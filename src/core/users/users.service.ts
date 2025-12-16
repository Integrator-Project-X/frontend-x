import "server-only";
import { apiServer } from "@/src/core/api/api.server";
import { API_ENDPOINTS } from "@/src/core/api/api.endpoints";
import type { AccessDTO, BackendUser, UserMe } from "@/src/types/users.types";

// ✅ Normaliza cualquier "shape" típico del backend
function normalizeAccessList(payload: any): AccessDTO[] {
  if (Array.isArray(payload)) return payload;                 // [...]
  if (Array.isArray(payload?.data)) return payload.data;      // { data: [...] }
  if (Array.isArray(payload?.items)) return payload.items;    // { items: [...] }
  if (Array.isArray(payload?.data?.items)) return payload.data.items; // { data: { items: [...] } }
  return [];
}

export async function getUsersWithRoles(): Promise<BackendUser[]> {
  const raw = await apiServer.get<any>(API_ENDPOINTS.access.list);

  const accessList = normalizeAccessList(raw);

  // (Opcional) Debug rápido en terminal de Next:
  // console.log("RAW /access:", raw);
  // console.log("accessList length:", accessList.length);

  return accessList.map((a) => ({
    id: a.user?.id_user ?? a.id_access,
    name: a.user?.full_name ?? "—",
    email: a.email ?? "—",
    roleName: a.role?.role_name ?? "",
    isActive: a.user?.isActive ?? a.isActive ?? true,
  }));
}

export async function deactivateUser(id: string | number) {
  return apiServer.patch(API_ENDPOINTS.users.deactivate(String(id)));
}

export async function restoreUser(id: string | number) {
  return apiServer.patch(API_ENDPOINTS.users.restore(String(id)));
}

export async function getMe(): Promise<UserMe> {
  const raw = await apiServer.get<any>(API_ENDPOINTS.users.me);
  return (raw?.data ?? raw) as UserMe;
}