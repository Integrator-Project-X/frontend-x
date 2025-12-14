import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_ENDPOINTS } from "@/src/core/api/api.endpoints";
import { AUTH_COOKIES } from "@/src/core/auth/auth.constants";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type Ctx = { params: Promise<{ id: string }> };

function isNumericString(v: string) {
  return /^\d+$/.test(String(v ?? "").trim());
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES.token)?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function PATCH(_: Request, ctx: Ctx) {
  if (!BASE_URL) return NextResponse.json({ message: "Missing NEXT_PUBLIC_API_URL" }, { status: 500 });

  const { id } = await ctx.params;
  if (!id || !isNumericString(id)) {
    return NextResponse.json({ message: "Validation failed (numeric string is expected)" }, { status: 400 });
  }

  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.animals.deactivate(id)}`, {
    method: "PATCH",
    headers: { Accept: "application/json", ...(await getAuthHeader()) },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
