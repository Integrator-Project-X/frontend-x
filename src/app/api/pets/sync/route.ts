import { NextResponse } from "next/server";
import { apiServer } from "@/src/core/api/api.server";

type PendingPet = {
  pet_name: string;
  birth_date: string;
  id_race: number;
  id_animal: number;
  _tempId?: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const pending: PendingPet[] = Array.isArray(body?.pending) ? body.pending : [];

    const results: Array<{ tempId?: string; ok: boolean; backend?: any; error?: string }> = [];

    for (const p of pending) {
      const forward = { pet_name: p.pet_name, birth_date: p.birth_date, id_race: p.id_race, id_animal: p.id_animal };
      try {
        const created = await apiServer.post("/pets", forward);
        results.push({ tempId: p._tempId, ok: true, backend: created });
        continue;
      } catch (err: any) {
        // try alternative endpoint /pet-user if available
        try {
          const alt = await apiServer.post("/pet-user", forward);
          results.push({ tempId: p._tempId, ok: true, backend: alt });
          continue;
        } catch (err2: any) {
          results.push({ tempId: p._tempId, ok: false, error: err2?.message ?? String(err2) });
        }
      }
    }

    return NextResponse.json({ results }, { status: 200 });
  } catch (err: any) {
    console.error("/api/pets/sync error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
