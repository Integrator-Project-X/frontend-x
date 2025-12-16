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

/**
 * apiServer ya hace unwrap de { success, data } => data
 * pero dejamos este helper por compatibilidad si algún fetch devuelve wrapper.
 */
function unwrapList<T>(payload: any): T[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as T[];
  if (Array.isArray(payload?.data)) return payload.data as T[];
  if (payload?.data && typeof payload.data === "object") return [payload.data as T];
  return [];
}

/* ------------------------- GENDERS ------------------------- */
export async function getGenders(): Promise<AdminGenderRow[]> {
  const raw = await apiServer.get<any>(API_ENDPOINTS.genders.list);
  const list = unwrapList<any>(raw);

  return list.map((g) => ({
    id: Number(g.id_gender ?? g.id ?? 0),
    name: String(g.name ?? ""),
    isActive: Boolean(g.isActive ?? g.is_active ?? true),
    createdAt: g.createdAt ?? null,
    updatedAt: g.updatedAt ?? null,
  }));
}

/**
 * Tu UI muestra: PATCH /genders/soft/:id
 * y tu endpoint es genders.softDelete(id) => /genders/soft/:id
 */
export async function deactivateGender(id: string | number) {
  return apiServer.patch(API_ENDPOINTS.genders.softDelete(String(id)));
}

/* ------------------------- ANIMALS ------------------------- */
export async function getAnimals(): Promise<AdminAnimalRow[]> {
  const raw = await apiServer.get<any>(API_ENDPOINTS.animals.list);
  const list = unwrapList<any>(raw);

  return list.map((a) => ({
    id: Number(a.id_animal ?? a.id ?? 0),
    animalName: String(a.animal_name ?? a.name ?? ""),
    isActive: Boolean(a.isActive ?? a.is_active ?? true),
    createdAt: a.createdAt ?? null,
    updatedAt: a.updatedAt ?? null,
  }));
}

/**
 * OJO: en tus endpoints se llama "deactivate",
 * pero la URL es /animals/:id/desactivate
 */
export async function deactivateAnimal(id: string | number) {
  return apiServer.patch(API_ENDPOINTS.animals.deactivate(String(id)));
}

/* ------------------------- RACES ------------------------- */
export async function getRaces(): Promise<AdminRaceRow[]> {
  const raw = await apiServer.get<any>(API_ENDPOINTS.races.list);
  const list = unwrapList<any>(raw);

  return list.map((r) => ({
    id: Number(r.id_race ?? r.id ?? 0),
    raceName: String(r.race_name ?? r.name ?? ""),
    isActive: Boolean(r.isActive ?? r.is_active ?? true),
    createdAt: r.createdAt ?? null,
    updatedAt: r.updatedAt ?? null,
  }));
}

export async function getRaceById(id: string | number): Promise<AdminRaceRow | null> {
  const r = await apiServer.get<any>(API_ENDPOINTS.races.byId(String(id)));
  if (!r) return null;

  return {
    id: Number(r.id_race ?? r.id ?? 0),
    raceName: String(r.race_name ?? r.name ?? ""),
    isActive: Boolean(r.isActive ?? r.is_active ?? true),
    createdAt: r.createdAt ?? null,
    updatedAt: r.updatedAt ?? null,
  };
}

export async function createRace(payload: { race_name: string; isActive?: boolean }) {
  return apiServer.post(API_ENDPOINTS.races.create, payload);
}

export async function updateRace(id: string | number, payload: { race_name?: string; isActive?: boolean }) {
  return apiServer.patch(API_ENDPOINTS.races.update(String(id)), payload);
}

export async function deactivateRace(id: string | number) {
  // OJO: tu endpoint se llama "deactivate" pero URL termina en /desactivate
  return apiServer.patch(API_ENDPOINTS.races.deactivate(String(id)));
}

/* ------------------------- ROLES ------------------------- */
export async function getRoles(): Promise<AdminRoleRow[]> {
  const raw = await apiServer.get<any>(API_ENDPOINTS.roles.list);
  const list = unwrapList<any>(raw);

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
  const raw = await apiServer.get<any>(API_ENDPOINTS.medicalRecords.list);
  const list = unwrapList<any>(raw);

  return list.map((m) => ({
    id: Number(m.id_medical_record ?? m.id ?? 0),
    isActive: Boolean(m.isActive ?? true),
    createdAt: m.createdAt ?? null,
    updatedAt: m.updatedAt ?? null,
  }));
}

export async function deleteMedicalRecord(id: string | number) {
  return apiServer.delete(API_ENDPOINTS.medicalRecords.delete(String(id)));
}

/* ------------------- CLINIC SCHEDULES ------------------- */
export async function getClinicSchedules(): Promise<AdminClinicScheduleRow[]> {
  const raw = await apiServer.get<any>(API_ENDPOINTS.clinicSchedules.list);
  const list = unwrapList<any>(raw);

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
