"use client";

import React, { useMemo, useState } from "react";
import Modal from "../site/Modal";
import { buildMailto } from "../site/mailto";
import { CONTACT } from "../site/config";
import { IconCalendar, IconArrowRight } from "../site/Icons";

export default function BookingModal({
  open,
  onClose,
  lead,
}: {
  open: boolean;
  onClose: () => void;
  lead?: { name: string; email: string; phone: string; notes: string };
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const canConfirm = useMemo(
    () => !!date && !!time && !!lead,
    [date, time, lead]
  );

  const confirm = () => {
    if (!lead) return;

    const body =
      lead.notes +
      `\n\n--- Booking request ---\n` +
      `Preferred date: ${date}\n` +
      `Preferred time: ${time}\n` +
      `\nPlease confirm this slot or suggest alternatives.\n`;

    const mailto = buildMailto({
      to: [CONTACT.emailArthur, CONTACT.emailStuart],
      subject: "Keystne Concierge Call Booking",
      body,
    });

    window.location.href = mailto;
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Schedule your call"
      subtitle="Choose a time that works — we’ll confirm quickly."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <div className="text-xs font-medium tracking-wide text-white/70">
            Preferred date
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-ksOffWhite outline-none"
          />
        </div>

        <div className="space-y-1">
          <div className="text-xs font-medium tracking-wide text-white/70">
            Preferred time
          </div>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-ksOffWhite outline-none"
          />
        </div>

        <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-white/60">Your details</div>
          <div className="mt-2 text-sm text-white/85">
            {lead ? `${lead.name} • ${lead.email} • ${lead.phone}` : "—"}
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            onClick={confirm}
            disabled={!canConfirm}
            className={[
              "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm transition",
              "border border-[#C8A45D]/45 bg-black/50 hover:bg-black/65",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            ].join(" ")}
          >
            Confirm booking <IconCalendar className="h-4 w-4" />
          </button>
        </div>

        <div className="md:col-span-2 text-[11px] text-white/55">
          If you prefer, you can also message us on WhatsApp/Telegram from the
          contact dock.
        </div>
      </div>
    </Modal>
  );
}
