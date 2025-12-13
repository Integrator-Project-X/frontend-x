export type VetClinicStatus = "ACTIVE" | "SUSPENDED" | "PENDING";

export type VetClinic = {
  id: string;
  name: string;
  email: string;
  city: string;
  status: VetClinicStatus;
  verified: boolean;
};

export type PetOwnerStatus = "ACTIVE" | "SUSPENDED";

export type PetOwner = {
  id: string;
  fullName: string;
  email: string;
  city: string;
  status: PetOwnerStatus;
  petsCount: number;
  lastActiveAt: string; 
};
