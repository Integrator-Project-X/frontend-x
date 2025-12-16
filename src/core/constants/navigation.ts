import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarClock,
  AlertTriangle,
  FileText,
  BarChart3,
  Database,
} from "lucide-react";

export const adminNavigation = [
  {
    section: "Core",
    items: [{ label: "Admin Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    section: "User Management",
    items: [
      { label: "Pet Owners", href: "/admin/users/pet-owners", icon: Users },
      { label: "Vets", href: "/admin/users/vets", icon: Users },
      { label: "Pets", href: "/admin/users/pets", icon: Users },
    ],
  },
  {
    section: "Clinics",
    items: [{ label: "Clinics", href: "/admin/clinics", icon: Building2 }],
  },
  {
    section: "Appointments Oversight",
    items: [
      { label: "Overview", href: "/admin/appointments", icon: CalendarClock },
      { label: "Reports", href: "/admin/appointments/reports", icon: FileText },
    ],
  },
  {
    section: "Control Overview",
    items: [
      { label: "Appointment Types", href: "/admin/control/appointment-types", icon: Database },
      { label: "Appointment Status", href: "/admin/control/appointment-status", icon: Database },
      { label: "Diagnosis", href: "/admin/control/diagnosis", icon: Database },
      { label: "Job Positions", href: "/admin/control/jobpositions", icon: Database },
      { label: "Personal", href: "/admin/control/personal", icon: Database },
      { label: "Genders", href: "/admin/master-data/genders", icon: Database },
      { label: "Animals", href: "/admin/master-data/animals", icon: Database },
      { label: "Races", href: "/admin/master-data/races", icon: Database },
      { label: "Roles", href: "/admin/master-data/roles", icon: Database },
      { label: "Clinic Schedules", href: "/admin/master-data/clinic-schedules", icon: Database },
      { label: "Medical Records", href: "/admin/master-data/medical-records", icon: Database },
    ],
  },
  {
    section: "Analytics",
    items: [{ label: "Platform Analytics", href: "/admin/analytics", icon: BarChart3 }],
  },
] as const;
