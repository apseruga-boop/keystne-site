"use client";

import React, { useMemo, useState } from "react";
import KeystneNav from "../../components/site/KeystneNav";
import KeystneFooter from "../../components/site/KeystneFooter";
import { CONTACT, MEDIA, DUBAI_AREAS } from "../../components/site/config";
import { IconArrowRight } from "../../components/site/Icons";

function mailtoFor(reason: string) {
  const to = CONTACT.emailArthur;
  const cc = CONTACT.emailStuart;

  const subject = encodeURIComponent(`Keystne enquiry — ${reason}`);
  const body = encodeURIComponent(
    `Hi Keystne team,\n\nI'm interested in: ${reason}\n\nName:\nPhone:\nPreferred contact time:\nDetails:\n\nThank you`
  );

  return `mailto:${to}?cc=${cc}&subject=${subject}&body=${body}`;
}

export default function ConciergePage() {
  const [area, setArea] = useState("");
  const [budget, setBudget] = useState("8–15k AED");
  const [timeline, setTimeline] = useState("ASAP");

  const mail = useMemo(() => mailtoFor("Concierge (Relocation)"), []);

  return (
    <div className="min-h-screen bg-[var(--ks-black)] text-white">
      <KeystneNav />

      {/* HERO */}
      <section className="relative min-h-[82vh] overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          src={MEDIA.concierge}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 to-[var(--ks-black)]" />

        <div className="relative mx-auto flex min-h-[82vh] max-w-6xl flex-col justify-end px-4 pb-14 pt-28">
          <div className="ks-glass rounded-[28px] p-8 shadow-ks">
            <div className="text-[11px] tracking-[0.22em] text-white/70">
              keystne.dubai
            </div>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
              Concierge, done personally.
            </h1>

            <p className="mt-4 text-base text-white/70 md:text-lg">
              You see a home you like — we handle the journey end-to-end:
              planning your Dubai visit, arranging viewings, guiding the buying
              process, and supporting you right through to ownership.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={mail}
                className="inline-flex items-center justify-center rounded-2xl px-6 py-4 text-sm ks-btn-gold"
              >
                Start concierge <span className="ml-2">→</span>
              </a>

              <a
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl px-6 py-4 text-sm ks-btn-ghost"
              >
                WhatsApp us <span className="ml-2">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK PREVIEW (simple now, we’ll make it “premium dynamic” next) */}
      <section className="bg-[var(--ks-black)]">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="text-[11px] tracking-[0.22em] text-white/55">
            QUICK PREVIEW
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Tell us your direction — we’ll design the trip.
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="text-[11px] tracking-[0.18em] text-white/55">
                AREA
              </div>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm outline-none"
              >
                <option value="">Select…</option>
                {DUBAI_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              <div className="mt-2 text-[11px] text-white/55">
                If unsure, leave blank — we’ll recommend.
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="text-[11px] tracking-[0.18em] text-white/55">
                BUDGET
              </div>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm outline-none"
              >
                <option>{"< 8k AED"}</option>
                <option>{"8–15k AED"}</option>
                <option>{"15–25k AED"}</option>
                <option>{"25k+ AED"}</option>
              </select>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="text-[11px] tracking-[0.18em] text-white/55">
                TIMELINE
              </div>
              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm outline-none"
              >
                <option>ASAP</option>
                <option>1 month</option>
                <option>2 months</option>
                <option>6 months</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <a
              href={mailtoFor(
                `Concierge (Relocation) — Area: ${
                  area || "TBD"
                } | Budget: ${budget} | Timeline: ${timeline}`
              )}
              className="inline-flex items-center justify-center rounded-2xl px-6 py-4 text-sm ks-btn-gold"
            >
              Get my concierge plan <IconArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <KeystneFooter />
    </div>
  );
}
