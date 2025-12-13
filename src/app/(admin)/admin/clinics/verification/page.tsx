import Link from "next/link";
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  ToggleLeft,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/atoms/card";
import { Button } from "@/src/components/ui/atoms/button";
import { Input } from "@/src/components/ui/molecules/input";
import { Badge } from "@/src/components/ui/atoms/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/atoms/table";

import type { VerificationClinic, VerificationStatus } from "@/src/types/clinics.types";
import { mockVerificationClinics } from "@/src/core/admin/clinics.mock";

function statusBadge(status: VerificationStatus) {
  if (status === "APPROVED") return <Badge variant="default">Aprobada</Badge>;
  if (status === "REJECTED") return <Badge variant="destructive">Rechazada</Badge>;
  return <Badge variant="secondary">Pendiente</Badge>;
}

function yesNoBadge(value: boolean) {
  return value ? (
    <span className="inline-flex items-center gap-1 text-sm">
      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
      Sí
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
      <XCircle className="h-4 w-4 text-muted-foreground" />
      No
    </span>
  );
}

export default function ClinicVerificationPage() {
  // métricas rápidas (mock)
  const total = mockVerificationClinics.length;
  const pending = mockVerificationClinics.filter((c) => c.status === "PENDING").length;
  const approved = mockVerificationClinics.filter((c) => c.status === "APPROVED").length;
  const rejected = mockVerificationClinics.filter((c) => c.status === "REJECTED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Clinic Verification</h1>
          <p className="text-muted-foreground">
            Aprobar clínicas, validar información y activar visibilidad pública.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/users/vets">
            <ShieldCheck className="h-4 w-4" />
            Ir a Veterinarias
          </Link>
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total" value={`${total}`} />
        <MetricCard title="Pendientes" value={`${pending}`} />
        <MetricCard title="Aprobadas" value={`${approved}`} />
        <MetricCard title="Rechazadas" value={`${rejected}`} />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtros</CardTitle>
          <CardDescription>Busca por clínica, correo o ciudad (mock por ahora).</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Buscar clínica, email o ciudad..." />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm">Todas</Button>
            <Button variant="outline" size="sm">Pendientes</Button>
            <Button variant="outline" size="sm">Aprobadas</Button>
            <Button variant="outline" size="sm">Rechazadas</Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Solicitudes</CardTitle>
          <CardDescription>Revisa la información y toma acción.</CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Clínica</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>Enviada</TableHead>
                <TableHead>Docs</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Visibilidad</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {mockVerificationClinics.map((c: VerificationClinic) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-medium">{c.clinicName}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </div>
                  </TableCell>

                  <TableCell>{c.city}</TableCell>
                  <TableCell className="text-muted-foreground">{c.submittedAt}</TableCell>
                  <TableCell>{yesNoBadge(c.docsProvided)}</TableCell>
                  <TableCell>{yesNoBadge(c.locationProvided)}</TableCell>
                  <TableCell>{statusBadge(c.status)}</TableCell>

                  <TableCell>
                    {c.visibilityEnabled ? (
                      <Badge variant="default">Visible</Badge>
                    ) : (
                      <Badge variant="outline">Oculta</Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="inline-flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/clinics/verification/${c.id}`}>
                          <Eye className="h-4 w-4" />
                          Ver
                        </Link>
                      </Button>

                      {c.status === "PENDING" && (
                        <>
                          <Button size="sm">Aprobar</Button>
                          <Button variant="destructive" size="sm">Rechazar</Button>
                        </>
                      )}

                      {c.status === "APPROVED" && (
                        <Button variant="secondary" size="sm">
                          <ToggleLeft className="h-4 w-4" />
                          Toggle visibilidad
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <p className="mt-3 text-xs text-muted-foreground">
            Mock data. Luego conectamos a backend y estas acciones serán reales.
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
