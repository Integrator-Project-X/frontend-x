import Link from "next/link";
import { FileText, AlertTriangle, ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/atoms/card";
import { Button } from "@/src/components/ui/atoms/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/atoms/table";
import { Badge } from "@/src/components/ui/atoms/badge";

import { mockAppointments } from "@/src/core/admin/appointments.mock";

type Row = { label: string; value: number };

function groupCountBy<T extends string>(items: string[]): Row[] {
  const map = new Map<string, number>();
  for (const it of items) map.set(it, (map.get(it) ?? 0) + 1);
  return Array.from(map.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export default function AppointmentReportsPage() {
  // KPIs (mock derived)
  const total = mockAppointments.length;
  const confirmed = mockAppointments.filter((a) => a.status === "CONFIRMED").length;
  const canceled = mockAppointments.filter((a) => a.status === "CANCELED").length;
  const problematic = mockAppointments.filter((a) => a.status === "PROBLEMATIC" || a.flagged).length;

  // Report slices
  const byCity = groupCountBy(mockAppointments.map((a) => a.city));
  const byStatus = groupCountBy(mockAppointments.map((a) => a.status));
  const byService = groupCountBy(mockAppointments.map((a) => a.service));

  // Peak hours (simple mock: take HH from "YYYY-MM-DD HH:mm")
  const hours = mockAppointments
    .map((a) => a.scheduledAt.split(" ")[1]?.split(":")[0])
    .filter(Boolean) as string[];
  const byHour = groupCountBy(hours.map((h) => `${h}:00`));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Appointment Reports</h1>
          <p className="text-muted-foreground">
            High-level insights for product decisions (MVP mock reports).
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/appointments">
              <FileText className="h-4 w-4" />
              Back to Overview
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/admin/appointments/problematic">
              <AlertTriangle className="h-4 w-4" />
              Problematic Cases
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Appointments" value={`${total}`} helper="Mock data" />
        <KpiCard label="Confirmed" value={`${confirmed}`} />
        <KpiCard label="Canceled" value={`${canceled}`} />
        <KpiCard label="Problematic / Flagged" value={`${problematic}`} />
      </div>

      {/* Report Blocks */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ReportTable
          title="Appointments by City"
          description="Where the platform is being used the most."
          rows={byCity}
        />

        <ReportTable
          title="Appointments by Status"
          description="Operational view of the current state."
          rows={byStatus}
          badgeMode="status"
        />

        <ReportTable
          title="Most Requested Services"
          description="What users ask for the most."
          rows={byService}
        />

        <ReportTable
          title="Peak Hours"
          description="When demand happens (based on scheduled time)."
          rows={byHour}
        />
      </div>

      {/* Footer note */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Next step</CardTitle>
          <CardDescription>
            Later, we will replace this mock with real backend data and charts (Recharts).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Suggested: add city filters + date range (last 7d / 30d).
          </p>

          <Link className="inline-flex items-center gap-2 text-sm underline" href="/admin/analytics">
            Platform Analytics <ArrowRight className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
      {helper ? (
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground">{helper}</p>
        </CardContent>
      ) : null}
    </Card>
  );
}

function ReportTable({
  title,
  description,
  rows,
  badgeMode,
}: {
  title: string;
  description: string;
  rows: Row[];
  badgeMode?: "status";
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead className="text-right">Count</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.slice(0, 8).map((r) => (
              <TableRow key={r.label}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {badgeMode === "status" ? <StatusBadge status={r.label} /> : null}
                    <span className="font-medium">{r.label}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{r.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {rows.length > 8 ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Showing top 8. Connect backend for full breakdown.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = status.toUpperCase();
  if (s === "CONFIRMED") return <Badge variant="default">Confirmed</Badge>;
  if (s === "PENDING") return <Badge variant="secondary">Pending</Badge>;
  if (s === "CANCELED") return <Badge variant="destructive">Canceled</Badge>;
  if (s === "COMPLETED") return <Badge variant="outline">Completed</Badge>;
  return <Badge variant="destructive">Problematic</Badge>;
}
