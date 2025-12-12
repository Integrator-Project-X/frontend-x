import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // { name, email, password }

    // Mock validation (mínimo)
    if (!body?.email || !body?.password) {
      return NextResponse.json(
        { ok: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    // TODO: en el futuro:
    // 1) llamar backend real /auth/register
    // 2) guardar usuario en BDD
    // 3) opcional: devolver token y setear cookie

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Bad request" },
      { status: 400 }
    );
  }
}
