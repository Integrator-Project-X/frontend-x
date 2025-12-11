"use client"

import Link from "next/link"
import { Heart } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="text-xl font-semibold">VetConnect</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/clinics" className="text-sm font-medium transition-colors hover:text-primary">
            Clinics
          </Link>
          <Link
            href="/emergencies"
            className="text-sm font-medium text-[var(--emergency)] transition-colors hover:opacity-80"
          >
            24/7 Emergencies
          </Link>
          <Link href="/login" className="text-sm font-medium transition-colors hover:text-primary">
            Log in
          </Link>
        </nav>

          <Link href="/register">Sign up</Link>
        

        <div className="flex items-center gap-2 md:hidden">
          
            <Link href="/register">Sign up</Link>
          
        </div>
      </div>
    </header>
  )
}
