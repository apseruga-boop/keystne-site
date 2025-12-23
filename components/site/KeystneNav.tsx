"use client";

import React from "react";
import Link from "next/link";

const LINKS = [
  { href: "/concierge", label: "Concierge" },
  { href: "/communities", label: "Discover Communities" },
  { href: "/investments", label: "Investments" },
  { href: "/long-term", label: "Long-Term" },
  { href: "/Property Management", label: "Property Management" },
  { href: "/about", label: "About" },
];

export default function KeystneNav() {
  return (
    <div className="fixed left-0 right-0 top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 pt-5">
        <div className="flex items-center justify-between rounded-[26px] border border-black/10 bg-white px-5 py-3 shadow-ks">
          <Link
            href="/"
            className="text-3xl font-semibold tracking-tight text-black"
          >
            keystne
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-2 py-1 text-[16px] font-semibold text-black/80 hover:text-black hover:bg-[#C8A45D] transition"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Mobile: keep minimal (no redesign beyond consistency) */}
          <div className="md:hidden">
            <Link
              href="/contact"
              className="rounded-2xl bg-[#C8A45D] px-4 py-2 text-sm font-semibold text-black"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
