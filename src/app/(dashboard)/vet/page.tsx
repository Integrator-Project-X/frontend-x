import { redirect } from "next/navigation";
import { requireAuth } from "@/src/core/auth/auth.guards";
import { getUserRole } from "@/src/core/auth/auth.cookies";

import type { AppointmentAPI } from "@/src/types/appointments.types";
import type { VetAppointmentVM, VetDashboardStats, VetScheduleDay } from "@/src/types/vet.types";

import { getMe } from "@/src/core/users/users.service";
import { getClinicAppointments } from "@/src/core/appointments/appointments.service";

import VetStatsRow from "@/src/components/ui/organisms/VetStatsRow";
import VetProfessionalProfileCard from "@/src/components/ui/organisms/VetProfessionalProfileCard";
import VetScheduleCard from "@/src/components/ui/organisms/VetScheduleCard";
import VetTodaysAppointments from "@/src/components/ui/organisms/VetTodaysAppointments";
import VetQuickTipsCard from "@/src/components/ui/organisms/VetQuickTipsCard";

const TZ = "America/Bogota";

function safeDate(value?: string | null): Date | null {
    if (!value) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
}

function isSameDayInTZ(a: Date, b: Date, timeZone: string) {
    const fmt = new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    return fmt.format(a) === fmt.format(b);
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

export default async function VetPage() {
    await requireAuth();
    const role = await getUserRole();

    if (role !== "VET") redirect("/dashboard");

    const profile = await getMe();
    const clinicAppointments = await getClinicAppointments();

    const now = new Date();
    const todaysAppointments = clinicAppointments.filter((a) => {
        const d = pickScheduledDate(a);
        return d ? isSameDayInTZ(d, now, TZ) : false;
    });

    const appointmentsVM = (todaysAppointments.length ? todaysAppointments : clinicAppointments).map(
        mapAppointmentToVM
    );

    const isVerified = Boolean((profile as any)?.isActive);

    const stats: VetDashboardStats = {
        profileStatus: isVerified ? "VERIFIED" : "PENDING",
        profileStatusLabel: isVerified ? "Verified" : "Pending",
        profileStatusHint: isVerified ? "Profile approved by admin" : "Profile pending approval",

        todaysAppointmentsCount: todaysAppointments.length ? todaysAppointments.length : clinicAppointments.length,
        todaysAppointmentsHint: todaysAppointments.length ? "Scheduled for today" : "Appointments in your clinic",

        clinicStatusLabel: "Open",
        clinicStatusHint: "Mon–Fri 8:00–18:00",
    };

    const schedule: VetScheduleDay[] = [
        { day: "Monday", start: "8:00 AM", end: "6:00 PM", slotsLabel: "8 slots" },
        { day: "Tuesday", start: "8:00 AM", end: "6:00 PM", slotsLabel: "8 slots" },
        { day: "Wednesday", start: "8:00 AM", end: "6:00 PM", slotsLabel: "8 slots" },
        { day: "Thursday", start: "8:00 AM", end: "6:00 PM", slotsLabel: "8 slots" },
        { day: "Friday", start: "8:00 AM", end: "6:00 PM", slotsLabel: "8 slots" },
        { day: "Saturday", start: "9:00 AM", end: "2:00 PM", slotsLabel: "4 slots" },
        { day: "Sunday", isClosed: true },
    ];

    return (
        <div className="w-full space-y-8 rounded-2xl bg-slate-50/80 p-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Welcome, Dr.</h1>
                <p className="text-slate-600">Manage your clinic and appointments.</p>
            </div>

            <VetStatsRow stats={stats} />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <VetProfessionalProfileCard
                    profile={profile as any}
                    email={(profile as any)?.email}
                    clinicName={(profile as any)?.clinic?.clinic_name}
                    professionalLicense={(profile as any)?.professional_license}
                />
                <VetScheduleCard schedule={schedule} />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <VetTodaysAppointments appointments={appointmentsVM} />
                <VetQuickTipsCard />
            </div>
        </div>
    );
}
