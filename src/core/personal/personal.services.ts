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

function toStr(v: any, fallback = "—") {
  const s = String(v ?? "").trim();
  return s ? s : fallback;
}

function toNum(v: any, fallback: number | null = null) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export async function getPersonal(): Promise<AdminPersonalRow[]> {
  // 👇 apiServer ya hace unwrap: si backend envía { success, data: [...] } devuelve [...]
  const list = await apiServer.get<PersonalAPI[] | any>(API_ENDPOINTS.personal.list);

  const arr: PersonalAPI[] = Array.isArray(list) ? list : [];

  return arr.map((p) => ({
    id: toNum(p?.id_personal, 0) ?? 0,
    isActive: !!p?.isActive,
    createdAt: p?.createdAt ?? null,

    userId: toNum(p?.user?.id_user, null),
    fullName: toStr(p?.user?.full_name),
    phone: toStr(p?.user?.phone_number),
    identification: toStr(p?.user?.identification_number),

    jobPositionId: toNum(p?.jobPosition?.id_job_position, null),
    jobPositionName: toStr(p?.jobPosition?.job_position_name),
  }));
}

export async function deactivatePersonal(id: string | number) {
  const endpoint = API_ENDPOINTS.personal.deactivate(String(id).trim());

  // Tu apiServer pone Content-Type SOLO si body !== undefined
  // y la mayoría de backends aceptan PATCH sin body.
  // 👇 mejor mandar undefined (más limpio)
  return apiServer.patch(endpoint);
}
