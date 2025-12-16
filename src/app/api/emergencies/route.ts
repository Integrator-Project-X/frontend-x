import { NextResponse } from "next/server";
import { apiServer } from "@/src/core/api/api.server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (!body || !body.type || !body.location) {
    return NextResponse.json({ message: "Missing emergency data" }, { status: 400 });
  }

  const created = await apiServer.post(`/emergencies`, body);
  return NextResponse.json(created, { status: 201 });
}

export async function GET() {
  const list = await apiServer.get(`/emergencies`);
  return NextResponse.json(list || []);
}
