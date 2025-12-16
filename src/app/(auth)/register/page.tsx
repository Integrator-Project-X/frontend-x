import RegisterForm from "@/src/components/ui/organisms/RegisterForm";
import { requireGuest } from "@/src/core/auth/auth.guards";

export default async function RegisterPage() {
  await requireGuest();

  return (
    <section className="w-full max-w-xl rounded-xl bg-white p-6 shadow">
      <h1 className="mb-1 text-xl font-semibold">Create account</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Fill the form to create your VetConnect account
      </p>

      <RegisterForm />
    </section>
  );
}
