"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { Button } from "@/src/components/ui/atoms/button";
import { Input } from "@/src/components/ui/molecules/input";
import { Badge } from "@/src/components/ui/atoms/badge";
import type { BackendUser } from "@/src/types/users.types";

type UserDetails = {
  id_user: number;
  full_name: string;
  age: number;
  address: string;
  phone_number: string;
  identification_number: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  gender?: { id_gender: number; name: string };
};

type UpdatePayload = {
  full_name: string;
  age: number;
  address: string;
  phone_number: string;
  identification_number: string;
  id_gender: number;
};

type GenderOption = {
  id_gender: number;
  name: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  summary: BackendUser;
  userId: string;
};

function isNumericString(v: string) {
  return /^\d+$/.test(String(v ?? "").trim());
}

const selectClassName =
  "flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background " +
  "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
  "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export default function UserDetailsModal({ open, onClose, summary, userId }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const [details, setDetails] = useState<UserDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ genders
  const [genders, setGenders] = useState<GenderOption[]>([]);
  const [gendersLoading, setGendersLoading] = useState(false);

  const [form, setForm] = useState<UpdatePayload>({
    full_name: "",
    age: 0,
    address: "",
    phone_number: "",
    identification_number: "",
    id_gender: 1,
  });

  const title = useMemo(() => `User #${userId}`, [userId]);

  function resetState() {
    setLoading(false);
    setEditing(false);
    setDetails(null);
    setError(null);
    setForm({
      full_name: "",
      age: 0,
      address: "",
      phone_number: "",
      identification_number: "",
      id_gender: 1,
    });
  }

  function handleClose() {
    resetState();
    onClose();
  }

  // ✅ Cargar genders cuando abre el modal (1 vez por open)
  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();

    (async () => {
      try {
        setGendersLoading(true);

        const res = await fetch("/api/genders/active", {
          cache: "no-store",
          signal: controller.signal,
        });

        const json = await res.json().catch(() => ({}));

        // soporta: {success:true,data:[...]} o directamente [...]
        const list: any[] = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : [];

        const normalized: GenderOption[] = list
          .map((g) => ({
            id_gender: Number(g?.id_gender),
            name: String(g?.name ?? ""),
          }))
          .filter((g) => Number.isFinite(g.id_gender) && g.name);

        setGenders(normalized);
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        console.error("Failed to load genders", e);
        setGenders([]);
      } finally {
        setGendersLoading(false);
      }
    })();

    return () => controller.abort();
  }, [open]);

  // ✅ Cargar detalle de user
  useEffect(() => {
    if (!open) {
      resetState();
      return;
    }

    const id = String(userId ?? "").trim();
    if (!id || id === "undefined" || !isNumericString(id)) {
      setError(`Invalid userId: "${id}"`);
      setDetails(null);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/users/${id}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          console.error("API /api/users/:id failed", json);
          const msg =
            json?.payload?.error?.message ||
            json?.payload?.message ||
            json?.message ||
            `Request failed (${res.status})`;
          setError(msg);
          setDetails(null);
          return;
        }

        const u: UserDetails = (json?.data ?? json) as UserDetails;

        setDetails(u);
        setForm({
          full_name: u?.full_name ?? "",
          age: Number(u?.age ?? 0),
          address: u?.address ?? "",
          phone_number: u?.phone_number ?? "",
          identification_number: u?.identification_number ?? "",
          id_gender: Number(u?.gender?.id_gender ?? 1),
        });

        setEditing(false);
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        console.error("Failed to load user details", e);
        setError("Failed to load user details");
        setDetails(null);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [open, userId]);

  async function onSave() {
    const id = String(userId ?? "").trim();
    if (!id || !isNumericString(id)) {
      setError(`Invalid userId: "${id}"`);
      return;
    }

    if (!form.full_name.trim()) {
      setError("Full name is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload: UpdatePayload = {
        full_name: form.full_name.trim(),
        age: Number(form.age),
        address: form.address,
        phone_number: form.phone_number,
        identification_number: form.identification_number,
        id_gender: Number(form.id_gender),
      };

      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Update failed", { status: res.status, json });
        const msg =
          json?.payload?.error?.message ||
          json?.payload?.message ||
          json?.message ||
          `Update failed (${res.status})`;
        setError(msg);
        return;
      }

      const updated: UserDetails = (json?.data ?? json) as UserDetails;

      setDetails(updated);
      setEditing(false);
      router.refresh();
    } catch (e) {
      console.error("Failed to update user", e);
      setError("Failed to update user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} title={title} onClose={handleClose}>
      {loading && <div className="text-sm text-muted-foreground">Loading...</div>}

      {!loading && (
        <div className="space-y-4">
          {/* Header: Status + Role */}
          <div className="grid grid-cols-2 gap-4 rounded-md border border-black/10 bg-white p-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Status</p>
              {summary.isActive ? <Badge>Active</Badge> : <Badge variant="destructive">Suspended</Badge>}
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Role</p>
              <Badge variant="secondary">{summary.roleName ?? "—"}</Badge>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Full name</p>
                  <p className="font-medium">{details.full_name}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p>{summary.email ?? "—"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Age</p>
                  <p>{details.age}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p>{details.address}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p>{details.phone_number}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">ID number</p>
                  <p>{details.identification_number}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Gender</p>
                  <p>{details.gender?.name ?? `#${details.gender?.id_gender ?? "—"}`}</p>
                </div>
              </div>

              <div className="pt-2 flex justify-start">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing(true);
                    setError(null);
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Full name</p>
                  <Input
                    value={form.full_name}
                    onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Age</p>
                  <Input
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm((p) => ({ ...p, age: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Address</p>
                  <Input
                    value={form.address}
                    onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Phone number</p>
                  <Input
                    value={form.phone_number}
                    onChange={(e) => setForm((p) => ({ ...p, phone_number: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Identification number</p>
                  <Input
                    value={form.identification_number}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, identification_number: e.target.value }))
                    }
                  />
                </div>

                {/* ✅ SELECT de Gender */}
                <div className="space-y-1">
                  <p className="text-sm font-medium">Gender</p>

                  <select
                    className={selectClassName}
                    value={String(form.id_gender ?? "")}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, id_gender: Number(e.target.value) }))
                    }
                    disabled={gendersLoading || genders.length === 0}
                  >
                    {/* placeholder */}
                    <option value="" disabled>
                      {gendersLoading ? "Loading genders..." : "Select a gender"}
                    </option>

                    {genders.map((g) => (
                      <option key={g.id_gender} value={g.id_gender}>
                        {g.name}
                      </option>
                    ))}
                  </select>

                  {genders.length === 0 && !gendersLoading && (
                    <p className="text-xs text-muted-foreground">
                      No genders available. Check /api/genders/active.
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-start gap-2">
                <Button onClick={onSave} disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing(false);
                    setError(null);
                  }}
                >
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
