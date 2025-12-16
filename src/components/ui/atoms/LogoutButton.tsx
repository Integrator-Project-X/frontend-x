"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={logout}
      className="w-full rounded-xl border px-3 py-2 text-sm hover:bg-muted"
    >
      Logout
    </button>
  );
}
