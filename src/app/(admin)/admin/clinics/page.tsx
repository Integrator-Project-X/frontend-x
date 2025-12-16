import Link from "next/link";
import Image from "next/image";
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

import type { AdminClinicRow } from "@/src/types/clinics.types";
import { getClinics, deactivateClinic } from "@/src/core/clinics/clinics.service";

import ClinicViewButton from "@/src/components/ui/organisms/ClinicViewButton";

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
  const qs = params.toString();
  return qs ? `/admin/users/clinics?${qs}` : "/admin/users/clinics";
}

function statusBadge(isActive: boolean) {
  return isActive ? <Badge>Active</Badge> : <Badge variant="destructive">Inactive</Badge>;
}

function hasValidHttpUrl(url?: string | null) {
  const s = (url ?? "").trim();
  return s.startsWith("http://") || s.startsWith("https://");
}

function initialLetter(name?: string | null) {
  const s = (name ?? "").trim();
  return (s[0] ?? "C").toUpperCase();
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

  if (status === "active") filtered = filtered.filter((c) => !!c.isActive);
  if (status === "inactive") filtered = filtered.filter((c) => !c.isActive);

  if (q) {
    filtered = filtered.filter((c) => {
      const name = (c.name ?? "").toLowerCase();
      const addr = (c.address ?? "").toLowerCase();
      const phone = (c.phoneNumber ?? "").toLowerCase();
      const nit = (c.identificationNumber ?? "").toLowerCase();
      return name.includes(q) || addr.includes(q) || phone.includes(q) || nit.includes(q);
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
  <div className="space-y-10 rounded-2xl bg-slate-50/70 p-6">
    {/* HEADER */}
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-800">
          Clinics
        </h1>
        <p className="text-sm text-slate-600">
          Manage clinics, status (active / inactive), and basic information.
        </p>
      </div>

      <div className="flex gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/users/pets">Pets</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/users/vets">Vets</Link>
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
          Search by clinic name, address, phone, or identification number.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <form
          className="relative w-full md:max-w-md"
          action="/admin/users/clinics"
          method="GET"
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="q"
            defaultValue={qRaw}
            className="pl-9"
            placeholder="Search clinic, address, phone, ID..."
          />
          <input type="hidden" name="status" value={status} />
        </form>

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
            Clinics List
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
                <TableCell
                  colSpan={6}
                  className="text-sm text-slate-500"
                >
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c) => {
                const showImage = hasValidHttpUrl(c.imageUrl);

                return (
                  <TableRow
                    key={c.id}
                    className="transition hover:bg-slate-50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-xl border bg-slate-100 flex items-center justify-center">
                          {showImage ? (
                            <Image
                              src={c.imageUrl as string}
                              alt={c.name || "Clinic"}
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <span className="text-xs font-medium text-slate-500">
                              {initialLetter(c.name)}
                            </span>
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <p className="font-medium text-slate-800">
                            {c.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            ID · {c.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-slate-600">
                      {c.address}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {c.phoneNumber}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {c.identificationNumber}
                    </TableCell>
                    <TableCell>
                      {statusBadge(!!c.isActive)}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="inline-flex gap-2">
                        <ClinicViewButton
                          clinic={{
                            id: c.id,
                            name: c.name,
                            address: c.address,
                            phoneNumber: c.phoneNumber,
                            identificationNumber: c.identificationNumber,
                            imageUrl: c.imageUrl,
                            isActive: c.isActive,
                          }}
                        />

                        {c.isActive ? (
                          <form action={deactivateAction}>
                            <input type="hidden" name="id" value={c.id} />
                            <Button
                              variant="destructive"
                              size="sm"
                              type="submit"
                            >
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
                );
              })
            )}
          </TableBody>
        </Table>

        <p className="mt-4 text-xs text-slate-400">
          Backend: <span className="font-mono">GET /clinics</span> ·{" "}
          <span className="font-mono">PATCH /clinics/:id</span>
        </p>
      </div>
    </div>
  </div>
);
}
