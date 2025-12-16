import { NextResponse } from "next/server";
import { apiServer } from "@/src/core/api/api.server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ownerId = url.searchParams.get("ownerId");
  if (ownerId) {
    const appointments = await apiServer.get(`/appointments?ownerId=${encodeURIComponent(ownerId)}`);
    return NextResponse.json(appointments);
  }

  // Fallback: return all appointments (proxy to backend)
  const all = await apiServer.get(`/appointments`);
  return NextResponse.json(all || []);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  // basic validation
  if (!body || !body.petId || !body.clinicId || !body.date || !body.time || !body.serviceType) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }
  // forward to backend
  const created = await apiServer.post(`/appointments`, body);
  return NextResponse.json(created, { status: 201 });
}
