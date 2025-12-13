import Link from "next/link";
import { Search, ShieldCheck, Eye, Ban, CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/atoms/card";
import { Button } from "@/src/components/ui/atoms/button";
import { Input } from "@/src/components/ui/molecules/input";
import { Badge } from "@/src/components/ui/atoms/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/atoms/table";
import type { VetClinic, VetClinicStatus } from "@/src/types/users.types";
import { mockClinics } from "@/src/core/admin/users.service";


function statusBadge(status: VetClinicStatus) {
  if (status === "ACTIVE") return <Badge variant="default">Activo</Badge>;
  if (status === "SUSPENDED") return <Badge variant="destructive">Suspendido</Badge>;
  return <Badge variant="secondary">Pendiente</Badge>;
}

export default function VetsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Veterinarias</h1>
          <p className="text-muted-foreground">
            Gestiona clínicas registradas, verificación y estado (activo/suspendido).
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/clinics/verification">
            <ShieldCheck className="h-4 w-4" />
            Ver pendientes de verificación
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtros</CardTitle>
          <CardDescription>Busca por nombre, correo o ciudad (mock por ahora).</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Buscar clínica, email o ciudad..." />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm">Todas</Button>
            <Button variant="outline" size="sm">Activas</Button>
            <Button variant="outline" size="sm">Suspendidas</Button>
            <Button variant="outline" size="sm">Pendientes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Listado</CardTitle>
          <CardDescription>Vista general de clínicas veterinarias.</CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Clínica</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Verificada</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {mockClinics.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </div>
                  </TableCell>

                  <TableCell>{c.city}</TableCell>

                  <TableCell>{statusBadge(c.status)}</TableCell>

                  <TableCell>
                    {c.verified ? (
                      <span className="inline-flex items-center gap-1 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        Sí
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">No</span>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="inline-flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/users/vets/${c.id}`}>
                          <Eye className="h-4 w-4" />
                          Ver
                        </Link>
                      </Button>

                      {c.status === "SUSPENDED" ? (
                        <Button variant="secondary" size="sm">Activar</Button>
                      ) : (
                        <Button variant="destructive" size="sm">
                          <Ban className="h-4 w-4" />
                          Suspender
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <p className="mt-3 text-xs text-muted-foreground">
            Esto es mock. Luego conectamos a backend y estos filtros/acciones serán reales.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
