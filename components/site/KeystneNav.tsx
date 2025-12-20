"use client";

import React from "react";
import Link from "next/link";

export default function KeystneNav() {
  return (
    <div className="fixed left-0 right-0 top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className="ks-glass rounded-3xl px-4 py-3 shadow-ks">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-white/10" />
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-wide">
                  keystne
                </div>
                <div className="text-[11px] text-white/60">
                  Real Estate • Dubai
                </div>
              </div>
            </Link>

            <div className="hidden items-center gap-6 text-[12px] text-white/70 md:flex">
              <Link className="hover:text-white" href="/concierge">
                Concierge
              </Link>
              <Link className="hover:text-white" href="/communities">
                Communities
              </Link>
              <Link className="hover:text-white" href="/investments">
                Investments
              </Link>
              <Link className="hover:text-white" href="/leasing">
                Leasing
              </Link>
              <Link className="hover:text-white" href="/management">
                Management
              </Link>
              <Link className="hover:text-white" href="/about">
                About
              </Link>
            </div>

            <Link
              href="#contact"
              className="ks-btn-gold ks-gold-ring rounded-2xl bg-black/40 px-4 py-2 text-[12px] text-ksWhite hover:bg-black/55"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
