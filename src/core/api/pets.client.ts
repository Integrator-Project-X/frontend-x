import { API_ENDPOINTS } from "./api.endpoints";
import { apiClient } from "./api.client";
import type { Pet } from "@/src/lib/mock-data";
import { getOwnerPets, addPet as addPetLocal } from "@/src/lib/mock-data";

const mapAnimalToSpecies = (animalName: string | undefined) => {
  if (!animalName) return "dog";
  const n = String(animalName).toLowerCase();
  if (n.includes("perro") || n.includes("dog")) return "dog";
  if (n.includes("gato") || n.includes("cat")) return "cat";
  return "dog";
};

export const petsClient = {
  list: async (
    ownerId: string,
    opts?: { page?: number; limit?: number; all?: boolean }
  ): Promise<{ items: Pet[]; total?: number }> => {
    try {
      const q = opts ? `?ownerId=${encodeURIComponent(ownerId)}&page=${opts.page ?? 1}&limit=${opts.limit ?? 20}` : `?ownerId=${encodeURIComponent(ownerId)}`;
      const res = await apiClient.get<{ success?: boolean; data?: any[]; total?: number }>(`${API_ENDPOINTS.pets.list}${q}`);

      let items = Array.isArray((res as any)?.data) ? (res as any).data : (res as any) || [];

      // If caller requested all and server returns a total, fetch remaining pages
      const serverTotal = (res as any)?.total ?? (res as any)?.meta?.total ?? undefined;
      const pageRequested = opts?.page ?? 1;
      const limitRequested = opts?.limit ?? 20;
      if (opts?.all && serverTotal !== undefined) {
        const totalPages = Math.max(1, Math.ceil(serverTotal / limitRequested));
        for (let p = 1; p <= totalPages; p++) {
          if (p === pageRequested) continue;
          try {
            const r = await apiClient.get<{ success?: boolean; data?: any[] }>(`${API_ENDPOINTS.pets.list}?ownerId=${encodeURIComponent(ownerId)}&page=${p}&limit=${limitRequested}`);
            const more = Array.isArray((r as any)?.data) ? (r as any).data : (r as any) || [];
            if (Array.isArray(more) && more.length > 0) items = items.concat(more);
          } catch (err) {
            // ignore page fetch errors
          }
        }
      }

      // If caller requested all but server didn't return a total, try requesting a very large limit
      if (opts?.all && serverTotal === undefined) {
        try {
          const r = await apiClient.get<{ success?: boolean; data?: any[] }>(`${API_ENDPOINTS.pets.list}?ownerId=${encodeURIComponent(ownerId)}&page=1&limit=10000`);
          const more = Array.isArray((r as any)?.data) ? (r as any).data : (r as any) || [];
          if (Array.isArray(more) && more.length > 0) items = more;
        } catch (err) {
          // ignore and continue with what we have
        }
      }

      const mappedServer: Pet[] = items.map((p: any) => ({
        id: String(p.id_pet ?? p.id ?? p._id ?? Math.random()),
        name: p.pet_name ?? p.name ?? "",
        species: mapAnimalToSpecies(p.animal?.animal_name ?? p.animal_name),
        breed: p.race?.race_name ?? p.race_name ?? p.breed ?? "",
        age: p.birth_date ? Math.max(0, new Date().getFullYear() - new Date(p.birth_date).getFullYear()) : 0,
        ownerId: String(ownerId),
        ownerName: String(p.ownerName ?? ""),
        ownerPhone: String(p.ownerPhone ?? ""),
        vaccinesUpToDate: Boolean(p.vaccinesUpToDate ?? true),
        imageUrl: p.image_url ?? p.imageUrl ?? "",
      }));

      // In browser, also merge any locally-created pending pets saved during backend fallback
      let localMapped: Pet[] = [];
      if (typeof window !== "undefined") {
        try {
          const local = JSON.parse(localStorage.getItem("pendingPets") || "[]") as any[];
          if (Array.isArray(local) && local.length > 0) {
            localMapped = local
              .filter((lp) => String(lp.ownerId ?? lp.ownerId) === String(ownerId))
              .map((p: any) => ({
                id: String(p.id_pet ?? p.id ?? p._id ?? Math.random()),
                name: p.pet_name ?? p.name ?? p.pet_name ?? "",
                species: mapAnimalToSpecies(p.animal?.animal_name ?? p.animal_name ?? p.species),
                breed: p.race?.race_name ?? p.race_name ?? p.breed ?? "",
                age: p.birth_date ? Math.max(0, new Date().getFullYear() - new Date(p.birth_date).getFullYear()) : Number(p.age) || 0,
                ownerId: String(ownerId),
                ownerName: String(p.ownerName ?? p.ownerName ?? ""),
                ownerPhone: String(p.ownerPhone ?? p.ownerPhone ?? ""),
                vaccinesUpToDate: Boolean(p.vaccinesUpToDate ?? true),
                imageUrl: p.image_url ?? p.imageUrl ?? p.imageUrl ?? "",
              }));
          }
        } catch {}
      }

      // If server provides a total, assume it already paginates and returns only the page items.
      // In that case, return the server items (with local pending items added on top) and adjust total.
      if (serverTotal !== undefined) {
        const merged = [...localMapped, ...mappedServer];
        const total = serverTotal + localMapped.length;
        if (merged.length === 0) {
          const fallback = getOwnerPets(ownerId);
          if (fallback && fallback.length > 0) return { items: fallback, total: fallback.length };
        }
        return { items: merged, total };
      }

      // Otherwise, implement client-side pagination (backend returned full list)
      const merged = [...localMapped, ...mappedServer];
      if (merged.length === 0) {
        const fallback = getOwnerPets(ownerId);
        if (fallback && fallback.length > 0) return { items: fallback, total: fallback.length };
      }

      const total = merged.length;
      const page = opts?.page ?? 1;
      const limit = opts?.limit ?? 20;
      const start = Math.max(0, (page - 1) * limit);
      const end = start + limit;

      return { items: merged.slice(start, end), total };
    } catch (err) {
      const fallback = getOwnerPets(ownerId);
      if (fallback && fallback.length > 0) return { items: fallback, total: fallback.length };
      throw err;
    }
  },

  // List ALL pets (no owner filter). Supports same opts as `list` and will try to fetch all pages when `all=true`.
  listAll: async (opts?: { page?: number; limit?: number; all?: boolean }): Promise<{ items: Pet[]; total?: number }> => {
    try {
      const q = opts ? `?page=${opts.page ?? 1}&limit=${opts.limit ?? 10000}` : `?page=1&limit=10000`;
      const res = await apiClient.get<{ success?: boolean; data?: any[]; total?: number }>(`${API_ENDPOINTS.pets.list}${q}`);

      let items = Array.isArray((res as any)?.data) ? (res as any).data : (res as any) || [];

      // If caller requested all and server returns a total, fetch remaining pages
      const serverTotal = (res as any)?.total ?? (res as any)?.meta?.total ?? undefined;
      const pageRequested = opts?.page ?? 1;
      const limitRequested = opts?.limit ?? 10000;
      if (opts?.all && serverTotal !== undefined) {
        const totalPages = Math.max(1, Math.ceil(serverTotal / limitRequested));
        for (let p = 1; p <= totalPages; p++) {
          if (p === pageRequested) continue;
          try {
            const r = await apiClient.get<{ success?: boolean; data?: any[] }>(`${API_ENDPOINTS.pets.list}?page=${p}&limit=${limitRequested}`);
            const more = Array.isArray((r as any)?.data) ? (r as any).data : (r as any) || [];
            if (Array.isArray(more) && more.length > 0) items = items.concat(more);
          } catch (err) {
            // ignore page fetch errors
          }
        }
      }

      // If caller requested all but server didn't return a total, try requesting a very large limit
      if (opts?.all && serverTotal === undefined) {
        try {
          const r = await apiClient.get<{ success?: boolean; data?: any[] }>(`${API_ENDPOINTS.pets.list}?page=1&limit=10000`);
          const more = Array.isArray((r as any)?.data) ? (r as any).data : (r as any) || [];
          if (Array.isArray(more) && more.length > 0) items = more;
        } catch (err) {
          // ignore and continue with what we have
        }
      }

      const mappedServer: Pet[] = items.map((p: any) => ({
        id: String(p.id_pet ?? p.id ?? p._id ?? Math.random()),
        name: p.pet_name ?? p.name ?? "",
        species: mapAnimalToSpecies(p.animal?.animal_name ?? p.animal_name),
        breed: p.race?.race_name ?? p.race_name ?? p.breed ?? "",
        age: p.birth_date ? Math.max(0, new Date().getFullYear() - new Date(p.birth_date).getFullYear()) : 0,
        ownerId: String(p.ownerId ?? p.owner_id ?? p.owner ?? ""),
        ownerName: String(p.ownerName ?? ""),
        ownerPhone: String(p.ownerPhone ?? ""),
        vaccinesUpToDate: Boolean(p.vaccinesUpToDate ?? true),
        imageUrl: p.image_url ?? p.imageUrl ?? "",
      }));

      // Merge local pending (no owner filter when listing all)
      let localMapped: Pet[] = [];
      if (typeof window !== "undefined") {
        try {
          const local = JSON.parse(localStorage.getItem("pendingPets") || "[]") as any[];
          if (Array.isArray(local) && local.length > 0) {
            localMapped = local.map((p: any) => ({
              id: String(p.id_pet ?? p.id ?? p._id ?? Math.random()),
              name: p.pet_name ?? p.name ?? p.pet_name ?? "",
              species: mapAnimalToSpecies(p.animal?.animal_name ?? p.animal_name ?? p.species),
              breed: p.race?.race_name ?? p.race_name ?? p.breed ?? "",
              age: p.birth_date ? Math.max(0, new Date().getFullYear() - new Date(p.birth_date).getFullYear()) : Number(p.age) || 0,
              ownerId: String(p.ownerId ?? p.ownerId ?? ""),
              ownerName: String(p.ownerName ?? p.ownerName ?? ""),
              ownerPhone: String(p.ownerPhone ?? p.ownerPhone ?? ""),
              vaccinesUpToDate: Boolean(p.vaccinesUpToDate ?? true),
              imageUrl: p.image_url ?? p.imageUrl ?? p.imageUrl ?? "",
            }));
          }
        } catch {}
      }

      const merged = [...localMapped, ...mappedServer];
      const total = merged.length;
      return { items: merged, total };
    } catch (err) {
      // fallback to owner-based data if global fails
      const fallback = getOwnerPets("1");
      if (fallback && fallback.length > 0) return { items: fallback, total: fallback.length };
      throw err;
    }
  },

  create: async (payload: Record<string, any>) => {
    // Transform frontend-friendly pet payload to the backend schema
    // Backend expects: pet_name, birth_date (ISO), id_race, id_animal
    const mapSpeciesToAnimalId: Record<string, number> = {
      dog: 1,
      cat: 2,
    };

    // Resolve id_animal from species (fallback to 1)
    const id_animal = mapSpeciesToAnimalId[payload.species as string] || 1;

    // Try to resolve id_race by searching available races; fallback to 1
    let id_race = 1;
    try {
      const races = await apiClient.get<any[]>(API_ENDPOINTS.races.list);
      if (Array.isArray(races)) {
        const found = races.find((r: any) => String(r.race_name).toLowerCase() === String(payload.breed).toLowerCase());
        if (found) id_race = found.id_race;
      }
    } catch (err) {
      // ignore and fallback
    }

    // Convert age (years) to a birth_date ISO string (approximate: Jan 1st of birth year)
    const age = Number(payload.age) || 0;
    const birthYear = new Date().getFullYear() - age;
    const birth_date = `${birthYear}-01-01`;

    const body = {
      pet_name: payload.name,
      birth_date,
      id_race,
      id_animal,
      // If client provided an image URL, send it as img_url (backend expects this field)
      ...(payload.imageUrl ? { img_url: payload.imageUrl } : {}),
    };

    // POST via internal API route so we can rely on server-side forwarding/auth and inspect errors
    try {
      console.debug("petsClient.create body:", body);
      const res = await fetch(`/api/pets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const text = await res.text();
      let created: any;
      try {
        created = JSON.parse(text);
      } catch (err) {
        throw new Error(`Unexpected non-JSON response: ${text}`);
      }

      if (!res.ok) {
        // include server JSON in error for easier debugging
        const errMsg = `${res.status} ${JSON.stringify(created)}`;
        // If backend complains about an 'image' property, fallback to local mock add to keep UX working
        const lower = errMsg.toLowerCase();
        if (lower.includes("property image should not exist") || lower.includes("image should not exist")) {
          console.warn("Backend rejected pet due to image property; adding locally as fallback.");
          const local = addPetLocal({
            name: payload.name,
            species: payload.species as any,
            breed: payload.breed,
            age: Number(payload.age) || 0,
            ownerId: payload.ownerId ?? "",
            ownerName: payload.ownerName ?? "",
            ownerPhone: payload.ownerPhone ?? "",
            vaccinesUpToDate: Boolean(payload.vaccinesUpToDate ?? true),
            imageUrl: payload.imageUrl ?? "",
          });

          return { ...local, _local: true } as Pet & { _local: true };
        }

        throw new Error(errMsg);
      }

      const isLocalCreated = Boolean((created as any)._local);
      const createdItem = created.data ?? created;
      // If server signalled a local fallback, persist it in browser localStorage so lists can show it
      if (isLocalCreated && typeof window !== "undefined" && createdItem) {
        try {
          const pending = JSON.parse(localStorage.getItem("pendingPets") || "[]");
          // attach a temporary id for client-side handling
          const temp = { ...createdItem, _tempId: `local-${Date.now()}-${Math.random().toString(36).slice(2,6)}` };
          pending.unshift(temp);
          localStorage.setItem("pendingPets", JSON.stringify(pending));
        } catch {}
      }

      if (createdItem) {
        return {
          id: String(createdItem.id_pet ?? createdItem.id ?? Math.random()),
          name: createdItem.pet_name ?? payload.name,
          species: mapAnimalToSpecies(createdItem.animal?.animal_name ?? payload.species),
          breed: createdItem.race?.race_name ?? payload.breed ?? "",
          age: createdItem.birth_date ? Math.max(0, new Date().getFullYear() - new Date(createdItem.birth_date).getFullYear()) : Number(payload.age) || 0,
          ownerId: payload.ownerId ?? "",
          ownerName: payload.ownerName ?? "",
          ownerPhone: payload.ownerPhone ?? "",
          vaccinesUpToDate: Boolean(createdItem.vaccinesUpToDate ?? payload.vaccinesUpToDate ?? true),
          imageUrl: createdItem.image_url ?? payload.imageUrl ?? "",
        } as Pet;
      }

      return null;
    } catch (err) {
      console.error("petsClient.create error:", err);
      throw err;
    }
  },

  // Attempt to sync pending local-created pets to the real backend
  syncPending: async (): Promise<{ tempId?: string; ok: boolean; backend?: any; error?: string }[]> => {
    if (typeof window === "undefined") return [];
    try {
      const pending = JSON.parse(localStorage.getItem("pendingPets") || "[]") as any[];
      if (!Array.isArray(pending) || pending.length === 0) return [];

      const res = await fetch(`/api/pets/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pending }),
      });

      const result = await res.json();

      // remove successful items from localStorage
      try {
        const remaining = pending.filter((p) => {
          const r = (result?.results || []).find((rr: any) => rr.tempId === p._tempId);
          return !r || !r.ok;
        });
        localStorage.setItem("pendingPets", JSON.stringify(remaining));
      } catch {}

      return result?.results ?? [];
    } catch (err: any) {
      console.error("petsClient.syncPending error:", err);
      return [];
    }
  },
};
