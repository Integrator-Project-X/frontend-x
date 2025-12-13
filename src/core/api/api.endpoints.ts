export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },

  users: {
    create: "/users",
    list: "/users",
    byId: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    deactivate: (id: string) => `/users/${id}/deactivate`,
    restore: (id: string) => `/users/${id}/restore`,
  },

  appointmentsTypes: {
    create: "/appointments-types",
    list: "/appointments-types",
    byId: (id: string) => `/appointments-types/${id}`,
    activeByStatus: "/appointments-types/status/active",
    update: (id: string) => `/appointments-types/${id}`,
    delete: (id: string) => `/appointments-types/${id}`,
  },

  genders: {
    create: "/genders",
    list: "/genders",
    active: "/genders/active",
    byName: (name: string) => `/genders/name/${encodeURIComponent(name)}`,
    byId: (id: string) => `/genders/${id}`,
    update: (id: string) => `/genders/${id}`,
    softDelete: (id: string) => `/genders/soft/${id}`,
    delete: (id: string) => `/genders/${id}`,
  },

  appointmentStatus: {
    create: "/appointment-status",
    list: "/appointment-status",
    active: "/appointment-status/active",
    byId: (id: string) => `/appointment-status/${id}`,
    update: (id: string) => `/appointment-status/${id}`,
    softDelete: (id: string) => `/appointment-status/${id}/soft-delete`,
  },

  roles: {
    create: "/roles",
    list: "/roles",
    active: "/roles/active",
    byId: (id: string) => `/roles/${id}`,
    update: (id: string) => `/roles/${id}`,
    deactivate: (id: string) => `/roles/${id}/desactivate`,
  },

  jobPositions: {
    create: "/jobpositions",
    list: "/jobpositions",
    active: "/jobpositions/active",
    byId: (id: string) => `/jobpositions/${id}`,
    update: (id: string) => `/jobpositions/${id}`,
    deactivate: (id: string) => `/jobpositions/${id}/desactivate`,
  },

  races: {
    create: "/races",
    list: "/races",
    active: "/races/active",
    byId: (id: string) => `/races/${id}`,
    update: (id: string) => `/races/${id}`,
    deactivate: (id: string) => `/races/${id}/desactivate`,
  },

  animals: {
    create: "/animals",
    list: "/animals",
    active: "/animals/active",
    byId: (id: string) => `/animals/${id}`,
    update: (id: string) => `/animals/${id}`,
    deactivate: (id: string) => `/animals/${id}/desactivate`,
  },

  pets: {
    create: "/pets",
    list: "/pets",
    active: "/pets/active",
    byId: (id: string) => `/pets/${id}`,
    update: (id: string) => `/pets/${id}`,
    deactivate: (id: string) => `/pets/${id}/deactivate`,
  },

  clinics: {
    create: "/clinics",
    list: "/clinics",
    active: "/clinics/active",
    byId: (id: string) => `/clinics/${id}`,
    update: (id: string) => `/clinics/${id}`,
    deactivate: (id: string) => `/clinics/${id}/deactivate`,
  },

  clinicSchedules: {
    create: "/clinic-schedules",
    list: "/clinic-schedules",
    active: "/clinic-schedules/active",
    byId: (id: string) => `/clinic-schedules/${id}`,
    update: (id: string) => `/clinic-schedules/${id}`,
    deactivate: (id: string) => `/clinic-schedules/${id}/deactivate`,
  },

  access: {
    create: "/access",
    list: "/access",
    byId: (id: string) => `/access/${id}`,
    update: (id: string) => `/access/${id}`,
    deactivate: (id: string) => `/access/${id}/deactivate`,
  },

  petUser: {
    create: "/pet-user",
    list: "/pet-user",
    byId: (id: string) => `/pet-user/${id}`,
    update: (id: string) => `/pet-user/${id}`,
    deactivate: (id: string) => `/pet-user/${id}/deactivate`,
  },

  personal: {
    create: "/personal",
    list: "/personal",
    byId: (id: string) => `/personal/${id}`,
    update: (id: string) => `/personal/${id}`,
    deactivate: (id: string) => `/personal/${id}/deactivate`,
  },

  appointments: {
    create: "/appointments",
    list: "/appointments",
    byId: (id: string) => `/appointments/${id}`,
    update: (id: string) => `/appointments/${id}`,
    deactivate: (id: string) => `/appointments/${id}/deactivate`,
  },

  diagnosis: {
    create: "/diagnosis",
    list: "/diagnosis",
    active: "/diagnosis/active",
    byId: (id: string) => `/diagnosis/${id}`,
    update: (id: string) => `/diagnosis/${id}`,
    delete: (id: string) => `/diagnosis/${id}`,
  },

  medicalRecords: {
    create: "/medical-records",
    list: "/medical-records",
    byId: (id: string) => `/medical-records/${id}`,
    update: (id: string) => `/medical-records/${id}`,
    delete: (id: string) => `/medical-records/${id}`,
  },
} as const;
