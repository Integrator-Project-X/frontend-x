export type BackendUserRole = "ADMIN" | "VET" | "CLIENT";

export type BackendUser = {
  id: string;
  email: string;
  name?: string;
  role: BackendUserRole;
  isActive?: boolean;
};
