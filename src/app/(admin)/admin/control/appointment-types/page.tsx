import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Search, Ban } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/atoms/card";
import { Button } from "@/src/components/ui/atoms/button";
import { Input } from "@/src/components/ui/molecules/input";
import { Badge } from "@/src/components/ui/atoms/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/atoms/table";

import { getAppointmentTypes, deactivateAppointmentType } from "@/src/core/control/appointment-types/appointment-types.service";

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
  return `/admin/control/appointment-types?${p.toString()}`;
}

export default async function AppointmentTypesPage({ searchParams }: { searchParams?: SP | Promise<SP> }) {
  const sp = await Promise.resolve(searchParams ?? {});
  const qRaw = (sp.q ?? "").trim();
  const q = qRaw.toLowerCase();
  const status = safeStatus(sp.status);

  const rows = await getAppointmentTypes();

  let filtered = [...rows];
  if (status === "active") filtered = filtered.filter((r) => r.isActive);
  if (status === "inactive") filtered = filtered.filter((r) => !r.isActive);
  if (q) filtered = filtered.filter((r) => (r.name ?? "").toLowerCase().includes(q));

  async function deactivateAction(fd: FormData) {
    "use server";
    const id = String(fd.get("id") ?? "");
    if (!id) return;
    await deactivateAppointmentType(id);
    revalidatePath("/admin/control/appointment-types");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Appointment Types</h1>
          <p className="text-muted-foreground">Master table control.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/control">Back</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
          <CardDescription>Search by name and filter by status.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <form className="relative w-full md:max-w-md" action="/admin/control/appointment-types" method="GET">
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
                filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-muted-foreground">{r.id}</TableCell>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{badge(r.isActive)}</TableCell>
                    <TableCell className="text-right">
                      {r.isActive ? (
                        <form action={deactivateAction}>
                          <input type="hidden" name="id" value={r.id} />
                          <Button size="sm" variant="destructive" type="submit">
                            <Ban className="h-4 w-4" />
                            Deactivate
                          </Button>
                        </form>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          Inactive
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <p className="mt-3 text-xs text-muted-foreground">
            Backend: <span className="font-mono">GET /appointments-types</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
