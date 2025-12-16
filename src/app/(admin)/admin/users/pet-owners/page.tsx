import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Search, Ban, RefreshCcw } from "lucide-react";

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

import UserViewButton from "@/src/components/ui/organisms/UserViewButton";

import type { BackendUser } from "@/src/types/users.types";
import {
  getUsersWithRoles,
  deactivateUser,
  restoreUser,
} from "@/src/core/users/users.service";

type SearchParams = {
  q?: string;
  status?: "all" | "active" | "suspended";
};

function safeStatus(value?: string): "all" | "active" | "suspended" {
  if (value === "active" || value === "suspended" || value === "all") return value;
  return "all";
}

function buildHref(q: string, status: "all" | "active" | "suspended") {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  params.set("status", status);
  return `/admin/users/pet-owners?${params.toString()}`;
}

function statusBadge(isActive?: boolean) {
  return isActive === false ? (
    <Badge variant="destructive">Suspended</Badge>
  ) : (
    <Badge variant="default">Active</Badge>
  );
}

type PageProps = {
  searchParams?: SearchParams | Promise<SearchParams>;
};

export default async function PetOwnersPage({ searchParams }: PageProps) {
  const sp = await Promise.resolve(searchParams ?? {});

  const qRaw = (sp.q ?? "").trim();
  const q = qRaw.toLowerCase();
  const status = safeStatus(sp.status);

  const users = await getUsersWithRoles();

  let filteredUsers: BackendUser[] = [...users];

  // Filtro por estado (MISMO patrón que Roles)
  if (status === "active") {
    filteredUsers = filteredUsers.filter((u) => u.isActive !== false);
  }

  if (status === "suspended") {
    filteredUsers = filteredUsers.filter((u) => u.isActive === false);
  }

  // Filtro por nombre o email
  if (q) {
    filteredUsers = filteredUsers.filter((u) => {
      const name = (u.name ?? "").toLowerCase();
      const email = (u.email ?? "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }

  const total = filteredUsers.length;

  async function suspendAction(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await deactivateUser(id);
    revalidatePath("/admin/users/pet-owners");
  }

  async function restoreAction(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await restoreUser(id);
    revalidatePath("/admin/users/pet-owners");
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-800">Pet Owners</h1>
          <p className="text-sm text-slate-600">
            Manage users, roles and status directly from backend data.
          </p>
        </div>

        <Button asChild variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
          <Link href="/admin/users/vets">Go to Vets</Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
          <CardDescription>
            Search by name or email and filter by status.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <form
            className="relative w-full md:max-w-md"
            action="/admin/users/pet-owners"
            method="GET"
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              name="q"
              defaultValue={qRaw}
              className="pl-9"
              placeholder="Search name or email..."
            />
            <input type="hidden" name="status" value={status} />
          </form>

          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant={status === "all" ? "secondary" : "outline"}>
              <Link href={buildHref(qRaw, "all")}>All</Link>
            </Button>

            <Button asChild size="sm" variant={status === "active" ? "secondary" : "outline"}>
              <Link href={buildHref(qRaw, "active")}>Active</Link>
            </Button>

            <Button asChild size="sm" variant={status === "suspended" ? "secondary" : "outline"}>
              <Link href={buildHref(qRaw, "suspended")}>Suspended</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Users list</CardTitle>
          <CardDescription>{total} result(s)</CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-6 text-center text-sm text-slate-500">
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((u) => {
                  const active = u.isActive !== false;

                  return (
                    <TableRow key={u.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="font-medium text-slate-800">
                            {u.name || "—"}
                          </p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </TableCell>

                      <TableCell>{statusBadge(u.isActive)}</TableCell>

                      <TableCell>
                        <span className="text-sm text-slate-600">
                          {u.roleName || "—"}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-2">
                          <UserViewButton user={u} />

                          {active ? (
                            <form action={suspendAction}>
                              <input type="hidden" name="id" value={u.id} />
                              <Button variant="destructive" size="sm">
                                <Ban className="h-4 w-4" />
                                Suspend
                              </Button>
                            </form>
                          ) : (
                            <form action={restoreAction}>
                              <input type="hidden" name="id" value={u.id} />
                              <Button
                                variant="secondary"
                                size="sm"
                                className="bg-green-100 text-green-700 hover:bg-green-200"
                              >
                                <RefreshCcw className="h-4 w-4" />
                                Restore
                              </Button>
                            </form>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
