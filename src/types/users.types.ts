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
