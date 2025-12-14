import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Search, Ban } from "lucide-react";

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

import type { AdminAppointmentRow } from "@/src/types/appointments.types";
import {
  getAppointments,
  deactivateAppointment,
} from "@/src/core/appointments/appointments.service";

// ✅ NUEVO: botón que abre modal
import AppointmentViewButton from "@/src/components/ui/organisms/AppointmentViewButton";

type AppointmentsSearchParams = {
  q?: string;
  state?: "all" | "active" | "inactive"; // isActive
  animal?: string; // "Perro", "Gato", etc.
  type?: string; // "Urgencias", etc.
};

function safeState(value?: string): "all" | "active" | "inactive" {
  if (value === "active" || value === "inactive" || value === "all") return value;
  return "all";
}

function buildHref(
  q: string,
  state: "all" | "active" | "inactive",
  animal: string,
  type: string
) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  params.set("state", state);
  if (animal && animal !== "all") params.set("animal", animal);
  if (type && type !== "all") params.set("type", type);

  const qs = params.toString();
  return qs ? `/admin/appointments?${qs}` : "/admin/appointments";
}

function stateBadge(isActive: boolean) {
  return isActive ? (
    <Badge variant="default">Active</Badge>
  ) : (
    <Badge variant="destructive">Inactive</Badge>
  );
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

type PageProps = {
  searchParams?: AppointmentsSearchParams | Promise<AppointmentsSearchParams>;
};

export default async function AppointmentsPage({ searchParams }: PageProps) {
  const sp = await Promise.resolve(searchParams ?? {});
  const qRaw = (sp.q ?? "").trim();
  const q = qRaw.toLowerCase();

  const state = safeState(sp.state);
  const animal = (sp.animal ?? "all").trim() || "all";
  const type = (sp.type ?? "all").trim() || "all";

  const appointments = await getAppointments();

  const animalOptions = Array.from(
    new Set(appointments.map((a) => (a.animalName ?? "").trim()).filter(Boolean))
  );

  const typeOptions = Array.from(
    new Set(appointments.map((a) => (a.typeName ?? "").trim()).filter(Boolean))
  );

  let filtered: AdminAppointmentRow[] = [...appointments];

  if (state === "active") filtered = filtered.filter((a) => !!a.isActive);
  if (state === "inactive") filtered = filtered.filter((a) => !a.isActive);

  if (animal !== "all") {
    filtered = filtered.filter(
      (a) => (a.animalName ?? "").toLowerCase() === animal.toLowerCase()
    );
  }

  if (type !== "all") {
    filtered = filtered.filter(
      (a) => (a.typeName ?? "").toLowerCase() === type.toLowerCase()
    );
  }

  if (q) {
    filtered = filtered.filter((a) => {
      const hay = [
        a.description,
        a.petName,
        a.animalName,
        a.raceName,
        a.ownerName,
        a.vetName,
        a.vetJob,
        a.typeName,
        a.statusName,
        a.clinicName,
      ]
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });
  }

  const total = filtered.length;
  const activeCount = filtered.filter((a) => !!a.isActive).length;
  const inactiveCount = total - activeCount;

  async function deactivateAction(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await deactivateAppointment(id);
    revalidatePath("/admin/appointments");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Appointments Overview</h1>
          <p className="text-muted-foreground">
            All appointments in the platform, with quick filters and actions.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin">Back to Dashboard</Link>
        </Button>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-semibold">{total}</p>
        </div>
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-semibold">{activeCount}</p>
        </div>
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Inactive</p>
          <p className="text-2xl font-semibold">{inactiveCount}</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
          <CardDescription>
            Search by clinic, pet, owner, vet, type, animal, race, or status.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <form
            className="relative w-full md:max-w-md"
            action="/admin/appointments"
            method="GET"
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" defaultValue={qRaw} className="pl-9" placeholder="Search..." />
            <input type="hidden" name="state" value={state} />
            <input type="hidden" name="animal" value={animal} />
            <input type="hidden" name="type" value={type} />
          </form>

          <div className="flex flex-wrap gap-2 items-center">
            <Button asChild variant={state === "all" ? "secondary" : "outline"} size="sm">
              <Link href={buildHref(qRaw, "all", animal, type)}>All</Link>
            </Button>
            <Button asChild variant={state === "active" ? "secondary" : "outline"} size="sm">
              <Link href={buildHref(qRaw, "active", animal, type)}>Active</Link>
            </Button>
            <Button asChild variant={state === "inactive" ? "secondary" : "outline"} size="sm">
              <Link href={buildHref(qRaw, "inactive", animal, type)}>Inactive</Link>
            </Button>

            {/* animal filter */}
            <form action="/admin/appointments" method="GET" className="ml-2 flex items-center gap-2">
              <input type="hidden" name="q" value={qRaw} />
              <input type="hidden" name="state" value={state} />
              <input type="hidden" name="type" value={type} />

              <select
                name="animal"
                defaultValue={animal}
                className="h-9 rounded-md border bg-white px-3 text-sm"
              >
                <option value="all">All animals</option>
                {animalOptions.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>

              <Button type="submit" variant="outline" size="sm">
                Apply
              </Button>
            </form>

            {/* type filter */}
            <form action="/admin/appointments" method="GET" className="flex items-center gap-2">
              <input type="hidden" name="q" value={qRaw} />
              <input type="hidden" name="state" value={state} />
              <input type="hidden" name="animal" value={animal} />

              <select
                name="type"
                defaultValue={type}
                className="h-9 rounded-md border bg-white px-3 text-sm"
              >
                <option value="all">All types</option>
                {typeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <Button type="submit" variant="outline" size="sm">
                Apply
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">List</CardTitle>
          <CardDescription>{filtered.length} result(s)</CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Appointment</TableHead>
                <TableHead>Clinic</TableHead>
                <TableHead>Pet</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Vet</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Appointment Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-sm text-muted-foreground">
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-medium">#{a.id}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {a.description}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground">{a.clinicName}</TableCell>

                    <TableCell className="text-muted-foreground">
                      <div className="space-y-0.5">
                        <p>{a.petName}</p>
                        <p className="text-xs text-muted-foreground">
                          {a.animalName} · {a.raceName}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {a.ownerName}
                      {a.ownerId ? (
                        <span className="text-xs text-muted-foreground"> · #{a.ownerId}</span>
                      ) : null}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      <div className="space-y-0.5">
                        <p>{a.vetName}</p>
                        <p className="text-xs text-muted-foreground">{a.vetJob}</p>
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground">{a.typeName}</TableCell>
                    <TableCell className="text-muted-foreground">{a.statusName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateTime(a.createdAt)}
                    </TableCell>
                    <TableCell>{stateBadge(!!a.isActive)}</TableCell>

                    <TableCell className="text-right">
                      <div className="inline-flex gap-2">
                        {/* ✅ View abre modal (no redirección) */}
                        <AppointmentViewButton
                          appointmentId={a.id}
                          summary={{ isActive: a.isActive }}
                        />

                        {a.isActive ? (
                          <form action={deactivateAction}>
                            <input type="hidden" name="id" value={a.id} />
                            <Button variant="destructive" size="sm" type="submit">
                              <Ban className="h-4 w-4" />
                              Deactivate
                            </Button>
                          </form>
                        ) : (
                          <Button variant="outline" size="sm" disabled>
                            Inactive
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <p className="mt-3 text-xs text-muted-foreground">
            Backend: <span className="font-mono">GET /appointments</span> · action{" "}
            <span className="font-mono">PATCH /appointments/:id/deactivate</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
