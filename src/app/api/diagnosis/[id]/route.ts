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

function resolveEndpoint(maybe: any, fallback: (id: string) => string, id: string) {
  try {
    if (typeof maybe === "function") return maybe(id);
    if (typeof maybe === "string" && maybe.trim()) {
      return maybe.includes(":id") ? maybe.replace(":id", id) : maybe;
    }
    return fallback(id);
  } catch {
    return fallback(id);
  }
}

export async function GET(_: Request, ctx: Ctx) {
  if (!BASE_URL) {
    return NextResponse.json({ message: "Missing NEXT_PUBLIC_API_URL" }, { status: 500 });
  }

  const { id } = await ctx.params;
  if (!id || !isNumericString(id)) {
    return NextResponse.json(
      { message: "Validation failed (numeric string is expected)" },
      { status: 400 }
    );
  }

  const endpoint = resolveEndpoint((API_ENDPOINTS as any)?.diagnosis?.byId, (x) => `/diagnosis/${x}`, id);

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "GET",
    headers: { Accept: "application/json", ...(await getAuthHeader()) },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(req: Request, ctx: Ctx) {
  if (!BASE_URL) {
    return NextResponse.json({ message: "Missing NEXT_PUBLIC_API_URL" }, { status: 500 });
  }

  const { id } = await ctx.params;
  if (!id || !isNumericString(id)) {
    return NextResponse.json(
      { message: "Validation failed (numeric string is expected)" },
      { status: 400 }
    );
  }

  const body = await req.json().catch(() => ({}));

  const endpoint = resolveEndpoint((API_ENDPOINTS as any)?.diagnosis?.update, (x) => `/diagnosis/${x}`, id);

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(await getAuthHeader()),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(_: Request, ctx: Ctx) {
  if (!BASE_URL) {
    return NextResponse.json({ message: "Missing NEXT_PUBLIC_API_URL" }, { status: 500 });
  }

  const { id } = await ctx.params;
  if (!id || !isNumericString(id)) {
    return NextResponse.json(
      { message: "Validation failed (numeric string is expected)" },
      { status: 400 }
    );
  }

  const endpoint = resolveEndpoint((API_ENDPOINTS as any)?.diagnosis?.delete, (x) => `/diagnosis/${x}`, id);

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: { Accept: "application/json", ...(await getAuthHeader()) },
    cache: "no-store",
  });

  // tu swagger muestra {} como respuesta. Por si viene vacío:
  const text = await res.text().catch(() => "");
  const data = text ? (() => { try { return JSON.parse(text); } catch { return {}; } })() : {};

  return NextResponse.json(data, { status: res.status });
}
