import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIES } from "@/src/core/auth/auth.constants";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIES.token, "", { path: "/", maxAge: 0 });
  cookieStore.set(AUTH_COOKIES.role, "", { path: "/", maxAge: 0 });
  cookieStore.set(AUTH_COOKIES.userId, "", { path: "/", maxAge: 0 });
  cookieStore.set(AUTH_COOKIES.accessId, "", { path: "/", maxAge: 0 });

  return NextResponse.json({ ok: true });
}
