export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen grid place-items-center bg-green-50/60 p-6">
      {children}
    </main>
  );
}
