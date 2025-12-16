import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_ENDPOINTS } from "@/src/core/api/api.endpoints";
import { AUTH_COOKIES } from "@/src/core/auth/auth.constants";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function joinUrl(base: string, path: string) {
  const b = base.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

async function authHeaders(): Promise<Record<string, string>> {
  const store = await cookies();
  const token = store.get(AUTH_COOKIES.token)?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function safeJson(res: Response) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export async function GET() {
  if (!BASE_URL) {
    return NextResponse.json(
      { message: "Missing NEXT_PUBLIC_API_URL" },
      { status: 500 }
    );
  }

  const path = API_ENDPOINTS.users.list; // ✅ asegúrate que exista
  const url = joinUrl(BASE_URL, path);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(await authHeaders()),
    },
    cache: "no-store",
  });

  const payload: any = await safeJson(res);

  if (!res.ok) {
    console.log("BACKEND ERROR GET /users", { url, status: res.status, payload });
    return NextResponse.json(
      { ok: false, status: res.status, url, payload },
      { status: res.status }
    );
  }

  // si el backend devuelve { success, data } o array directo
  return NextResponse.json(payload?.data ?? payload, { status: 200 });
}
