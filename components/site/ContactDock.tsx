"use client";

import React, { useState } from "react";
import { CONTACT } from "../site/config";
import { IconCalendar, IconMail, IconMessage, IconPhone } from "../site/Icons";

export default function ContactDock({
  onEnquire
}: {
  onEnquire: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-[55]">
      <div className="flex flex-col items-end gap-2">
        {open ? (
          <div className="w-[260px] overflow-hidden rounded-[22px] border border-white/10 bg-black/75 shadow-ks backdrop-blur-xl">
            <div className="p-2">
              <a
                href={CONTACT.phoneTel}
                className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm text-ksOffWhite hover:bg-white/10"
              >
                <IconPhone className="h-4 w-4" />
                Call
              </a>

              <a
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm text-ksOffWhite hover:bg-white/10"
              >
                <IconMessage className="h-4 w-4" />
                WhatsApp
              </a>

              <a
                href={CONTACT.telegramLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm text-ksOffWhite hover:bg-white/10"
              >
                <IconMessage className="h-4 w-4" />
                Telegram
              </a>

              <button
                onClick={onEnquire}
                className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm text-ksOffWhite hover:bg-white/10"
              >
                <IconCalendar className="h-4 w-4" />
                Book a call
              </button>

              <button
                onClick={onEnquire}
                className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm text-ksOffWhite hover:bg-white/10"
              >
                <IconMail className="h-4 w-4" />
                Email
              </button>

              <div className="px-3 py-2 text-[11px] text-white/55">
                WeChat: <span className="text-[#C8A45D]">keystne</span>
              </div>
            </div>

            <div className="border-t border-white/10 p-3">
              <div className="text-[11px] text-white/55">Direct</div>
              <div className="text-sm font-semibold text-ksOffWhite">
                {CONTACT.phoneDisplay}
              </div>
            </div>
          </div>
        ) : null}

        <button
          onClick={() => setOpen((v) => !v)}
          className={[
            "inline-flex items-center gap-2 rounded-[18px] px-4 py-3 text-sm transition",
            "border border-[#C8A45D]/45 bg-black/70 text-ksOffWhite shadow-ks hover:bg-black/85"
          ].join(" ")}
        >
          <span className="inline-block h-2 w-2 rounded-full bg-[#C8A45D]" />
          Contact
        </button>
      </div>
    </div>
  );
}

