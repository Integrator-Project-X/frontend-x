import { NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/src/core/api/api.endpoints";
import { AUTH_COOKIES } from "@/src/core/auth/auth.constants";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: Request) {
  if (!BASE_URL) return NextResponse.json({ message: "Missing NEXT_PUBLIC_API_URL" }, { status: 500 });

  const body = await req.json();

  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.auth.login}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  // Ajusta esto cuando veas el response real del backend:
  const token = data.accessToken ?? data.token ?? data.jwt;

  if (!token) {
    return NextResponse.json({ message: "Login ok but token missing in response" }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set(AUTH_COOKIES.token, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // en prod true
    path: "/",
  });

  return response;
}
