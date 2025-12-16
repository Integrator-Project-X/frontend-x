import "server-only";
import { apiServer } from "@/src/core/api/api.server";
import { API_ENDPOINTS } from "@/src/core/api/api.endpoints";
import type { ApiEnvelope, AppointmentAPI, AdminAppointmentRow } from "@/src/types/appointments.types";

function unwrapArray<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  const env = raw as Partial<ApiEnvelope<T[]>>;
  if (Array.isArray(env?.data)) return env.data;
  return [];
}

export async function getAppointments(): Promise<AdminAppointmentRow[]> {
  const raw = await apiServer.get<unknown>(API_ENDPOINTS.appointments.list);
  const list = unwrapArray<AppointmentAPI>(raw);

  return list.map((a) => ({
    id: a.id_appointment,
    description: a.description ?? "—",
    createdAt: a.createdAt,
    isActive: a.isActive ?? true,

    clinicName: a.clinic?.clinic_name ?? "—",

    petName: a.pet?.pet_name ?? "—",
    animalName: a.pet?.animal?.animal_name ?? "—",
    raceName: a.pet?.race?.race_name ?? "—",

    ownerName: a.user?.full_name ?? "—",
    ownerId: a.user?.id_user ?? null,

    vetName: a.diagnosis?.personal?.user?.full_name ?? "—",
    vetJob: a.diagnosis?.personal?.jobPosition?.job_position_name ?? "—",

    typeName: a.type?.name ?? "—",
    statusName: a.status?.status_name ?? "—",
  }));
}

export async function deactivateAppointment(id: string | number) {
  return apiServer.patch(API_ENDPOINTS.appointments.deactivate(String(id)));
}

export async function getClinicAppointments(): Promise<AppointmentAPI[]> {
  const raw = await apiServer.get<unknown>(API_ENDPOINTS.appointments.clinic);
  return unwrapArray<AppointmentAPI>(raw);
}

export async function getAppointmentById(id: string | number): Promise<AppointmentAPI> {
  const raw = await apiServer.get<any>(API_ENDPOINTS.appointments.byId(String(id)));
  return (raw?.data ?? raw) as AppointmentAPI;
}

export async function updateAppointmentStatus(
  id: string | number,
  id_status: number
): Promise<AppointmentAPI> {
  const raw = await apiServer.patch<any>(API_ENDPOINTS.appointments.setStatus(String(id)), {
    id_status,
  });
  return (raw?.data ?? raw) as AppointmentAPI;
}

export async function setAppointmentDiagnosis(
  id: string | number,
  payload: { id_personal: number; description: string }
): Promise<AppointmentAPI> {
  const raw = await apiServer.patch<any>(
    API_ENDPOINTS.appointments.setDiagnosis(String(id)),
    payload
  );
  return (raw?.data ?? raw) as AppointmentAPI;
}
