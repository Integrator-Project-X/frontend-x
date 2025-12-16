import { NextResponse } from "next/server";

const BASE_URL = process.env.BACKEND_URL ?? "http://localhost:3001";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const upstream = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await upstream.json().catch(() => null);

    if (!upstream.ok) {
      return NextResponse.json(
        { error: data?.message ?? data?.error ?? "REGISTER_FAILED", details: data },
        { status: upstream.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "INTERNAL_ERROR", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
