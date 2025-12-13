import type { VetClinic, PetOwner } from "@/src/types/users.types";


export const mockClinics: VetClinic[] = [
  { id: "c1", name: "Happy Paws Clinic", email: "contact@happypaws.com", city: "Barranquilla", status: "ACTIVE", verified: true },
  { id: "c2", name: "VetCare 24/7", email: "hello@vetcare.com", city: "Bogotá", status: "PENDING", verified: false },
  { id: "c3", name: "Animalia Center", email: "info@animalia.com", city: "Medellín", status: "SUSPENDED", verified: true },
  { id: "c4", name: "CostaVet", email: "admin@costavet.com", city: "Barranquilla", status: "ACTIVE", verified: false },
];


export const mockPetOwners: PetOwner[] = [
  { id: "u1", fullName: "Ariana Barreto", email: "ari@demo.com", city: "Barranquilla", status: "ACTIVE", petsCount: 2, lastActiveAt: "2025-12-12" },
  { id: "u2", fullName: "Carlos Pérez", email: "carlos@demo.com", city: "Bogotá", status: "ACTIVE", petsCount: 1, lastActiveAt: "2025-12-10" },
  { id: "u3", fullName: "María Gómez", email: "maria@demo.com", city: "Medellín", status: "SUSPENDED", petsCount: 3, lastActiveAt: "2025-11-28" },
  { id: "u4", fullName: "Sebastián Ruiz", email: "sebas@demo.com", city: "Cali", status: "ACTIVE", petsCount: 0, lastActiveAt: "2025-12-13" },
];
