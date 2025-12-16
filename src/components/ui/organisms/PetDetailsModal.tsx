"use client";

import Modal from "./Modal";
import type { Pet } from "@/src/lib/mock-data";

type Props = {
  open: boolean;
  pet: Pet | null;
  onClose: () => void;
};

export default function PetDetailsModalSimple({ open, pet, onClose }: Props) {
  return (
    <Modal open={open} title={pet ? pet.name : "Pet"} onClose={onClose}>
      {!pet ? (
        <div className="text-sm text-muted-foreground">No pet selected.</div>
      ) : (
        <div className="space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pet.imageUrl || "/placeholder.svg"}
            alt={pet.name}
            className="h-40 w-full rounded-xl object-cover"
          />

          <div className="text-sm">
            <p><span className="font-medium">Breed:</span> {pet.breed}</p>
            <p><span className="font-medium">Age:</span> {pet.age} years</p>
          </div>

          <div className="pt-2">
            <button className="rounded-md border px-4 py-2 text-sm" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
