export type VetClinicStatus = "A" | "" | "PENDING";

export type VetClinic = {
  id: string;
  name: string;
  email: string;
  city: string;
  status: VetClinicStatus;
  verified: boolean;
};