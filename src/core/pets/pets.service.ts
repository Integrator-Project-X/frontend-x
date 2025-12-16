import "server-only";
import { apiServer } from "@/src/core/api/api.server";
import { API_ENDPOINTS } from "@/src/core/api/api.endpoints";
import type { PetAPI, AdminPetRow } from "@/src/types/pets.types";

export async function getPets(): Promise<AdminPetRow[]> {
  const list = await apiServer.get<PetAPI[]>(API_ENDPOINTS.pets.list);

  return list.map((p) => ({
    id: p.id_pet,
    name: p.pet_name,
    birthDate: p.birth_date,
    isActive: p.isActive,
    imageUrl: p.image_url ?? null,
    raceName: p.race?.race_name ?? "",
    animalName: p.animal?.animal_name ?? "",
  }));
}
