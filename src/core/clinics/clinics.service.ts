import "server-only";
import { apiServer } from "@/src/core/api/api.server";
import { API_ENDPOINTS } from "@/src/core/api/api.endpoints";
import type { AdminClinicRow, ClinicAPI } from "@/src/types/clinics.types";

export async function getClinics(): Promise<AdminClinicRow[]> {
  const list = await apiServer.get<ClinicAPI[]>(API_ENDPOINTS.clinics.list);

  // backend devuelve array directo ✅
  if (!Array.isArray(list)) return [];

  return list.map((c) => ({
    id: c.id_clinic,
    name: (c.clinic_name ?? "").trim() || "—",
    address: (c.address ?? "").trim() || "—",
    phoneNumber: (c.phone_number ?? "").trim() || "—",
    identificationNumber: (c.identification_number ?? "").trim() || "—",
    imageUrl: c.image_url ?? null,
    isActive: c.isActive !== false,
  }));
}

export async function deactivateClinic(id: string | number) {
  return apiServer.patch(API_ENDPOINTS.clinics.deactivate(String(id)));
}
