import Link from "next/link";
import Image from "next/image";
import { revalidatePath } from "next/cache";
import { Search, Eye, Ban } from "lucide-react";

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

import type { AdminClinicRow } from "@/src/types/clinics.types";
import { getClinics, deactivateClinic } from "@/src/core/clinics/clinics.service";

type ClinicsSearchParams = {
  q?: string;
  status?: "all" | "active" | "inactive";
};

function safeStatus(value?: string): "all" | "active" | "inactive" {
  if (value === "active" || value === "inactive" || value === "all") return value;
  return "all";
}

function buildHref(q: string, status: "all" | "active" | "inactive") {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  params.set("status", status);
  return `/admin/users/clinics?${params.toString()}`;
}

function statusBadge(isActive: boolean) {
  return isActive ? (
    <Badge variant="default">Active</Badge>
  ) : (
    <Badge variant="destructive">Inactive</Badge>
  );
}

function safeImageSrc(src?: string | null) {
  const s = (src ?? "").trim();
  if (!s) return "/placeholder-clinic.png"; // crea este archivo en /public
  return s;
}

type PageProps = {
  searchParams?: ClinicsSearchParams | Promise<ClinicsSearchParams>;
};

export default async function ClinicsPage({ searchParams }: PageProps) {
  const sp = await Promise.resolve(searchParams ?? {});
  const qRaw = (sp.q ?? "").trim();
  const q = qRaw.toLowerCase();
  const status = safeStatus(sp.status);

  const clinics = await getClinics();

  let filtered: AdminClinicRow[] = [...clinics];

  if (status === "active") filtered = filtered.filter((c) => c.isActive);
  if (status === "inactive") filtered = filtered.filter((c) => !c.isActive);

  if (q) {
    filtered = filtered.filter((c) => {
      const name = (c.name ?? "").toLowerCase();
      const addr = (c.address ?? "").toLowerCase();
      const phone = (c.phoneNumber ?? "").toLowerCase();
      const nit = (c.identificationNumber ?? "").toLowerCase();
      return (
        name.includes(q) ||
        addr.includes(q) ||
        phone.includes(q) ||
        nit.includes(q)
      );
    });
  }

  async function deactivateAction(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "");
    if (!id) return;

    await deactivateClinic(id);
    revalidatePath("/admin/users/clinics");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Clinics</h1>
          <p className="text-muted-foreground">
            Manage clinics, status (active/inactive), and basic info.
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/users/pets">Go to Pets</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/users/vets">Go to Vets</Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
          <CardDescription>
            Search by clinic name, address, phone, or identification number.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <form className="relative w-full md:max-w-md" action="/admin/users/clinics" method="GET">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={qRaw}
              className="pl-9"
              placeholder="Search clinic, address, phone, ID..."
            />
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
                <TableHead>Clinic</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Identification</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-sm text-muted-foreground">
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 overflow-hidden rounded-lg border bg-white">
                          <Image
                            src={safeImageSrc(c.imageUrl)}
                            alt={c.name || "Clinic"}
                            width={36}
                            height={36}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                        </div>

                        <div className="space-y-0.5">
                          <p className="font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">ID: {c.id}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground">{c.address}</TableCell>
                    <TableCell className="text-muted-foreground">{c.phoneNumber}</TableCell>
                    <TableCell className="text-muted-foreground">{c.identificationNumber}</TableCell>
                    <TableCell>{statusBadge(c.isActive)}</TableCell>

                    <TableCell className="text-right">
                      <div className="inline-flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/users/clinics/${c.id}`}>
                            <Eye className="h-4 w-4" />
                            View
                          </Link>
                        </Button>

                        {c.isActive ? (
                          <form action={deactivateAction}>
                            <input type="hidden" name="id" value={c.id} />
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
            Backend: <span className="font-mono">GET /clinics</span>. Action:{" "}
            <span className="font-mono">PATCH /clinics/:id/deactivate</span>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
