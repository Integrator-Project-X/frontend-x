import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_ENDPOINTS } from "@/src/core/api/api.endpoints";
import { AUTH_COOKIES } from "@/src/core/auth/auth.constants";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type Ctx = { params: Promise<{ id: string }> };

function isNumericString(v: string) {
  return /^\d+$/.test(String(v ?? "").trim());
}

function joinUrl(base: string, path: string) {
  const b = base.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES.token)?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
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

  try {
    const url = joinUrl(BASE_URL, API_ENDPOINTS.appointments.byId(id));

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(await getAuthHeader()),
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Upstream fetch failed", error: String(error) },
      { status: 502 }
    );
  }
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

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const url = joinUrl(BASE_URL, API_ENDPOINTS.appointments.update(id));

    const res = await fetch(url, {
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
  } catch (error) {
    return NextResponse.json(
      { message: "Upstream fetch failed", error: String(error) },
      { status: 502 }
    );
  }
}
