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

async function handler({ id }: { id: string }) {
  if (!BASE_URL) {
    return NextResponse.json(
      { message: "Missing NEXT_PUBLIC_API_URL" },
      { status: 500 }
    );
  }

  const url = joinUrl(BASE_URL, API_ENDPOINTS.users.restore(id));

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeaders()),
    },
  });

  const data = await safeJson(res);
  return NextResponse.json(data, { status: res.status });
}

export async function POST(_: Request, { params }: { params: { id: string } }) {
  return handler({ id: params.id });
}

export async function PATCH(_: Request, { params }: { params: { id: string } }) {
  return handler({ id: params.id });
}
