"use client";

import React, { useMemo, useState } from "react";
import Modal from "../site/Modal";
import { buildMailto, isValidEmail, sanitizePhone } from "../site/mailto";
import { CONTACT } from "../site/config";
import { IconArrowRight, IconCheck } from "../site/Icons";

type ContactWhen = "ASAP" | "1 month" | "2 months" | "6 months";
type Channel =
  | "Call"
  | "WhatsApp"
  | "Telegram"
  | "WeChat"
  | "Email"
  | "Book a call";

export type ConciergePrefill = {
  country?: string;
  relocationDate?: string;
  household?: string;
  kids?: string;
  area?: string;
  budgetBand?: string;
  estWeeks?: number;
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  right,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium tracking-wide text-white/70">
        {label}
      </div>
      <div
        className={[
          "flex items-center gap-2 rounded-2xl border px-3 py-2",
          "bg-white/5 backdrop-blur-xl",
          error ? "border-red-500/40" : "border-white/10",
        ].join(" ")}
      >
        <input
          value={value}
          type={type}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-ksOffWhite outline-none placeholder:text-white/35"
        />
        {right}
      </div>
      {error ? (
        <div className="text-[11px] text-red-400/90">{error}</div>
      ) : null}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium tracking-wide text-white/70">
        {label}
      </div>
      <div
        className={[
          "rounded-2xl border px-3 py-2 bg-white/5 backdrop-blur-xl",
          error ? "border-red-500/40" : "border-white/10",
        ].join(" ")}
      >
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-ksOffWhite outline-none"
        >
          <option value="">Select…</option>
          {options.map((o) => (
            <option key={o} value={o} className="text-black">
              {o}
            </option>
          ))}
        </select>
      </div>
      {error ? (
        <div className="text-[11px] text-red-400/90">{error}</div>
      ) : null}
    </div>
  );
}

export default function ConciergeLeadModal({
  open,
  onClose,
  prefill,
  onRequestBooking,
}: {
  open: boolean;
  onClose: () => void;
  prefill?: ConciergePrefill;
  onRequestBooking: (lead: {
    name: string;
    email: string;
    phone: string;
    when: ContactWhen;
    channel: Channel;
    notes: string;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");
  const [phone, setPhone] = useState("");
  const [when, setWhen] = useState<ContactWhen>("ASAP");
  const [channel, setChannel] = useState<Channel>("Book a call");
  const [notes, setNotes] = useState("");

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Enter your name.";
    if (!email.trim()) e.email = "Enter your email.";
    else if (!isValidEmail(email)) e.email = "Email looks incorrect.";
    if (!email2.trim()) e.email2 = "Confirm your email.";
    else if (email2.trim() !== email.trim()) e.email2 = "Emails do not match.";
    if (!phone.trim()) e.phone = "Enter your phone number.";
    return e;
  }, [name, email, email2, phone]);

  const canSubmit = Object.keys(errors).length === 0;

  const prefillLine = () => {
    if (!prefill) return "";
    const parts = [
      prefill.country ? `Country: ${prefill.country}` : null,
      prefill.household ? `Household: ${prefill.household}` : null,
      prefill.kids ? `Kids: ${prefill.kids}` : null,
      prefill.relocationDate
        ? `Relocation date: ${prefill.relocationDate}`
        : null,
      prefill.area ? `Preferred area: ${prefill.area}` : null,
      prefill.budgetBand ? `Budget band: ${prefill.budgetBand}` : null,
      typeof prefill.estWeeks === "number"
        ? `Estimated timeline: ~${prefill.estWeeks} weeks`
        : null,
    ].filter(Boolean);
    return parts.length
      ? `\n\n--- Calculator snapshot ---\n${parts.join("\n")}\n`
      : "";
  };

  const submit = () => {
    const cleanPhone = sanitizePhone(phone);

    const body =
      `Hi Keystne team,\n\n` +
      `I’d like help with: Concierge (Relocation / Viewing Trip)\n\n` +
      `My details:\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Phone: ${cleanPhone}\n\n` +
      `Preferred contact: ${channel}\n` +
      `When: ${when}\n\n` +
      `Notes:\n${notes || "-"}\n` +
      prefillLine() +
      `\nThanks,\n${name}\n`;

    if (channel === "Book a call" && when === "ASAP") {
      onRequestBooking({
        name,
        email,
        phone: cleanPhone,
        when,
        channel,
        notes: body,
      });
      return;
    }

    const mailto = buildMailto({
      to: [CONTACT.emailArthur, CONTACT.emailStuart],
      subject: "Keystne Concierge Enquiry",
      body,
    });

    window.location.href = mailto;
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Concierge enquiry"
      subtitle="Premium, personal support — we’ll respond directly."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Full name"
          value={name}
          onChange={setName}
          placeholder="Your name"
          error={errors.name}
        />

        <Field
          label="Phone (include country code)"
          value={phone}
          onChange={(v) => setPhone(sanitizePhone(v))}
          placeholder="+971…"
          error={errors.phone}
        />

        <Field
          label="Email"
          value={email}
          onChange={setEmail}
          placeholder="you@email.com"
          error={errors.email}
          right={
            email && isValidEmail(email) ? (
              <IconCheck className="h-4 w-4 text-[#C8A45D]" />
            ) : null
          }
        />

        <Field
          label="Confirm email"
          value={email2}
          onChange={setEmail2}
          placeholder="Repeat email"
          error={errors.email2}
          right={
            email2 && email2 === email ? (
              <IconCheck className="h-4 w-4 text-[#C8A45D]" />
            ) : null
          }
        />

        <Select
          label="When should we contact you?"
          value={when}
          onChange={(v) => setWhen(v as ContactWhen)}
          options={["ASAP", "1 month", "2 months", "6 months"]}
        />

        <Select
          label="Preferred channel"
          value={channel}
          onChange={(v) => setChannel(v as Channel)}
          options={[
            "Book a call",
            "Call",
            "WhatsApp",
            "Telegram",
            "WeChat",
            "Email",
          ]}
        />

        <div className="md:col-span-2">
          <div className="text-xs font-medium tracking-wide text-white/70">
            Notes (optional)
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tell us what you need, your timeline, and any priorities."
            className="mt-1 h-28 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-ksOffWhite outline-none placeholder:text-white/35"
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-[11px] text-white/55">
            We use your info only to respond to this request.
          </div>

          <button
            onClick={submit}
            disabled={!canSubmit}
            className={[
              "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm transition",
              "border border-[#C8A45D]/45 bg-black/50 hover:bg-black/65",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            ].join(" ")}
          >
            {channel === "Book a call" && when === "ASAP" ? (
              <>
                Choose a time <IconArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                Email Keystne <IconArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
