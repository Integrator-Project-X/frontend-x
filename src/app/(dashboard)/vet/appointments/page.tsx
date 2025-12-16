import type { AppointmentAPI } from "@/src/types/appointments.types";
import type { VetAppointmentVM } from "@/src/types/vet.types";

import { getClinicAppointments } from "@/src/core/appointments/appointments.service";
import VetTodaysAppointments from "@/src/components/ui/organisms/VetTodaysAppointments";
import VetQuickTipsCard from "@/src/components/ui/organisms/VetQuickTipsCard";

const TZ = "America/Bogota";

function safeDate(value?: string | null): Date | null {
    if (!value) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
}

function formatTimeInTZ(d: Date, timeZone: string) {
    return new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour: "numeric",
        minute: "2-digit",
    }).format(d);
}

function pickScheduledDate(a: AppointmentAPI): Date | null {
    const anyA = a as any;
    const maybe =
        anyA?.scheduledAt ??
        anyA?.appointment_date ??
        anyA?.appointmentDate ??
        anyA?.date ??
        null;

    const d = safeDate(maybe);
    if (d) return d;

    return safeDate(a.createdAt);
}

function mapAppointmentToVM(a: AppointmentAPI): VetAppointmentVM {
    const scheduled = pickScheduledDate(a);

    return {
        id: a.id_appointment,
        petName: a.pet?.pet_name ?? "—",
        ownerName: a.user?.full_name ?? "—",
        clinicName: a.clinic?.clinic_name ?? undefined,
        typeName: a.type?.name ?? undefined,
        description: a.description ?? undefined,
        statusName: a.status?.status_name ?? "—",
        timeLabel: scheduled ? formatTimeInTZ(scheduled, TZ) : undefined,
    };
}

export default async function VetAppointmentsPage() {
    const clinicAppointments = await getClinicAppointments();
    const vm = clinicAppointments.map(mapAppointmentToVM);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Appointments</h1>
                <p className="text-slate-600">All appointments for your clinic.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <VetTodaysAppointments
                    title="All Appointments"
                    emptyLabel="No clinic appointments yet."
                    appointments={vm}
                />
                <VetQuickTipsCard />
            </div>
        </div>
    );
}
