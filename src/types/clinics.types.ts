export type ClinicAPI = {
  id_clinic: number;
  clinic_name?: string | null;
  address?: string | null;
  phone?: string | null;
  isActive?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type AdminClinicRow = {
  id: number;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
  createdAt?: string | null;
};
