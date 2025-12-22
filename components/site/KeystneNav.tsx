"use client";

import React from "react";
import Link from "next/link";

const GOLD = "#C8A45D";

export default function KeystneNav() {
  return (
    <div className="fixed left-0 right-0 top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className="flex items-center justify-between rounded-[28px] border border-white/10 bg-black/70 px-5 py-4 text-white shadow-ks backdrop-blur-xl">
          {/* BRAND (no logo square, just keystne) */}
          <Link href="/" className="leading-none">
            <div
              className="font-semibold tracking-tight"
              style={{
                fontSize: "42px", // ~3x
                lineHeight: "1",
              }}
            >
              keystne
            </div>
          </Link>

          {/* NAV (2 sizes bigger + bold + gold hover) */}
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

            {/* Contact (smaller) */}
            <a
              href="#contact"
              className="font-semibold transition"
              style={{ fontSize: "14px" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
            >
              Contact
            </a>
          </nav>

          {/* Mobile */}
          <a
            href="#contact"
            className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 md:hidden"
          >
            Contact
          </a>
        </div>
      </div>
    </div>
  );
}
