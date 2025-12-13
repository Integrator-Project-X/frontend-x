"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, Flag, CheckCircle2 } from "lucide-react";

import { Button } from "@/src/components/ui/atoms/button";
import { Badge } from "@/src/components/ui/atoms/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/atoms/table";

import type { Appointment, AppointmentStatus } from "@/src/types/appointments.types";

function statusBadge(status: AppointmentStatus) {
  if (status === "CONFIRMED") return <Badge variant="default">Confirmed</Badge>;
  if (status === "PENDING") return <Badge variant="secondary">Pending</Badge>;
  if (status === "CANCELED") return <Badge variant="destructive">Canceled</Badge>;
  if (status === "COMPLETED") return <Badge variant="outline">Completed</Badge>;
  return <Badge variant="destructive">Problematic</Badge>;
}

export default function ProblematicAppointmentsTable({ rows }: { rows: Appointment[] }) {
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

  const data = useMemo(() => {
    return rows.map((r) => ({
      ...r,
      _resolved: resolvedIds.has(r.id),
    }));
  }, [rows, resolvedIds]);

  const resolveCase = (id: string) => {
    setResolvedIds((prev) => new Set(prev).add(id));
  };

  const flagCase = (id: string) => {
    // mock action
    alert(`Flagged case ${id}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Scheduled At</TableHead>
          <TableHead>City</TableHead>
          <TableHead>Clinic</TableHead>
          <TableHead>Pet Owner</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((a) => (
          <TableRow key={a.id}>
            <TableCell className="font-medium">{a.id}</TableCell>
            <TableCell>{a.scheduledAt}</TableCell>
            <TableCell>{a.city}</TableCell>
            <TableCell>{a.clinicName}</TableCell>
            <TableCell>{a.petOwnerName}</TableCell>
            <TableCell>{a.service}</TableCell>

            <TableCell>
              <div className="inline-flex items-center gap-2">
                {statusBadge(a.status)}
                {a._resolved && (
                  <Badge variant="outline" className="inline-flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Resolved
                  </Badge>
                )}
              </div>
            </TableCell>

            <TableCell className="text-right">
              <div className="inline-flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/appointments/${a.id}`}>
                    <Eye className="h-4 w-4" />
                    View
                  </Link>
                </Button>

                <Button size="sm" onClick={() => resolveCase(a.id)} disabled={a._resolved}>
                  Resolve
                </Button>

                <Button variant="destructive" size="sm" onClick={() => flagCase(a.id)}>
                  <Flag className="h-4 w-4" />
                  Flag
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
