"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/src/components/ui/atoms/button";
import type { AdminPetRow } from "@/src/types/pets.types";
import PetDetailsModal from "./PetDetailsModal";

export default function PetViewButton({ pet }: { pet: AdminPetRow }) {
  const [open, setOpen] = useState(false);
  const petId = pet?.id != null ? String(pet.id) : "";

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} disabled={!petId}>
        <Eye className="h-4 w-4" />
        View
      </Button>

      <PetDetailsModal
        open={open}
        onClose={() => setOpen(false)}
        summary={pet}
        petId={petId}
      />
    </>
  );
}
