import React from "react";
import KeystneNav from "../../components/site/KeystneNav";
import KeystneFooter from "../../components/site/KeystneFooter";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ksBlack text-ksOffWhite">
      <KeystneNav />
      <main className="mx-auto max-w-6xl px-4 pt-28 pb-16">
        <div className="text-[11px] tracking-[0.22em] text-white/55">ABOUT</div>
        <h1 className="mt-2 text-4xl font-semibold">
          Premium service. Serious network.
        </h1>
        <p className="mt-4 max-w-3xl text-white/70">
          Next: we paste the credentials from your deck and make this page feel
          like a luxury brand story.
        </p>
      </main>
      <KeystneFooter />
    </div>
  );
}
