import "server-only";
import { apiServer } from "@/src/core/api/api.server";
import { API_ENDPOINTS } from "@/src/core/api/api.endpoints";
import type { BackendUser, AccessDTO } from "@/src/types/users.types";

function normalizeAccessList(payload: any): AccessDTO[] {
  // Caso 1: ya es un array
  if (Array.isArray(payload)) return payload;

  // Caso 2: viene envuelto { data: [...] }
  if (Array.isArray(payload?.data)) return payload.data;

  // Caso 3: paginado típico { data: { items: [...] } }
  if (Array.isArray(payload?.data?.items)) return payload.data.items;

  // Caso 4: paginado típico { items: [...] }
  if (Array.isArray(payload?.items)) return payload.items;

  return [];
}

export async function getUsersWithRoles(): Promise<BackendUser[]> {
  // 👇 OJO: ponemos any para inspeccionar cualquier shape real
  const raw = await apiServer.get<any>(API_ENDPOINTS.access.list);

  const accessList = normalizeAccessList(raw);

  // Debug rápido (míralo en la terminal donde corre Next)
  // console.log("ACCESS RAW:", raw);
  // console.log("ACCESS LIST:", accessList.length);

  return accessList.map((a) => ({
    // Tu backend usa id_user / full_name / role_name
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
