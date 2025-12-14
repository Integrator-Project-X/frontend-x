import Link from "next/link";
import { Search, Eye, Flag, CheckCircle2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/atoms/card";
import { Button } from "@/src/components/ui/atoms/button";
import { Input } from "@/src/components/ui/molecules/input";
import { Badge } from "@/src/components/ui/atoms/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/atoms/table";

import { getAppointments } from "@/src/core/appointments/appointments.service";
import type { AdminAppointmentRow } from "@/src/types/appointments.types";

type Tab = "all" | "resolved" | "pending" | "flagged";

type SearchParams = {
  q?: string;
  tab?: Tab;
};

function safeTab(value?: string): Tab {
  if (value === "resolved" || value === "pending" || value === "flagged" || value === "all")
    return value;
  return "all";
}

function buildHref(q: string, tab: Tab) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  params.set("tab", tab);
  return `/admin/appointments/problematic?${params.toString()}`;
}

function formatDateTime(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/**
 * Ajusta estas reglas si tus statuses cambian:
 * - pending: pendiente / por confirmar
 * - resolved: confirmada / completada / finalizada / resuelta
 * - flagged: cancelada / rechazada / problematic / no show
 *
 * Extra: si isActive = false, la consideramos flagged también.
 */
function categorize(row: AdminAppointmentRow): "pending" | "resolved" | "flagged" | "other" {
  const s = (row.statusName ?? "").toLowerCase();

  if (row.isActive === false) return "flagged";

  if (s.includes("pend")) return "pending";
  if (s.includes("confirm") || s.includes("complet") || s.includes("final") || s.includes("resuel"))
    return "resolved";
  if (s.includes("problem") || s.includes("cancel") || s.includes("rechaz") || s.includes("no show"))
    return "flagged";

  return "other";
}

function pill(kind: ReturnType<typeof categorize>, label: string) {
  if (kind === "pending") return <Badge variant="secondary">{label}</Badge>;
  if (kind === "resolved") return <Badge variant="default">{label}</Badge>;
  if (kind === "flagged") return <Badge variant="destructive">{label}</Badge>;
  return <Badge variant="outline">{label}</Badge>;
}

type PageProps = {
  searchParams?: SearchParams | Promise<SearchParams>;
};

export default async function ProblematicAppointmentsPage({ searchParams }: PageProps) {
  const sp = await Promise.resolve(searchParams ?? {});
  const qRaw = (sp.q ?? "").trim();
  const q = qRaw.toLowerCase();
  const tab = safeTab(sp.tab);

  const rows = await getAppointments();

  // stats
  const stats = rows.reduce(
    (acc, r) => {
      const cat = categorize(r);
      acc.total += 1;
      if (cat === "resolved") acc.resolved += 1;
      if (cat === "pending") acc.pending += 1;
      if (cat === "flagged") acc.flagged += 1;
      return acc;
    },
    { total: 0, resolved: 0, pending: 0, flagged: 0 }
  );

  // filters
  let filtered: AdminAppointmentRow[] = [...rows];

  if (tab !== "all") {
    filtered = filtered.filter((r) => categorize(r) === tab);
  }

  if (q) {
    filtered = filtered.filter((r) => {
      const hay = [
        r.description,
        r.clinicName,
        r.ownerName,     // ✅ antes petOwnerName
        r.petName,
        r.typeName,      // ✅ antes serviceName
        r.statusName,
        r.animalName,
        r.raceName,
        r.vetName,
        r.vetJob,
      ]
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Problematic Appointments</h1>
          <p className="text-muted-foreground">
            Focus on appointments that might need manual review (pending, flagged, etc.).
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/appointments/reports">View Reports</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-3 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.total}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Resolved</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.resolved}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pending</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.pending}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Flagged</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.flagged}</CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
          <CardDescription>Search by clinic, owner, pet, type, status, animal, race, vet.</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <form className="relative w-full md:max-w-md" action="/admin/appointments/problematic" method="GET">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={qRaw}
              className="pl-9"
              placeholder="Search clinic, owner, pet, type, status..."
            />
            <input type="hidden" name="tab" value={tab} />
          </form>

          <div className="flex flex-wrap gap-2">
            <Button asChild variant={tab === "all" ? "secondary" : "outline"} size="sm">
              <Link href={buildHref(qRaw, "all")}>All</Link>
            </Button>
            <Button asChild variant={tab === "resolved" ? "secondary" : "outline"} size="sm">
              <Link href={buildHref(qRaw, "resolved")}>Resolved</Link>
            </Button>
            <Button asChild variant={tab === "pending" ? "secondary" : "outline"} size="sm">
              <Link href={buildHref(qRaw, "pending")}>Pending</Link>
            </Button>
            <Button asChild variant={tab === "flagged" ? "secondary" : "outline"} size="sm">
              <Link href={buildHref(qRaw, "flagged")}>Flagged</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appointment List</CardTitle>
          <CardDescription>{filtered.length} result(s)</CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Clinic</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Pet</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-sm text-muted-foreground">
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((r) => {
                  const cat = categorize(r);
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">#{r.id}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDateTime(r.createdAt)}</TableCell>
                      <TableCell className="text-muted-foreground">{r.clinicName}</TableCell>
                      <TableCell className="text-muted-foreground">{r.ownerName}</TableCell>

                      <TableCell className="text-muted-foreground">
                        <div className="space-y-0.5">
                          <p>{r.petName}</p>
                          <p className="text-xs text-muted-foreground">
                            {r.animalName} · {r.raceName}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="text-muted-foreground">{r.typeName}</TableCell>
                      <TableCell>{pill(cat, r.statusName || "—")}</TableCell>

                      <TableCell className="text-right">
                        <div className="inline-flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/appointments/${r.id}`}>
                              <Eye className="h-4 w-4" />
                              View
                            </Link>
                          </Button>

                          {/* Estas acciones las conectamos cuando tengas endpoint para update status/flag */}
                          <Button variant="outline" size="sm" disabled>
                            <CheckCircle2 className="h-4 w-4" />
                            Resolve
                          </Button>
                          <Button variant="outline" size="sm" disabled>
                            <Flag className="h-4 w-4" />
                            Flag
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          <p className="mt-3 text-xs text-muted-foreground">
            Backend: <span className="font-mono">GET /appointments</span> (needs clinic + user + pet + type + status).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
