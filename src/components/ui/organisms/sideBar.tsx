"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logoBasw.svg";
import {
  Home,
  Hospital,
  Siren,
  Menu,
  X,
  User as UserIcon,
  LogIn,
  UserPlus,
} from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <>
      {/* HAMBURGUESA (MÓVIL) */}
      {!open && (
        <button
          className="md:hidden fixed top-4 left-4 z-50
                     bg-white/80 backdrop-blur-md
                     text-slate-800
                     border border-slate-200
                     p-2 rounded-xl shadow"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      )}

      {/* OVERLAY MOBILE */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-50
          bg-white/80 backdrop-blur-md
          text-slate-800
          border-r border-slate-200
          p-6 pb-28
          w-70 md:w-[250px]
          flex flex-col shadow-xl
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* CERRAR MOBILE */}
        <button
          className="md:hidden absolute top-4 right-4 text-slate-800"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <X size={22} />
        </button>

        {/* LOGO */}
        <div className="flex items-center gap-2 px-2 py-1 mt-2">
          <Image
            src={logo}
            alt="VetConnect Logo"
            className="w-9 h-9 object-contain"
            priority
          />
        </div>

        {/* LINKS */}
        <nav className="flex flex-col gap-2 mt-6">
          <Link
            href="/"
            className="flex items-center gap-3 p-3 rounded-xl
                       hover:bg-slate-100 transition"
          >
            <Home size={18} />
            <span>Home</span>
          </Link>

          <Link
            href="/clinic"
            className="flex items-center gap-3 p-3 rounded-xl
                       hover:bg-slate-100 transition"
          >
            <Hospital size={18} />
            <span>Clinic</span>
          </Link>

          <Link
            href="/emergency"
            className="flex items-center gap-3 p-3 rounded-xl
                       hover:bg-slate-100 transition"
          >
            <Siren size={18} />
            <span>Emergency</span>
          </Link>
        </nav>

        {/* SEPARADOR */}
        <div className="border-t border-slate-200 my-4" />

        {/* USER MENU */}
        <div className="absolute bottom-6 left-0 w-full px-6">
          <button
            onClick={() => setUserOpen(!userOpen)}
            className="w-full
                       bg-slate-100
                       p-3 rounded-xl
                       flex items-center justify-between
                       hover:bg-slate-200 transition"
          >
            <div className="flex items-center gap-3">
              <UserIcon size={18} />
              <span>User</span>
            </div>

            <svg
              className={`w-4 h-4 transition-transform ${
                userOpen ? "rotate-180" : ""
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {/* MENU OPTIONS */}
          {userOpen && (
            <div
              className="mt-3
                         bg-white
                         border border-slate-200
                         rounded-xl
                         shadow-lg
                         p-3 flex flex-col gap-2"
            >
              <Link
                href="/user"
                className="flex items-center gap-2 p-2 rounded-lg
                           hover:bg-slate-100 transition"
              >
                <UserIcon size={16} />
                <span>Profile</span>
              </Link>

              <Link
                href="/login"
                className="flex items-center gap-2 p-2 rounded-lg
                           hover:bg-slate-100 transition"
              >
                <LogIn size={16} />
                <span>Sign in</span>
              </Link>

              <Link
                href="/register"
                className="flex items-center gap-2 p-2 rounded-lg
                           hover:bg-slate-100 transition"
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
