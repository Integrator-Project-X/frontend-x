import { redirect } from "next/navigation";
import { requireAuth } from "@/src/core/auth/auth.guards";
import { getUserRole } from "@/src/core/auth/auth.cookies";

export default async function DashboardPage() {
  await requireAuth();
  const role = await getUserRole();

  if (role === "ADMIN") redirect("/admin");
  if (role === "VET") redirect("/vet"); // futuro
  if (role === "CLIENT") redirect("/owner");   // futuro

  redirect("/login");
}
