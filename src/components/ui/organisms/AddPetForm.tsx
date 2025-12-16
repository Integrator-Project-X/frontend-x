"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  ownerId: string;
  ownerName: string;
  ownerPhone?: string;
};

export default function AddPetForm({ ownerId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;

    // ✅ SOLO CAMPOS QUE EL BACKEND ACEPTA
    const payload = {
      pet_name: (form.pet_name as HTMLInputElement).value,
      birth_date: (form.birth_date as HTMLInputElement).value,
      id_race: Number((form.id_race as HTMLInputElement).value),
      id_animal: Number((form.id_animal as HTMLInputElement).value),
    };

    console.log("🟢 FRONTEND payload:", payload);

    try {
      const res = await fetch("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("❌ ERROR:", err);
        alert("Error creating pet");
        return;
      }

      alert("✅ Mascota creada correctamente");
      router.push("/user");
    } catch (err) {
      console.error(err);
      alert("Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Pet name</label>
        <input
          name="pet_name"
          required
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Birth date</label>
        <input
          type="date"
          name="birth_date"
          required
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Race ID</label>
        <input
          type="number"
          name="id_race"
          min={1}
          required
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Animal ID</label>
        <input
          type="number"
          name="id_animal"
          min={1}
          required
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-green-600 py-2 text-white font-medium disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add Pet"}
      </button>
    </form>
  );
}
