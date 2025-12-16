import { apiServer } from "@/src/core/api/api.server";
import { API_ENDPOINTS } from "@/src/core/api/api.endpoints";
import { AdminStats } from "@/src/types/adminstats.types";
type MaybeResponse<T> = T | { data: T } | { data: { data: T } };

function unwrap<T>(res: MaybeResponse<T>): T {
  // Soporta varias formas: res, res.data, res.data.data
  if (res && typeof res === "object" && "data" in res) {
    const d: any = (res as any).data;
    if (d && typeof d === "object" && "data" in d) return d.data as T;
    return d as T;
  }
  return res as T;
}

export async function getAdminStats(): Promise<AdminStats> {
  const [usersRes, clinicsRes, appointmentsRes] = await Promise.all([
    apiServer.get<any>(API_ENDPOINTS.users.list),
    apiServer.get<any>(API_ENDPOINTS.clinics.list),
    apiServer.get<any>(API_ENDPOINTS.appointments.list),
  ]);

  const users = unwrap<any[]>(usersRes) ?? [];
  const clinics = unwrap<any[]>(clinicsRes) ?? [];
  const appointments = unwrap<any[]>(appointmentsRes) ?? [];

  // Ajusta estos campos según tu backend real:
  const activeUsers = users.filter((u) => u?.isActive !== false).length;

  return {
    activeUsers,
    clinicsRegistered: clinics.length,
    totalAppointments: appointments.length,
    systemAlerts: 0, // luego lo conectamos (por ahora 0 o mock)
  };
}
