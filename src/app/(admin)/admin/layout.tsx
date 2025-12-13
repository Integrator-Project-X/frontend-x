import AdminSidebar from "@/src/components/ui/organisms/AdminSidebar";
import { requireRole } from "@/src/core/auth/auth.guards";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("ADMIN");

  return (
    <div className="min-h-screen flex">
      {/* Sidebar siempre visible */}
      <AdminSidebar />

      {/* Contenido */}
      <main className="flex-1 pl-[260px] p-6">
        {children}
      </main>
    </div>
  );
}
