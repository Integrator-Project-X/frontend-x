export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED" | "PROBLEMATIC";

export type Appointment = {
  id: string;
  createdAt: string;     // "YYYY-MM-DD"
  scheduledAt: string;   // "YYYY-MM-DD HH:mm"
  city: string;

  clinicName: string;
  petOwnerName: string;

  service: string;       // "Consulta", "Grooming", "Emergencia", etc.
  status: AppointmentStatus;

  flagged: boolean;      // for problematic cases
};
