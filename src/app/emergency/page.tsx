"use client"

import { actiClinic } from "@/src/types/mockClinics";
import { MapPin, Phone, Clock, Upload, Siren } from "lucide-react";

export default function ClinicsPage() {

  const filteredClinics = actiClinic.filter((clinic) => clinic.is24Hours);

  return (
    <div className="min-h-screen px-6 py-10">
      {/* Header */}
      <div className="bg-orange-100 border border-orange-200 px-6 py-4 rounded-lg mb-10">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-600">
            <Siren className="w-6 h-6 text-white" />
          </div>
          Animal Emergencies 24/7
        </h1>

        <p className="text-gray-700 text-sm">
          Use this section only if a pet or animal is in danger. For non-urgent situations, please book a regular appointment.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-2 gap-10">
        
        {/* LEFT — 24/7 Clinics */}
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold">24/7 Clinics Nearby</h2>
          <p className="text-gray-600 -mt-3">
            These clinics are open right now and accept emergency cases
          </p>

          {filteredClinics.map((clinic) => (
            <div
              key={clinic.id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold">{clinic.name}</h3>

              <div className="flex items-center gap-2 mt-1">
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                  Open 24/7
                </span>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                  Available Now
                </span>
              </div>

              <div className="mt-4 space-y-1 text-gray-700 text-sm">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {clinic.address}, {clinic.neighborhood}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {clinic.phone}
                </p>
                <p className="text-xs text-gray-500">Distance: {clinic.distance}</p>
              </div>

              <div className="flex gap-3 mt-5">
                <button className="bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-orange-700">
                  <Phone className="w-4 h-4" />
                  Call Now
                </button>

                <button className="border px-4 py-2 rounded-md hover:bg-gray-100">
                  View on Map
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT — Emergency Form */}
        <div>
           <div className="space-y-1 mb-6">
              <p className="text-2xl font-semibold">Report to Animal Patrol</p>    
              <p>Animal Patrol – City of Barranquilla</p>
            </div>

          <div className="bg-white border border-red-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-red-600">
              <Clock className="w-5 h-5" />
              Emergency Report Form
            </h2>

            <div className="space-y-5 mt-4">

              {/* Type of emergency */}
              <div>
                <label className="block text-sm font-medium mb-1">Type of Case</label>
                <select className="w-full border rounded px-3 py-2">
                  <option>Select the type of emergency</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Street address or neighborhood"
                />
                <button className="text-blue-600 text-sm mt-1 underline">
                  Use Current Location
                </button>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Brief Description</label>
                <textarea
                  className="w-full border rounded px-3 py-2 h-20"
                  placeholder="Describe what is happening with the animal..."
                ></textarea>
              </div>

              {/* Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">Attach Photos (Optional)</label>
                <div className="border border-dashed rounded-xl p-8 text-center text-gray-500">
                  <Upload className="mx-auto w-8 h-8 mb-2" />
                  Click to upload or drag and drop
                  <p className="text-xs mt-1">PNG, JPG up to 10MB</p>
                </div>
              </div>

              {/* Contact info */}
              <div>
                <h3 className="font-semibold mb-2">Your Contact Information</h3>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  className="w-full border rounded px-3 py-2 mb-3"
                  placeholder="Your Name"
                />

                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="+57 300 123 4567"
                />
              </div>

              {/* Submit Button */}
              <button className="bg-orange-600 w-full text-white py-3 rounded-md mt-2 hover:bg-orange-700 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                Send Report to Animal Patrol
              </button>

            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-6">
            <h3 className="font-semibold mb-3">Official Recommendations</h3>
            <ul className="text-sm text-gray-700 list-disc pl-4 space-y-1">
              <li>Do not put your own safety at risk.</li>
              <li>Do not confront suspects involved in animal abuse.</li>
              <li>If the case is critical, call the official emergency line: <b>123</b>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
