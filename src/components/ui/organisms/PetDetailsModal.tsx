"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { Button } from "@/src/components/ui/atoms/button";
import { Input } from "@/src/components/ui/molecules/input";
import { Badge } from "@/src/components/ui/atoms/badge";
import type { AdminPetRow, PetAPI } from "@/src/types/pets.types";

type Props = {
  open: boolean;
  onClose: () => void;
  summary: AdminPetRow;
  petId: string;
};

type AnimalOption = { id_animal: number; animal_name: string };
type RaceOption = { id_race: number; race_name: string };

type FormState = {
  pet_name: string;
  birth_date: string; // YYYY-MM-DD
  isActive: boolean;
  id_race: number | "";
  id_animal: number | "";
  image: File | null;
};

function isNumericString(v: string) {
  return /^\d+$/.test(String(v ?? "").trim());
}

function isoToDateOnly(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function dateOnlyToIso(dateOnly: string) {
  // ✅ backend espera ISO
  // "2020-05-10" -> "2020-05-10T00:00:00.000Z"
  return dateOnly ? `${dateOnly}T00:00:00.000Z` : "";
}

const selectClassName =
  "flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background " +
  "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
  "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export default function PetDetailsModal({ open, onClose, summary, petId }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [details, setDetails] = useState<PetAPI | null>(null);

  const [animals, setAnimals] = useState<AnimalOption[]>([]);
  const [races, setRaces] = useState<RaceOption[]>([]);

  const [form, setForm] = useState<FormState>({
    pet_name: "",
    birth_date: "",
    isActive: true,
    id_race: "",
    id_animal: "",
    image: null,
  });

  const title = useMemo(() => `Pet #${petId}`, [petId]);

  function resetState() {
    setLoading(false);
    setEditing(false);
    setError(null);
    setDetails(null);
    setForm({
      pet_name: "",
      birth_date: "",
      isActive: true,
      id_race: "",
      id_animal: "",
      image: null,
    });
  }

  function handleClose() {
    resetState();
    onClose();
  }

  // ✅ cargar opciones (animals/races) al abrir
  useEffect(() => {
    if (!open) return;

    (async () => {
      try {
        const [aRes, rRes] = await Promise.all([
          fetch("/api/animals/active", { cache: "no-store" }),
          fetch("/api/races/active", { cache: "no-store" }),
        ]);

        const aJson = await aRes.json().catch(() => ({}));
        const rJson = await rRes.json().catch(() => ({}));

        const aList: any[] = Array.isArray(aJson?.data) ? aJson.data : Array.isArray(aJson) ? aJson : [];
        const rList: any[] = Array.isArray(rJson?.data) ? rJson.data : Array.isArray(rJson) ? rJson : [];

        setAnimals(
          aList
            .map((x) => ({ id_animal: Number(x?.id_animal), animal_name: String(x?.animal_name ?? "") }))
            .filter((x) => Number.isFinite(x.id_animal) && x.animal_name)
        );

        setRaces(
          rList
            .map((x) => ({ id_race: Number(x?.id_race), race_name: String(x?.race_name ?? "") }))
            .filter((x) => Number.isFinite(x.id_race) && x.race_name)
        );
      } catch {
        setAnimals([]);
        setRaces([]);
      }
    })();
  }, [open]);

  // ✅ cargar detalle pet
  useEffect(() => {
    if (!open) {
      resetState();
      return;
    }

    const id = String(petId ?? "").trim();
    if (!id || id === "undefined" || !isNumericString(id)) {
      setError(`Invalid petId: "${id}"`);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/pets/${id}`, { cache: "no-store" });
        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          const msg = json?.payload?.error?.message || json?.message || `Request failed (${res.status})`;
          setError(msg);
          setDetails(null);
          return;
        }

        const p: PetAPI = (json?.data ?? json) as PetAPI;

        setDetails(p);
        setForm({
          pet_name: p.pet_name ?? "",
          birth_date: isoToDateOnly(p.birth_date),
          isActive: !!p.isActive,
          id_race: Number(p.race?.id_race ?? "") || "",
          id_animal: Number(p.animal?.id_animal ?? "") || "",
          image: null,
        });

        setEditing(false);
      } catch {
        setError("Failed to load pet details");
        setDetails(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, petId]);

  const previewUrl = useMemo(() => {
    if (form.image) return URL.createObjectURL(form.image);
    return details?.image_url ?? "";
  }, [form.image, details?.image_url]);

  useEffect(() => {
    return () => {
      if (form.image) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.image]);

  async function onSave() {
    const id = String(petId ?? "").trim();
    if (!id || !isNumericString(id)) {
      setError(`Invalid petId: "${id}"`);
      return;
    }

    if (!form.pet_name.trim()) {
      setError("Pet name is required");
      return;
    }

    if (!form.birth_date) {
      setError("Birth date is required");
      return;
    }

    if (!form.id_race || !form.id_animal) {
      setError("Race and Animal are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const fd = new FormData();
      fd.append("pet_name", form.pet_name.trim());
      fd.append("birth_date", dateOnlyToIso(form.birth_date));
      fd.append("isActive", String(form.isActive));
      fd.append("id_race", String(form.id_race));
      fd.append("id_animal", String(form.id_animal));
      if (form.image) fd.append("image", form.image);

      const res = await fetch(`/api/pets/${id}`, {
        method: "PATCH",
        body: fd,
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = json?.payload?.error?.message || json?.message || `Update failed (${res.status})`;
        setError(msg);
        return;
      }

      const updated: PetAPI = (json?.data ?? json) as PetAPI;
      setDetails(updated);
      setEditing(false);
      router.refresh();
    } catch {
      setError("Failed to update pet");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} title={title} onClose={handleClose}>
      {loading && <div className="text-sm text-muted-foreground">Loading...</div>}

      {!loading && (
        <div className="space-y-4">
          {/* header */}
          <div className="grid grid-cols-2 gap-4 rounded-md border border-black/10 bg-white p-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Status</p>
              {summary.isActive ? <Badge>Active</Badge> : <Badge variant="destructive">Inactive</Badge>}
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Animal</p>
              <Badge variant="secondary">{summary.animalName || "—"}</Badge>
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
              <p className="font-medium">Error</p>
              <p className="text-muted-foreground">{error}</p>
            </div>
          )}

          {!details ? (
            <div className="text-sm text-muted-foreground">No data loaded.</div>
          ) : !editing ? (
            <div className="space-y-3">
              {/* image */}
              <div className="flex items-start gap-4">
                <div className="h-24 w-24 overflow-hidden rounded-xl border bg-white">
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewUrl} alt={details.pet_name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm flex-1">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Pet name</p>
                    <p className="font-medium">{details.pet_name}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Birth date</p>
                    <p>{isoToDateOnly(details.birth_date) || "—"}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Race</p>
                    <p>{details.race?.race_name ?? "—"}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Animal</p>
                    <p>{details.animal?.animal_name ?? "—"}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-start">
                <Button variant="outline" onClick={() => setEditing(true)}>
                  Edit
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Pet name</p>
                  <Input
                    value={form.pet_name}
                    onChange={(e) => setForm((p) => ({ ...p, pet_name: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Birth date</p>
                  <Input
                    type="date"
                    value={form.birth_date}
                    onChange={(e) => setForm((p) => ({ ...p, birth_date: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Status</p>
                  <select
                    className={selectClassName}
                    value={String(form.isActive)}
                    onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.value === "true" }))}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Race</p>
                  <select
                    className={selectClassName}
                    value={String(form.id_race)}
                    onChange={(e) => setForm((p) => ({ ...p, id_race: Number(e.target.value) }))}
                  >
                    <option value="" disabled>
                      Select race
                    </option>
                    {races.map((r) => (
                      <option key={r.id_race} value={r.id_race}>
                        {r.race_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Animal</p>
                  <select
                    className={selectClassName}
                    value={String(form.id_animal)}
                    onChange={(e) => setForm((p) => ({ ...p, id_animal: Number(e.target.value) }))}
                  >
                    <option value="" disabled>
                      Select animal
                    </option>
                    {animals.map((a) => (
                      <option key={a.id_animal} value={a.id_animal}>
                        {a.animal_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm font-medium">Image (optional)</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setForm((p) => ({ ...p, image: e.target.files?.[0] ?? null }))}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-start gap-2">
                <Button onClick={onSave} disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </Button>
                <Button variant="outline" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
