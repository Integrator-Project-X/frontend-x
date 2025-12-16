"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/atoms/button";
import { Badge } from "@/src/components/ui/atoms/badge";
import VetAppointmentDetailsModal from "@/src/components/ui/organisms/VetAppointmentDetailsModal";
import type { VetAppointmentVM } from "@/src/types/vet.types";

type AppointmentStatusRow = {
    id_appointment_status: number;
    status_name: string;
    isActive?: boolean;
};

function statusBadgeVariant(statusName: string) {
    const s = (statusName ?? "").toLowerCase();
    if (s.includes("confirm")) return "default";
    if (s.includes("cancel")) return "destructive";
    if (s.includes("complet")) return "outline";
    return "secondary";
}

function unwrapArray<T>(payload: any): T[] {
    const arr = payload?.data ?? payload;
    return Array.isArray(arr) ? (arr as T[]) : [];
}

export default function VetAppointmentItem({ appointment }: { appointment: VetAppointmentVM }) {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const badgeVariant = useMemo(
        () => statusBadgeVariant(appointment.statusName),
        [appointment.statusName]
    );

    const isCompleted = (appointment.statusName ?? "").toLowerCase().includes("complet");
    const isCancelled = (appointment.statusName ?? "").toLowerCase().includes("cancel");

    async function markComplete() {
        try {
            setSaving(true);

            const statusRes = await fetch("/api/appointment-status", { cache: "no-store" });
            const statusJson = await statusRes.json().catch(() => ({}));
            const statuses = unwrapArray<AppointmentStatusRow>(statusJson);

            const completed = statuses.find(
                (x) => String(x.status_name ?? "").trim().toLowerCase() === "completada"
            );

            if (!completed?.id_appointment_status) {
                console.error("Could not resolve 'Completada' status id");
                return;
            }

            const res = await fetch(`/api/appointments/${appointment.id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_status: completed.id_appointment_status }),
                cache: "no-store",
            });

            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                console.error("Mark complete failed", { status: res.status, json });
                return;
            }

            router.refresh();
        } catch (e) {
            console.error("Mark complete error", e);
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <div className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-base font-semibold text-foreground">
                            {appointment.petName}{" "}
                            {appointment.timeLabel ? (
                                <span className="text-sm font-medium text-muted-foreground">
                                    • {appointment.timeLabel}
                                </span>
                            ) : null}
                        </p>

                        <p className="text-sm text-muted-foreground">Owner: {appointment.ownerName}</p>
                        {appointment.typeName ? (
                            <p className="text-sm text-muted-foreground">Type: {appointment.typeName}</p>
                        ) : null}
                    </div>

                    <Badge variant={badgeVariant}>{appointment.statusName}</Badge>
                </div>

                {appointment.description ? (
                    <p className="mt-3 text-sm text-muted-foreground">{appointment.description}</p>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-2">
                    <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
                        View Details
                    </Button>

                    <Button
                        type="button"
                        onClick={markComplete}
                        disabled={saving || isCompleted || isCancelled}
                    >
                        {saving ? "Saving..." : "Mark Complete"}
                    </Button>
                </div>
            </div>

            <VetAppointmentDetailsModal
                open={open}
                onClose={() => setOpen(false)}
                appointmentId={String(appointment.id)}
            />
        </>
    );
}
