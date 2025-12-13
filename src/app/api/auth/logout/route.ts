import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/src/core/auth/auth.cookies";

export async function POST() {
  await clearAuthCookies();
  return NextResponse.json({ ok: true });
}
