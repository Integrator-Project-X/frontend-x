"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { adminNavigation } from "@/src/core/constants/navigation";
import { cn } from "@/src/lib/utils";
import LogoutButton from "@/src/components/ui/atoms/LogoutButton";

export default function AdminSidebar() {
  const pathname = usePathname();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "User Management": true,
    Clinics: true,
    "Appointments Oversight": true,
    "Control Overview": true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[260px] border-r border-slate-200 bg-white/80 backdrop-blur flex flex-col">
      {/* Header */}
      <div className="flex h-16 items-center gap-3 px-5 shrink-0">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white font-bold shadow-sm">
          VC
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-slate-800">VetConnect</p>
          <p className="text-xs text-slate-500">Admin Platform</p>
        </div>
      </div>

      <div className="px-4 shrink-0">
        <div className="h-px bg-slate-200" />
      </div>

      {/* NAV (SCROLL NATIVO) */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6 pb-15">
        {adminNavigation.map((group) => {
          const isCore = group.section === "Core";
          const isOpen = openSections[group.section];

          return (
            <div key={group.section} className="space-y-2">
              {/* Section header */}
              {!isCore && (
                <button
                  type="button"
                  onClick={() => toggleSection(group.section)}
                  className="flex w-full items-center justify-between px-2 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-700"
                >
                  <span>{group.section}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
              )}

              {/* Items */}
              <div
                className={cn(
                  "space-y-1",
                  !isCore && !isOpen && "hidden"
                )}
              >
                {group.items.map((item) => {
                  const isDashboard = item.href === "/admin";

                  const active = isDashboard
                    ? pathname === "/admin"
                    : pathname === item.href ||
                      pathname.startsWith(item.href + "/");

                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-blue-100 text-blue-700"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          active ? "text-blue-600" : "text-slate-400"
                        )}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="shrink-0 p-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-slate-800">Admin</p>
            <p className="text-xs text-slate-500">
              Control, growth & quality
            </p>
          </div>

          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
