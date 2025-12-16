import "server-only";
import { apiServer } from "@/src/core/api/api.server";
import { API_ENDPOINTS } from "@/src/core/api/api.endpoints";
import { unwrapArray } from "@/src/core/api/api.unwrap";

type AppointmentStatusAPI = {
  id_appointment_status: number;
  status_name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminAppointmentStatusRow = {
  id: number;
  name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export async function getAppointmentStatuses(): Promise<AdminAppointmentStatusRow[]> {
  const res = await apiServer.get<any>(API_ENDPOINTS.appointmentStatus.list);
  const list = unwrapArray<AppointmentStatusAPI>(res);

  return list.map((s) => ({
    id: s.id_appointment_status,
    name: s.status_name ?? "—",
    isActive: !!s.isActive,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  }));
}

export async function softDeleteAppointmentStatus(id: string | number) {
  return apiServer.patch(API_ENDPOINTS.appointmentStatus.softDelete(String(id)));
}
