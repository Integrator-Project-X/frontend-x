import LoginForm from "@/src/components/ui/organisms/LoginForm";
import { requireGuest } from "@/src/core/auth/auth.guards";

export default async function LoginPage() {
  await requireGuest();

  return (
    <section className="w-full max-w-sm rounded-xl bg-white p-6 shadow">
      <h1 className="mb-4 text-xl font-semibold">Login</h1>
      <LoginForm />
    </section>
  );
}
