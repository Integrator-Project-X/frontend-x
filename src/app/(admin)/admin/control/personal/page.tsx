import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Search, Ban, Plus, Pencil } from "lucide-react";

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

import { getPersonal, deactivatePersonal } from "@/src/core/personal/personal.services";
import type { AdminPersonalRow } from "@/src/core/personal/personal.services";

import PersonalClientActions from "@/src/components/ui/organisms/PersonalClientActions";

type SP = {
  q?: string;
  status?: "all" | "active" | "inactive";
  job?: string;
};

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

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}

function buildHref(q: string, status: "all" | "active" | "inactive", job: string) {
  const p = new URLSearchParams();
  if (q) p.set("q", q);
  p.set("status", status);
  if (job && job !== "all") p.set("job", job);
  return `/admin/control/personal?${p.toString()}`;
}

export default async function PersonalPage({
  searchParams,
}: {
  searchParams?: SP | Promise<SP>;
}) {
  const sp = await Promise.resolve(searchParams ?? {});
  const qRaw = (sp.q ?? "").trim();
  const q = qRaw.toLowerCase();
  const status = safeStatus(sp.status);
  const job = (sp.job ?? "all").trim() || "all";

  const rows = await getPersonal();

  const jobOptions = Array.from(
    new Set(rows.map((r) => (r.jobPositionName ?? "").trim()).filter(Boolean))
  );

  let filtered: AdminPersonalRow[] = [...rows];

  if (status === "active") filtered = filtered.filter((r) => r.isActive);
  if (status === "inactive") filtered = filtered.filter((r) => !r.isActive);

  if (job !== "all") {
    filtered = filtered.filter(
      (r) => (r.jobPositionName ?? "").toLowerCase() === job.toLowerCase()
    );
  }

  if (q) {
    filtered = filtered.filter((r) => {
      const hay = [
        r.fullName,
        r.phone,
        r.identification,
        r.jobPositionName,
        r.userId ? String(r.userId) : "",
        String(r.id),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }

  async function deactivateAction(fd: FormData) {
    "use server";
    const id = String(fd.get("id") ?? "");
    if (!id) return;
    await deactivatePersonal(id); // PATCH /personal/:id/deactivate
    revalidatePath("/admin/control/personal");
  }

  return (
  <div className="space-y-6">
    <div className="flex items-end justify-between gap-3">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-800">Personal</h1>
        <p className="text-sm text-slate-600">
          Manage staff linked to users + job positions.
        </p>
      </div>

      <div className="flex gap-2">
        <PersonalClientActions mode="create">
          <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
            <Plus className="h-4 w-4" />
            New staff
          </Button>
        </PersonalClientActions>

        <Button asChild variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
          <Link href="/admin">Back</Link>
        </Button>
      </div>
    </div>

    <Card>
      <CardHeader>
        <CardTitle className="text-base text-slate-800">Filters</CardTitle>
        <CardDescription className="text-slate-500">
          Search by name, phone, ID, job position.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <form
          className="relative w-full md:max-w-md"
          action="/admin/control/personal"
          method="GET"
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input name="q" defaultValue={qRaw} className="pl-9" placeholder="Search..." />
          <input type="hidden" name="status" value={status} />
          <input type="hidden" name="job" value={job} />
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            asChild
            size="sm"
            variant={status === "all" ? "secondary" : "outline"}
            className={status === "all" ? "bg-blue-100 text-blue-700" : "border-blue-200 text-blue-700 hover:bg-blue-50"}
          >
            <Link href={buildHref(qRaw, "all", job)}>All</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant={status === "active" ? "secondary" : "outline"}
            className={status === "active" ? "bg-green-100 text-green-700" : "border-green-200 text-green-700 hover:bg-green-50"}
          >
            <Link href={buildHref(qRaw, "active", job)}>Active</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant={status === "inactive" ? "secondary" : "outline"}
            className={status === "inactive" ? "bg-red-100 text-red-700" : "border-red-200 text-red-700 hover:bg-red-50"}
          >
            <Link href={buildHref(qRaw, "inactive", job)}>Inactive</Link>
          </Button>

          <form
            action="/admin/control/personal"
            method="GET"
            className="ml-2 flex items-center gap-2"
          >
            <input type="hidden" name="q" value={qRaw} />
            <input type="hidden" name="status" value={status} />

            <select
              name="job"
              defaultValue={job}
              className="h-9 rounded-md border bg-white px-3 text-sm"
            >
              <option value="all">All job positions</option>
              {jobOptions.map((j) => (
                <option key={j} value={j}>
                  {j}
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

    <Card>
      <CardHeader>
        <CardTitle className="text-base text-slate-800">List</CardTitle>
        <CardDescription className="text-slate-500">{filtered.length} result(s)</CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-slate-600">Personal</TableHead>
              <TableHead className="text-slate-600">User</TableHead>
              <TableHead className="text-slate-600">Job Position</TableHead>
              <TableHead className="text-slate-600">Created</TableHead>
              <TableHead className="text-slate-600">Status</TableHead>
              <TableHead className="text-slate-600 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-sm text-slate-500">
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => (
                <TableRow key={r.id} className="transition hover:bg-slate-50">
                  <TableCell className="text-slate-500">
                    <div className="space-y-0.5">
                      <p className="font-medium">#{r.id}</p>
                      <p className="text-xs text-slate-500">UserID: {r.userId ?? "—"}</p>
                    </div>
                  </TableCell>

                  <TableCell className="text-slate-500">
                    <div className="space-y-0.5">
                      <p className="font-medium text-slate-800">{r.fullName}</p>
                      <p className="text-xs text-slate-500">
                        {r.phone} · {r.identification}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className="text-slate-500">{r.jobPositionName}</TableCell>
                  <TableCell className="text-slate-500">{formatDate(r.createdAt)}</TableCell>
                  <TableCell>{badge(r.isActive)}</TableCell>

                  <TableCell className="text-right">
                    <div className="inline-flex gap-2">
                      <PersonalClientActions mode="edit" personalId={r.id}>
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                      </PersonalClientActions>

                      {r.isActive ? (
                        <form action={deactivateAction}>
                          <input type="hidden" name="id" value={r.id} />
                          <Button
                            size="sm"
                            variant="destructive"
                            type="submit"
                            className="bg-red-100 text-red-700 hover:bg-red-200"
                          >
                            <Ban className="h-4 w-4" />
                            Deactivate
                          </Button>
                        </form>
                      ) : (
                        <Button size="sm" variant="outline" disabled className="border-slate-300 text-slate-400">
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

        <p className="mt-3 text-xs text-slate-400">
          Backend: <span className="font-mono">GET /personal</span> · action{" "}
          <span className="font-mono">PATCH /personal/:id/deactivate</span>
        </p>
      </CardContent>
    </Card>
  </div>
);
}
