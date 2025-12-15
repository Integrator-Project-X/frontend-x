import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-6 flex flex-col items-center justify-center bg-gradient-to-b from-white to-orange-50">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl font-extrabold mb-4">VetConnect</h1>
        <p className="text-lg text-gray-700 mb-6">Connecting pet owners with trusted clinics and emergency services in your city.</p>

        <div className="flex items-center justify-center gap-3 mb-8">
          <Link href="/register" className="rounded-md bg-black px-5 py-3 text-white">Get Started</Link>
          <Link href="/login" className="rounded-md border px-5 py-3">Log In</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="font-semibold mb-2">Find Clinics</h3>
            <p className="text-sm text-gray-600">Search local clinics and see who accepts emergencies.</p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="font-semibold mb-2">Book Appointments</h3>
            <p className="text-sm text-gray-600">Schedule visits, vaccinations, and checkups.</p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="font-semibold mb-2">Emergency Help</h3>
            <p className="text-sm text-gray-600">Report an animal in danger or contact a 24/7 clinic.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
