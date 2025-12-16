import type { Appointment } from "@/src/lib/mock-data";
import { apiClient } from "./api.client";
import { API_ENDPOINTS } from "./api.endpoints";
import { getPetById } from "@/src/lib/mock-data";

export const appointmentsClient = {
  list: async (ownerId: string, opts?: { page?: number; limit?: number; all?: boolean }): Promise<{ items: Appointment[]; total?: number }> => {
    const q = opts ? `?ownerId=${encodeURIComponent(ownerId)}&page=${opts.page ?? 1}&limit=${opts.limit ?? 20}` : `?ownerId=${encodeURIComponent(ownerId)}`;
    const res = await apiClient.get<{ success?: boolean; data?: any[]; total?: number }>(`${API_ENDPOINTS.appointments.list}${q}`);

    let items = Array.isArray((res as any)?.data) ? (res as any).data : (res as any) || [];

    // If caller asked for all and the server provides a total, fetch all pages
    const serverTotal = (res as any)?.total ?? (res as any)?.meta?.total ?? undefined;
    const pageRequested = opts?.page ?? 1;
    const limitRequested = opts?.limit ?? 20;
    if (opts?.all && serverTotal !== undefined) {
      const totalPages = Math.max(1, Math.ceil(serverTotal / limitRequested));
      const pagesToFetch: number[] = [];
      for (let p = 1; p <= totalPages; p++) {
        if (p === pageRequested) continue; // already have this page
        pagesToFetch.push(p);
      }

      for (const p of pagesToFetch) {
        try {
          const r = await apiClient.get<{ success?: boolean; data?: any[] }>(`${API_ENDPOINTS.appointments.list}?ownerId=${encodeURIComponent(ownerId)}&page=${p}&limit=${limitRequested}`);
          const more = Array.isArray((r as any)?.data) ? (r as any).data : (r as any) || [];
          if (Array.isArray(more) && more.length > 0) items = items.concat(more);
        } catch (err) {
          // ignore page fetch errors and continue
        }
      }
    }

    const mapStatus = (s: string | undefined) => {
      if (!s) return "pending";
      const n = String(s).trim().toLowerCase();
      if (n.includes("pend")) return "pending";
      if (n.includes("cancel")) return "cancelled";
      if (n.includes("complet")) return "completed";
      if (n.includes("confirm")) return "confirmed";
      if (n.includes("attend") || n.includes("asist")) return "completed";
      return "pending";
    };

    const mappedFull: Appointment[] = items.map((a: any) => ({
      id: String(a.id_appointment ?? a.id ?? a._id ?? Math.random()),
      petId: String(a.pet?.id_pet ?? a.petId ?? ""),
      petName: a.pet?.pet_name ?? a.petName ?? "",
      clinicId: String(a.clinic?.id_clinic ?? a.clinicId ?? ""),
      clinicName: a.clinic?.clinic_name ?? a.clinicName ?? "",
      date: a.date ?? (a.createdAt ? a.createdAt.split("T")[0] : ""),
      time: a.time ?? "",
      serviceType: a.type?.name ?? a.type?.type_name ?? a.serviceType ?? "",
      status: mapStatus(a.status?.status_name ?? a.status ?? "pending") as any,
      notes: a.description ?? a.notes ?? undefined,
    }));

    // Attach pet image when available (from nested pet or local mock lookup)
    const mapped: Appointment[] = mappedFull.map((m) => {
      const img = (items.find((it: any) => String(it.id_appointment ?? it.id ?? it._id ?? Math.random()) === m.id)?.pet?.image_url) || (items.find((it: any) => String(it.id_appointment ?? it.id ?? it._id ?? Math.random()) === m.id)?.pet?.imageUrl) || undefined;
      if (img) return { ...m, imageUrl: img } as any;

      // fallback to local pet mock
      const pet = getPetById(m.petId);
      if (pet) return { ...m, imageUrl: pet.imageUrl } as any;

      return m;
    });

    // If caller requested all items, return full mapped list (we already fetched extra pages above when possible)
    if (opts?.all) return { items: mapped, total: serverTotal ?? mapped.length };

    // If backend provides a total, assume pagination server-side
    if (serverTotal !== undefined) return { items: mapped, total: serverTotal };

    // client-side pagination
    const page = opts?.page ?? 1;
    const limit = opts?.limit ?? 20;
    const start = Math.max(0, (page - 1) * limit);
    const end = start + limit;
    const total = mapped.length;
    return { items: mapped.slice(start, end), total };
  },

  create: async (payload: Partial<Appointment>): Promise<Appointment> => {
    return apiClient.post<Appointment>(API_ENDPOINTS.appointments.create, payload);
  },
};

