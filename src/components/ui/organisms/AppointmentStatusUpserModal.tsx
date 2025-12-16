"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { Button } from "@/src/components/ui/atoms/button";
import { Input } from "@/src/components/ui/molecules/input";
import { Badge } from "@/src/components/ui/atoms/badge";

type StatusDetails = {
  id_appointment_status: number;
  status_name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  statusId?: number | null; // si viene -> edit; si no -> create
};

function unwrapObject<T>(payload: any): T | null {
  if (!payload) return null;
  return (payload?.data ?? payload) as T;
}

export default function AppointmentStatusUpsertModal({ open, onClose, statusId }: Props) {
  const router = useRouter();
  const isEdit = !!statusId;

  const title = useMemo(
    () => (isEdit ? `Edit status #${statusId}` : "Create new status"),
    [isEdit, statusId]
  );

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<{ status_name: string; isActive: boolean }>({
    status_name: "",
    isActive: true,
  });

  const [loaded, setLoaded] = useState<StatusDetails | null>(null);

  useEffect(() => {
    if (!open) return;

    // reset al abrir
    setLoaded(null);
    setForm({ status_name: "", isActive: true });

    if (!statusId) return;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/appointment-status/${statusId}`, { cache: "no-store" });
        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          console.error("Failed to load appointment-status detail", { status: res.status, json });
          return;
        }

        const d = unwrapObject<StatusDetails>(json);
        if (!d) return;

        setLoaded(d);
        setForm({
          status_name: d.status_name ?? "",
          isActive: !!d.isActive,
        });
      } catch (e) {
        console.error("Load status failed", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, statusId]);

  async function onSave() {
    try {
      setLoading(true);

      const payload = {
        status_name: String(form.status_name ?? "").trim(),
        isActive: !!form.isActive,
      };

      const res = await fetch(isEdit ? `/api/appointment-status/${statusId}` : "/api/appointment-status", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Save appointment status failed", { status: res.status, json });
        return;
      }

      router.refresh();
      onClose();
    } catch (e) {
      console.error("Save status failed", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} title={title} onClose={onClose}>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : (
        <div className="space-y-4">
          {isEdit ? (
            <div className="flex items-center gap-2">
              <Badge variant={loaded?.isActive ? "default" : "destructive"}>
                {loaded?.isActive ? "Active" : "Inactive"}
              </Badge>
              {loaded?.status_name ? <Badge variant="secondary">{loaded.status_name}</Badge> : null}
            </div>
          ) : null}

          <div className="space-y-2">
            <div className="text-sm font-medium">Status name</div>
            <Input
              value={form.status_name}
              onChange={(e) => setForm((p) => ({ ...p, status_name: e.target.value }))}
              placeholder="e.g. Confirmada"
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">isActive</div>
            <select
              value={form.isActive ? "true" : "false"}
              onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.value === "true" }))}
              className="h-10 w-full rounded-md border bg-white px-3 text-sm"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="pt-2 flex gap-2">
            <Button onClick={onSave} disabled={loading || !form.status_name.trim()}>
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
