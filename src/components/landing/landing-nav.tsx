"use client";

import Link from "next/link";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2" aria-label="RegWatch home">
          <Shield className="h-6 w-6 text-blue-600" aria-hidden="true" />
          <span className="text-xl font-bold text-slate-900">RegWatch</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          <Link href="/#features" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
            Features
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
            Pricing
          </Link>
          <Link href="/auth/signin" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Get started free
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t border-slate-200 bg-white px-4 py-4 md:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-4">
            <Link href="/#features" className="text-sm font-medium text-slate-600" onClick={() => setMobileOpen(false)}>
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-slate-600" onClick={() => setMobileOpen(false)}>
              Pricing
            </Link>
            <Link href="/auth/signin" className="text-sm font-medium text-slate-600" onClick={() => setMobileOpen(false)}>
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-medium text-white"
              onClick={() => setMobileOpen(false)}
            >
              Get started free
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
