import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_ENDPOINTS } from "@/src/core/api/api.endpoints";
import { AUTH_COOKIES } from "@/src/core/auth/auth.constants";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES.token)?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET() {
  if (!BASE_URL) {
    return NextResponse.json({ message: "Missing NEXT_PUBLIC_API_URL" }, { status: 500 });
  }

  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.appointmentStatus.list}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(await getAuthHeader()),
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
