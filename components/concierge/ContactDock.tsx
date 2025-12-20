"use client";

import React from "react";
import { CONTACT } from "../site/config";

function mailtoFor(reason: string) {
  const to = CONTACT.emailArthur;
  const cc = CONTACT.emailStuart;

  const subject = encodeURIComponent(`Keystne enquiry — ${reason}`);
  const body = encodeURIComponent(
    `Hi Keystne team,\n\nI'm interested in: ${reason}\n\nName:\nPhone:\nPreferred contact time:\nDetails:\n\nThank you`
  );

  return `mailto:${to}?cc=${cc}&subject=${subject}&body=${body}`;
}

export default function ContactDock({
  onBookCall,
  onOpenLead,
  reason = "Concierge (Relocation)",
}: {
  onBookCall?: () => void;
  onOpenLead?: () => void;
  reason?: string;
}) {
  const handleBook = () => {
    if (onBookCall) return onBookCall();
    if (onOpenLead) return onOpenLead();
    // fallback: open email if no handlers wired yet
    window.location.href = mailtoFor(reason);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 w-[240px]">
      <div className="overflow-hidden rounded-[22px] border border-white/10 bg-black/70 shadow-ks backdrop-blur-xl">
        {/* Premium CTA (WhatsApp) */}
        <div className="p-2">
          <a
            href={CONTACT.whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="group relative block overflow-hidden rounded-2xl border border-[#C8A45D]/45 bg-black/60 px-4 py-3 text-center text-[12px] font-semibold text-[#F7F3EA] hover:bg-black/75"
          >
            <span className="relative z-10">WhatsApp us</span>
            <span className="absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-[#C8A45D]/35 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[ksShimmer_900ms_ease-out_1]" />
          </a>

          {/* Actions */}
          <div className="mt-2 grid gap-1">
            <a
              href={CONTACT.phoneTel}
              className="rounded-2xl px-4 py-2 text-[12px] text-white/80 hover:bg-white/5"
            >
              Call
            </a>

            <a
              href={CONTACT.telegramLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl px-4 py-2 text-[12px] text-white/80 hover:bg-white/5"
            >
              Telegram
            </a>

            <a
              href={mailtoFor(reason)}
              className="rounded-2xl px-4 py-2 text-[12px] text-white/80 hover:bg-white/5"
            >
              Email
            </a>

            <button
              type="button"
              onClick={handleBook}
              className="rounded-2xl px-4 py-2 text-left text-[12px] text-white/80 hover:bg-white/5"
            >
              Book a call
            </button>

            <div className="rounded-2xl px-4 py-2 text-[11px] text-white/55">
              {CONTACT.wechatText}
            </div>
          </div>

          {/* Direct number block */}
          <div className="mt-3 rounded-2xl border border-[#C8A45D]/35 bg-black/60 px-4 py-3">
            <div className="text-[10px] tracking-[0.22em] text-white/55">
              DIRECT
            </div>
            <div className="mt-1 text-sm font-semibold text-[#F7F3EA]">
              {CONTACT.phoneDisplay}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
