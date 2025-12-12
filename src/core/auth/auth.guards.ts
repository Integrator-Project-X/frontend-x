import { redirect } from "next/navigation";
import { getAccessToken } from "./auth.cookies";

/** Protege páginas privadas: si no hay token → /login */
export async function requireAuth() {
  const token = await getAccessToken();
  if (!token) redirect("/login");
  return token;
}

/** Protege páginas públicas de auth: si hay token → /dashboard */
export async function requireGuest() {
  const token = await getAccessToken();
  if (token) redirect("/dashboard");
}
