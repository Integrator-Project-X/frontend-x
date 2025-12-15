"use client"

import Sidebar from "@/src/components/ui/organisms/sideBar";
import AddPetForm from "@/src/components/ui/organisms/AddPetForm";

export default function NewPetPage() {
  // In this demo the user is a temporary developer user
  const user = { id: "1", name: "Developer", phone: "+57 300 000 0000" };

  return (
    <div className="min-h-screen md:pl-[250px]">
      <Sidebar />
      <main className="container mx-auto px-6 py-10">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold mb-2">Add a New Pet</h1>
          <p className="text-sm text-gray-600 mb-6">Register another pet to your account.</p>

          <div className="rounded-xl border bg-white p-6">
            <AddPetForm ownerId={user.id} ownerName={user.name} ownerPhone={user.phone} />
          </div>
        </div>
      </main>
    </div>
  );
}
