import { NextResponse } from "next/server";

const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");

export async function GET(req: Request) {
  if (!BASE_URL) return NextResponse.json({ error: "Missing NEXT_PUBLIC_API_URL" }, { status: 500 });

  const url = new URL(req.url);
  const mode = url.searchParams.get("mode") || "json";
  const payload = { pet_name: "__test__", birth_date: "2020-01-01", id_race: 1, id_animal: 1 } as Record<string, any>;

  try {
    if (mode === "json-with-image-null") {
      payload.image = null;
    }

    console.info("/api/pets/test: mode", mode, "sending to backend", BASE_URL + "/pets", payload);

    let res: Response;

    if (mode === "form") {
      const body = new URLSearchParams();
      Object.entries(payload).forEach(([k, v]) => body.append(k, String(v ?? "")));
      res = await fetch(`${BASE_URL}/pets`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() });
    } else if (mode === "formdata") {
      const fd = new FormData();
      Object.entries(payload).forEach(([k, v]) => fd.append(k, String(v ?? "")));
      res = await fetch(`${BASE_URL}/pets`, { method: "POST", body: fd as any });
    } else {
      res = await fetch(`${BASE_URL}/pets`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    }

    const text = await res.text().catch(() => "");
    let json: any = null;
    try { json = JSON.parse(text); } catch {}

    return NextResponse.json({ mode, status: res.status, ok: res.ok, text, json, requestBody: payload }, { status: 200 });
  } catch (err: any) {
    console.error("/api/pets/test error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
