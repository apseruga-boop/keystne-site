"use client";

import React from "react";

export default function KeystneFooter() {
  return (
    <footer className="bg-[#070707] text-white">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="text-2xl font-semibold tracking-tight">keystne</div>

        <div className="mt-3 max-w-2xl text-sm text-white/70">
          We believe in redefining property experiences — turning complex
          transactions into moments of clarity, trust, and lasting value.
        </div>

        <div className="mt-10 text-[11px] text-white/35">
          Keystne Real Estate — Registered in Dubai (details to be added).
        </div>

        {/* LAST line */}
        <div className="mt-3 text-[11px] text-white/45">
          © {new Date().getFullYear()} Keystne. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
