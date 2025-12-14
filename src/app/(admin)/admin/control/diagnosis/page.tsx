import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Search, Trash2, Plus, Pencil } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/atoms/card";
import { Button } from "@/src/components/ui/atoms/button";
import { Input } from "@/src/components/ui/molecules/input";
import { Badge } from "@/src/components/ui/atoms/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/atoms/table";

import { getDiagnosis, deleteDiagnosis } from "@/src/core/control/diagnosis/diagnosis.service";
import DiagnosisClientActions from "@/src/components/ui/organisms/DiagnosisClientActions";

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
  return `/admin/control/diagnosis?${p.toString()}`;
}

// getters robustos (por si te llega id_diagnosis/personal/user/jobPosition)
function rowId(r: any) {
  return Number(r?.id ?? r?.id_diagnosis ?? 0);
}
function rowDesc(r: any) {
  return String(r?.description ?? r?.diagnosisName ?? "").trim();
}
function rowActive(r: any) {
  return Boolean(r?.isActive ?? r?.is_active ?? false);
}
function rowVetName(r: any) {
  return String(r?.vetName ?? r?.personal?.user?.full_name ?? "—");
}
function rowVetJob(r: any) {
  return String(r?.vetJob ?? r?.personal?.jobPosition?.job_position_name ?? "—");
}

export default async function DiagnosisPage({ searchParams }: { searchParams?: SP | Promise<SP> }) {
  const sp = await Promise.resolve(searchParams ?? {});
  const qRaw = (sp.q ?? "").trim();
  const q = qRaw.toLowerCase();
  const status = safeStatus(sp.status);

  const rows = await getDiagnosis();

  let filtered = [...rows];
  if (status === "active") filtered = filtered.filter((r: any) => rowActive(r));
  if (status === "inactive") filtered = filtered.filter((r: any) => !rowActive(r));

  if (q) {
    filtered = filtered.filter((r: any) => {
      const hay = [rowDesc(r), rowVetName(r), rowVetJob(r)].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }

  async function deleteAction(fd: FormData) {
    "use server";
    const id = String(fd.get("id") ?? "");
    if (!id) return;
    await deleteDiagnosis(id); // DELETE /diagnosis/:id (soft-delete)
    revalidatePath("/admin/control/diagnosis");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Diagnosis</h1>
          <p className="text-muted-foreground">Master table control.</p>
        </div>

        <div className="flex gap-2">
          <DiagnosisClientActions mode="create">
            <Button variant="outline">
              <Plus className="h-4 w-4" />
              New diagnosis
            </Button>
          </DiagnosisClientActions>

          <Button asChild variant="outline">
            <Link href="/admin/control">Back</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
          <CardDescription>Search by description or vet.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <form className="relative w-full md:max-w-md" action="/admin/control/diagnosis" method="GET">
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
                <TableHead>Description</TableHead>
                <TableHead>Vet</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-sm text-muted-foreground">
                    No results.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((r: any) => {
                  const id = rowId(r);
                  const desc = rowDesc(r);
                  const vetName = rowVetName(r);
                  const vetJob = rowVetJob(r);
                  const isActive = rowActive(r);

                  return (
                    <TableRow key={id}>
                      <TableCell className="text-muted-foreground">{id}</TableCell>
                      <TableCell className="font-medium">{desc}</TableCell>

                      <TableCell className="text-muted-foreground">
                        <div className="space-y-0.5">
                          <p>{vetName}</p>
                          <p className="text-xs text-muted-foreground">{vetJob}</p>
                        </div>
                      </TableCell>

                      <TableCell>{badge(isActive)}</TableCell>

                      <TableCell className="text-right">
                        <div className="inline-flex gap-2">
                          <DiagnosisClientActions mode="edit" diagnosisId={id}>
                            <Button size="sm" variant="outline">
                              <Pencil className="h-4 w-4" />
                              Edit
                            </Button>
                          </DiagnosisClientActions>

                          <form action={deleteAction}>
                            <input type="hidden" name="id" value={id} />
                            <Button size="sm" variant="destructive" type="submit">
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          <p className="mt-3 text-xs text-muted-foreground">
            Backend: <span className="font-mono">GET /diagnosis</span> · action{" "}
            <span className="font-mono">DELETE /diagnosis/:id</span> (soft-delete)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

