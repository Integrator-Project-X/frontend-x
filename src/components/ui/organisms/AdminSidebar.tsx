"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavigation } from "@/src/core/constants/navigation";
import { cn } from "@/src/lib/utils";
import LogoutButton from "@/src/components/ui/atoms/LogoutButton";

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-[260px] border-r bg-background">
            {/* Header / Brand */}
            <div className="flex h-16 items-center gap-2 px-5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground font-semibold">
                    VC
                </div>
                <div className="leading-tight">
                    <p className="text-sm font-semibold">VetConnect</p>
                    <p className="text-xs text-muted-foreground">Admin Platform</p>
                </div>
            </div>

            <div className="px-3">
                <div className="h-px bg-border" />
            </div>

            {/* Nav (con espacio para el footer) */}
            <nav className="px-3 py-4 space-y-6 pb-28">
                {adminNavigation.map((group) => (
                    <div key={group.section} className="space-y-2">
                        <p className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {group.section}
                        </p>

                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const active =
                                    pathname === item.href || pathname.startsWith(item.href + "/");
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
                                            active
                                                ? "bg-muted text-foreground"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 w-full p-3">
                <div className="rounded-2xl border bg-card p-3 space-y-3">
                    <div>
                        <p className="text-sm font-medium">Admin</p>
                        <p className="text-xs text-muted-foreground">
                            Control, growth & quality
                        </p>
                    </div>

                    <LogoutButton />
                </div>
            </div>
        </aside>
    );
}
