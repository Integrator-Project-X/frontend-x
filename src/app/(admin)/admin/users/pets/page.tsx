import Link from "next/link";
import { Search, Eye } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/atoms/card";
import { Button } from "@/src/components/ui/atoms/button";
import { Input } from "@/src/components/ui/molecules/input";
import { Badge } from "@/src/components/ui/atoms/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/atoms/table";

import { mockPets } from "@/src/core/admin/pets.mock";
import type { Pet, PetSpecies, PetStatus } from "@/src/types/pets.types";

function speciesBadge(species: PetSpecies) {
  if (species === "DOG") return <Badge variant="secondary">Dog</Badge>;
  if (species === "CAT") return <Badge variant="secondary">Cat</Badge>;
  return <Badge variant="outline">Other</Badge>;
}

function statusBadge(status: PetStatus) {
  if (status === "ACTIVE") return <Badge variant="default">Active</Badge>;
  return <Badge variant="outline">Archived</Badge>;
}

export default function PetsAdminPage() {
  const total = mockPets.length;
  const dogs = mockPets.filter((p) => p.species === "DOG").length;
  const cats = mockPets.filter((p) => p.species === "CAT").length;
  const archived = mockPets.filter((p) => p.status === "ARCHIVED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Pets</h1>
          <p className="text-muted-foreground">
            View all pets across the platform (MVP mock).
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/users/pet-owners">Go to Pet Owners</Link>
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total pets" value={`${total}`} />
        <MetricCard title="Dogs" value={`${dogs}`} />
        <MetricCard title="Cats" value={`${cats}`} />
        <MetricCard title="Archived" value={`${archived}`} />
      </div>

      {/* Filters (UI only) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
          <CardDescription>Search by pet name, owner email, city, breed (mock).</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search pet, owner, city, breed..." />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm">All</Button>
            <Button variant="outline" size="sm">Dogs</Button>
            <Button variant="outline" size="sm">Cats</Button>
            <Button variant="outline" size="sm">Other</Button>
            <Button variant="outline" size="sm">Archived</Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pet List</CardTitle>
          <CardDescription>Main fields for admin review.</CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pet</TableHead>
                <TableHead>Species</TableHead>
                <TableHead>Breed</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {mockPets.map((p: Pet) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{speciesBadge(p.species)}</TableCell>
                  <TableCell className="text-muted-foreground">{p.breed ?? "—"}</TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-medium">{p.ownerName}</p>
                      <p className="text-xs text-muted-foreground">{p.ownerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>{p.city}</TableCell>
                  <TableCell className="text-muted-foreground">{p.createdAt}</TableCell>
                  <TableCell>{statusBadge(p.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/users/pets/${p.id}`}>
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <p className="mt-3 text-xs text-muted-foreground">
            Mock data. Later we will connect backend + add pagination and real filters.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
