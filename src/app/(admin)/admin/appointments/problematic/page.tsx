import Link from "next/link";
import { Search, AlertTriangle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/atoms/card";
import { Button } from "@/src/components/ui/atoms/button";
import { Input } from "@/src/components/ui/molecules/input";

import { mockProblematicAppointments } from "@/src/core/admin/appointments.mock";
import ProblematicAppointmentsTable from "@/src/components/ui/organisms/ProblematicAppointmentsTable";

export default function ProblematicAppointmentsPage() {
  const total = mockProblematicAppointments.length;
  const resolved = mockProblematicAppointments.filter((a) => a.status === "COMPLETED").length;
  const pending = mockProblematicAppointments.filter((a) => a.status === "PENDING").length;
  const flagged = mockProblematicAppointments.filter((a) => a.flagged).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Problematic Appointments</h1>
          <p className="text-muted-foreground">
            Manage problematic appointments, flag them, and resolve them.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/appointments/reports">
            <AlertTriangle className="h-4 w-4" />
            View Reports
          </Link>
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total" value={`${total}`} />
        <MetricCard title="Resolved" value={`${resolved}`} />
        <MetricCard title="Pending" value={`${pending}`} />
        <MetricCard title="Flagged" value={`${flagged}`} />
      </div>

      {/* Filters (UI only, no state in server component) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
          <CardDescription>Search by clinic, user, city, or service (mock data).</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search clinic, email, city, or service..." />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm">All</Button>
            <Button variant="outline" size="sm">Resolved</Button>
            <Button variant="outline" size="sm">Pending</Button>
            <Button variant="outline" size="sm">Flagged</Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appointment List</CardTitle>
          <CardDescription>Manage appointments and resolve issues.</CardDescription>
        </CardHeader>

        <CardContent>
          <ProblematicAppointmentsTable rows={mockProblematicAppointments} />

          <p className="mt-3 text-xs text-muted-foreground">
            Mock data. Later we will connect to the backend and actions will be real.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
