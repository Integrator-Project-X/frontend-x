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

function normalizeNumericId(value: unknown): string | null {
  const s = String(value ?? "").trim();
  if (!s) return null;
  if (!/^\d+$/.test(s)) return null;
  return s;
}

type RouteCtx = { params: Promise<{ id: string }> };

async function handler(id: string) {
  if (!BASE_URL) {
    return NextResponse.json(
      { message: "Missing NEXT_PUBLIC_API_URL" },
      { status: 500 }
    );
  }

  // Ajusta esto a tu endpoint real:
  const url = joinUrl(BASE_URL, API_ENDPOINTS.users.restore(id));

  const res = await fetch(url, {
    method: "PATCH", // o "POST" si tu backend lo requiere
    headers: {
      "Content-Type": "application/json",
      ...(await authHeaders()),
    },
  });

  const data = await safeJson(res);
  return NextResponse.json(data, { status: res.status });
}

export async function POST(_: NextRequest, ctx: RouteCtx) {
  const { id: rawId } = await ctx.params;
  const id = normalizeNumericId(rawId);

  if (!id) {
    return NextResponse.json(
      { ok: false, message: "Invalid route param id", received: rawId },
      { status: 400 }
    );
  }

  return handler(id);
}

// Si también lo expones como PATCH:
export async function PATCH(_: NextRequest, ctx: RouteCtx) {
  const { id: rawId } = await ctx.params;
  const id = normalizeNumericId(rawId);

  if (!id) {
    return NextResponse.json(
      { ok: false, message: "Invalid route param id", received: rawId },
      { status: 400 }
    );
  }

  return handler(id);
}
