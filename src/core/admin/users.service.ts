import { apiServer } from "@/src/core/api/api.server";
import { API_ENDPOINTS } from "@/src/core/api/api.endpoints";

export type BackendUser = {
  id: string;
  email: string;
  name?: string;

  // ajusta según tu backend (puede venir roleId o role.name)
  role?: string; // "ADMIN" | "CLINIC" | "OWNER"
  isActive?: boolean; // true/false
};

export async function getUsers(): Promise<BackendUser[]> {
  return apiServer.get<BackendUser[]>(API_ENDPOINTS.users.list);
}
