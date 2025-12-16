import { NextResponse } from "next/server";
import { apiServer } from "@/src/core/api/api.server";
import { addPet as addPetLocal } from "@/src/lib/mock-data";

/**
 * GET /api/pets?ownerId=...
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const ownerId = url.searchParams.get("ownerId");
  const page = url.searchParams.get("page") || "1";
  const limit = url.searchParams.get("limit") || "20";

  if (!ownerId) {
    return NextResponse.json(
      { error: "ownerId required" },
      { status: 400 }
    );
  }

  const pets = await apiServer.get(
    `/pets?ownerId=${encodeURIComponent(ownerId)}&page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`
  );

  return NextResponse.json(pets);
}

/**
 * POST /api/pets
 * ⚠️ Backend NO permite ninguna propiedad llamada "image"
 * ⚠️ img_url es la única relacionada con imagen permitida
 */
export async function POST(req: Request) {
  let forward: Record<string, unknown> = {};
  let receivedBody: unknown = undefined;

  try {
    // 1️⃣ Leer body original
    const body = await req.json();
    receivedBody = body;

    // 2️⃣ Limpieza ABSOLUTA:
    // elimina cualquier key que contenga "image" (image, imageUrl, image_url, image:null, etc.)
    const incoming: Record<string, unknown> = JSON.parse(
      JSON.stringify(body ?? {}, (key, value) => {
        if (key.toLowerCase().includes("image")) return undefined;
        return value;
      })
    );

    // 3️⃣ SOLO campos permitidos por el backend
    const {
      pet_name,
      birth_date,
      id_race,
      id_animal,
      img_url, // ✅ opcional
    } = incoming;

    // 4️⃣ Payload final limpio
    forward = JSON.parse(
      JSON.stringify({
        pet_name,
        birth_date,
        id_race,
        id_animal,
        img_url,
      })
    );

    console.info("/api/pets forwarding clean payload:", forward);

    // 5️⃣ Enviar al backend real (si falla, crear fallback local)
    try {
      const created = await apiServer.post("/pets", forward);
      return NextResponse.json(created, { status: 201 });
    } catch (backendErr: any) {
      console.error("/api/pets backend post failed, creating local fallback:", backendErr);
      try {
        const petName = String(forward.pet_name ?? "");
        const birth = String(forward.birth_date ?? "1970-01-01");
        const age = birth ? Math.max(0, new Date().getFullYear() - new Date(birth).getFullYear()) : 0;
        const species = Number(forward.id_animal) === 2 ? "cat" : "dog";

        const local = addPetLocal({
          name: petName,
          species: species as any,
          breed: "",
          age,
          ownerId: String(forward.ownerId ?? ""),
          ownerName: String(forward.ownerName ?? ""),
          ownerPhone: String(forward.ownerPhone ?? ""),
          vaccinesUpToDate: true,
          imageUrl: "",
        });

        return NextResponse.json({ data: local, _local: true, backendError: String(backendErr) }, { status: 201 });
      } catch (localErr) {
        console.error("/api/pets failed local fallback:", localErr);
        throw backendErr;
      }
    }

  } catch (err: any) {
    console.error("/api/pets POST error:", err);

    const raw = err?.message ?? String(err);
    const match = raw.match(/\{[\s\S]*\}/);

    if (match) {
      try {
        const parsed = JSON.parse(match[0]);

        // If backend rejects due to 'image' field, create locally as fallback so UI can continue
        const msgs: string[] = parsed?.error?.message ?? [];
        const hasImageError = msgs.some((m: string) => String(m).toLowerCase().includes("image"));
        if (hasImageError) {
          try {
            const petName = String(forward.pet_name ?? "");
            const birth = String(forward.birth_date ?? "1970-01-01");
            const age = birth ? Math.max(0, new Date().getFullYear() - new Date(birth).getFullYear()) : 0;
            const species = Number(forward.id_animal) === 2 ? "cat" : "dog";

            const local = addPetLocal({
              name: petName,
              species: species as any,
              breed: "",
              age,
              ownerId: String(forward.ownerId ?? ""),
              ownerName: String(forward.ownerName ?? ""),
              ownerPhone: String(forward.ownerPhone ?? ""),
              vaccinesUpToDate: true,
              imageUrl: "",
            });

            return NextResponse.json({ data: local, _local: true }, { status: 201 });
          } catch (localErr) {
            console.error("/api/pets local fallback error:", localErr);
            // continue to return backend error below
          }
        }

        return NextResponse.json(
          {
            error: parsed?.error ?? parsed,
            backend: parsed,
            forwarded: forward,
            received: receivedBody,
          },
          { status: parsed?.statusCode ?? 400 }
        );
      } catch {
        // fallthrough
      }
    }

    return NextResponse.json(
      {
        error: raw,
        forwarded: forward,
        received: receivedBody,
      },
      { status: 400 }
    );
  }
}
