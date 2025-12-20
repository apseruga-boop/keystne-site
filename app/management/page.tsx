import React from "react";
import KeystneNav from "../../components/site/KeystneNav";
import KeystneFooter from "../../components/site/KeystneFooter";

export default function ManagementPage() {
  return (
    <div className="min-h-screen bg-ksBlack text-ksOffWhite">
      <KeystneNav />
      <main className="mx-auto max-w-6xl px-4 pt-28 pb-16">
        <div className="text-[11px] tracking-[0.22em] text-white/55">
          MANAGEMENT
        </div>
        <h1 className="mt-2 text-4xl font-semibold">
          Property management, elevated.
        </h1>
        <p className="mt-4 max-w-3xl text-white/70">
          Next we’ll build: services grid + “management platform” section +
          performance levers.
        </p>
      </main>
      <KeystneFooter />
    </div>
  );
}
