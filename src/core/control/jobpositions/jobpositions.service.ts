import "server-only";
import { apiServer } from "@/src/core/api/api.server";
import { API_ENDPOINTS } from "@/src/core/api/api.endpoints";
import { unwrapArray } from "@/src/core/api/api.unwrap";

type JobPositionAPI = {
  id_job_position: number;
  job_position_name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminJobPositionRow = {
  id: number;
  name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export async function getJobPositions(): Promise<AdminJobPositionRow[]> {
  const res = await apiServer.get<any>(API_ENDPOINTS.jobPositions.list);
  const list = unwrapArray<JobPositionAPI>(res);

  return list.map((j) => ({
    id: j.id_job_position,
    name: j.job_position_name ?? "—",
    isActive: !!j.isActive,
    createdAt: j.createdAt,
    updatedAt: j.updatedAt,
  }));
}

export async function deactivateJobPosition(id: string | number) {
  return apiServer.patch(API_ENDPOINTS.jobPositions.deactivate(String(id)));
}
