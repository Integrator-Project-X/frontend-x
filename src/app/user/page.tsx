"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import Sidebar from "@/src/components/ui/organisms/sideBar"
import { type Pet, type Appointment } from "@/src/lib/mock-data"
import { petsClient } from "@/src/core/api/pets.client"
import PetDetailsModal from "@/src/components/ui/organisms/PetDetailsModal"
import { appointmentsClient } from "@/src/core/api/appointments.client"
import { Calendar, Clock, Heart, MapPin, PlusCircle, Siren } from "lucide-react"

function Box({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border bg-white shadow-sm ${className}`}>{children}</div>
}

function Tag({
  children,
  type = "default",
}: {
  children: React.ReactNode
  type?: "default" | "warning"
}) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium
        ${
          type === "default"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
    >
      {children}
    </span>
  )
}

type TempUser = {
  id: string
  name: string
}

function DashboardContent() {
  const [pets, setPets] = useState<Pet[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(5)
  const [totalPets, setTotalPets] = useState<number | undefined>(undefined)
  const [appointmentsPage, setAppointmentsPage] = useState<number>(1)
  const [appointmentsLimit] = useState<number>(5)
  const [totalAppointments, setTotalAppointments] = useState<number | undefined>(undefined)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [viewPet, setViewPet] = useState<Pet | null>(null)
  console.log(pets);
  // 👇 Usuario temporal (solo para desarrollo)
  const user: TempUser = {
    id: "1",
    name: "Developer",
  }

  useEffect(() => {
    ;(async () => {
      try {
        const [petsRes, appointmentsAllRes] = await Promise.all([
          petsClient.list(user.id, { page, limit }),
          appointmentsClient.list(user.id, { all: true }),
        ])

        // Use the full appointments list (no filtering) and paginate client-side
        const allAppointments = appointmentsAllRes.items ?? [];
        // sort by date/time ascending
        const sorted = allAppointments.sort((a, b) => {
          const da = a.date ? new Date(a.date).getTime() : 0;
          const db = b.date ? new Date(b.date).getTime() : 0;
          if (da !== db) return da - db;
          return (a.time || "") < (b.time || "") ? -1 : 1;
        });

        const totalA = sorted.length;
        const start = Math.max(0, (appointmentsPage - 1) * appointmentsLimit);
        const end = start + appointmentsLimit;
        const pageItems = sorted.slice(start, end);

        setPets(petsRes.items)
        setTotalPets(petsRes.total)
        setAppointments(pageItems)
        setTotalAppointments(totalA)
      } catch (err) {
        console.error(err)
      }
    })()
  }, [page, appointmentsPage])

  // Show only active upcoming appointments (pending/confirmed) sorted by date/time and limited to 5
  const upcomingAppointments = appointments
    .filter((apt) => apt.status === "pending" || apt.status === "confirmed")
    .filter((apt) => {
      if (!apt.date) return true;
      try {
        const aptDate = new Date(apt.date);
        const today = new Date();
        // zero time portion for comparison
        aptDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        return aptDate >= today;
      } catch {
        return true;
      }
    })
    .sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      if (da !== db) return da - db;
      return (a.time || "") < (b.time || "") ? -1 : 1;
    })
    .slice(0, 5);

  return (
    <>
    <Sidebar/>
    <div className="min-h-screen p-6 md:pl-[250px] flex min-h-screen flex-col">
      <main className="container mx-auto flex-1 px-4 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">
            Hi, {user.name}
          </h1>
          <p className="text-gray-500">Dashboard sin autenticación (modo desarrollo)</p>
        </div>

        {/* Overview */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <Box className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Your Pets</p>
              <Heart className="h-4 w-4 text-gray-400" />
            </div>
            <p className="mt-2 text-2xl font-bold">{totalPets ?? pets.length}</p>
            <p className="text-xs text-gray-500">Registered pets</p>
          </Box>

          <Box className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Upcoming Appointments</p>
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <p className="mt-2 text-2xl font-bold">{totalAppointments ?? appointments.length}</p>
            <p className="text-xs text-gray-500">
              { (totalAppointments ?? 0) === 0 ? "No upcoming appointments" : "Scheduled" }
            </p>
          </Box>
        </div>

        {/* Emergency */}
        <Box className="mb-8 border-red-300 bg-red-50 p-6">
          <h3 className="text-lg font-semibold">Is this an emergency?</h3>
          <p className="mb-4 text-sm text-gray-600">
            Find 24/7 clinics or report an animal in danger.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/emergency"
              className="flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
            >
              <Clock className="h-4 w-4" />
              View 24/7 clinics
            </Link>

            <Link
              href="/emergency"
              className="flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              <Siren className="h-4 w-4" />
              Report to Animal Patrol
            </Link>
          </div>
        </Box>

        {/* Quick actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link href="/clinics" className="flex flex-col items-center gap-2 rounded-xl border p-6 hover:bg-gray-50">
              <MapPin className="h-8 w-8" />
              <span>Search Clinics</span>
            </Link>

            <Link href="/appointments" className="flex flex-col items-center gap-2 rounded-xl border p-6 hover:bg-gray-50">
              <Calendar className="h-8 w-8" />
              <span>Book Appointment</span>
            </Link>

            <Link
              href="/emergency"
              className="flex flex-col items-center gap-2 rounded-xl border border-red-300 p-6 text-red-600 hover:bg-red-50"
            >
              <Siren className="h-8 w-8" />
              <span>24/7 Emergencies</span>
            </Link>
          </div>
        </div>

        {/* Pets & Appointments */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Pets */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Pets</h2>
              <Link
                href="/pets/new"
                className="flex items-center gap-2 rounded-md bg-black px-3 py-1 text-sm text-white"
              >
                <PlusCircle className="h-4 w-4" />
                Add Pet
              </Link>
            </div>

            {pets.length === 0 ? (
              <Box className="p-8 text-center">
                <Heart className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="font-medium">No pets yet</p>
              </Box>
            ) : (
              <div className="space-y-4">
                {pets.map((pet) => (
                  <Box key={pet.id}>
                    <div className="flex items-center gap-4 p-4">
                      <img
                        src={pet.imageUrl || "/placeholder.svg"}
                        alt={pet.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{pet.name}</h3>
                          <Tag type={pet.vaccinesUpToDate ? "default" : "warning"}>
                            {pet.vaccinesUpToDate ? "Vaccines up to date" : "Vaccines pending"}
                          </Tag>
                        </div>
                        <p className="text-sm text-gray-500">{pet.breed} • {pet.age} years</p>
                        <div className="flex gap-2">
                          <button className="text-sm rounded-md border px-2 py-1" onClick={() => setViewPet(pet)}>View</button>
                        </div>
                      </div>
                    </div>
                  </Box>
                ))}
              </div>
            )}
              {/* Pagination */}
              <div className="mt-4 flex items-center gap-2">
                <button className="px-2 py-1 rounded border" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  Prev
                </button>
                {(() => {
                  const totalPages = Math.max(1, Math.ceil((totalPets ?? pets.length) / limit));
                  const maxButtons = 5;
                  const half = Math.floor(maxButtons / 2);
                  let start = Math.max(1, page - half);
                  let end = Math.min(totalPages, start + maxButtons - 1);
                  if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);
                  const arr = [] as number[];
                  for (let i = start; i <= end; i++) arr.push(i);
                  return arr.map((n) => (
                    <button key={n} onClick={() => setPage(n)} className={`px-2 py-1 rounded ${n === page ? 'bg-black text-white' : 'border'}`}>
                      {n}
                    </button>
                  ));
                })()}
                <button className="px-2 py-1 rounded border" onClick={() => setPage((p) => p + 1)}>
                  Next
                </button>
              </div>
              <PetDetailsModal pet={viewPet} onClose={() => setViewPet(null)} />
          </div>

          {/* Appointments */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">Upcoming Appointments</h2>

            {appointments.length === 0 ? (
              <Box className="p-8 text-center">
                <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="font-medium">No upcoming appointments</p>
              </Box>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <Box key={apt.id} className="p-4 max-h-28 overflow-hidden">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={(apt as any).imageUrl || "/placeholder.svg"} alt={apt.petName} className="h-10 w-10 rounded-md object-cover" />
                        <h3 className="font-semibold truncate max-w-xs">{apt.petName}</h3>
                      </div>
                      <Tag>{apt.status}</Tag>
                    </div>
                    <p className="text-sm text-gray-500 truncate max-w-full">{apt.clinicName}</p>
                    <div className="mt-2 flex gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> {apt.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {apt.time}
                      </span>
                    </div>
                  </Box>
                ))}

                {/* Appointments pagination (independent) */}
                <div className="mt-4 flex items-center gap-2">
                  <button className="px-2 py-1 rounded border" disabled={appointmentsPage <= 1} onClick={() => setAppointmentsPage((p) => Math.max(1, p - 1))}>
                    Prev
                  </button>
                  {(() => {
                    const totalPages = Math.max(1, Math.ceil((totalAppointments ?? appointments.length) / appointmentsLimit));
                    const maxButtons = 5;
                    const half = Math.floor(maxButtons / 2);
                    let start = Math.max(1, appointmentsPage - half);
                    let end = Math.min(totalPages, start + maxButtons - 1);
                    if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);
                    const arr: number[] = [];
                    for (let i = start; i <= end; i++) arr.push(i);
                    return arr.map((n) => (
                      <button key={n} onClick={() => setAppointmentsPage(n)} className={`px-2 py-1 rounded ${n === appointmentsPage ? 'bg-black text-white' : 'border'}`}>
                        {n}
                      </button>
                    ));
                  })()}
                  <button className="px-2 py-1 rounded border" onClick={() => setAppointmentsPage((p) => p + 1)}>
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
    </>
  )
}

export default function DashboardPage() {
  return <DashboardContent />
}
