"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { Button } from "@/src/components/ui/atoms/button";
import { Input } from "@/src/components/ui/molecules/input";
import { Badge } from "@/src/components/ui/atoms/badge";

type AppointmentTypeRow = {
  id: number;
  name: string;
  is_active?: boolean;
};

type AppointmentStatusRow = {
  id_appointment_status: number;
  status_name: string;
  isActive?: boolean;
};

type AppointmentDetails = {
  id_appointment: number;
  description: string;
  isActive: boolean;

  pet?: { id_pet: number; pet_name?: string };
  user?: { id_user: number; full_name?: string };
  clinic?: { id_clinic: number; clinic_name?: string };
  diagnosis?: { id_diagnosis: number; description?: string };

  type?: { id: number; name: string };
  status?: { id_appointment_status: number; status_name: string };
};

type UpdatePayload = {
  id_pet: number;
  id_user: number;
  id_clinic: number;
  id_type: number;
  id_status: number;
  id_diagnosis: number;
  description: string;
  isActive: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  appointmentId: string;
  initialIsActive?: boolean;
};

function unwrapObject<T>(payload: any): T | null {
  if (!payload) return null;
  return (payload?.data ?? payload) as T;
}

function unwrapArray<T>(payload: any): T[] {
  const arr = payload?.data ?? payload;
  return Array.isArray(arr) ? (arr as T[]) : [];
}

