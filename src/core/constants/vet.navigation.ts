import { LayoutDashboard, CalendarDays } from "lucide-react";

export const VET_NAV_ITEMS = [
    { label: "Dashboard", href: "/vet", icon: LayoutDashboard },
    { label: "Appointments", href: "/vet/appointments", icon: CalendarDays },
] as const;
