import AdminSidebar from "@/src/components/ui/organisms/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-green-50/60">
      <AdminSidebar />

      {/* OJO: usa margin-left, no padding-left */}
      <main className="min-h-screen ml-[260px] p-6">
        {children}
      </main>
    </div>
  );
}
