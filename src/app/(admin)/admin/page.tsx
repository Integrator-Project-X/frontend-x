import Link from "next/link";
import { getAdminStats } from "@/src/core/admin/admin.stats";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div className="w-full space-y-8 rounded-2xl bg-slate-50/80 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Admin Dashboard
        </h1>
        <p className="text-slate-600">
          Overview and shortcuts for platform management.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-green-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Active users</p>
          <p className="text-3xl font-semibold text-green-600">
            {stats.activeUsers}
          </p>
        </div>

        <div className="rounded-xl border border-blue-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Clinics registered</p>
          <p className="text-3xl font-semibold text-blue-600">
            {stats.clinicsRegistered}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Total appointments</p>
          <p className="text-3xl font-semibold text-slate-800">
            {stats.totalAppointments}
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">System alerts</p>
          <p className="text-3xl font-semibold text-red-600">
            {stats.systemAlerts}
          </p>
        </div>
      </div>

      {/* Quick links */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Quick links
          </h2>
          <p className="text-sm text-slate-500">
            Go directly to the most common admin areas.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/admin/users/pet-owners"
            className="rounded-lg border border-blue-200 bg-blue-100/70 px-4 py-2 text-blue-700 font-medium transition hover:bg-blue-200"
          >
            Pet Owners
          </Link>

          <Link
            href="/admin/clinics"
            className="rounded-lg border border-blue-200 bg-blue-100/70 px-4 py-2 text-blue-700 font-medium transition hover:bg-blue-200"
          >
            Clinics
          </Link>

          <Link
            href="/admin/clinics/verification"
            className="rounded-lg border border-blue-200 bg-blue-100/70 px-4 py-2 text-blue-700 font-medium transition hover:bg-blue-200"
          >
            Clinic Verification
          </Link>

          <Link
            href="/admin/appointments"
            className="rounded-lg border border-green-200 bg-green-100/70 px-4 py-2 text-green-700 font-medium transition hover:bg-green-200"
          >
            Appointments
          </Link>

          <Link
            href="/admin/appointments/problematic"
            className="rounded-lg border border-red-200 bg-red-100/70 px-4 py-2 text-red-700 font-medium transition hover:bg-red-200"
          >
            Problematic Cases
          </Link>

          <Link
            href="/admin/appointments/reports"
            className="rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-slate-700 font-medium transition hover:bg-slate-200"
          >
            Reports
          </Link>

          <Link
            href="/admin/analytics"
            className="rounded-lg border border-green-200 bg-green-100/70 px-4 py-2 text-green-700 font-medium transition hover:bg-green-200"
          >
            Analytics
          </Link>
        </div>
      </div>
    </div>
  );
}
