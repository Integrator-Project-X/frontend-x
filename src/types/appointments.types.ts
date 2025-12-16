export type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string | string[];
  error?: string;
  meta?: { timestamp?: string; path?: string };
};

export type AppointmentAPI = {
  id_appointment: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  pet?: {
    id_pet: number;
    pet_name: string;
    image_url?: string | null;
    birth_date?: string;
    isActive?: boolean;
    race?: { id_race: number; race_name: string };
    animal?: { id_animal: number; animal_name: string };
  } | null;

  user?: {
    id_user: number;
    full_name: string;
    isActive?: boolean;
  } | null;

  diagnosis?: {
    id_diagnosis: number;
    description: string;
    isActive: boolean;
    personal?: {
      id_personal: number;
      user?: { id_user: number; full_name: string } | null;
      jobPosition?: { id_job_position: number; job_position_name: string } | null;
    } | null;
  } | null;

  type?: {
    id: number;
    name: string;
    is_active: boolean;
  } | null;

  status?: {
    id_appointment_status: number;
    status_name: string;
    isActive: boolean;
  } | null;

  clinic?: {
    id_clinic: number;
    clinic_name: string;
    image_url?: string | null;
    isActive?: boolean;
  } | null;
};

export type AdminAppointmentRow = {
  id: number;
  description: string;
  createdAt: string;
  isActive: boolean;

  clinicName: string;

  petName: string;
  animalName: string;
  raceName: string;

  ownerName: string;
  ownerId: number | null;

  vetName: string;
  vetJob: string;

  typeName: string;
  statusName: string;
};
