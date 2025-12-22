"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import KeystneNav from "../../components/site/KeystneNav";
import KeystneFooter from "../../components/site/KeystneFooter";
import { CONTACT } from "../../components/site/config";

function mailtoFor(reason: string) {
  const to = CONTACT.emailArthur;
  const cc = CONTACT.emailStuart;

  const subject = encodeURIComponent(`Keystne enquiry — ${reason}`);
  const body = encodeURIComponent(
    `Hi Keystne team,\n\nI'm interested in: ${reason}\n\nName:\nPhone:\nPreferred contact time:\nDetails:\n\nThank you`
  );

  return `mailto:${to}?cc=${cc}&subject=${subject}&body=${body}`;
}

function ContactDock() {
  return (
    <div
      id="contact"
      className="fixed bottom-5 right-5 z-40 w-[220px] overflow-hidden rounded-[22px] border border-black/10 bg-white/85 shadow-ks backdrop-blur-xl"
    >
      <div className="p-2">
        <a
          className="ks-btn-gold ks-gold-ring flex items-center justify-center rounded-2xl bg-black px-3 py-3 text-[12px] text-white hover:bg-black/90"
          href={CONTACT.whatsappLink}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp us
        </a>

        <div className="mt-2 grid gap-1">
          <a
            className="rounded-2xl px-3 py-2 text-[12px] text-black/80 hover:bg-black/5"
            href={CONTACT.phoneTel}
          >
            Call
          </a>
          <a
            className="rounded-2xl px-3 py-2 text-[12px] text-black/80 hover:bg-black/5"
            href={CONTACT.telegramLink}
            target="_blank"
            rel="noreferrer"
          >
            Telegram
          </a>
          <a
            className="rounded-2xl px-3 py-2 text-[12px] text-black/80 hover:bg-black/5"
            href={mailtoFor("Concierge")}
          >
            Email
          </a>

          <div className="rounded-2xl px-3 py-2 text-[11px] text-black/55">
            {CONTACT.wechatText}
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-black/10 bg-white px-3 py-3">
          <div className="text-[10px] tracking-[0.22em] text-black/55">
            DIRECT
          </div>
          <div className="mt-1 text-sm font-semibold text-black">
            {CONTACT.phoneDisplay}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConciergePage() {
  const heroMail = useMemo(() => mailtoFor("Concierge (Relocation)"), []);

  return (
    <div className="min-h-screen bg-ksBlack text-ksWhite">
      <KeystneNav />

      {/* HERO */}
      <section className="relative overflow-hidden bg-ksBlack">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-28">
          <div className="text-[11px] tracking-[0.22em] text-white/55">
            CONCIERGE
          </div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-6xl">
            A personal journey from viewing to keys.
          </h1>
          <p className="mt-4 max-w-3xl text-white/70 md:text-lg">
            You find a property you love — we handle the journey end-to-end:
            arranging travel, building the itinerary, scheduling viewings,
            guiding you through documentation, and supporting you through the
            full purchase process in Dubai, personally.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={heroMail}
              className="ks-btn-gold ks-gold-ring inline-flex items-center justify-center rounded-2xl bg-black/55 px-6 py-4 text-sm hover:bg-black/70"
            >
              Start with concierge →
            </a>

            <Link
              href="/investments"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-sm hover:bg-white/15"
            >
              Explore investments
            </Link>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-ksBlack">
        <div className="mx-auto max-w-6xl px-4 pb-16">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                k: "Step 01",
                t: "Discovery & profiling",
                d: "We understand your budget, timeline, goals, and non-negotiables.",
              },
              {
                k: "Step 02",
                t: "Travel & itinerary",
                d: "We coordinate flights, stays, transport, and a viewing schedule.",
              },
              {
                k: "Step 03",
                t: "Viewings to completion",
                d: "We guide negotiation, paperwork, and completion with full clarity.",
              },
            ].map((x) => (
              <div
                key={x.k}
                className="rounded-[28px] border border-white/10 bg-white/5 p-6"
              >
                <div className="text-[11px] tracking-[0.18em] text-white/55">
                  {x.k}
                </div>
                <div className="mt-2 text-lg font-semibold text-ksWhite">
                  {x.t}
                </div>
                <div className="mt-2 text-sm text-white/70">{x.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <KeystneFooter />
      <ContactDock />
    </div>
  );
}
