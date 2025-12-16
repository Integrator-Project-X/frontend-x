"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import type { RegisterPayload } from "@/src/types/auth.types";
import type { GenderBackend, GenderOption } from "@/src/types/genders.types";

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterPayload>({
    full_name: "",
    age: 18,
    address: "",
    phone_number: "",
    identification_number: "",
    id_gender: 0, // se setea cuando carguen genders
    email: "",
    password: "",
  });

  const [genders, setGenders] = useState<GenderOption[]>([]);
  const [gendersLoading, setGendersLoading] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load genders list from backend and normalize: id_gender -> id
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setGendersLoading(true);

        const res = await fetch("/api/genders/active", { cache: "no-store" });
        const data = await res.json();

        // soporta: [...] o { data: [...] }
        const raw: GenderBackend[] = Array.isArray(data) ? data : data?.data ?? [];

        // normaliza al shape que usa el select
        const normalized: GenderOption[] = raw.map((g) => ({
          id: g.id_gender,
          name: g.name,
        }));

        // remove duplicated ids (prevents React key warning)
        const unique = Array.from(new Map(normalized.map((g) => [g.id, g])).values());

        if (!mounted) return;

        setGenders(unique);

        // set default id_gender if needed
        setForm((prev) => {
          if (unique.length && !unique.some((g) => g.id === prev.id_gender)) {
            return { ...prev, id_gender: unique[0].id };
          }
          return prev;
        });
      } catch {
        if (mounted) setGenders([]);
      } finally {
        if (mounted) setGendersLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

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
    <form onSubmit={submit} className="space-y-6">
      {/* Account */}
      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Account</h2>
          <p className="text-xs text-gray-500">Credentials to access VetConnect.</p>
        </div>

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

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
        </div>
      </div>

      <div className="h-px w-full bg-gray-100" />

      {/* Personal info */}
      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Personal info</h2>
          <p className="text-xs text-gray-500">Basic information for your profile.</p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
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

          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Gender</label>

            <select
              className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              value={form.id_gender}
              onChange={onChange("id_gender")}
              disabled={gendersLoading || genders.length === 0}
              required
            >
              {gendersLoading && <option value={0}>Loading...</option>}

              {!gendersLoading && genders.length === 0 && (
                <option value={0}>No genders available</option>
              )}

              {!gendersLoading &&
                genders.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
            </select>

            <p className="text-xs text-gray-500">
              Stored as <span className="font-mono">id_gender</span> (backend expects the ID).
            </p>
          </div>
        </div>

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
      </div>

      <div className="h-px w-full bg-gray-100" />

      {/* Contact */}
      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Contact</h2>
          <p className="text-xs text-gray-500">How we can reach you.</p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
        </div>
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
