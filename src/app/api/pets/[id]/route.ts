import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_ENDPOINTS } from "@/src/core/api/api.endpoints";
import { AUTH_COOKIES } from "@/src/core/auth/auth.constants";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function isNumericString(v: string) {
  return /^\d+$/.test(String(v ?? "").trim());
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES.token)?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, ctx: Ctx) {
  if (!BASE_URL) {
    return NextResponse.json({ message: "Missing NEXT_PUBLIC_API_URL" }, { status: 500 });
  }

  const { id } = await ctx.params;

  if (!id || !isNumericString(id)) {
    return NextResponse.json({ message: "Validation failed (numeric string is expected)" }, { status: 400 });
  }

  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.pets.byId(id)}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(await getAuthHeader()),
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(req: Request, ctx: Ctx) {
  if (!BASE_URL) {
    return NextResponse.json({ message: "Missing NEXT_PUBLIC_API_URL" }, { status: 500 });
  }

  const { id } = await ctx.params;

  if (!id || !isNumericString(id)) {
    return NextResponse.json({ message: "Validation failed (numeric string is expected)" }, { status: 400 });
  }

  // ✅ multipart/form-data desde el cliente
  const incoming = await req.formData();
  const outgoing = new FormData();

  // Campos esperados por Swagger
  const pet_name = incoming.get("pet_name");
  const birth_date = incoming.get("birth_date");
  const isActive = incoming.get("isActive");
  const id_race = incoming.get("id_race");
  const id_animal = incoming.get("id_animal");
  const image = incoming.get("image");

  if (typeof pet_name === "string" && pet_name.trim()) outgoing.append("pet_name", pet_name.trim());
  if (typeof birth_date === "string" && birth_date.trim()) outgoing.append("birth_date", birth_date.trim());
  if (typeof isActive === "string" && isActive.trim()) outgoing.append("isActive", isActive.trim());
  if (typeof id_race === "string" && id_race.trim()) outgoing.append("id_race", id_race.trim());
  if (typeof id_animal === "string" && id_animal.trim()) outgoing.append("id_animal", id_animal.trim());

  if (image instanceof File && image.size > 0) {
    outgoing.append("image", image);
  }

  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.pets.update(id)}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      ...(await getAuthHeader()),
      // ❌ NO pongas Content-Type aquí (fetch lo pone con boundary)
    },
    body: outgoing,
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
