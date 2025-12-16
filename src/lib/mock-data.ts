// Mock data for pets, appointments, clinics, etc.

export interface Pet {
  id: string
  name: string
  species: "dog" | "cat"
  breed: string
  age: number
  ownerId: string
  ownerName: string
  ownerPhone: string
  vaccinesUpToDate: boolean
  imageUrl: string
}

export interface Appointment {
  id: string
  petId: string
  petName: string
  clinicId: string
  clinicName: string
  date: string
  time: string
  serviceType: string
  status: "confirmed" | "pending" | "completed" | "cancelled"
  notes?: string
}

export interface Clinic {
  id: string
  name: string
  address: string
  neighborhood: string
  phone: string
  isOpen: boolean
  is24Hours: boolean
  services: string[]
  distance: string
  rating: number
}

// Mock pets data
export const mockPets: Pet[] = [
  {
    id: "pet-1",
    name: "Max",
    species: "dog",
    breed: "Golden Retriever",
    age: 3,
    ownerId: "1",
    ownerName: "Walter Martinez",
    ownerPhone: "+57 300 123 4567",
    vaccinesUpToDate: true,
    imageUrl: "/golden-retriever.png",
  },
  {
    id: "pet-2",
    name: "Luna",
    species: "cat",
    breed: "Siamese",
    age: 2,
    ownerId: "1",
    ownerName: "Walter Martinez",
    ownerPhone: "+57 300 123 4567",
    vaccinesUpToDate: false,
    imageUrl: "/siamese-cat.png",
  },
]

// Mock appointments data
export const mockAppointments: Appointment[] = [
  {
    id: "apt-1",
    petId: "pet-1",
    petName: "Max",
    clinicId: "clinic-1",
    clinicName: "Clinica Veterinaria El Norte",
    date: "2025-11-25",
    time: "10:00 AM",
    serviceType: "General Consultation",
    status: "confirmed",
    notes: "Annual checkup",
  },
  {
    id: "apt-2",
    petId: "pet-2",
    petName: "Luna",
    clinicId: "clinic-2",
    clinicName: "Veterinaria La Costa",
    date: "2025-11-28",
    time: "2:30 PM",
    serviceType: "Vaccination",
    status: "pending",
  },
]

// Mock clinics data
export const mockClinics: Clinic[] = [
  {
    id: "clinic-1",
    name: "Clinica Veterinaria El Norte",
    address: "Calle 84 #45-23",
    neighborhood: "El Prado",
    phone: "+57 300 555 0001",
    isOpen: true,
    is24Hours: false,
    services: ["General Consultation", "Surgery", "Vaccination", "Emergency"],
    distance: "2.3 km",
    rating: 4.8,
  },
  {
    id: "clinic-2",
    name: "Veterinaria La Costa",
    address: "Carrera 51B #79-150",
    neighborhood: "Riomar",
    phone: "+57 300 555 0002",
    isOpen: true,
    is24Hours: true,
    services: ["Emergency", "General Consultation", "Vaccination", "Home Visit"],
    distance: "3.5 km",
    rating: 4.6,
  },
  {
    id: "clinic-3",
    name: "Hospital Veterinario Central",
    address: "Calle 72 #57-45",
    neighborhood: "Boston",
    phone: "+57 300 555 0003",
    isOpen: false,
    is24Hours: false,
    services: ["Surgery", "General Consultation", "Vaccination", "X-Ray"],
    distance: "4.1 km",
    rating: 4.9,
  },
  {
    id: "clinic-4",
    name: "Veterinaria Pet Care 24/7",
    address: "Calle 98 #52-165",
    neighborhood: "Villa Carolina",
    phone: "+57 300 555 0004",
    isOpen: true,
    is24Hours: true,
    services: ["Emergency", "General Consultation", "Surgery", "ICU"],
    distance: "5.2 km",
    rating: 4.7,
  },
  {
    id: "clinic-5",
    name: "Clinica Veterinaria San Francisco",
    address: "Carrera 38 #74-120",
    neighborhood: "San Francisco",
    phone: "+57 300 555 0005",
    isOpen: true,
    is24Hours: false,
    services: ["General Consultation", "Vaccination", "Grooming"],
    distance: "6.8 km",
    rating: 4.5,
  },
]

// Emergencies storage
export interface Emergency {
  id: string;
  type: string;
  location: string;
  description?: string;
  reporterName?: string;
  reporterPhone?: string;
  createdAt: string;
}

export const mockEmergencies: Emergency[] = [];

export const reportEmergency = (payload: Omit<Emergency, 'id' | 'createdAt'>): Emergency => {
  const emergency: Emergency = { id: `em-${Math.random().toString(36).slice(2, 10)}`, createdAt: new Date().toISOString(), ...payload };
  mockEmergencies.unshift(emergency);
  return emergency;
};

export const getEmergencies = (): Emergency[] => mockEmergencies;

export const addAppointment = (apt: Appointment) => {
  mockAppointments.unshift(apt);
  return apt;
};

export const getOwnerPets = (ownerId: string): Pet[] => {
  return mockPets.filter((pet) => pet.ownerId === ownerId)
}

export const getOwnerAppointments = (ownerId: string): Appointment[] => {
  const pets = getOwnerPets(ownerId)
  const petIds = pets.map((p) => p.id)
  return mockAppointments.filter((apt) => petIds.includes(apt.petId))
}

export const getPetById = (petId: string): Pet | undefined => {
  return mockPets.find((pet) => pet.id === petId)
}

export const addPet = (payload: Omit<Pet, 'id'>): Pet => {
  const pet: Pet = { id: `pet-${Math.random().toString(36).slice(2, 9)}`, ...payload }
  mockPets.unshift(pet)
  return pet
}
