<<<<<<< HEAD
export type VetClinicStatus = "A" | "" | "PENDING";

export type VetClinic = {
  id: string;
  name: string;
  email: string;
  city: string;
  status: VetClinicStatus;
  verified: boolean;
};
=======
export type ClinicAPI = {
  id_clinic: number;
  clinic_name: string | null;
  address: string | null;
  phone_number: string | null;
  identification_number: string | null;
  image_url: string | null;
  isActive: boolean | null;
};

export type AdminClinicRow = {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  identificationNumber: string;
  imageUrl: string | null;
  isActive: boolean;
};
>>>>>>> feat/api_client
