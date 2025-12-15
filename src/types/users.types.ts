export type DbUser = {
  id: number;
  email: string;
  fullname?: string; // tu backend usa "fullname" según el diagrama
  is_active?: boolean; // si existe
  isActive?: boolean;  // si existe
};

export type DbAccess = {
  id: number;
  email: string;
  id_user: number;
  id_role: number;
};

export type DbRole = {
  id: number;
  name: string; // "ADMIN" | "OWNER" | "CLINIC"
};

export type BackendUser = {
  id: string;
  email: string;
  name?: string;
  isActive?: boolean;

  roleId?: number;
  roleName?: string;
  accessId?: number;
};
