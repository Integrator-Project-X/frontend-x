import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  CalendarClock,
  AlertTriangle,
  FileText,
  BarChart3,
  BookOpen,
} from "lucide-react";

export const adminNavigation = [
  {
    section: "Módulos core",
    items: [{ label: "Admin Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    section: "User Management",
    items: [
      { label: "Pet Owners", href: "/admin/users/pet-owners", icon: Users },
      { label: "Vets", href: "/admin/users/vets", icon: Users },
      { label: "Pets", href: "/admin/users/pets", icon: Users }
    ],
  },
  {
    section: "Clinics Management",
    items: [
      { label: "Clinics", href: "/admin/clinics/verification", icon: ShieldCheck },
    ],
  },
  {
    section: "Appointments Oversight",
    items: [
      { label: "General View", href: "/admin/appointments", icon: CalendarClock },
      { label: "Problematics case", href: "/admin/appointments/problematic", icon: AlertTriangle },
      { label: "Reports", href: "/admin/appointments/reports", icon: FileText },
    ],
  },
  {
    section: "Analytics",
    items: [{ label: "Platform Analytics", href: "/admin/analytics", icon: BarChart3 }],
  },
  {
    section: "Control",
    items: [{ label: "Content / Static Pages", href: "/admin/content", icon: BookOpen }],
  },
] as const;
