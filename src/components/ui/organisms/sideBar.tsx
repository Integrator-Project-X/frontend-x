"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logoBasw.svg"
import { Home, Hospital, ShoppingCart, Siren, Menu, X, User as UserIcon, LogIn, UserPlus } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <>
      {/* HAMBURGUESA (solo móvil) */}
      {!open && (
        <button
          className="md:hidden fixed top-4 left-4 z-50 bg-neutral-900 text-white p-2 rounded-lg shadow"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      )}

      {/* OVERLAY MOBILE */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-50 bg-neutral-900 text-white p-6 pb-28
          w-72 md:w-[250px] flex flex-col shadow-xl
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* CERRAR MOBILE */}
        <button
          className="md:hidden absolute top-4 right-4 text-white"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <X size={22} />
        </button>

        <div className="flex items-center justify-start gap-2 px-2 py-1 mt-2">
          <Image
            src={logo}
            alt="VetConnect Logo"
            className="w-9 h-9 object-contain"
            priority
          />
        </div>

        {/* LINKS */}
        <nav className="flex flex-col gap-2 mt-4">
          <Link href="/" className="flex items-center gap-3 p-3 hover:bg-neutral-800 rounded-lg">
            <Home size={18} /><span>Home</span>
          </Link>

          <Link href="/clinic" className="flex items-center gap-3 p-3 hover:bg-neutral-800 rounded-lg">
            <Hospital size={18} /><span>Clinic</span>
          </Link>

          <Link href="/product" className="flex items-center gap-3 p-3 hover:bg-neutral-800 rounded-lg">
            <ShoppingCart size={18} /><span>Product</span>
          </Link>

          <Link href="/emergency" className="flex items-center gap-3 p-3 hover:bg-neutral-800 rounded-lg">
            <Siren size={18} /><span>Emergency</span>
          </Link>
        </nav>

        {/* SEPARADOR */}
        <div className="border-t border-neutral-800 my-2" />

        {/* USER MENU ALWAYS AT BOTTOM */}
        <div className="absolute bottom-6 left-0 w-full px-6">
          <button
            onClick={() => setUserOpen(!userOpen)}
            className="w-full bg-neutral-800 p-3 rounded-lg flex items-center justify-between hover:bg-neutral-700"
          >
            <div className="flex items-center gap-3">
              <UserIcon size={18} />
              <span>User</span>
            </div>

            <svg
              className={`w-4 h-4 transform transition-transform ${userOpen ? "rotate-180" : ""
                }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6"></path>
            </svg>
          </button>

          {/* MENU OPTIONS */}
          {userOpen && (
            <div className="mt-3 bg-neutral-800 border border-neutral-700 rounded-lg p-3 flex flex-col gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-2 p-2 rounded hover:bg-neutral-700"
              >
                <UserIcon size={16} />
                <span>Profile</span>
              </Link>

              <Link
                href="/login"
                className="flex items-center gap-2 p-2 rounded hover:bg-neutral-700"
              >
                <LogIn size={16} />
                <span>Sign in</span>
              </Link>

              <Link
                href="/register"
                className="flex items-center gap-2 p-2 rounded hover:bg-neutral-700"
              >
                <UserPlus size={16} />
                <span>Sign up</span>
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
