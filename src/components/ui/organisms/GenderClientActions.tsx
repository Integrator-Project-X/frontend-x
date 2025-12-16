"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/src/components/ui/organisms/Modal";
import { Button } from "@/src/components/ui/atoms/button";
import { Input } from "@/src/components/ui/molecules/input";

type Mode = "create" | "edit";

type Props = {
  mode: Mode;
  children: React.ReactNode;
  gender?: { id: number; name: string; isActive?: boolean };
};

function unwrapObject<T>(payload: any): T | null {
  if (!payload) return null;
  return (payload?.data ?? payload) as T;
}

export default function GenderClientActions({ mode, children, gender }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");

  const title = useMemo(
    () => (mode === "create" ? "New gender" : `Edit gender #${gender?.id}`),
    [mode, gender?.id]
  );

  useEffect(() => {
    if (!open) return;
    if (mode === "edit") setName(gender?.name ?? "");
    if (mode === "create") setName("");
  }, [open, mode, gender?.name]);

  async function onSave() {
    try {
      setLoading(true);

      const payload = { name: String(name ?? "").trim() };
      if (!payload.name) return;

      const res =
        mode === "create"
          ? await fetch("/api/genders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
              cache: "no-store",
            })
          : await fetch(`/api/genders/${gender?.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
              cache: "no-store",
            });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Save gender failed", { status: res.status, json });
        return;
      }

      unwrapObject(json); // solo por consistencia

      setOpen(false);
      // refresca la tabla (server component)
      window.location.reload();
    } catch (e) {
      console.error("Save gender error", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <span onClick={() => setOpen(true)}>{children}</span>

      <Modal open={open} title={title} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-1">Name</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Non-Binary" />
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={onSave} disabled={loading || !name.trim()}>
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
