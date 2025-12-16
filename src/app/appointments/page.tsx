"use client"

import { useEffect, useState } from "react"
import type { ReactNode, ChangeEvent, FormEvent } from "react"

import Sidebar from "@/src/components/ui/organisms/sideBar"
import EmergencyForm from "@/src/components/ui/organisms/EmergencyForm"
import PetDetailsModal from "@/src/components/ui/organisms/PetDetailsModal"

import { type Pet, mockClinics, type Appointment } from "@/src/lib/mock-data"
import { petsClient } from "@/src/core/api/pets.client"
import { appointmentsClient } from "@/src/core/api/appointments.client"
import { emergenciesClient } from "@/src/core/api/emergencies.client"

import Link from "next/link"
import { Calendar, Siren, PlusCircle } from "lucide-react"

/* =========================
   UI Helper
========================= */
function Box({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`rounded-xl border bg-white shadow-sm ${className}`}>{children}</div>
}

/* =========================
   Page
========================= */
export default function AppointmentsPage() {
  const [pets, setPets] = useState<Pet[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isEmergency, setIsEmergency] = useState(false)
  const [selectedPetId, setSelectedPetId] = useState<string>("")
  const [viewPet, setViewPet] = useState<Pet | null>(null)

  const [form, setForm] = useState({
    clinicId: "",
    date: "",
    time: "",
    service: "General Consultation",
  })

  // Mock user
  const userId = "1"

  /* =========================
     Effects
  ========================= */
  useEffect(() => {
    ; (async () => {
      try {
        const petsRes = await petsClient.listAll({ all: true })
        setPets(petsRes.items)
        if (petsRes.items.length > 0) setSelectedPetId(petsRes.items[0].id)

        const apptsRes = await appointmentsClient.list(userId, { all: true })
        setAppointments(apptsRes.items ?? [])
      } catch (error) {
        console.error(error)
      }
    })()
  }, [userId])

  /* =========================
     Handlers
  ========================= */
  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (isEmergency) return

    const pet = pets.find((p) => p.id === selectedPetId)
    const clinic = mockClinics.find((c) => c.id === form.clinicId)

    if (!pet || !clinic) {
      alert("Seleccione una mascota y una clínica")
      return
    }

    const payload: Partial<Appointment> = {
      petId: pet.id,
      petName: pet.name,
      clinicId: clinic.id,
      clinicName: clinic.name,
      date: form.date,
      time: form.time,
      serviceType: form.service,
      status: "pending",
    }

    try {
      const created = await appointmentsClient.create(payload)
      setAppointments((prev) => [created, ...prev])
      alert("Appointment created")
    } catch (error) {
      console.error(error)
      alert("Failed to create appointment")
    }
  }

  /* =========================
     Render
  ========================= */
  return (
    <>
      <Sidebar />

      <div className="min-h-screen p-6 md:pl-[250px]">
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Book Appointment</h1>
              <p className="text-gray-500">
                Choose a pet and book a visit, or report an emergency.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                className={`rounded-md px-4 py-2 text-sm ${isEmergency ? "bg-red-600 text-white" : "border"
                  }`}
                onClick={() => setIsEmergency(true)}
              >
                <Siren className="inline h-4 w-4" /> Emergency
              </button>

              <button
                className={`rounded-md px-4 py-2 text-sm ${!isEmergency ? "bg-blue-600 text-white" : "border"
                  }`}
                onClick={() => setIsEmergency(false)}
              >
                <Calendar className="inline h-4 w-4" /> Book
              </button>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* FORMULARIO */}
            <Box className="p-6 max-w-md w-full mx-auto max-h-[520px] overflow-y-auto">
              {isEmergency ? (
                <>
                  <h2 className="mb-4 text-xl font-semibold text-red-600">
                    Emergency
                  </h2>

                  <EmergencyForm
                    onSubmit={async (data) => {
                      try {
                        await emergenciesClient.report({
                          type: data.type,
                          location: data.location,
                          description: data.description,
                          reporterName: data.name,
                          reporterPhone: data.phone,
                        })
                        alert("Emergency reported")
                      } catch (error) {
                        console.error(error)
                        alert("Failed to report emergency")
                      }
                    }}
                  />
                </>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Pet */}
                  <div>
                    <label className="text-sm font-medium">Pet</label>
                    <select
                      value={selectedPetId}
                      onChange={(e) => setSelectedPetId(e.target.value)}
                      className="w-full rounded border px-3 py-2"
                    >
                      {pets.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {p.breed}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Clinic */}
                  <div>
                    <label className="text-sm font-medium">Clinic</label>
                    <select
                      name="clinicId"
                      value={form.clinicId}
                      onChange={handleFormChange}
                      className="w-full rounded border px-3 py-2"
                    >
                      <option value="">Select a clinic</option>
                      {mockClinics.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleFormChange}
                      className="rounded border px-3 py-2"
                    />
                    <input
                      type="time"
                      name="time"
                      value={form.time}
                      onChange={handleFormChange}
                      className="rounded border px-3 py-2"
                    />
                  </div>

                  {/* Service */}
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleFormChange}
                    className="w-full rounded border px-3 py-2"
                  >
                    <option>General Consultation</option>
                    <option>Vaccination</option>
                    <option>Surgery</option>
                    <option>Home Visit</option>
                    <option>Emergency</option>
                  </select>

                  <button
                    type="submit"
                    className="w-full rounded-md bg-blue-600 px-4 py-2 text-white"
                  >
                    Create Appointment
                  </button>
                </form>
              )}
            </Box>

            {/* PETS */}
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

              {pets.map((pet) => (
                <Box key={pet.id} className="mb-4 p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={pet.imageUrl || "/placeholder.svg"}
                      className="h-16 w-16 rounded-lg object-cover"
                      alt={pet.name}
                    />
                    <div>
                      <h3 className="font-semibold">{pet.name}</h3>
                      <p className="text-sm text-gray-500">
                        {pet.breed} • {pet.age} years
                      </p>
                      <button
                        className="mt-1 text-sm text-blue-600"
                        onClick={() => setViewPet(pet)}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </Box>
              ))}

              <PetDetailsModal
                open={!!viewPet}
                pet={viewPet}
                onClose={() => setViewPet(null)}
              />
            </div>
          </div>
        </main>
      </div>

    </>
  )
}
