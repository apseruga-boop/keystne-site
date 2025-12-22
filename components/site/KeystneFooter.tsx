"use client";

import React from "react";

export default function KeystneFooter() {
  return (
    <footer className="bg-[#070707] text-white">
      <div className="mx-auto max-w-6xl px-4 py-14">
        {/* Minimal, premium top row */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold tracking-wide">keystne</div>
            <div className="mt-2 text-[11px] tracking-[0.22em] text-white/55">
              DUBAI • REAL ESTATE
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-white/70">
            <a className="hover:text-white" href="/concierge">
              Concierge
            </a>
            <a className="hover:text-white" href="/investments">
              Investments
            </a>
            <a className="hover:text-white" href="/leasing">
              Leasing
            </a>
            <a className="hover:text-white" href="/management">
              Management
            </a>
            <a className="hover:text-white" href="/about">
              About
            </a>
          </div>
        </div>

        {/* Rights + Legal (legal BELOW all rights reserved) */}
        <div className="mt-10 text-[11px] text-white/45">
          © {new Date().getFullYear()} Keystne. All rights reserved.
        </div>

        <div className="mt-2 text-[11px] text-white/35">
          Registered in Dubai (details on request). Terms &amp; Conditions
          apply.
        </div>

        {/* Statement alone at the bottom */}
        <div className="mt-10 border-t border-white/10 pt-10">
          <div className="text-center text-sm text-white/70">
            We believe in redefining property experiences — turning complex
            transactions into moments of clarity, trust, and lasting value.
          </div>
        </div>
      </div>
    </footer>
  );
}
