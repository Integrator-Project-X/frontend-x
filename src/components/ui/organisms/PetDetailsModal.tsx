import React from "react";
import { X } from "lucide-react";
import type { Pet } from "@/src/lib/mock-data";

type Props = {
  pet: Pet | null;
  onClose: () => void;
};

export default function PetDetailsModal({ pet, onClose }: Props) {
  if (!pet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-md rounded bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">{pet.name}</h3>
          <button onClick={onClose} className="ml-2 rounded p-1 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex gap-4">
          <img src={pet.imageUrl || "/placeholder.svg"} alt={pet.name} className="h-24 w-24 rounded-lg object-cover" />
          <div>
            <p className="text-sm text-gray-600">Species: {pet.species}</p>
            <p className="text-sm text-gray-600">Breed: {pet.breed}</p>
            <p className="text-sm text-gray-600">Age: {pet.age} years</p>
            <p className="text-sm text-gray-600">Age: {pet.age} years</p>
            <p className="text-sm text-gray-600 mt-2">Owner: {pet.ownerName}</p>
            <p className="text-sm text-gray-600">Contact: {pet.ownerPhone}</p>
            <p className={`text-sm mt-2 ${pet.vaccinesUpToDate ? 'text-green-600' : 'text-yellow-600'}`}>
              {pet.vaccinesUpToDate ? 'Vaccines up to date' : 'Vaccines pending'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
