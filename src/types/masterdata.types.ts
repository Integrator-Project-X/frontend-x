export type ActiveStatus = boolean | undefined;

export type AdminGenderRow = {
  id: number;
  name: string;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type AdminAnimalRow = {
  id: number;
  animalName: string;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type AdminRaceRow = {
  id: number;
  raceName: string;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type AdminRoleRow = {
  id: number;
  roleName: string;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type AdminMedicalRecordRow = {
  id: number;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

// ⚠️ no me pasaste response real, lo dejo flexible
export type AdminClinicScheduleRow = {
  id: number;
  isActive: boolean;

  clinicName?: string | null;
  day?: string | null;
  startTime?: string | null;
  endTime?: string | null;

  createdAt?: string | null;
  updatedAt?: string | null;
};
