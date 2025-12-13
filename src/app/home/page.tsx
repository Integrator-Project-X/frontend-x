import Link from "next/link";
import Image from "next/image";
import vetImg from "@/public/image.png";
import { Clock, Siren, Bell, Calendar, Heart, Search, AlertTriangle, User, MapPin } from "lucide-react";


export default function Home() {
  return (
    <>
      <div className="w-full flex flex-col items-center px-6">

        {/* Título + Imagen importada */}
        <div className="flex flex-col md:flex-row items-center gap-6 mt-10">

          {/* Imagen importada */}
          <Image
            src={vetImg}
            alt="Veterinary"
            className="w-32 h-32 object-contain md:ml-4"
          />

          {/* Título */}
          <h1 className="text-5xl font-bold leading-tight max-w-3xl text-center md:text-left">
            Find veterinary help <br />
            <span className="block">when you need it most.</span>
          </h1>

        </div>

        {/* Texto descriptivo */}
        <p className="text-lg text-gray-600 mt-6 max-w-2xl text-center">
          Connect with clinics, vets and the official Animal Patrol in Barranquilla,
          even at night, on Sundays and holidays.
        </p>

        {/* BOTONES */}
        <div className="flex gap-4 py-6 mt-10">
          <Link
            href="/emergency"
            className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition"
          >
            <Bell />
            View 24/7 emergencies
          </Link>

          <Link
            href="/clinic"
            className="flex items-center gap-2 border border-gray-300 px-6 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            <Search />
            Search clinics
          </Link>
        </div>

        {/* SECTION 1 - Problem / Solution */}
        <section className="border-y border-gray-200 bg-gray-50 w-full py-15">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex flex-row justify-around gap-12">

              <div className="flex flex-col border border-[#ffd9d9] shadow-md shadow-red-200/30 items-center text-center max-w-xs p-4 rounded-lg">
                <div className="bg-teal-700 text-white w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-xl">
                  <AlertTriangle />
                </div>
                <h3 className="font-semibold text-2xl">The Problem</h3>
                <p className="text-gray-600 mt-2">
                  Pet emergencies at night and weekends leave owners driving around the city without knowing which clinic is open. Time is critical, but information is scattered.
                </p>
              </div>

              <div className="flex flex-col border border-[#d9fff1] shadow-md shadow-teal-200/30 items-center text-center max-w-xs p-4 rounded-lg">
                <div className="bg-teal-700 text-white w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-xl">
                  <Heart />
                </div>
                <h3 className="font-semibold text-2xl">The Solution</h3>
                <p className="text-gray-600 mt-2">
                  VetConnect centralizes clinics, emergency services and Animal Patrol reports in one place. Find help instantly when every minute counts.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 2 - How It Works */}
        <section className="w-full py-15 px-6">
          <div className="max-w-6xl mx-auto text-center">

            <h2 className="text-3xl font-bold mb-12">How It Works</h2>

            <div className="grid grid-cols-1 py-15 md:grid-cols-3 gap-12">

              {/* STEP 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="bg-teal-700 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-xl">
                  <User className="text-white" />
                </div>
                <div className="bg-teal-50 w-10 h-10 rounded-full flex items-center mb-4 justify-center text-xl">
                  1
                </div>
                <h3 className="font-semibold">Register your pets</h3>
                <p className="text-gray-600 mt-2 max-w-xs">
                  Create profiles for your pets with their medical history and
                  important information all in one secure place.
                </p>
              </div>

              {/* STEP 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="bg-teal-700 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-xl">
                  <MapPin className="text-white" />
                </div>
                <div className="bg-teal-50 w-10 h-10 rounded-full flex items-center mb-4 justify-center text-xl">
                  2
                </div>
                <h3 className="font-semibold">Find available clinics</h3>
                <p className="text-gray-600 mt-2 max-w-xs">
                  Search by location, services, and real-time availability to find
                  the right clinic for your needs.
                </p>
              </div>

              {/* STEP 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="bg-teal-700 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-xl">
                  <Calendar className="text-white" />
                </div>
                <div className="bg-teal-50 w-10 h-10 rounded-full flex items-center mb-4 justify-center text-xl">
                  3
                </div>
                <h3 className="font-semibold">Book or report emergencies</h3>
                <p className="text-gray-600 mt-2 max-w-xs">
                  Schedule appointments or quickly report animal emergencies to the official
                  Animal Patrol.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 3 - Emergency CTA con el MISMO TAMAÑO que el Section 1 */}
        <section className="w-full border-y border-gray-200 bg-[#fff4f4] py-15">
          <div className="max-w-6xl mx-auto text-center px-4">
            <div className="mx-auto max-w-3xl p-8 border border-[#ffd9d9] text-center bg-[#fffdfd] rounded-lg shadow-lg">

              <div className="flex h-16 items-center justify-center">
                <div className="bg-orange-500 rounded-full p-3 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-black" />
                </div>
              </div>

              <div>
                <h2 className="mb-2 text-2xl font-bold md:text-3xl">Need help right now?</h2>
                <p className="text-pretty text-muted-foreground leading-relaxed">
                  Access 24/7 emergency clinics or report an animal in danger to the official Animal Patrol program.
                </p>
              </div>

              <div className="mt-6">
                <Link
                  href="/emergency"
                  className="bg-orange-500 hover:bg-orange-600 inline-flex items-center justify-center px-6 py-3 text-lg font-semibold rounded-lg transition"
                >
                  <Siren className="mr-2 h-5 w-5" />
                  Access Emergency Services
                </Link>
              </div>

            </div>
          </div>
        </section>


      </div>
    </>
  );
}
