"use client";

import React from "react";
import Link from "next/link";

export default function KeystneFooter() {
  return (
    <footer className="bg-[#070707] text-white">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <div className="text-lg font-semibold tracking-wide">keystne</div>
            <div className="mt-3 max-w-md text-sm text-white/65">
              We believe in redefining property experiences — turning complex
              transactions into moments of clarity, trust, and lasting value.
            </div>
          </div>

          <div className="grid gap-3 text-sm text-white/70">
            <div className="text-[11px] tracking-[0.18em] text-white/55">
              NAVIGATION
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link className="hover:text-[var(--ks-gold)]" href="/concierge">
                Concierge
              </Link>
              <Link className="hover:text-[var(--ks-gold)]" href="/communities">
                Discover Dubai communities
              </Link>
              <Link className="hover:text-[var(--ks-gold)]" href="/investments">
                Investments
              </Link>
              <Link className="hover:text-[var(--ks-gold)]" href="/leasing">
                Long term rentals
              </Link>
              <Link className="hover:text-[var(--ks-gold)]" href="/management">
                Property management
              </Link>
              <Link className="hover:text-[var(--ks-gold)]" href="/about">
                About
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 text-[11px] text-white/45">
          © {new Date().getFullYear()} Keystne. All rights reserved.
        </div>

        <div className="mt-2 text-[11px] text-white/35">
          Keystne is registered in Dubai (UAE). Terms &amp; conditions apply.
        </div>
      </div>
    </footer>
  );
}
