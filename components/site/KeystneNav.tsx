"use client";

import React from "react";
import Link from "next/link";

const GOLD = "#C8A45D";

export default function KeystneNav() {
  return (
    <div className="fixed left-0 right-0 top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className="flex items-center justify-between rounded-[28px] border border-white/10 bg-black/70 px-5 py-4 text-white shadow-ks backdrop-blur-xl">
          {/* BRAND */}
          <Link href="/" className="leading-none">
            <div
              className="font-semibold tracking-tight"
              style={{ fontSize: "42px", lineHeight: "1" }}
            >
              keystne
            </div>
          </Link>

          {/* NAV */}
          <nav className="hidden items-center gap-7 md:flex">
            {[
              ["Concierge", "/concierge"],
              ["Discover Communities", "/communities"],
              ["Investments", "/investments"],
              ["Long-Term", "/long-term"],
              ["Property Management", "/property-management"],
              ["About", "/about"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="font-semibold transition"
                style={{ fontSize: "18px" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile (no Contact) */}
          <div className="md:hidden" />
        </div>
      </div>
    </div>
  );
}
