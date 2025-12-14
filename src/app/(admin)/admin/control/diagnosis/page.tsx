import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Search, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/atoms/card";
import { Button } from "@/src/components/ui/atoms/button";
import { Input } from "@/src/components/ui/molecules/input";
import { Badge } from "@/src/components/ui/atoms/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/atoms/table";

import { getDiagnosis, deleteDiagnosis } from "@/src/core/control/diagnosis/diagnosis.service";

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

export default async function DiagnosisPage({ searchParams }: { searchParams?: SP | Promise<SP> }) {
  const sp = await Promise.resolve(searchParams ?? {});
  const qRaw = (sp.q ?? "").trim();
  const q = qRaw.toLowerCase();
  const status = safeStatus(sp.status);

  const rows = await getDiagnosis();

  let filtered = [...rows];
  if (status === "active") filtered = filtered.filter((r) => r.isActive);
  if (status === "inactive") filtered = filtered.filter((r) => !r.isActive);

  if (q) {
    filtered = filtered.filter((r) => {
      const hay = [r.description, r.vetName, r.vetJob].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }

  async function deleteAction(fd: FormData) {
    "use server";
    const id = String(fd.get("id") ?? "");
    if (!id) return;
    await deleteDiagnosis(id);
    revalidatePath("/admin/control/diagnosis");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Diagnosis</h1>
          <p className="text-muted-foreground">Master table control.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin">Back</Link>
        </Button>
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
                filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-muted-foreground">{r.id}</TableCell>
                    <TableCell className="font-medium">{r.description}</TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="space-y-0.5">
                        <p>{r.vetName}</p>
                        <p className="text-xs text-muted-foreground">{r.vetJob}</p>
                      </div>
                    </TableCell>
                    <TableCell>{badge(r.isActive)}</TableCell>
                    <TableCell className="text-right">
                      <form action={deleteAction}>
                        <input type="hidden" name="id" value={r.id} />
                        <Button size="sm" variant="destructive" type="submit">
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
            Backend: <span className="font-mono">GET /diagnosis</span> · action{" "}
            <span className="font-mono">DELETE /diagnosis/:id</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
