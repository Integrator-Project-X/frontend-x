"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // MOCK: no crea usuario todavía
    // En el futuro: POST /api/auth/register -> backend
    router.push("/login");
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input className="w-full rounded-xl border px-3 py-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="w-full rounded-xl border px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full rounded-xl border px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="w-full rounded-xl bg-green-600 py-2 font-medium text-white">Create account</button>
    </form>
  );
}
