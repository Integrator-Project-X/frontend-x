"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { VET_NAV_ITEMS } from "@/src/core/constants/vet.navigation";
import LogoutButton from "@/src/components/ui/atoms/LogoutButton";

export default function VetSidebar() {
    const pathname = usePathname();

    return (
        <>
            <aside className="fixed left-0 top-0 hidden h-screen w-[260px] border-r border-slate-200 bg-white md:block">
                <div className="flex h-full flex-col p-4">
                    <div className="mb-4">
                        <p className="text-lg font-semibold text-slate-800">Vet Panel</p>
                        <p className="text-sm text-slate-500">Clinic dashboard</p>
                    </div>

                    <nav className="flex-1 space-y-1">
                        {VET_NAV_ITEMS.map((item) => {
                            const active =
                                pathname === item.href || (item.href !== "/vet" && pathname.startsWith(item.href));
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                                        active
                                            ? "bg-slate-900 text-white"
                                            : "text-slate-700 hover:bg-slate-100"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="pt-3">
                        <LogoutButton />
                    </div>
                </div>
            </aside>

            <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur md:hidden">
                <div className="flex items-center justify-between px-4 py-3">
                    <p className="font-semibold text-slate-800">Vet Panel</p>
                    <LogoutButton />
                </div>

                <div className="flex gap-2 px-4 pb-3">
                    {VET_NAV_ITEMS.map((item) => {
                        const active =
                            pathname === item.href || (item.href !== "/vet" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "rounded-xl px-3 py-2 text-sm",
                                    active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
