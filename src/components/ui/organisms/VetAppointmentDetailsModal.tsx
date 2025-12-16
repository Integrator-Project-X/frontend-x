"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/src/components/ui/organisms/Modal";
import { Badge } from "@/src/components/ui/atoms/badge";
import { Card, CardContent } from "@/src/components/ui/atoms/card";
import type { AppointmentAPI } from "@/src/types/appointments.types";

type Props = {
    open: boolean;
    onClose: () => void;
    appointmentId: string;
};

function unwrapObject<T>(payload: any): T | null {
    if (!payload) return null;
    return (payload?.data ?? payload) as T;
}

function statusBadgeVariant(statusName?: string) {
    const s = (statusName ?? "").toLowerCase();
    if (s.includes("confirm")) return "default";
    if (s.includes("cancel")) return "destructive";
    if (s.includes("complet")) return "outline";
    return "secondary";
}

export default function VetAppointmentDetailsModal({ open, onClose, appointmentId }: Props) {
    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState<AppointmentAPI | null>(null);

    const title = useMemo(() => `Appointment #${appointmentId}`, [appointmentId]);

    useEffect(() => {
        if (!open) return;
        if (!appointmentId) return;

        (async () => {
            try {
                setLoading(true);

                const res = await fetch(`/api/appointments/${appointmentId}`, { cache: "no-store" });
                const json = await res.json().catch(() => ({}));

                if (!res.ok) {
                    console.error("Failed to load appointment details", { status: res.status, json });
                    setDetails(null);
                    return;
                }

                const d = unwrapObject<AppointmentAPI>(json);
                setDetails(d);
            } catch (e) {
                console.error("Details modal error", e);
                setDetails(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [open, appointmentId]);

    return (
        <Modal open={open} title={title} onClose={onClose}>
            {loading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
            ) : !details ? (
                <div className="text-sm text-muted-foreground">
                    No data. Revisa consola/logs (401/403/404/500).
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={details.isActive ? "default" : "destructive"}>
                            {details.isActive ? "Active" : "Inactive"}
                        </Badge>

                        {details.status?.status_name ? (
                            <Badge variant={statusBadgeVariant(details.status.status_name)}>
                                {details.status.status_name}
                            </Badge>
                        ) : null}

                        {details.type?.name ? <Badge variant="secondary">{details.type.name}</Badge> : null}
                    </div>

                    <Card className="border-slate-200">
                        <CardContent className="space-y-2">
                            <div className="text-sm">
                                <span className="font-medium">Pet:</span>{" "}
                                {details.pet?.pet_name ?? "—"}
                            </div>
                            <div className="text-sm">
                                <span className="font-medium">Owner:</span>{" "}
                                {details.user?.full_name ?? "—"}
                            </div>
                            <div className="text-sm">
                                <span className="font-medium">Clinic:</span>{" "}
                                {details.clinic?.clinic_name ?? "—"}
                            </div>

                            <div className="pt-2 text-sm">
                                <span className="font-medium">Notes:</span>
                                <p className="text-muted-foreground">{details.description ?? "—"}</p>
                            </div>

                            <div className="pt-2 text-sm">
                                <span className="font-medium">Diagnosis:</span>
                                <p className="text-muted-foreground">
                                    {details.diagnosis?.description ?? "—"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </Modal>
    );
}
