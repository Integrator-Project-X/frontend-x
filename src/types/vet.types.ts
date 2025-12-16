// src/types/vet.types.ts

export type VetProfileStatus = "VERIFIED" | "PENDING" | "REJECTED";

export type VetDashboardStats = {
    profileStatus: VetProfileStatus;
    profileStatusLabel: string;
    profileStatusHint: string;

    todaysAppointmentsCount: number;
    todaysAppointmentsHint: string;

    clinicStatusLabel: string;
    clinicStatusHint: string;
};

export type VetScheduleDay = {
    day: string;
    start?: string;
    end?: string;
    slotsLabel?: string;
    isClosed?: boolean;
};

export type VetAppointmentStatusName =
    | "Pendiente"
    | "Confirmada"
    | "Completada"
    | "Cancelada"
    | string;

export type VetAppointmentVM = {
    id: number;

    petName: string;
    ownerName: string;
    clinicName?: string;

    typeName?: string;
    description?: string;

    statusName: VetAppointmentStatusName;

    timeLabel?: string;
};

export type VetDiagnosisPayload = {
    id_personal: number;
    description: string;
};

export type VetUpdateStatusPayload = {
    id_status: number;
};
