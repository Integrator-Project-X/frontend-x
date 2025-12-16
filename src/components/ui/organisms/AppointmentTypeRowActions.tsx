"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ban, Pencil } from "lucide-react";
import { Button } from "@/src/components/ui/atoms/button";
import AppointmentTypeUpsertModal from "@/src/components/ui/organisms/AppointmentTypeUpserModal";

type Row = {
  id: number;
  name: string;
  isActive: boolean;
};

export default function AppointmentTypeRowActions({ row }: { row: Row }) {
  const router = useRouter();
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onDeactivate() {
    const ok = window.confirm(`Deactivate "${row.name}"?`);
    if (!ok) return;

    try {
      setLoading(true);

      // deactivar con PATCH -> { isActive: false }
      const res = await fetch(`/api/appointments-types/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: false }),
        cache: "no-store",
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("Deactivate failed", { status: res.status, json });
        return;
      }

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="inline-flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setOpenEdit(true)} disabled={loading}>
          <Pencil className="h-4 w-4" />
          Edit
        </Button>

        {row.isActive ? (
          <Button variant="destructive" size="sm" onClick={onDeactivate} disabled={loading}>
            <Ban className="h-4 w-4" />
            Deactivate
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Inactive
          </Button>
        )}
      </div>

      <AppointmentTypeUpsertModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        mode="edit"
        initial={row}
      />
    </>
  );
}