export default function AppointmentDetailsModal({
  open,
  onClose,
  appointmentId,
  initialIsActive,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [details, setDetails] = useState<AppointmentDetails | null>(null);
  const [types, setTypes] = useState<AppointmentTypeRow[]>([]);
  const [statuses, setStatuses] = useState<AppointmentStatusRow[]>([]);

  const [form, setForm] = useState<UpdatePayload>({
    id_pet: 0,
    id_user: 0,
    id_clinic: 0,
    id_type: 0,
    id_status: 0,
    id_diagnosis: 0,
    description: "",
    isActive: true,
  });

  const title = useMemo(() => `Appointment #${appointmentId}`, [appointmentId]);

  const badgeState = details?.isActive ?? initialIsActive;
  const badgeStatus = details?.status?.status_name;
  const badgeType = details?.type?.name;

  useEffect(() => {
    if (!open) return;
    if (!appointmentId) return;

    (async () => {
      try {
        setLoading(true);

        // 1) details
        const detailsRes = await fetch(`/api/appointments/${appointmentId}`, {
          cache: "no-store",
        });
        const detailsJson = await detailsRes.json().catch(() => ({}));

        if (!detailsRes.ok) {
          console.error("Failed to load appointment details", {
            status: detailsRes.status,
            detailsJson,
          });
          setDetails(null);
          return;
        }

        const d = unwrapObject<AppointmentDetails>(detailsJson);
        if (!d) {
          setDetails(null);
          return;
        }

        setDetails(d);
        setForm({
          id_pet: Number(d.pet?.id_pet ?? 0),
          id_user: Number(d.user?.id_user ?? 0),
          id_clinic: Number(d.clinic?.id_clinic ?? 0),
          id_type: Number(d.type?.id ?? 0),
          id_status: Number(d.status?.id_appointment_status ?? 0),
          id_diagnosis: Number(d.diagnosis?.id_diagnosis ?? 0),
          description: d.description ?? "",
          isActive: !!d.isActive,
        });

        // 2) lists
        const [typesRes, statusRes] = await Promise.all([
          fetch("/api/appointments-types", { cache: "no-store" }),
          fetch("/api/appointment-status", { cache: "no-store" }),
        ]);

        const typesJson = await typesRes.json().catch(() => ({}));
        const statusJson = await statusRes.json().catch(() => ({}));

        if (!typesRes.ok) {
          console.error("Failed to load appointments types", {
            status: typesRes.status,
            typesJson,
          });
        }
        if (!statusRes.ok) {
          console.error("Failed to load appointment status list", {
            status: statusRes.status,
            statusJson,
          });
        }

        setTypes(unwrapArray<AppointmentTypeRow>(typesJson));
        setStatuses(unwrapArray<AppointmentStatusRow>(statusJson));
      } catch (e) {
        console.error("Modal load failed", e);
        setDetails(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, appointmentId]);

  async function onSave() {
    try {
      setLoading(true);

      const payload: UpdatePayload = {
        id_pet: Number(form.id_pet),
        id_user: Number(form.id_user),
        id_clinic: Number(form.id_clinic),
        id_type: Number(form.id_type),
        id_status: Number(form.id_status),
        id_diagnosis: Number(form.id_diagnosis),
        description: String(form.description ?? ""),
        isActive: !!form.isActive,
      };

      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Update appointment failed", { status: res.status, json });
        return;
      }

      const updated = unwrapObject<AppointmentDetails>(json);
      if (updated) setDetails(updated);

      router.refresh();
      onClose();
    } catch (e) {
      console.error("Save failed", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} title={title} onClose={onClose}>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : !details ? (
        <div className="text-sm text-muted-foreground">
          No data. Revisa consola/logs (401/400/500).
        </div>
      ) : (
        <div className="space-y-4">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={badgeState ? "default" : "destructive"}>
              {badgeState ? "Active" : "Inactive"}
            </Badge>
            {badgeStatus ? <Badge variant="secondary">{badgeStatus}</Badge> : null}
            {badgeType ? <Badge variant="secondary">{badgeType}</Badge> : null}
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <div className="text-sm font-medium mb-1">id_pet</div>
              <Input
                type="number"
                value={form.id_pet}
                onChange={(e) => setForm((p) => ({ ...p, id_pet: Number(e.target.value) }))}
              />
            </div>

            <div>
              <div className="text-sm font-medium mb-1">id_user</div>
              <Input
                type="number"
                value={form.id_user}
                onChange={(e) => setForm((p) => ({ ...p, id_user: Number(e.target.value) }))}
              />
            </div>

            <div>
              <div className="text-sm font-medium mb-1">id_clinic</div>
              <Input
                type="number"
                value={form.id_clinic}
                onChange={(e) => setForm((p) => ({ ...p, id_clinic: Number(e.target.value) }))}
              />
            </div>

            <div>
              <div className="text-sm font-medium mb-1">Appointment type</div>
              <select
                value={form.id_type ? String(form.id_type) : ""}
                onChange={(e) => setForm((p) => ({ ...p, id_type: Number(e.target.value) }))}
                className="h-10 w-full rounded-md border bg-white px-3 text-sm"
              >
                <option value="" disabled>
                  {types.length ? "Select type..." : "Loading types..."}
                </option>
                {types.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="text-sm font-medium mb-1">Appointment status</div>
              <select
                value={form.id_status ? String(form.id_status) : ""}
                onChange={(e) => setForm((p) => ({ ...p, id_status: Number(e.target.value) }))}
                className="h-10 w-full rounded-md border bg-white px-3 text-sm"
              >
                <option value="" disabled>
                  {statuses.length ? "Select status..." : "Loading statuses..."}
                </option>
                {statuses.map((s) => (
                  <option key={s.id_appointment_status} value={s.id_appointment_status}>
                    {s.status_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="text-sm font-medium mb-1">id_diagnosis</div>
              <Input
                type="number"
                value={form.id_diagnosis}
                onChange={(e) =>
                  setForm((p) => ({ ...p, id_diagnosis: Number(e.target.value) }))
                }
              />
            </div>

            <div className="md:col-span-2">
              <div className="text-sm font-medium mb-1">description</div>
              <Input
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              />
            </div>

            <div className="md:col-span-2">
              <div className="text-sm font-medium mb-1">isActive</div>
              <select
                value={form.isActive ? "true" : "false"}
                onChange={(e) =>
                  setForm((p) => ({ ...p, isActive: e.target.value === "true" }))
                }
                className="h-10 w-full rounded-md border bg-white px-3 text-sm"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex gap-2">
            <Button onClick={onSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
