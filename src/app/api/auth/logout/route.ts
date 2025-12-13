import { NextResponse } from "next/server";
import { AUTH_COOKIES } from "@/src/core/auth/auth.constants";

export async function POST() {
  const res = NextResponse.json({ ok: true });

  res.cookies.set(AUTH_COOKIES.token, "", { path: "/", maxAge: 0 });
  res.cookies.set(AUTH_COOKIES.role, "", { path: "/", maxAge: 0 });

  return res;
}
