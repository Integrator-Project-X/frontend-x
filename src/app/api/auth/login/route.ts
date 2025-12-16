import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIES } from "@/src/core/auth/auth.constants";

const BASE_URL = process.env.BACKEND_URL ?? "http://localhost:3001";

type BackendLoginResponse = {
  success?: boolean;
  data?: {
    accessToken?: string;
    user?: {
      userid?: number;
      accessId?: number;
      roleId?: number;
      roleName?: string; // "ADMIN" | ...
      email?: string;
    };
  };
  message?: string;
  error?: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body?.email || !body?.password) {
      return NextResponse.json(
        { error: "MISSING_CREDENTIALS" },
        { status: 400 }
      );
    }

    const upstream = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // tu backend espera { email, password }
      body: JSON.stringify({ email: body.email, password: body.password }),
      cache: "no-store",
    });

    const data = (await upstream.json().catch(() => null)) as BackendLoginResponse | null;

    if (!upstream.ok) {
      return NextResponse.json(
        {
          error: data?.message ?? data?.error ?? "LOGIN_FAILED",
          details: data ?? null,
        },
        { status: upstream.status }
      );
    }

    const token = data?.data?.accessToken;
    const user = data?.data?.user;
    const role = user?.roleName;

    if (!token) {
      // Aquí estaba tu 500: el token existe pero lo estabas leyendo mal
      return NextResponse.json(
        { error: "TOKEN_MISSING_IN_RESPONSE", details: data },
        { status: 502 }
      );
    }

    const cookieStore = await cookies();
    const secure = process.env.NODE_ENV === "production";

    cookieStore.set(AUTH_COOKIES.token, token, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    if (role) {
      cookieStore.set(AUTH_COOKIES.role, String(role), {
        httpOnly: true,
        sameSite: "lax",
        secure,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    if (user?.userid != null) {
      cookieStore.set(AUTH_COOKIES.userId, String(user.userid), {
        httpOnly: true,
        sameSite: "lax",
        secure,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    if (user?.accessId != null) {
      cookieStore.set(AUTH_COOKIES.accessId, String(user.accessId), {
        httpOnly: true,
        sameSite: "lax",
        secure,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return NextResponse.json(
      { ok: true, role: role ?? null, user: user ?? null },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "INTERNAL_ERROR", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

