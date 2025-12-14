import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Search, Trash2 } from "lucide-react";

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

import type { AdminMedicalRecordRow } from "@/src/types/masterdata.types";
import { getMedicalRecords, deleteMedicalRecord } from "@/src/core/masterdata/masterdata.service";

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
  return `/admin/master-data/medical-records?${params.toString()}`;
}

function statusBadge(isActive: boolean) {
  return isActive ? <Badge variant="default">Active</Badge> : <Badge variant="destructive">Inactive</Badge>;
}

type Props = { searchParams?: SearchParams | Promise<SearchParams> };

export default async function MedicalRecordsPage({ searchParams }: Props) {
  const sp = await Promise.resolve(searchParams ?? {});
  const qRaw = (sp.q ?? "").trim();
  const q = qRaw.toLowerCase();
  const status = safeStatus(sp.status);

  const rows = await getMedicalRecords();

  let filtered: AdminMedicalRecordRow[] = [...rows];

  if (status === "active") filtered = filtered.filter((r) => r.isActive);
  if (status === "inactive") filtered = filtered.filter((r) => !r.isActive);

  // search por id (y por si luego agregas más campos)
  if (q) filtered = filtered.filter((r) => String(r.id).includes(q));

  async function deleteAction(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await deleteMedicalRecord(id);
    revalidatePath("/admin/master-data/medical-records");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Medical Records</h1>
          <p className="text-muted-foreground">Master-like control (minimal fields from backend).</p>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin">Back to Admin</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
          <CardDescription>Search by ID + filter by status.</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <form className="relative w-full md:max-w-md" action="/admin/master-data/medical-records" method="GET">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" defaultValue={qRaw} className="pl-9" placeholder="Search ID..." />
            <input type="hidden" name="status" value={status} />
          </form>

          <div className="flex flex-wrap gap-2">
            <Button asChild variant={status === "all" ? "secondary" : "outline"} size="sm">
              <Link href={buildHref(qRaw, "all")}>All</Link>
            </Button>
            <Button asChild variant={status === "active" ? "secondary" : "outline"} size="sm">
              <Link href={buildHref(qRaw, "active")}>Active</Link>
            </Button>
            <Button asChild variant={status === "inactive" ? "secondary" : "outline"} size="sm">
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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-sm text-muted-foreground">
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.id}</TableCell>
                    <TableCell>{statusBadge(r.isActive)}</TableCell>

                    <TableCell className="text-right">
                      <form action={deleteAction}>
                        <input type="hidden" name="id" value={r.id} />
                        <Button variant="destructive" size="sm" type="submit">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <p className="mt-3 text-xs text-muted-foreground">
            Backend: <span className="font-mono">GET /medical-records</span> · action{" "}
            <span className="font-mono">DELETE /medical-records/:id</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
