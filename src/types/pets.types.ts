export type PetAPI = {
  id_pet: number;
  pet_name: string;
  birth_date: string; // ISO
  isActive: boolean;
  image_url?: string | null;
  createdAt: string;
  updatedAt: string;

  race?: {
    id_race: number;
    race_name: string;
  } | null;

  animal?: {
    id_animal: number;
    animal_name: string;
  } | null;
};

export type AdminPetRow = {
  id: number;
  name: string;
  birthDate?: string; // ISO
  isActive: boolean;
  imageUrl?: string | null;
  raceName?: string;
  animalName?: string;
};
