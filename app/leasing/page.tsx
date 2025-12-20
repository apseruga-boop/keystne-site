import React from "react";
import KeystneNav from "../../components/site/KeystneNav";
import KeystneFooter from "../../components/site/KeystneFooter";

export default function LeasingPage() {
  return (
    <div className="min-h-screen bg-ksBlack text-ksOffWhite">
      <KeystneNav />
      <main className="mx-auto max-w-6xl px-4 pt-28 pb-16">
        <div className="text-[11px] tracking-[0.22em] text-white/55">
          LEASING
        </div>
        <h1 className="mt-2 text-4xl font-semibold">
          Leasing & rentals made effortless.
        </h1>
        <p className="mt-4 max-w-3xl text-white/70">
          Next we’ll build: stay-cost calculator (duration, rooms, location
          known/unknown, budget → area recommendation).
        </p>
      </main>
      <KeystneFooter />
    </div>
  );
}
