import { redirect } from "next/navigation";
import { requireAuth } from "@/src/core/auth/auth.guards";
import { getUserRole } from "@/src/core/auth/auth.cookies";
import VetSidebar from "@/src/components/ui/organisms/VetSidebar";

export default async function VetLayout({ children }: { children: React.ReactNode }) {
    await requireAuth();
    const role = await getUserRole();

    if (role !== "VET") redirect("/dashboard");

    return (
        <div className="min-h-screen bg-slate-50">
            <VetSidebar />
            <main className="p-4 md:ml-[260px] md:p-6">{children}</main>
        </div>
    );
}
