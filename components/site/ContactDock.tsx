"use client";

import React from "react";
import { CONTACT } from "../site/config";

const GOLD = "#C8A45D";

function mailtoFor(reason: string) {
  const to = CONTACT.emailArthur;
  const cc = CONTACT.emailStuart;

  const subject = encodeURIComponent(`Keystne enquiry — ${reason}`);
  const body = encodeURIComponent(
    `Hi Keystne team,\n\nI'm interested in: ${reason}\n\nName:\nPhone:\nPreferred contact time:\nDetails:\n\nThank you`
  );

  return `mailto:${to}?cc=${cc}&subject=${subject}&body=${body}`;
}

export default function ContactDock() {
  const itemBase =
    "flex items-center justify-between rounded-2xl px-3 py-2 text-[12px] font-semibold transition";

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[240px] overflow-hidden rounded-[22px] border border-black/10 bg-white/90 shadow-ks backdrop-blur-xl">
      <div className="p-2">
        {/* WhatsApp */}
        <a
          className={`${itemBase} bg-black text-white hover:bg-[${GOLD}] hover:text-black`}
          href={CONTACT.whatsappLink}
          target="_blank"
          rel="noreferrer"
        >
          <span>WhatsApp</span>
          <span className="opacity-70">↗</span>
        </a>

        <div className="mt-2 grid gap-1">
          {/* Book a call (email template for now, as agreed - no CRM) */}
          <a
            className={`${itemBase} text-black/85 hover:bg-[${GOLD}] hover:text-black`}
            href={mailtoFor("Book a call")}
          >
            <span>Book a call</span>
            <span className="opacity-70">→</span>
          </a>

          {/* Telegram */}
          <a
            className={`${itemBase} text-black/85 hover:bg-[${GOLD}] hover:text-black`}
            href={CONTACT.telegramLink}
            target="_blank"
            rel="noreferrer"
          >
            <span>Telegram</span>
            <span className="opacity-70">↗</span>
          </a>

          {/* Email */}
          <a
            className={`${itemBase} text-black/85 hover:bg-[${GOLD}] hover:text-black`}
            href={mailtoFor("General enquiry")}
          >
            <span>Email</span>
            <span className="opacity-70">→</span>
          </a>

          {/* WeChat ID */}
          <div
            className={`${itemBase} text-black/65 hover:bg-[${GOLD}] hover:text-black`}
          >
            <span>WeChat ID</span>
            <span className="text-black/85">keystne</span>
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
