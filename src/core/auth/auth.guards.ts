import { redirect } from "next/navigation";
import { getAccessToken, getUserRole } from "./auth.cookies";

export async function requireAuth() {
  const token = await getAccessToken();
  if (!token) redirect("/login");
  return token;
}

export async function requireGuest() {
  const token = await getAccessToken();
  if (token) redirect("/dashboard");
}

export async function requireRole(role: "ADMIN" | "CLINIC" | "OWNER") {
  await requireAuth();
  const current = await getUserRole();
  if (current !== role) redirect("/dashboard"); // o "/"
}
