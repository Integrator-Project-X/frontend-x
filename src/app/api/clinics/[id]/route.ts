import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_ENDPOINTS } from "@/src/core/api/api.endpoints";
import { AUTH_COOKIES } from "@/src/core/auth/auth.constants";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type Ctx = { params: Promise<{ id: string }> };

function isNumericString(v: string) {
  return /^\d+$/.test(String(v ?? "").trim());
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES.token)?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET(_: Request, ctx: Ctx) {
  if (!BASE_URL) {
    return NextResponse.json({ message: "Missing NEXT_PUBLIC_API_URL" }, { status: 500 });
  }

  const { id } = await ctx.params;

  if (!id || !isNumericString(id)) {
    return NextResponse.json(
      { message: "Validation failed (numeric string is expected)" },
      { status: 400 }
    );
  }

  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.clinics.byId(id)}`, {
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
    return NextResponse.json(
      { message: "Validation failed (numeric string is expected)" },
      { status: 400 }
    );
  }

  const incoming = await req.formData();
  const outgoing = new FormData();

  const clinic_name = incoming.get("clinic_name");
  const address = incoming.get("address");
  const phone_number = incoming.get("phone_number");
  const identification_number = incoming.get("identification_number");
  const isActive = incoming.get("isActive");
  const image = incoming.get("image");

  if (typeof clinic_name === "string" && clinic_name.trim())
    outgoing.append("clinic_name", clinic_name.trim());
  if (typeof address === "string" && address.trim()) outgoing.append("address", address.trim());
  if (typeof phone_number === "string" && phone_number.trim())
    outgoing.append("phone_number", phone_number.trim());
  if (typeof identification_number === "string" && identification_number.trim())
    outgoing.append("identification_number", identification_number.trim());
  if (typeof isActive === "string" && isActive.trim()) outgoing.append("isActive", isActive.trim());

  if (image instanceof File && image.size > 0) outgoing.append("image", image);

  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.clinics.update(id)}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      ...(await getAuthHeader()),
      // NO Content-Type aquí (FormData lo pone solo)
    },
    body: outgoing,
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
