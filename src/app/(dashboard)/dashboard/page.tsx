import { redirect } from "next/navigation";
import { requireAuth } from "@/src/core/auth/auth.guards";
import { getUserRole } from "@/src/core/auth/auth.cookies";

export default async function DashboardPage() {
  await requireAuth();
  const role = await getUserRole();

  if (role === "ADMIN") redirect("/admin");
  if (role === "CLINIC") redirect("/clinic"); // futuro
  if (role === "OWNER") redirect("/owner");   // futuro

  redirect("/login");
}
