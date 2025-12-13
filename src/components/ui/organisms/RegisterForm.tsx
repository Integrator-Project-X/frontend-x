"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";

type RegisterPayload = {
  full_name: string;
  age: number;
  address: string;
  phone_number: string;
  identification_number: string;
  id_gender: number;
  email: string;
  password: string;
};

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterPayload>({
    full_name: "",
    age: 18,
    address: "",
    phone_number: "",
    identification_number: "",
    id_gender: 1,
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return (
      form.full_name.trim().length >= 2 &&
      Number.isFinite(form.age) &&
      form.age > 0 &&
      form.address.trim().length >= 3 &&
      form.phone_number.trim().length >= 7 &&
      form.identification_number.trim().length >= 5 &&
      Number.isFinite(form.id_gender) &&
      form.id_gender > 0 &&
      form.email.includes("@") &&
      form.password.length >= 6
    );
  }, [form]);

  const onChange =
    <K extends keyof RegisterPayload>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;

      setForm((prev) => {
        if (key === "age" || key === "id_gender") {
          return { ...prev, [key]: Number(value) as RegisterPayload[K] };
        }
        return { ...prev, [key]: value as RegisterPayload[K] };
      });
    };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        let message = "Register failed";
        try {
          const data = await res.json();
          message = data?.message ?? data?.error ?? message;
        } catch {}
        throw new Error(message);
      }

      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* Full name */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Full name</label>
        <input
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Jane Doe"
          value={form.full_name}
          onChange={onChange("full_name")}
          required
        />
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="you@email.com"
          value={form.email}
          onChange={onChange("email")}
          required
        />
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="••••••••"
          value={form.password}
          onChange={onChange("password")}
          minLength={6}
          required
        />
        <p className="text-xs text-gray-500">Min 6 characters</p>
      </div>

      {/* Age + Gender */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Age</label>
          <input
            type="number"
            className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={form.age}
            onChange={onChange("age")}
            min={1}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Gender (id_gender)</label>
          {/* Por ahora es input/selector simple.
              Luego lo conectamos a GET /genders/active */}
          <select
            className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            value={form.id_gender}
            onChange={onChange("id_gender")}
            required
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
          <p className="text-xs text-gray-500">
            Later we’ll load these options from <span className="font-mono">/genders/active</span>
          </p>
        </div>
      </div>

      {/* Phone */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Phone number</label>
        <input
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="3001234567"
          value={form.phone_number}
          onChange={onChange("phone_number")}
          required
        />
      </div>

      {/* Identification */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Identification number</label>
        <input
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="CC / ID"
          value={form.identification_number}
          onChange={onChange("identification_number")}
          required
        />
      </div>

      {/* Address */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Address</label>
        <input
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Street 123, City"
          value={form.address}
          onChange={onChange("address")}
          required
        />
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Submit */}
      <button
        disabled={loading || !canSubmit}
        className="w-full rounded-xl bg-green-600 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-60"
      >
        {loading ? "Creating..." : "Create account"}
      </button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-green-600 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
