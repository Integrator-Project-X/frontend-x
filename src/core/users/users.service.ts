import "server-only";

import { apiServer } from "@/src/core/api/api.server";
import { API_ENDPOINTS } from "@/src/core/api/api.endpoints";
import type { BackendUser, DbUser, DbAccess, DbRole } from "@/src/types/users.types";

function unwrapArray<T>(payload: any): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (Array.isArray(payload?.data)) return payload.data as T[];
  return [];
}

function pickName(u: DbUser) {
  return u.fullname ?? (u as any).full_name ?? undefined;
}

function pickIsActive(u: DbUser) {
  if (typeof (u as any).isActive === "boolean") return (u as any).isActive;
  if (typeof (u as any).is_active === "boolean") return (u as any).is_active;
  // si tu backend no maneja isActive, asumimos true
  return true;
}

/**
 * Trae users y les "inyecta" roleName:
 * - GET /users
 * - GET /access (id_user -> id_role)
 * - GET /roles (id -> name)
 */
export async function getUsersWithRoles(): Promise<BackendUser[]> {
  const usersRaw = await apiServer.get<any>(API_ENDPOINTS.users.list);
  const accessRaw = await apiServer.get<any>(API_ENDPOINTS.access.list);
  const rolesRaw = await apiServer.get<any>(API_ENDPOINTS.roles.list);

  const users = unwrapArray<DbUser>(usersRaw);
  const access = unwrapArray<DbAccess>(accessRaw);
  const roles = unwrapArray<DbRole>(rolesRaw);

  const roleNameById = new Map<number, string>(roles.map((r) => [r.id, r.name]));

  // OJO: asumo 1 access por user. Si en tu sistema puede haber varios,
  // luego lo cambiamos a map por array.
  const accessByUserId = new Map<number, DbAccess>();
  for (const a of access) accessByUserId.set(a.id_user, a);

  return users.map((u) => {
    const a = accessByUserId.get(u.id);
    const roleId = a?.id_role;
    const roleName = roleId ? roleNameById.get(roleId) : undefined;

    return {
      id: String(u.id),
      email: u.email,
      name: pickName(u),
      isActive: pickIsActive(u),

      roleId,
      roleName,
      accessId: a?.id,
    };
  });
}

/**
 * PATCH /users/:id/deactivate
 */
export async function deactivateUser(id: string) {
  return apiServer.patch(API_ENDPOINTS.users.deactivate(id));
}

/**
 * PATCH /users/:id/restore
 */
export async function restoreUser(id: string) {
  return apiServer.patch(API_ENDPOINTS.users.restore(id));
}

