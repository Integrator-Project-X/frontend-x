"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { Button } from "@/src/components/ui/atoms/button";
import { Input } from "@/src/components/ui/molecules/input";
import { Badge } from "@/src/components/ui/atoms/badge";

type Mode = "create" | "edit";

type Row = {
  id: number;
  name: string;
  isActive: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  mode: Mode;
  initial?: Row | null;
};

function unwrapObject<T>(payload: any): T | null {
  if (!payload) return null;
  return (payload?.data ?? payload) as T;
}

export default function AppointmentTypeUpsertModal({ open, onClose, mode, initial }: Props) {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(() => {
    if (mode === "create") return "Create appointment type";
    return `Edit appointment type #${initial?.id ?? ""}`;
  }, [mode, initial?.id]);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setSaving(false);

    if (mode === "edit" && initial) {
      setName(initial.name ?? "");
      setIsActive(!!initial.isActive);
    } else {
      setName("");
      setIsActive(true);
    }
  }, [open, mode, initial]);

  async function onSave() {
    try {
      setSaving(true);
      setError(null);

      const payload = {
        name: String(name ?? "").trim(),
        isActive: !!isActive,
      };

      if (!payload.name) {
        setError("Name is required.");
        return;
      }

      const url =
        mode === "create"
          ? "/api/appointments-types"
          : `/api/appointments-types/${initial?.id}`;

      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Upsert appointment type failed", { status: res.status, json });
        setError(json?.message ?? "Request failed.");
        return;
      }

      // opcional: si quieres usar el objeto actualizado
      unwrapObject(json);

      router.refresh();
      onClose();
    } catch (e) {
      console.error("Save failed", e);
      setError("Unexpected error.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={isActive ? "default" : "destructive"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
          {mode === "edit" && initial?.id ? (
            <Badge variant="secondary">ID: {initial.id}</Badge>
          ) : null}
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <div className="text-sm font-medium mb-1">Name</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Urgencias" />
          </div>

          <div className="md:col-span-2">
            <div className="text-sm font-medium mb-1">Status</div>
            <select
              value={isActive ? "true" : "false"}
              onChange={(e) => setIsActive(e.target.value === "true")}
              className="h-10 w-full rounded-md border bg-white px-3 text-sm"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex gap-2">
          <Button onClick={onSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
