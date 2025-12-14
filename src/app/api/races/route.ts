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
  const text = await res.text().catch(() => "");
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export async function GET() {
  if (!BASE_URL) {
    return NextResponse.json({ message: "Missing NEXT_PUBLIC_API_URL" }, { status: 500 });
  }

  const url = joinUrl(BASE_URL, API_ENDPOINTS.races.list);

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json", ...(await authHeaders()) },
    cache: "no-store",
  });

  const payload = await safeJson(res);
  return NextResponse.json(payload, { status: res.status });
}

export async function POST(req: Request) {
  if (!BASE_URL) {
    return NextResponse.json({ message: "Missing NEXT_PUBLIC_API_URL" }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const race_name = String(body?.race_name ?? "").trim();

  if (!race_name) {
    return NextResponse.json({ message: "race_name is required" }, { status: 400 });
  }

  const url = joinUrl(BASE_URL, API_ENDPOINTS.races.create);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", ...(await authHeaders()) },
    body: JSON.stringify({ race_name }),
    cache: "no-store",
  });

  const payload = await safeJson(res);
  return NextResponse.json(payload, { status: res.status });
}
