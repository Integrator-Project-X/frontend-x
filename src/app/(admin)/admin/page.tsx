import Link from "next/link";
import { getAdminStats } from "@/src/core/admin/admin.stats";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview and shortcuts for platform management.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border p-6">
          <p className="text-sm text-muted-foreground">Active users</p>
          <p className="text-2xl font-semibold">{stats.activeUsers}</p>
        </div>

        <div className="rounded-xl border p-6">
          <p className="text-sm text-muted-foreground">Clinics registered</p>
          <p className="text-2xl font-semibold">{stats.clinicsRegistered}</p>
        </div>

        <div className="rounded-xl border p-6">
          <p className="text-sm text-muted-foreground">Total appointments</p>
          <p className="text-2xl font-semibold">{stats.totalAppointments}</p>
        </div>

        <div className="rounded-xl border p-6">
          <p className="text-sm text-muted-foreground">System alerts</p>
          <p className="text-2xl font-semibold">{stats.systemAlerts}</p>
        </div>
      </div>

      <div className="rounded-xl border p-6 space-y-2">
        <h2 className="font-semibold">Quick links</h2>
        <p className="text-sm text-muted-foreground">
          Go directly to the most common admin areas.
        </p>

        <div className="flex flex-col gap-2">
          <Link className="underline" href="/admin/users/pet-owners">User Management · Pet Owners</Link>
          <Link className="underline" href="/admin/clinics">User Management · Clinics</Link>
          <Link className="underline" href="/admin/clinics/verification">Clinic Verification</Link>
          <Link className="underline" href="/admin/appointments">Appointments Overview</Link>
          <Link className="underline" href="/admin/appointments/problematic">Problematic Cases</Link>
          <Link className="underline" href="/admin/appointments/reports">Reports</Link>
          <Link className="underline" href="/admin/analytics">Analytics</Link>
        </div>
      </div>
    </div>
  );
}
