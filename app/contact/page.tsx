"use client";

import React from "react";
import KeystneNav from "../../components/site/KeystneNav";
import KeystneFooter from "../../components/site/KeystneFooter";
import { CONTACT } from "../../components/site/config";
import { buildMailto } from "../../components/site/mailto";

export default function ContactPage() {
  const mailto = buildMailto({
    to: [CONTACT.emailArthur, CONTACT.emailStuart],
    subject: "Keystne enquiry",
    body: "Hi Keystne team,\n\nI’d like help with:\n- Service:\n- Timeline:\n- Budget:\n- Preferred contact method:\n\nMy details:\nName:\nPhone:\n\nThanks,",
  });

  return (
    <div className="min-h-screen bg-ksBlack text-ksOffWhite">
      <KeystneNav />
      <main className="mx-auto max-w-6xl px-4 pt-28 pb-16">
        <div className="text-[11px] tracking-[0.22em] text-white/55">
          CONTACT
        </div>
        <h1 className="mt-2 text-4xl font-semibold">Let’s talk.</h1>
        <p className="mt-4 max-w-2xl text-white/70">
          Choose your channel — we respond personally.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <a
            className="rounded-ks border border-white/10 bg-white/5 p-6 hover:bg-white/10"
            href={CONTACT.phoneTel}
          >
            <div className="text-sm font-semibold">Call</div>
            <div className="mt-1 text-sm text-white/70">
              {CONTACT.phoneDisplay}
            </div>
          </a>

          <a
            className="rounded-ks border border-white/10 bg-white/5 p-6 hover:bg-white/10"
            target="_blank"
            rel="noreferrer"
            href={CONTACT.whatsappLink}
          >
            <div className="text-sm font-semibold">WhatsApp</div>
            <div className="mt-1 text-sm text-white/70">
              Message us instantly
            </div>
          </a>

          <a
            className="rounded-ks border border-white/10 bg-white/5 p-6 hover:bg-white/10"
            target="_blank"
            rel="noreferrer"
            href={CONTACT.telegramLink}
          >
            <div className="text-sm font-semibold">Telegram</div>
            <div className="mt-1 text-sm text-white/70">@keystne</div>
          </a>

          <a
            className="rounded-ks border border-ksGold/35 bg-black/40 p-6 hover:bg-black/55"
            href={mailto}
          >
            <div className="text-sm font-semibold">Email</div>
            <div className="mt-1 text-sm text-white/70">
              {CONTACT.emailArthur} • {CONTACT.emailStuart}
            </div>
          </a>
        </div>

        <div className="mt-8 text-sm text-white/55">
          WeChat: <span className="text-ksOffWhite">{CONTACT.wechatText}</span>
        </div>
      </main>
      <KeystneFooter />
    </div>
  );
}
