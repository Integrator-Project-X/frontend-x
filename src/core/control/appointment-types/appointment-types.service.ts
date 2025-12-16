import "server-only";
import { apiServer } from "@/src/core/api/api.server";
import { API_ENDPOINTS } from "@/src/core/api/api.endpoints";
import { unwrapArray } from "@/src/core/api/api.unwrap";

type AppointmentTypeAPI = {
  id: number;
  name: string;
  is_active: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminAppointmentTypeRow = {
  id: number;
  name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export async function getAppointmentTypes(): Promise<AdminAppointmentTypeRow[]> {
  const res = await apiServer.get<any>(API_ENDPOINTS.appointmentsTypes.list);
  const list = unwrapArray<AppointmentTypeAPI>(res);

  return list.map((t) => ({
    id: t.id,
    name: t.name ?? "—",
    isActive: !!t.is_active,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  }));
}

// OJO: aquí depende de tus endpoints reales. Si NO tienes deactivate,
// puedes usar delete o update cambiando is_active.
export async function deactivateAppointmentType(id: string | number) {
  return apiServer.delete(API_ENDPOINTS.appointmentsTypes.delete(String(id)));
}
