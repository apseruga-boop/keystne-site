"use client";

import React from "react";
import Link from "next/link";

export default function KeystneFooter() {
  return (
    <footer className="bg-[#070707] text-white">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-2xl font-semibold tracking-tight">keystne</div>
            <div className="mt-3 max-w-xl text-sm text-white/65">
              We believe in redefining property experiences — turning complex
              transactions into moments of clarity, trust, and lasting value.
            </div>
          </div>

          <div className="grid gap-3 text-sm text-white/70 md:text-right">
            <Link className="hover:text-white" href="/concierge">
              Concierge
            </Link>
            <Link className="hover:text-white" href="/communities">
              Discover Communities
            </Link>
            <Link className="hover:text-white" href="/investments">
              Investments
            </Link>
            <Link className="hover:text-white" href="/long-term">
              Long-Term
            </Link>
            <Link className="hover:text-white" href="/property-management">
              Property Management
            </Link>
            <Link className="hover:text-white" href="/about">
              About
            </Link>
            <a className="hover:text-white" href="#contact">
              Contact
            </a>
          </div>
        </div>

        <div className="mt-10 text-[11px] text-white/45">
          © {new Date().getFullYear()} Keystne. All rights reserved.
        </div>
        <div className="mt-2 text-[11px] text-white/35">
          Keystne Real Estate — Registered in Dubai (details to be added).
        </div>
      </div>
    </footer>
  );
}
