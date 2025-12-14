import Link from "next/link";
import Image from "next/image";
import { Search, Eye } from "lucide-react";

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

function buildHref(
  q: string,
  status: "all" | "active" | "inactive",
  animal: string
) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  params.set("status", status);
  if (animal && animal !== "all") params.set("animal", animal);
  const qs = params.toString();
  return qs ? `/admin/users/pets?${qs}` : "/admin/users/pets";
}

function statusBadge(isActive: boolean) {
  return isActive ? (
    <Badge variant="default">Active</Badge>
  ) : (
    <Badge variant="destructive">Inactive</Badge>
  );
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

  // dropdown animals
  const animalOptions = Array.from(
    new Set(pets.map((p) => (p.animalName ?? "").trim()).filter(Boolean))
  );

  // filters
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Pets</h1>
          <p className="text-muted-foreground">
            View all pets registered in the platform (from backend).
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/users/pet-owners">Go to Pet Owners</Link>
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
          <CardDescription>Search by pet name, animal, or race.</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <form
            className="relative w-full md:max-w-md"
            action="/admin/users/pets"
            method="GET"
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={qRaw}
              className="pl-9"
              placeholder="Search pet, animal, race..."
            />
            <input type="hidden" name="status" value={status} />
            <input type="hidden" name="animal" value={animal} />
          </form>

          <div className="flex flex-wrap gap-2 items-center">
            <Button
              asChild
              variant={status === "all" ? "secondary" : "outline"}
              size="sm"
            >
              <Link href={buildHref(qRaw, "all", animal)}>All</Link>
            </Button>

            <Button
              asChild
              variant={status === "active" ? "secondary" : "outline"}
              size="sm"
            >
              <Link href={buildHref(qRaw, "active", animal)}>Active</Link>
            </Button>

            <Button
              asChild
              variant={status === "inactive" ? "secondary" : "outline"}
              size="sm"
            >
              <Link href={buildHref(qRaw, "inactive", animal)}>Inactive</Link>
            </Button>

            {/* Animal filter (server-safe) */}
            <form
              action="/admin/users/pets"
              method="GET"
              className="ml-2 flex items-center"
            >
              <input type="hidden" name="q" value={qRaw} />
              <input type="hidden" name="status" value={status} />

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

              <Button type="submit" variant="outline" size="sm" className="ml-2">
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
                  <TableCell colSpan={6} className="text-sm text-muted-foreground">
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => {
                  const showImage = hasValidHttpUrl(p.imageUrl);

                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 overflow-hidden rounded-lg border bg-white flex items-center justify-center">
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
                              <span className="text-[10px] text-muted-foreground">
                                {initialLetter(p.name)}
                              </span>
                            )}
                          </div>

                          <div className="space-y-0.5">
                            <p className="font-medium">{p.name || "—"}</p>
                            <p className="text-xs text-muted-foreground">ID: {p.id}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {p.animalName || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {p.raceName || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(p.birthDate)}
                      </TableCell>
                      <TableCell>{statusBadge(!!p.isActive)}</TableCell>

                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/users/pets/${p.id}`}>
                            <Eye className="h-4 w-4" />
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          <p className="mt-3 text-xs text-muted-foreground">
            Backend: <span className="font-mono">GET /pets</span> (returns race + animal relations).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
