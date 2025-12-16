import Link from "next/link";
import Image from "next/image";
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

import type { AdminPetRow } from "@/src/types/pets.types";
import { getPets } from "@/src/core/pets/pets.service";

import PetViewButton from "@/src/components/ui/organisms/PetViewButton";

type PetsSearchParams = {
  q?: string;
  status?: "all" | "active" | "inactive";
  animal?: string;
};

type PageProps = {
  searchParams?: PetsSearchParams | Promise<PetsSearchParams>;
};

function safeStatus(value?: string): "all" | "active" | "inactive" {
  if (value === "active" || value === "inactive" || value === "all") return value;
  return "all";
}

function buildHref(q: string, status: "all" | "active" | "inactive", animal: string) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  params.set("status", status);
  if (animal && animal !== "all") params.set("animal", animal);
  const qs = params.toString();
  return qs ? `/admin/users/pets?${qs}` : "/admin/users/pets";
}

function statusBadge(isActive: boolean) {
  return isActive ? <Badge variant="default">Active</Badge> : <Badge variant="destructive">Inactive</Badge>;
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}

function hasValidHttpUrl(url?: string | null) {
  const s = (url ?? "").trim();
  return s.startsWith("http://") || s.startsWith("https://");
}

function initialLetter(name?: string | null) {
  const s = (name ?? "").trim();
  return (s[0] ?? "P").toUpperCase();
}

export default async function PetsPage({ searchParams }: PageProps) {
  const sp = await Promise.resolve(searchParams ?? {});
  const qRaw = (sp.q ?? "").trim();
  const q = qRaw.toLowerCase();
  const status = safeStatus(sp.status);
  const animal = (sp.animal ?? "all").trim() || "all";

  const pets = await getPets();

  const animalOptions = Array.from(
    new Set(pets.map((p) => (p.animalName ?? "").trim()).filter(Boolean))
  );

  let filtered: AdminPetRow[] = [...pets];

  if (status === "active") filtered = filtered.filter((p) => !!p.isActive);
  if (status === "inactive") filtered = filtered.filter((p) => !p.isActive);

  if (animal !== "all") {
    filtered = filtered.filter(
      (p) => (p.animalName ?? "").toLowerCase() === animal.toLowerCase()
    );
  }

  if (q) {
    filtered = filtered.filter((p) => {
      const name = (p.name ?? "").toLowerCase();
      const race = (p.raceName ?? "").toLowerCase();
      const ani = (p.animalName ?? "").toLowerCase();
      return name.includes(q) || race.includes(q) || ani.includes(q);
    });
  }

  return (
  <div className="space-y-8">
    {/* Header */}
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-800">Pets</h1>
        <p className="max-w-xl text-sm text-slate-600">
          View all pets registered in the platform (from backend).
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          asChild
          variant="outline"
          className="border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          <Link href="/admin/users/pet-owners">Go to Pet Owners</Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          <Link href="/admin/users/vets">Go to Vets</Link>
        </Button>
      </div>
    </div>

    {/* Filters */}
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-slate-800">
          Filters
        </CardTitle>
        <CardDescription className="text-slate-500">
          Search by pet name, animal, or race.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <form
          className="relative w-full md:max-w-md"
          action="/admin/users/pets"
          method="GET"
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="q"
            defaultValue={qRaw}
            className="pl-9"
            placeholder="Search pet, animal, race..."
          />
          <input type="hidden" name="status" value={status} />
          <input type="hidden" name="animal" value={animal} />
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            asChild
            size="sm"
            variant={status === "all" ? "secondary" : "outline"}
            className={status === "all" ? "bg-blue-100 text-blue-700" : ""}
          >
            <Link href={buildHref(qRaw, "all", animal)}>All</Link>
          </Button>

          <Button
            asChild
            size="sm"
            variant={status === "active" ? "secondary" : "outline"}
            className={status === "active" ? "bg-green-100 text-green-700" : ""}
          >
            <Link href={buildHref(qRaw, "active", animal)}>Active</Link>
          </Button>

          <Button
            asChild
            size="sm"
            variant={status === "inactive" ? "secondary" : "outline"}
            className={status === "inactive" ? "bg-red-100 text-red-700" : ""}
          >
            <Link href={buildHref(qRaw, "inactive", animal)}>Inactive</Link>
          </Button>

          {/* Animal filter */}
          <form
            action="/admin/users/pets"
            method="GET"
            className="ml-2 flex items-center gap-2"
          >
            <input type="hidden" name="q" value={qRaw} />
            <input type="hidden" name="status" value={status} />

            <select
              name="animal"
              defaultValue={animal}
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="all">All animals</option>
              {animalOptions.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>

            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Apply
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>

    {/* Table */}
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-slate-800">
          Pets list
        </CardTitle>
        <CardDescription className="text-slate-500">
          {filtered.length} result(s)
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Pet</TableHead>
              <TableHead>Animal</TableHead>
              <TableHead>Race</TableHead>
              <TableHead>Birth date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-6 text-center text-sm text-slate-500"
                >
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => {
                const showImage = hasValidHttpUrl(p.imageUrl);

                return (
                  <TableRow key={p.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 overflow-hidden rounded-lg border border-slate-200 bg-white flex items-center justify-center">
                          {showImage ? (
                            <Image
                              src={p.imageUrl as string}
                              alt={p.name || "Pet"}
                              width={36}
                              height={36}
                              className="h-full w-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <span className="text-[10px] text-slate-400">
                              {initialLetter(p.name)}
                            </span>
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <p className="font-medium text-slate-800">
                            {p.name || "—"}
                          </p>
                          <p className="text-xs text-slate-500">
                            ID: {p.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-slate-500">
                      {p.animalName || "—"}
                    </TableCell>

                    <TableCell className="text-slate-500">
                      {p.raceName || "—"}
                    </TableCell>

                    <TableCell className="text-slate-500">
                      {formatDate(p.birthDate)}
                    </TableCell>

                    <TableCell>{statusBadge(!!p.isActive)}</TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <PetViewButton pet={p} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <p className="mt-3 px-4 pb-4 text-xs text-slate-400">
          Backend: <span className="font-mono">GET /pets</span> (returns race + animal relations).
        </p>
      </CardContent>
    </Card>
  </div>
);
}
