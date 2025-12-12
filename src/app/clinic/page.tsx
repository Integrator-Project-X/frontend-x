"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, Phone, Star } from "lucide-react";

// Datos de ejemplo
const mockClinics = [
  {
    id: 1,
    name: "Happy Paws Clinic",
    neighborhood: "El Prado",
    address: "Calle 45 # 23 - 10",
    phone: "3001234567",
    rating: 4.8,
    distance: "1.2 km",
    isOpen: true,
    is24Hours: false,
    services: ["Emergency", "Vaccination", "General Consultation"],
  },
  {
    id: 2,
    name: "AnimalCare 24H",
    neighborhood: "Riomar",
    address: "Cra 59 # 80 - 22",
    phone: "3019876543",
    rating: 4.5,
    distance: "2.5 km",
    isOpen: true,
    is24Hours: true,
    services: ["Emergency", "Surgery"],
  },
  {
    id: 3,
    name: "PetZone Veterinary Center",
    neighborhood: "Alameda del Río",
    address: "Transversal 9 # 110 - 35",
    phone: "3021239876",
    rating: 4.3,
    distance: "3.1 km",
    isOpen: false,
    is24Hours: false,
    services: ["General Consultation", "Vaccination"],
  },
  {
    id: 4,
    name: "Clinivet Express",
    neighborhood: "Boston",
    address: "Carrera 43 # 64 - 18",
    phone: "3055551234",
    rating: 4.9,
    distance: "900 m",
    isOpen: true,
    is24Hours: true,
    services: ["Emergency", "Home Visit", "General Consultation"],
  },
  {
    id: 5,
    name: "Mascotas & Salud",
    neighborhood: "Villa Santos",
    address: "Calle 85 # 24 - 50",
    phone: "3007778899",
    rating: 4.6,
    distance: "4.2 km",
    isOpen: false,
    is24Hours: false,
    services: ["Surgery", "Vaccination", "General Consultation"],
  },
  {
    id: 6,
    name: "VitalPet Barranquilla",
    neighborhood: "Los Andes",
    address: "Carrera 27 # 70 - 15",
    phone: "3045567890",
    rating: 4.7,
    distance: "2 km",
    isOpen: true,
    is24Hours: false,
    services: ["Emergency", "General Consultation", "Home Visit"],
  },
];

export default function ClinicsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [onlyOpenNow, setOnlyOpenNow] = useState(false);
  const [only24Hours, setOnly24Hours] = useState(false);

  const filteredClinics = mockClinics.filter((clinic) => {
    if (
      searchQuery &&
      !clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !clinic.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (serviceFilter !== "all" && !clinic.services.includes(serviceFilter)) {
      return false;
    }

    if (onlyOpenNow && !clinic.isOpen) return false;
    if (only24Hours && !clinic.is24Hours) return false;

    return true;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Find a Clinic</h1>
          <p className="text-gray-500">
            Search for veterinary clinics in Barranquilla by location, services, and availability
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          {/* Filters */}
          <div className="border border-gray-200 rounded-lg p-6 space-y-6 shadow-sm h-[520px]">
            <h2 className="text-lg font-semibold">Filters</h2>

            <div className="space-y-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search by name or neighborhood</label>
                <input
                  className="w-full rounded border px-3 py-2"
                  placeholder="El Prado, Riomar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Services */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Service type</label>
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="w-full rounded border px-3 py-2"
                >
                  <option value="all">All services</option>
                  <option value="General Consultation">General Consultation</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Vaccination">Vaccination</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Home Visit">Home Visit</option>
                </select>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={onlyOpenNow}
                    onChange={() => setOnlyOpenNow(!onlyOpenNow)}
                  />
                  Only show open now
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={only24Hours}
                    onChange={() => setOnly24Hours(!only24Hours)}
                  />
                  24/7 clinics only
                </label>
              </div>
            </div>
          </div>

          {/* Clinics List */}
          <div className="space-y-6">
            <p className="text-sm text-gray-500">
              {filteredClinics.length} {filteredClinics.length === 1 ? "clinic" : "clinics"} found
            </p>

            <div className="space-y-4">
              {filteredClinics.length === 0 && (
                <div className="border border-gray-200 rounded-lg p-6 text-center text-gray-500">
                  No clinics found matching your criteria
                </div>
              )}

              {filteredClinics.map((clinic) => (
                <div key={clinic.id} className="border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <div>
                      <div className="flex gap-2 items-center mb-2">
                        <h3 className="text-lg font-semibold">{clinic.name}</h3>

                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            clinic.isOpen
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {clinic.isOpen ? "Open now" : "Closed"}
                        </span>

                        {clinic.is24Hours && (
                          <span className="px-2 py-1 rounded text-xs border border-red-400 text-red-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> 24/7
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="flex gap-2 items-center">
                          <MapPin className="w-4 h-4" />
                          {clinic.address}, {clinic.neighborhood}
                        </p>

                        <p className="flex gap-2 items-center">
                          <Phone className="w-4 h-4" />
                          {clinic.phone}
                        </p>

                        <p className="flex gap-2 items-center">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {clinic.rating} • {clinic.distance}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {clinic.services.map((service) => (
                      <span key={service} className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {service}
                      </span>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 mt-4">
                    <button className="border px-3 py-2 rounded text-sm">
                      View on Map
                    </button>

                    <Link
                      href="/appointments"
                      className="bg-blue-600 text-white px-3 py-2 rounded text-sm flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Book Appointment
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* MAPA INCRUSTADO CORRECTAMENTE */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-100">
              <h2 className="text-lg font-semibold mb-4">Clinic Locations</h2>

              <div className="w-full h-[450px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d31333.71317374667!2d-74.79220881810954!3d10.98493559711992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sveterinaria!5e0!3m2!1ses-419!2sco!4v1764862029868!5m2!1ses-419!2sco"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
