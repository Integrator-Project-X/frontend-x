import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_ENDPOINTS } from "@/src/core/api/api.endpoints";
import { AUTH_COOKIES } from "@/src/core/auth/auth.constants";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

type Ctx = { params: { id: string } | Promise<{ id: string }> };

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
  const text = await res.text().catch(() => "");
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

export async function GET(_: Request, ctx: Ctx) {
  if (!BASE_URL) {
    return NextResponse.json({ message: "Missing NEXT_PUBLIC_API_URL" }, { status: 500 });
  }

  const params = await ctx.params;
  const id = normalizeNumericId(params?.id);

  if (!id) {
    return NextResponse.json({ message: "Invalid route param id", received: params?.id }, { status: 400 });
  }

  const url = joinUrl(BASE_URL, API_ENDPOINTS.races.byId(id));

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json", ...(await authHeaders()) },
    cache: "no-store",
  });

  const payload = await safeJson(res);
  return NextResponse.json(payload, { status: res.status });
}

export async function PATCH(req: Request, ctx: Ctx) {
  if (!BASE_URL) {
    return NextResponse.json({ message: "Missing NEXT_PUBLIC_API_URL" }, { status: 500 });
  }

  const params = await ctx.params;
  const id = normalizeNumericId(params?.id);

  if (!id) {
    return NextResponse.json({ message: "Invalid route param id", received: params?.id }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const race_name = String(body?.race_name ?? "").trim();

  if (!race_name) {
    return NextResponse.json({ message: "race_name is required" }, { status: 400 });
  }

  const url = joinUrl(BASE_URL, API_ENDPOINTS.races.update(id));

  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Accept: "application/json", ...(await authHeaders()) },
    body: JSON.stringify({ race_name }),
    cache: "no-store",
  });

  const payload = await safeJson(res);
  return NextResponse.json(payload, { status: res.status });
}
