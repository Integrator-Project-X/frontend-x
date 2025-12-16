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

export async function GET(_: NextRequest, ctx: RouteCtx) {
  if (!BASE_URL) {
    return NextResponse.json(
      { message: "Missing NEXT_PUBLIC_API_URL" },
      { status: 500 }
    );
  }

  const { id: rawId } = await ctx.params;
  const id = normalizeNumericId(rawId);

  if (!id) {
    return NextResponse.json(
      { ok: false, message: "Invalid route param id", received: rawId },
      { status: 400 }
    );
  }

  const url = joinUrl(BASE_URL, API_ENDPOINTS.users.byId(id));

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeaders()),
    },
    cache: "no-store",
  });

  const payload: any = await safeJson(res);

  if (!res.ok) {
    console.log("BACKEND ERROR GET /users/:id", { id, url, status: res.status, payload });
    return NextResponse.json(
      { ok: false, status: res.status, url, payload },
      { status: res.status }
    );
  }

  return NextResponse.json(payload?.data ?? payload, { status: 200 });
}

export async function PATCH(req: NextRequest, ctx: RouteCtx) {
  if (!BASE_URL) {
    return NextResponse.json(
      { message: "Missing NEXT_PUBLIC_API_URL" },
      { status: 500 }
    );
  }

  const { id: rawId } = await ctx.params;
  const id = normalizeNumericId(rawId);

  if (!id) {
    return NextResponse.json(
      { ok: false, message: "Invalid route param id", received: rawId },
      { status: 400 }
    );
  }

  const body = await req.json().catch(() => ({}));

  const url = joinUrl(BASE_URL, API_ENDPOINTS.users.update(id));

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeaders()),
    },
    body: JSON.stringify(body),
  });

  const payload: any = await safeJson(res);

  if (!res.ok) {
    console.log("BACKEND ERROR PATCH /users/:id", { id, url, status: res.status, body, payload });
    return NextResponse.json(
      { ok: false, status: res.status, url, body, payload },
      { status: res.status }
    );
  }

  return NextResponse.json(payload?.data ?? payload, { status: 200 });
}
