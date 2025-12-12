import { NextResponse } from "next/server";
import { login } from "@/src/core/auth/auth.service";
import { setAccessTokenCookie } from "@/src/core/auth/auth.cookies";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // { email, password }
    const data = await login(body);

    await setAccessTokenCookie(data.accessToken);

    return NextResponse.json({ ok: true, user: data.user });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid credentials" },
      { status: 401 }
    );
  }
}
