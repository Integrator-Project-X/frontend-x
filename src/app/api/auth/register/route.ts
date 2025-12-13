import { NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/src/core/api/api.endpoints";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: Request) {
  if (!BASE_URL) return NextResponse.json({ message: "Missing NEXT_PUBLIC_API_URL" }, { status: 500 });

  const body = await req.json();

  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.auth.register}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  return NextResponse.json(data, { status: res.status });
}
