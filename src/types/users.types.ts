export type AccessDTO = {
  id_access: number;
  email: string;
  isActive: boolean;
  user: {
    id_user: number;
    full_name: string;
    isActive: boolean;
  };
  role: {
    id_role: number;
    role_name: string; // "ADMIN" | "VET" | "CLIENT"
    isActive: boolean;
  };
};

export type BackendUser = {
  id: number | string;
  name: string;
  email: string;
  roleName: string;
  isActive: boolean;
};

export type UserMe = {
  id_user: number;
  full_name: string;
  age?: number;
  address?: string;
  phone_number?: string;
  identification_number?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  gender?: {
    id_gender: number;
    gender_name: string;
  } | null;
};
