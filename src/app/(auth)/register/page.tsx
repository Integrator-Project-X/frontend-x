import RegisterForm from "@/src/components/ui/organisms/RegisterForm";
import { requireGuest } from "@/src/core/auth/auth.guards";

export default async function RegisterPage() {
  await requireGuest();

  return (
    <section className="w-full max-w-sm rounded-xl bg-white p-6 shadow">
      <h1 className="mb-4 text-xl font-semibold">Register</h1>
      <RegisterForm />
      <p className="mt-3 text-xs text-gray-500">
        Mock por ahora. Luego conectamos a backend/BDD.
      </p>
    </section>
  );
}
