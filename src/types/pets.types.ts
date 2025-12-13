export type PetSpecies = "DOG" | "CAT" | "OTHER";
export type PetStatus = "ACTIVE" | "ARCHIVED";

export type Pet = {
  id: string;
  name: string;
  species: PetSpecies;
  breed?: string;

  ownerId: string;
  ownerName: string;
  ownerEmail: string;

  city: string;
  createdAt: string; // "YYYY-MM-DD"
  status: PetStatus;
};
