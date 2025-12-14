import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Search, Trash2, Plus, Pencil } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/atoms/card";
import { Button } from "@/src/components/ui/atoms/button";
import { Input } from "@/src/components/ui/molecules/input";
import { Badge } from "@/src/components/ui/atoms/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/atoms/table";

import {
  getAppointmentStatuses,
  softDeleteAppointmentStatus,
} from "@/src/core/control/appointment-status/appointment-status.service";

import AppointmentStatusClientActions from "@/src/components/ui/organisms/AppointmentStatusClienActions";

type SP = { q?: string; status?: "all" | "active" | "inactive" };

function safeStatus(v?: string): "all" | "active" | "inactive" {
  if (v === "active" || v === "inactive" || v === "all") return v;
  return "all";
}

function badge(isActive: boolean) {
  return isActive ? <Badge variant="default">Active</Badge> : <Badge variant="destructive">Inactive</Badge>;
}

function buildHref(q: string, status: "all" | "active" | "inactive") {
  const p = new URLSearchParams();
  if (q) p.set("q", q);
  p.set("status", status);
  return `/admin/control/appointment-status?${p.toString()}`;
}

// Helpers robustos por si tu service no mapea igual
function rowId(r: any) {
  return Number(r?.id ?? r?.id_appointment_status ?? 0);
}
function rowName(r: any) {
  return String(r?.name ?? r?.status_name ?? "").trim();
}
function rowActive(r: any) {
  return Boolean(r?.isActive ?? r?.is_active ?? false);
}

export default async function AppointmentStatusPage({ searchParams }: { searchParams?: SP | Promise<SP> }) {
  const sp = await Promise.resolve(searchParams ?? {});
  const qRaw = (sp.q ?? "").trim();
  const q = qRaw.toLowerCase();
  const status = safeStatus(sp.status);

  const rows = await getAppointmentStatuses();

  let filtered = [...rows];
  if (status === "active") filtered = filtered.filter((r: any) => rowActive(r));
  if (status === "inactive") filtered = filtered.filter((r: any) => !rowActive(r));
  if (q) filtered = filtered.filter((r: any) => rowName(r).toLowerCase().includes(q));

  async function softDeleteAction(fd: FormData) {
    "use server";
    const id = String(fd.get("id") ?? "");
    if (!id) return;
    await softDeleteAppointmentStatus(id);
    revalidatePath("/admin/control/appointment-status");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Appointment Status</h1>
          <p className="text-muted-foreground">Master table control.</p>
        </div>

        <div className="flex gap-2">
          {/* ✅ Create modal button */}
          <AppointmentStatusClientActions mode="create">
            <Button variant="outline">
              <Plus className="h-4 w-4" />
              New status
            </Button>
          </AppointmentStatusClientActions>

          <Button asChild variant="outline">
            <Link href="/admin/control">Back</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
          <CardDescription>Search by status name and filter by active/inactive.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <form className="relative w-full md:max-w-md" action="/admin/control/appointment-status" method="GET">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" defaultValue={qRaw} className="pl-9" placeholder="Search..." />
            <input type="hidden" name="status" value={status} />
          </form>

          <div className="flex gap-2">
            <Button asChild size="sm" variant={status === "all" ? "secondary" : "outline"}>
              <Link href={buildHref(qRaw, "all")}>All</Link>
            </Button>
            <Button asChild size="sm" variant={status === "active" ? "secondary" : "outline"}>
              <Link href={buildHref(qRaw, "active")}>Active</Link>
            </Button>
            <Button asChild size="sm" variant={status === "inactive" ? "secondary" : "outline"}>
              <Link href={buildHref(qRaw, "inactive")}>Inactive</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">List</CardTitle>
          <CardDescription>{filtered.length} result(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-sm text-muted-foreground">
                    No results.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((r: any) => {
                  const id = rowId(r);
                  const name = rowName(r);
                  const isActive = rowActive(r);

                  return (
                    <TableRow key={id}>
                      <TableCell className="text-muted-foreground">{id}</TableCell>
                      <TableCell className="font-medium">{name}</TableCell>
                      <TableCell>{badge(isActive)}</TableCell>

                      <TableCell className="text-right">
                        <div className="inline-flex gap-2">
                          {/* ✅ Edit modal button */}
                          <AppointmentStatusClientActions mode="edit" statusId={id}>
                            <Button size="sm" variant="outline">
                              <Pencil className="h-4 w-4" />
                              Edit
                            </Button>
                          </AppointmentStatusClientActions>

                          {/* ✅ Soft delete (server action) */}
                          {isActive ? (
                            <form action={softDeleteAction}>
                              <input type="hidden" name="id" value={id} />
                              <Button size="sm" variant="destructive" type="submit">
                                <Trash2 className="h-4 w-4" />
                                Soft delete
                              </Button>
                            </form>
                          ) : (
                            <Button size="sm" variant="outline" disabled>
                              Inactive
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          <p className="mt-3 text-xs text-muted-foreground">
            Backend: <span className="font-mono">GET /appointment-status</span> · action{" "}
            <span className="font-mono">PATCH /appointment-status/:id/soft-delete</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
