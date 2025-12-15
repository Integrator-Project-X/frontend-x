import { NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/src/core/api/api.endpoints";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  if (!BASE_URL) {
    return NextResponse.json({ message: "Missing NEXT_PUBLIC_API_URL" }, { status: 500 });
  }

  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.genders.active}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
