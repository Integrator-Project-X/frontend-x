import Link from "next/link";
import { Search } from "lucide-react";

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

import { getAppointmentTypes } from "@/src/core/control/appointment-types/appointment-types.service";
import AppointmentTypeRowActions from "@/src/components/ui/organisms/AppointmentTypeRowActions";
import AppointmentTypeCreateButton from "@/src/components/ui/organisms/AppointmentTypeCreateButton";

type SP = { q?: string; status?: "all" | "active" | "inactive" };

function safeStatus(v?: string): "all" | "active" | "inactive" {
  if (v === "active" || v === "inactive" || v === "all") return v;
  return "all";
}

function badge(isActive: boolean) {
  return isActive ? (
    <Badge variant="default">Active</Badge>
  ) : (
    <Badge variant="destructive">Inactive</Badge>
  );
}

function buildHref(q: string, status: "all" | "active" | "inactive") {
  const p = new URLSearchParams();
  if (q) p.set("q", q);
  p.set("status", status);
  return `/admin/control/appointment-types?${p.toString()}`;
}

export default async function AppointmentTypesPage({
  searchParams,
}: {
  searchParams?: SP | Promise<SP>;
}) {
  const sp = await Promise.resolve(searchParams ?? {});
  const qRaw = (sp.q ?? "").trim();
  const q = qRaw.toLowerCase();
  const status = safeStatus(sp.status);

  const rows = await getAppointmentTypes();

  let filtered = [...rows];
  if (status === "active") filtered = filtered.filter((r) => r.isActive);
  if (status === "inactive") filtered = filtered.filter((r) => !r.isActive);
  if (q) filtered = filtered.filter((r) => (r.name ?? "").toLowerCase().includes(q));

  return (
  <div className="space-y-10 rounded-2xl bg-slate-50/70 p-6">
    {/* HEADER */}
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-800">
          Appointment Types
        </h1>
        <p className="text-sm text-slate-600">
          Manage and control appointment categories used across the platform.
        </p>
      </div>

      <div className="flex gap-2">
        <AppointmentTypeCreateButton />
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/control">Back</Link>
        </Button>
      </div>
    </div>

    {/* FILTERS */}
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4 space-y-1">
        <h2 className="text-sm font-semibold text-slate-800">
          Filters
        </h2>
        <p className="text-xs text-slate-500">
          Search by name and filter by status.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <form
          className="relative w-full md:max-w-md"
          action="/admin/control/appointment-types"
          method="GET"
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="q"
            defaultValue={qRaw}
            className="pl-9"
            placeholder="Search appointment type..."
          />
          <input type="hidden" name="status" value={status} />
        </form>

        {/* BOTONES – MISMA LÓGICA */}
        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            size="sm"
            variant={status === "all" ? "secondary" : "outline"}
          >
            <Link href={buildHref(qRaw, "all")}>All</Link>
          </Button>

          <Button
            asChild
            size="sm"
            variant={status === "active" ? "secondary" : "outline"}
          >
            <Link href={buildHref(qRaw, "active")}>Active</Link>
          </Button>

          <Button
            asChild
            size="sm"
            variant={status === "inactive" ? "secondary" : "outline"}
          >
            <Link href={buildHref(qRaw, "inactive")}>Inactive</Link>
          </Button>
        </div>
      </div>
    </div>

    {/* TABLE */}
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            Appointment Types
          </h2>
          <p className="text-xs text-slate-500">
            {filtered.length} result(s)
          </p>
        </div>
      </div>

      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[90px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-sm text-slate-500">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => (
                <TableRow
                  key={r.id}
                  className="transition hover:bg-slate-50"
                >
                  <TableCell className="text-slate-500">
                    #{r.id}
                  </TableCell>
                  <TableCell className="font-medium text-slate-800">
                    {r.name}
                  </TableCell>
                  <TableCell>{badge(r.isActive)}</TableCell>
                  <TableCell className="text-right">
                    <AppointmentTypeRowActions row={r} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
);
}
