import { NextRequest, NextResponse } from "next/server";
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

async function handler(id: string) {
  if (!BASE_URL) {
    return NextResponse.json(
      { message: "Missing NEXT_PUBLIC_API_URL" },
      { status: 500 }
    );
  }

  const url = joinUrl(BASE_URL, API_ENDPOINTS.users.deactivate(id));

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

type RouteCtx = { params: Promise<{ id: string }> };

// Por si lo llamas desde el front con POST
export async function POST(_: NextRequest, ctx: RouteCtx) {
  const { id } = await ctx.params;
  return handler(id);
}

// Y por si lo llamas como PATCH
export async function PATCH(_: NextRequest, ctx: RouteCtx) {
  const { id } = await ctx.params;
  return handler(id);
}
