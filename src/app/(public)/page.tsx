import Link from "next/link";

export default function Home() {
  return (
    <main className="p-6 space-y-3">
      <h1 className="text-2xl font-semibold">VetConnect</h1>

      <div className="flex gap-3">
        <Link className="underline" href="/login">Login</Link>
        <Link className="underline" href="/register">Register</Link>
        <Link className="underline" href="/dashboard">Dashboard</Link>
      </div>
    </main>
  );
}
