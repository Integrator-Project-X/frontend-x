import Link from "next/link";
import { Search, AlertTriangle, FileText, Eye } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/atoms/card";
import { Button } from "@/src/components/ui/atoms/button";
import { Input } from "@/src/components/ui/molecules/input";
import { Badge } from "@/src/components/ui/atoms/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/atoms/table";

import type { Appointment, AppointmentStatus } from "@/src/types/appointments.types";
import { mockAppointments } from "@/src/core/admin/appointments.mock";

function statusBadge(status: AppointmentStatus) {
  if (status === "CONFIRMED") return <Badge variant="default">Confirmada</Badge>;
  if (status === "PENDING") return <Badge variant="secondary">Pendiente</Badge>;
  if (status === "CANCELED") return <Badge variant="destructive">Cancelada</Badge>;
  if (status === "COMPLETED") return <Badge variant="outline">Completada</Badge>;
  return <Badge variant="destructive">Problemática</Badge>;
}

export default function AppointmentsOverviewPage() {
  const total = mockAppointments.length;
  const problematic = mockAppointments.filter((a) => a.status === "PROBLEMATIC" || a.flagged).length;
  const pending = mockAppointments.filter((a) => a.status === "PENDING").length;
  const canceled = mockAppointments.filter((a) => a.status === "CANCELED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Appointments Oversight</h1>
          <p className="text-muted-foreground">
            Vista general de citas, casos problemáticos y reportes.
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/appointments/problematic">
              <AlertTriangle className="h-4 w-4" />
              Casos problemáticos
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/appointments/reports">
              <FileText className="h-4 w-4" />
              Reportes
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total" value={`${total}`} />
        <MetricCard title="Pendings" value={`${pending}`} />
        <MetricCard title="Canceled" value={`${canceled}`} />
        <MetricCard title="Problematics" value={`${problematic}`} />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Search</CardTitle>
          <CardDescription>Busca por clínica, usuario, ciudad o servicio (mock por ahora).</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Buscar (clínica, usuario, ciudad, servicio)..." />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm">All</Button>
            <Button variant="outline" size="sm">Pendings</Button>
            <Button variant="outline" size="sm">Confirmed</Button>
            <Button variant="outline" size="sm">Canceled</Button>
            <Button variant="outline" size="sm">Completed</Button>
            <Button variant="outline" size="sm">Problematics</Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">List of appointments</CardTitle>
          <CardDescription>Main information and status.</CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Clinic</TableHead>
                <TableHead>Pet Owner</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {mockAppointments.map((a: Appointment) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.id}</TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-sm">{a.scheduledAt}</p>
                      <p className="text-xs text-muted-foreground">Created: {a.createdAt}</p>
                    </div>
                  </TableCell>
                  <TableCell>{a.city}</TableCell>
                  <TableCell>{a.clinicName}</TableCell>
                  <TableCell>{a.petOwnerName}</TableCell>
                  <TableCell>{a.service}</TableCell>
                  <TableCell>
                    <div className="inline-flex items-center gap-2">
                      {statusBadge(a.status)}
                      {(a.status === "PROBLEMATIC" || a.flagged) && (
                        <Badge variant="destructive">Flag</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/appointments/${a.id}`}>
                        <Eye className="h-4 w-4" />
                        Ver
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <p className="mt-3 text-xs text-muted-foreground">
            Mock data. Luego conectamos a backend y filtros/acciones serán reales.
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
