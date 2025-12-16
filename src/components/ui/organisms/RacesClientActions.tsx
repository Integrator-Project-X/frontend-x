"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { Button } from "@/src/components/ui/atoms/button";
import { Input } from "@/src/components/ui/molecules/input";

type RaceLite = {
  id: number;
  raceName: string;
  isActive?: boolean;
};

type Props = {
  mode: "create" | "edit";
  race?: RaceLite; // requerido si mode="edit"
  children: React.ReactNode;
};

export default function RacesClientActions({ mode, race, children }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialName = useMemo(() => {
    if (mode === "edit") return race?.raceName ?? "";
    return "";
  }, [mode, race]);

  const [name, setName] = useState(initialName);

  function onOpen() {
    if (mode === "edit") setName(race?.raceName ?? "");
    else setName("");
    setOpen(true);
  }

  async function onSave() {
    try {
      setLoading(true);

      const race_name = String(name ?? "").trim();
      if (!race_name) return;

      if (mode === "create") {
        const res = await fetch("/api/races", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ race_name }),
          cache: "no-store",
        });

        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          console.error("Create race failed", { status: res.status, json });
          return;
        }
      } else {
        const id = String(race?.id ?? "");
        if (!id) return;

        const res = await fetch(`/api/races/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ race_name }),
          cache: "no-store",
        });

        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          console.error("Update race failed", { status: res.status, json });
          return;
        }
      }

      router.refresh();
      setOpen(false);
    } catch (e) {
      console.error("Save race failed", e);
    } finally {
      setLoading(false);
    }
  }

  const title = mode === "create" ? "New race" : `Edit race #${race?.id ?? ""}`;

  return (
    <>
      <span onClick={onOpen} className="inline-block">
        {children}
      </span>

      <Modal open={open} title={title} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-1">Race name</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Labrador" />
          </div>

          <div className="pt-2 flex gap-2">
            <Button onClick={onSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
