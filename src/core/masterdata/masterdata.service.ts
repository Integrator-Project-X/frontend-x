import "server-only";
import { apiServer } from "@/src/core/api/api.server";
import { API_ENDPOINTS } from "@/src/core/api/api.endpoints";

import type {
  AdminGenderRow,
  AdminAnimalRow,
  AdminRaceRow,
  AdminRoleRow,
  AdminMedicalRecordRow,
  AdminClinicScheduleRow,
} from "@/src/types/masterdata.types";

function unwrapList<T>(json: any): T[] {
  if (Array.isArray(json)) return json as T[];
  if (Array.isArray(json?.data)) return json.data as T[];
  // por si te devuelven un solo objeto en data
  if (json?.data && typeof json.data === "object") return [json.data as T];
  return [];
}

/* ------------------------- GENDERS ------------------------- */
export async function getGenders(): Promise<AdminGenderRow[]> {
  const json = await apiServer.get<any>(API_ENDPOINTS.genders.list);
  const list = unwrapList<any>(json);

  return list.map((g) => ({
    id: Number(g.id_gender ?? g.id ?? 0),
    name: String(g.name ?? ""),
    isActive: Boolean(g.isActive ?? g.is_active ?? true),
    createdAt: g.createdAt ?? null,
    updatedAt: g.updatedAt ?? null,
  }));
}

// en tu endpoints: genders.softDelete = "/genders/soft/:id"
export async function deactivateGender(id: string | number) {
  return apiServer.patch(API_ENDPOINTS.genders.softDelete(String(id)));
}

/* ------------------------- ANIMALS ------------------------- */
export async function getAnimals(): Promise<AdminAnimalRow[]> {
  const json = await apiServer.get<any>(API_ENDPOINTS.animals.list);
  const list = unwrapList<any>(json);

  return list.map((a) => ({
    id: Number(a.id_animal ?? a.id ?? 0),
    animalName: String(a.animal_name ?? a.name ?? ""),
    isActive: Boolean(a.isActive ?? a.is_active ?? true),
    createdAt: a.createdAt ?? null,
    updatedAt: a.updatedAt ?? null,
  }));
}

export async function deactivateAnimal(id: string | number) {
  return apiServer.patch(API_ENDPOINTS.animals.deactivate(String(id)));
}

/* ------------------------- RACES ------------------------- */
export async function getRaces(): Promise<AdminRaceRow[]> {
  const json = await apiServer.get<any>(API_ENDPOINTS.races.list);
  const list = unwrapList<any>(json);

  return list.map((r) => ({
    id: Number(r.id_race ?? r.id ?? 0),
    raceName: String(r.race_name ?? r.name ?? ""),
    isActive: Boolean(r.isActive ?? r.is_active ?? true),
    createdAt: r.createdAt ?? null,
    updatedAt: r.updatedAt ?? null,
  }));
}

export async function deactivateRace(id: string | number) {
  return apiServer.patch(API_ENDPOINTS.races.deactivate(String(id)));
}

/* ------------------------- ROLES ------------------------- */
export async function getRoles(): Promise<AdminRoleRow[]> {
  const json = await apiServer.get<any>(API_ENDPOINTS.roles.list);
  const list = unwrapList<any>(json);

  return list.map((r) => ({
    id: Number(r.id_role ?? r.id ?? 0),
    roleName: String(r.role_name ?? r.name ?? ""),
    isActive: Boolean(r.isActive ?? r.is_active ?? true),
    createdAt: r.createdAt ?? null,
    updatedAt: r.updatedAt ?? null,
  }));
}

export async function deactivateRole(id: string | number) {
  return apiServer.patch(API_ENDPOINTS.roles.deactivate(String(id)));
}

/* --------------------- MEDICAL RECORDS --------------------- */
export async function getMedicalRecords(): Promise<AdminMedicalRecordRow[]> {
  const json = await apiServer.get<any>(API_ENDPOINTS.medicalRecords.list);
  const list = unwrapList<any>(json);

  return list.map((m) => ({
    id: Number(m.id_medical_record ?? m.id ?? 0),
    isActive: Boolean(m.isActive ?? true),
    createdAt: m.createdAt ?? null,
    updatedAt: m.updatedAt ?? null,
  }));
}

// en tu endpoints: medicalRecords.delete = DELETE /medical-records/:id
export async function deleteMedicalRecord(id: string | number) {
  return apiServer.delete(API_ENDPOINTS.medicalRecords.delete(String(id)));
}

/* ------------------- CLINIC SCHEDULES ------------------- */
export async function getClinicSchedules(): Promise<AdminClinicScheduleRow[]> {
  const json = await apiServer.get<any>(API_ENDPOINTS.clinicSchedules.list);
  const list = unwrapList<any>(json);

  return list.map((s) => ({
    id: Number(s.id_clinic_schedule ?? s.id ?? 0),
    isActive: Boolean(s.isActive ?? s.is_active ?? true),

    clinicName: s?.clinic?.clinic_name ?? s?.clinic_name ?? null,
    day: s?.day ?? s?.day_of_week ?? null,
    startTime: s?.start_time ?? s?.startTime ?? null,
    endTime: s?.end_time ?? s?.endTime ?? null,

    createdAt: s.createdAt ?? null,
    updatedAt: s.updatedAt ?? null,
  }));
}

export async function deactivateClinicSchedule(id: string | number) {
  return apiServer.patch(API_ENDPOINTS.clinicSchedules.deactivate(String(id)));
}
