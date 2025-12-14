import "server-only";
import { apiServer } from "@/src/core/api/api.server";
import { API_ENDPOINTS } from "@/src/core/api/api.endpoints";

export type PersonalAPI = {
  id_personal: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id_user: number;
    full_name?: string;
    phone_number?: string;
    identification_number?: string;
    isActive?: boolean;
  };
  jobPosition?: {
    id_job_position: number;
    job_position_name?: string;
    isActive?: boolean;
  };
};

export type AdminPersonalRow = {
  id: number;
  isActive: boolean;
  createdAt?: string | null;

  userId?: number | null;
  fullName: string;
  phone: string;
  identification: string;

  jobPositionId?: number | null;
  jobPositionName: string;
};

export async function getPersonal(): Promise<AdminPersonalRow[]> {
  const list = await apiServer.get<PersonalAPI[]>(API_ENDPOINTS.personal.list);

  return (list ?? []).map((p) => ({
    id: p.id_personal,
    isActive: !!p.isActive,
    createdAt: p.createdAt ?? null,

    userId: p.user?.id_user ?? null,
    fullName: p.user?.full_name ?? "—",
    phone: p.user?.phone_number ?? "—",
    identification: p.user?.identification_number ?? "—",

    jobPositionId: p.jobPosition?.id_job_position ?? null,
    jobPositionName: p.jobPosition?.job_position_name ?? "—",
  }));
}

export async function deactivatePersonal(id: string | number) {
  return apiServer.patch(API_ENDPOINTS.personal.deactivate(String(id)));
}
