"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { Button } from "@/src/components/ui/atoms/button";
import { Input } from "@/src/components/ui/molecules/input";

type AnimalLite = {
  id: number;
  animalName: string;
  isActive?: boolean;
};

type Props = {
  mode: "create" | "edit";
  animal?: AnimalLite; // requerido si mode="edit"
  children: React.ReactNode;
};

export default function AnimalsClientActions({ mode, animal, children }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialName = useMemo(() => {
    if (mode === "edit") return animal?.animalName ?? "";
    return "";
  }, [mode, animal]);

  const [name, setName] = useState(initialName);

  // cuando abres el modal, sincroniza el input con el row actual
  function onOpen() {
    if (mode === "edit") setName(animal?.animalName ?? "");
    else setName("");
    setOpen(true);
  }

  async function onSave() {
    try {
      setLoading(true);

      const animal_name = String(name ?? "").trim();
      if (!animal_name) return;

      if (mode === "create") {
        const res = await fetch("/api/animals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ animal_name }),
          cache: "no-store",
        });

        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          console.error("Create animal failed", { status: res.status, json });
          return;
        }
      } else {
        const id = String(animal?.id ?? "");
        if (!id) return;

        const res = await fetch(`/api/animals/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ animal_name }),
          cache: "no-store",
        });

        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          console.error("Update animal failed", { status: res.status, json });
          return;
        }
      }

      router.refresh();
      setOpen(false);
    } catch (e) {
      console.error("Save animal failed", e);
    } finally {
      setLoading(false);
    }
  }

  const title = mode === "create" ? "New animal" : `Edit animal #${animal?.id ?? ""}`;

  return (
    <>
      <span onClick={onOpen} className="inline-block">
        {children}
      </span>

      <Modal open={open} title={title} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-1">Animal name</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rabbit" />
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
