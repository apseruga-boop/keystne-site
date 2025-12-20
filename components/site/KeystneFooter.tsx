import React from "react";

export default function KeystneFooter() {
  return (
    <footer className="bg-[#070707] text-ksWhite">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-[11px] tracking-[0.22em] text-white/55">
          KEYSTNE
        </div>
        <div className="mt-3 max-w-3xl text-2xl font-semibold leading-tight md:text-3xl">
          We believe in redefining property experiences — turning complex
          transactions into moments of clarity, trust, and lasting value.
        </div>

        <div className="mt-10 text-[11px] text-white/45">
          © {new Date().getFullYear()} Keystne. All rights reserved.
        </div>

        <div className="mt-3 text-[11px] text-white/45">
          Keystne is registered in Dubai, UAE. All information on this site is
          provided for general guidance and does not constitute legal or
          financial advice.
        </div>
      </div>
    </footer>
  );
}
