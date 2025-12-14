import "server-only";
import { apiServer } from "@/src/core/api/api.server";
import { API_ENDPOINTS } from "@/src/core/api/api.endpoints";
import { unwrapArray } from "@/src/core/api/api.unwrap";

type DiagnosisAPI = {
  id_diagnosis: number;
  description: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  personal?: {
    user?: { full_name?: string };
    jobPosition?: { job_position_name?: string };
  };
};

export type AdminDiagnosisRow = {
  id: number;
  description: string;
  isActive: boolean;
  vetName: string;
  vetJob: string;
  createdAt?: string;
  updatedAt?: string;
};

export async function getDiagnosis(): Promise<AdminDiagnosisRow[]> {
  const res = await apiServer.get<any>(API_ENDPOINTS.diagnosis.list);
  const list = unwrapArray<DiagnosisAPI>(res);

  return list.map((d) => ({
    id: d.id_diagnosis,
    description: d.description ?? "—",
    isActive: !!d.isActive,
    vetName: d.personal?.user?.full_name ?? "—",
    vetJob: d.personal?.jobPosition?.job_position_name ?? "—",
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  }));
}

export async function deleteDiagnosis(id: string | number) {
  return apiServer.delete(API_ENDPOINTS.diagnosis.delete(String(id)));
}
