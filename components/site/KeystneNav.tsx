"use client";

import React from "react";
import Link from "next/link";

export default function KeystneNav() {
  return (
    <div className="fixed left-0 right-0 top-0 z-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-4 flex items-center justify-between rounded-[26px] border border-white/10 bg-black/55 px-4 py-2.5 text-white backdrop-blur-xl">
          {/* Left: logo + wordmark */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              {/* Put your logo in /public/keystne-logo.png */}
              <img
                src="/keystne-logo.png"
                alt="keystne"
                className="h-8 w-8 rounded-xl object-contain"
              />
              <div className="leading-tight">
                <div className="text-[15px] tracking-[0.02em]">keystne</div>
              </div>
            </div>
          </Link>

          {/* Right: menu */}
          <nav className="hidden items-center gap-5 text-[12px] tracking-[0.08em] text-white/85 md:flex">
            <Link className="hover:text-white" href="/concierge">
              Concierge
            </Link>
            <Link className="hover:text-white" href="/communities">
              Discover Dubai communities
            </Link>
            <Link className="hover:text-white" href="/investments">
              Investments
            </Link>
            <Link className="hover:text-white" href="/leasing">
              Long term rentals
            </Link>
            <Link className="hover:text-white" href="/management">
              Property management
            </Link>
            <Link className="hover:text-white" href="/about">
              About
            </Link>
          </nav>

          {/* Mobile: minimal */}
          <div className="md:hidden">
            <Link
              href="/concierge"
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[11px]"
            >
              Concierge
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
