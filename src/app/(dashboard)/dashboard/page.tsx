import { requireAuth } from "@/src/core/auth/auth.guards";
import LogoutButton from "@/src/components/ui/atoms/LogoutButton";

export default async function DashboardPage() {
  await requireAuth();

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>Estás logueado ✅</p>
      <LogoutButton />
    </main>
  );
}
