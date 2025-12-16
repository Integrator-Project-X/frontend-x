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

import type { AdminRoleRow } from "@/src/types/masterdata.types";
import { getRoles, deactivateRole } from "@/src/core/masterdata/masterdata.service";

type SearchParams = {
  q?: string;
  status?: "all" | "active" | "inactive";
};

function safeStatus(v?: string): "all" | "active" | "inactive" {
  if (v === "all" || v === "active" || v === "inactive") return v;
  return "all";
}

function buildHref(q: string, status: "all" | "active" | "inactive") {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  params.set("status", status);
  return `/admin/master-data/roles?${params.toString()}`;
}

function statusBadge(isActive: boolean) {
  return isActive ? <Badge variant="default">Active</Badge> : <Badge variant="destructive">Inactive</Badge>;
}

type Props = { searchParams?: SearchParams | Promise<SearchParams> };

export default async function RolesPage({ searchParams }: Props) {
  const sp = await Promise.resolve(searchParams ?? {});
  const qRaw = (sp.q ?? "").trim();
  const q = qRaw.toLowerCase();
  const status = safeStatus(sp.status);

  const rows = await getRoles();

  let filtered: AdminRoleRow[] = [...rows];

  if (status === "active") filtered = filtered.filter((r) => r.isActive);
  if (status === "inactive") filtered = filtered.filter((r) => !r.isActive);

  if (q) filtered = filtered.filter((r) => r.roleName.toLowerCase().includes(q));

  async function deactivateAction(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await deactivateRole(id);
    revalidatePath("/admin/master-data/roles");
  }

  return (
  <div className="space-y-6">
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-800">Roles</h1>
        <p className="text-sm text-slate-600">Master table control.</p>
      </div>

      <Button asChild variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
        <Link href="/admin">Back to Admin</Link>
      </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle className="text-base text-slate-800">Filters</CardTitle>
        <CardDescription className="text-slate-500">
          Search by role name + filter by status.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <form
          className="relative w-full md:max-w-md"
          action="/admin/master-data/roles"
          method="GET"
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input name="q" defaultValue={qRaw} className="pl-9" placeholder="Search..." />
          <input type="hidden" name="status" value={status} />
        </form>

        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            size="sm"
            variant={status === "all" ? "secondary" : "outline"}
            className={status === "all" ? "bg-blue-100 text-blue-700" : "border-blue-200 text-blue-700 hover:bg-blue-50"}
          >
            <Link href={buildHref(qRaw, "all")}>All</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant={status === "active" ? "secondary" : "outline"}
            className={status === "active" ? "bg-green-100 text-green-700" : "border-green-200 text-green-700 hover:bg-green-50"}
          >
            <Link href={buildHref(qRaw, "active")}>Active</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant={status === "inactive" ? "secondary" : "outline"}
            className={status === "inactive" ? "bg-red-100 text-red-700" : "border-red-200 text-red-700 hover:bg-red-50"}
          >
            <Link href={buildHref(qRaw, "inactive")}>Inactive</Link>
          </Button>
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
              <TableHead className="text-slate-600">ID</TableHead>
              <TableHead className="text-slate-600">Role</TableHead>
              <TableHead className="text-slate-600">Status</TableHead>
              <TableHead className="text-slate-600 text-right">Actions</TableHead>
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
                <TableRow key={r.id} className="transition hover:bg-slate-50">
                  <TableCell className="text-slate-500">{r.id}</TableCell>
                  <TableCell className="font-medium text-slate-800">{r.roleName}</TableCell>
                  <TableCell>{statusBadge(r.isActive)}</TableCell>

                  <TableCell className="text-right">
                    {!r.isActive ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="border-slate-300 text-slate-400"
                      >
                        Inactive
                      </Button>
                    ) : (
                      <form action={deactivateAction}>
                        <input type="hidden" name="id" value={r.id} />
                        <Button
                          variant="destructive"
                          size="sm"
                          type="submit"
                          className="bg-red-100 text-red-700 hover:bg-red-200"
                        >
                          <Ban className="h-4 w-4" />
                          Deactivate
                        </Button>
                      </form>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <p className="mt-3 text-xs text-slate-400">
          Backend: <span className="font-mono">GET /roles</span> · action{" "}
          <span className="font-mono">PATCH /roles/:id</span> ·{" "}
          <span className="font-mono">PATCH /roles/:id/deactivate</span>
        </p>
      </CardContent>
    </Card>
  </div>
);
}
