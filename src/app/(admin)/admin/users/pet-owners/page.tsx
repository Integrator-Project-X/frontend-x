import Link from "next/link";
import { Search, Eye, Ban } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/atoms/card";
import { Button } from "@/src/components/ui/atoms/button";
import { Input } from "@/src/components/ui/molecules/input";
import { Badge } from "@/src/components/ui/atoms/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/atoms/table";

import type { PetOwner, PetOwnerStatus } from "@/src/types/users.types";
import { mockPetOwners } from "@/src/core/admin/users.mock";

function statusBadge(status: PetOwnerStatus) {
    if (status === "ACTIVE") return <Badge variant="default">Activo</Badge>;
    return <Badge variant="destructive">Suspendido</Badge>;
}

export default function PetOwnersPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold">Pet Owners</h1>
                    <p className="text-muted-foreground">
                        Gestiona usuarios, estado (activo/suspendido) y actividad reciente.
                    </p>
                </div>

                <Button asChild variant="outline">
                    <Link href="/admin/users/vets">Ir a Veterinarias</Link>
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
                        <Input className="pl-9" placeholder="Buscar usuario, email o ciudad..." />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button variant="secondary" size="sm">Todos</Button>
                        <Button variant="outline" size="sm">Activos</Button>
                        <Button variant="outline" size="sm">Suspendidos</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Listado</CardTitle>
                    <CardDescription>Vista general de usuarios tipo Pet Owner.</CardDescription>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Usuario</TableHead>
                                <TableHead>Ciudad</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead># Mascotas</TableHead>
                                <TableHead>Última actividad</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {mockPetOwners.map((u: PetOwner) => (
                                <TableRow key={u.id}>
                                    <TableCell>
                                        <div className="space-y-0.5">
                                            <p className="font-medium">{u.fullName}</p>
                                            <p className="text-xs text-muted-foreground">{u.email}</p>
                                        </div>
                                    </TableCell>

                                    <TableCell>{u.city}</TableCell>

                                    <TableCell>{statusBadge(u.status)}</TableCell>

                                    <TableCell>{u.petsCount}</TableCell>

                                    <TableCell className="text-muted-foreground">{u.lastActiveAt}</TableCell>

                                    <TableCell className="text-right">
                                        <div className="inline-flex gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/users/pet-owners/${u.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                    Ver
                                                </Link>
                                            </Button>

                                            {u.status === "SUSPENDED" ? (
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
                        Mock data. Luego conectamos a backend y los filtros/acciones serán reales.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
