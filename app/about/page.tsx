"use client";

import React, { useMemo, useState } from "react";
import KeystneNav from "../../components/site/KeystneNav";
import KeystneFooter from "../../components/site/KeystneFooter";
import { CONTACT } from "../../components/site/config";

/* =========================
   Helpers
========================= */
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function buildMailto(args: { subject: string; body: string }) {
  const to = CONTACT.emailArthur;
  const cc = CONTACT.emailStuart;
  const subject = encodeURIComponent(args.subject);
  const body = encodeURIComponent(args.body);
  return `mailto:${to}?cc=${cc}&subject=${subject}&body=${body}`;
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function formatLocalSlot(d: Date) {
  // Simple readable string: Tue 16 Jan, 14:30
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}, ${pad2(
    d.getHours()
  )}:${pad2(d.getMinutes())}`;
}

/* =========================
   Inline icons (NO lucide-react)
========================= */
function Icon({
  name,
  className = "h-4 w-4",
}: {
  name:
    | "whatsapp"
    | "phone"
    | "telegram"
    | "mail"
    | "arrow"
    | "check"
    | "x"
    | "spark"
    | "shield"
    | "doc"
    | "wrench"
    | "calendar";
  className?: string;
}) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
  };
  switch (name) {
    case "arrow":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M5 12h12" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      );
    case "check":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M20 6L9 17l-5-5" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </svg>
      );
    case "phone":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M22 16.5v3a2 2 0 0 1-2.2 2c-9.6-.8-17-8.2-17.8-17.8A2 2 0 0 1 4 1.5h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9c1.6 3.1 4.1 5.6 7.2 7.2l1.1-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" />
        </svg>
      );
    case "mail":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M4 4h16v16H4z" />
          <path d="M4 6l8 6 8-6" />
        </svg>
      );
    case "telegram":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M22 2L11 13" />
          <path d="M22 2L15 22l-4-9-9-4 20-7z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M20 11.5a8.5 8.5 0 0 1-12.7 7.4L4 20l1.2-3.1A8.5 8.5 0 1 1 20 11.5z" />
          <path d="M9.5 9.5c.3 2.4 2.6 4.8 5.2 5.2" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M12 2l1.2 5.1L18 9l-4.8 1.9L12 16l-1.2-5.1L6 9l4.8-1.9L12 2z" />
          <path d="M19 14l.8 3.2L23 18l-3.2.8L19 22l-.8-3.2L15 18l3.2-.8L19 14z" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M12 2l8 4v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4z" />
          <path d="M9 12l2 2 4-5" />
        </svg>
      );
    case "doc":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M7 3h7l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
          <path d="M14 3v4h4" />
        </svg>
      );
    case "wrench":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M14.7 6.3a4 4 0 0 0-5.6 5.6l-6 6a2 2 0 1 0 2.8 2.8l6-6a4 4 0 0 0 5.6-5.6l-2 2-2.8-2.8 2-2z" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M7 2v3M17 2v3" />
          <path d="M3 8h18" />
          <path d="M5 5h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
          <path d="M7 12h4M7 16h6" />
        </svg>
      );
    default:
      return null;
  }
}

/* =========================
   UI primitives
========================= */
function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  widthClass = "max-w-4xl",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  widthClass?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 md:items-center">
      <button
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close backdrop"
      />
      <div
        className={`relative w-full overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-ks ${widthClass}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-black/10 p-5">
          <div>
            <div className="text-base font-semibold tracking-tight text-black">
              {title}
            </div>
            {subtitle ? (
              <div className="mt-1 text-xs text-black/55">{subtitle}</div>
            ) : null}
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl px-3 py-2 text-[12px] font-semibold text-black/70 hover:bg-black/5"
          >
            Close
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function FieldShell({
  label,
  hint,
  required,
  error,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-end justify-between gap-3">
        <label className="text-xs font-semibold tracking-wide text-black/70">
          {label} {required ? <span className="text-black/35">*</span> : null}
        </label>
        {hint ? <div className="text-[11px] text-black/45">{hint}</div> : null}
      </div>
      <div
        className={`rounded-2xl border bg-white px-3 py-3 shadow-sm ${
          error ? "border-red-400/60" : "border-black/10"
        }`}
      >
        {children}
      </div>
      {error ? (
        <div className="text-[11px] text-red-600/85">{error}</div>
      ) : null}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/30"
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent text-sm text-black outline-none"
    >
      <option value="">Select…</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function Segmented({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value === o;
        return (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`rounded-full px-3 py-2 text-[12px] font-semibold transition ${
              active
                ? "bg-[#C8A45D] text-black"
                : "bg-black/5 text-black/70 hover:bg-black/10"
            }`}
            type="button"
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

/* =========================
   Contact Dock (same as other pages)
========================= */
function ContactDock({ onContact }: { onContact: () => void }) {
  return (
    <div className="fixed bottom-5 right-5 z-40 w-[240px] overflow-hidden rounded-[22px] border border-black/10 bg-white/90 shadow-ks backdrop-blur-xl">
      <div className="p-2">
        <button
          onClick={onContact}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#C8A45D] px-3 py-3 text-[12px] font-semibold text-black hover:brightness-110"
          type="button"
        >
          <Icon name="spark" className="h-4 w-4" />
          Contact us
        </button>

        <div className="mt-2 grid gap-1">
          <a
            className="flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] font-semibold text-black/75 hover:bg-[#C8A45D] hover:text-black"
            href={CONTACT.whatsappLink}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="whatsapp" /> WhatsApp
          </a>
          <a
            className="flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] font-semibold text-black/75 hover:bg-[#C8A45D] hover:text-black"
            href={CONTACT.phoneTel}
          >
            <Icon name="phone" /> Call
          </a>
          <a
            className="flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] font-semibold text-black/75 hover:bg-[#C8A45D] hover:text-black"
            href={CONTACT.telegramLink}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="telegram" /> Telegram
          </a>
          <a
            className="flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] font-semibold text-black/75 hover:bg-[#C8A45D] hover:text-black"
            href={buildMailto({
              subject: "Keystne enquiry",
              body: "Hi Keystne team,\n\nI’d like to enquire about your services.\n\nName:\nPhone:\nWhat I need:\nTimeline:\n\nThank you",
            })}
          >
            <Icon name="mail" /> Email
          </a>
          <div className="flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] font-semibold text-black/55">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-black/20 text-[10px] font-bold">
              W
            </span>
            {CONTACT.wechatText || "WeChat ID: keystne"}
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-black/10 bg-black px-3 py-3">
          <div className="text-[10px] tracking-[0.22em] text-white/60">
            DIRECT
          </div>
          <div className="mt-1 text-sm font-semibold text-white">
            {CONTACT.phoneDisplay}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Meeting slots (simple client-side)
   NOTE: This is lead-gen scheduling preference.
========================= */
function generateSlots(daysAhead = 10) {
  const slots: Date[] = [];
  const now = new Date();

  for (let d = 0; d < daysAhead; d++) {
    const day = new Date(now);
    day.setDate(now.getDate() + d);

    // hours: 10:00, 12:00, 14:00, 16:00, 18:00
    const hours = [10, 12, 14, 16, 18];
    for (const h of hours) {
      const slot = new Date(day);
      slot.setHours(h, 0, 0, 0);
      // Skip slots in the past
      if (slot.getTime() > now.getTime() + 30 * 60 * 1000) slots.push(slot);
    }
  }
  return slots;
}

/* =========================
   Service definitions (4)
========================= */
const SERVICES = [
  {
    id: "concierge",
    title: "Concierge & Relocation",
    icon: "shield" as const,
    prompt:
      "Relocation / concierge support (visas, set-up, onboarding, lifestyle).",
    emailSubject: "Keystne — Concierge & Relocation enquiry",
    emailTemplate: [
      "Hi Keystne team,",
      "",
      "I’d like support with Concierge & Relocation.",
      "",
      "Name:",
      "Phone:",
      "Current country:",
      "Target move date:",
      "What you need help with (visa / set-up / schools / transport / etc):",
      "",
      "Thank you,",
    ].join("\n"),
  },
  {
    id: "invest",
    title: "Invest With Clarity",
    icon: "spark" as const,
    prompt:
      "Investment support (location selection, strategy options, due diligence guidance).",
    emailSubject: "Keystne — Investment enquiry",
    emailTemplate: [
      "Hi Keystne team,",
      "",
      "I’d like support with investing in Dubai.",
      "",
      "Name:",
      "Phone:",
      "Budget / deposit range:",
      "Preferred communities:",
      "Strategy preference (long-term / short-term / mixed):",
      "Timeline:",
      "",
      "Thank you,",
    ].join("\n"),
  },
  {
    id: "rentals",
    title: "Long-Term Rentals",
    icon: "doc" as const,
    prompt:
      "Long-term rental support (finding, viewings, contract support, move-in coordination).",
    emailSubject: "Keystne — Long-term rentals enquiry",
    emailTemplate: [
      "Hi Keystne team,",
      "",
      "I’d like support with a long-term rental in Dubai.",
      "",
      "Name:",
      "Phone:",
      "Current country:",
      "Move-in date:",
      "Preferred areas:",
      "Budget range:",
      "Bedrooms:",
      "",
      "Thank you,",
    ].join("\n"),
  },
  {
    id: "management",
    title: "Property Management",
    icon: "wrench" as const,
    prompt:
      "Premium property management (tenants, rent collection, inspections, maintenance, reporting).",
    emailSubject: "Keystne — Property management enquiry",
    emailTemplate: [
      "Hi Keystne team,",
      "",
      "I’d like support with property management.",
      "",
      "Name:",
      "Phone:",
      "Property/community:",
      "Property type:",
      "Tenancy status (vacant / tenanted / not sure):",
      "When to start:",
      "",
      "Thank you,",
    ].join("\n"),
  },
];

type ContactForm = {
  serviceId: string;
  name: string;
  email: string;
  email2: string;
  phone: string;
  preferredChannel: string;
  notes: string;
  meetingChoice: string; // formatted slot or ""
};

function ContactModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"email" | "meeting" | "call" | "whatsapp">(
    "email"
  );

  const [form, setForm] = useState<ContactForm>({
    serviceId: "",
    name: "",
    email: "",
    email2: "",
    phone: "",
    preferredChannel: "WhatsApp",
    notes: "",
    meetingChoice: "",
  });

  const service = useMemo(
    () => SERVICES.find((s) => s.id === form.serviceId) || null,
    [form.serviceId]
  );
  const slots = useMemo(() => generateSlots(12), []);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!form.serviceId) e.serviceId = "Select a service.";
    if (!form.name.trim()) e.name = "Add your name.";
    if (!form.phone.trim()) e.phone = "Add your phone (with country code).";
    if (!form.email.trim()) e.email = "Add your email.";
    else if (!isValidEmail(form.email)) e.email = "Email looks incorrect.";
    if (!form.email2.trim()) e.email2 = "Confirm your email.";
    else if (form.email2.trim() !== form.email.trim())
      e.email2 = "Emails do not match.";
    if (mode === "meeting" && !form.meetingChoice)
      e.meetingChoice = "Pick a time slot.";
    return e;
  }, [form, mode]);

  const canProceed = Object.keys(errors).length === 0;

  const buildBody = () => {
    const header =
      service?.emailTemplate ||
      "Hi Keystne team,\n\nI’d like to enquire.\n\nThank you";
    const lines = [
      header,
      "",
      "—",
      `Service: ${service?.title || ""}`,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email}`,
      `Preferred contact: ${form.preferredChannel}`,
      mode === "meeting"
        ? `Meeting slot preference: ${form.meetingChoice}`
        : "",
      form.notes.trim() ? `Notes:\n${form.notes.trim()}` : "Notes: (none)",
      "",
      "This message was generated from keystne.com (About → Contact).",
    ].filter(Boolean);

    return lines.join("\n");
  };

  const openEmail = () => {
    if (!service) return;
    window.location.href = buildMailto({
      subject: service.emailSubject,
      body: buildBody(),
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Contact Keystne"
      subtitle="Choose the service → pick how you want to reach us."
      widthClass="max-w-5xl"
    >
      <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
        {/* Left: service + mode */}
        <div className="space-y-5">
          <div className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm">
            <div className="text-[11px] tracking-[0.22em] text-black/55">
              STEP 1
            </div>
            <div className="mt-2 text-lg font-semibold text-black">
              What do you want to contact us about?
            </div>
            <div className="mt-3 grid gap-2">
              {SERVICES.map((s) => {
                const active = form.serviceId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, serviceId: s.id }))}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      active
                        ? "border-[#C8A45D]/70 bg-[#C8A45D]/15 text-black"
                        : "border-black/10 bg-white text-black/70 hover:bg-black/5"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl ${
                          active
                            ? "bg-[#C8A45D] text-black"
                            : "bg-black/5 text-black/70"
                        }`}
                      >
                        <Icon name={s.icon} />
                      </span>
                      {s.title}
                    </span>
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${
                        active
                          ? "bg-[#C8A45D] text-black"
                          : "bg-black/10 text-black/40"
                      }`}
                    >
                      <Icon
                        name={active ? "check" : "x"}
                        className="h-3.5 w-3.5"
                      />
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.serviceId ? (
              <div className="mt-2 text-[11px] text-red-600/85">
                {errors.serviceId}
              </div>
            ) : null}
          </div>

          <div className="rounded-[28px] border border-black/10 bg-black p-5 text-white shadow-sm">
            <div className="text-[11px] tracking-[0.22em] text-white/55">
              STEP 2
            </div>
            <div className="mt-2 text-lg font-semibold">
              How do you want to reach us?
            </div>

            <div className="mt-4 grid gap-2">
              {[
                {
                  id: "email",
                  label: "Email (pre-written)",
                  icon: "mail" as const,
                },
                {
                  id: "meeting",
                  label: "Set up a meeting",
                  icon: "calendar" as const,
                },
                { id: "call", label: "Call us", icon: "phone" as const },
                {
                  id: "whatsapp",
                  label: "WhatsApp us",
                  icon: "whatsapp" as const,
                },
              ].map((m) => {
                const active = mode === (m.id as any);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id as any)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      active
                        ? "border-white/20 bg-white/10 text-white"
                        : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon name={m.icon} /> {m.label}
                    </span>
                    <Icon name="arrow" className="h-4 w-4" />
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
              {service ? (
                <>
                  <div className="text-xs tracking-[0.22em] text-white/55">
                    SELECTED SERVICE
                  </div>
                  <div className="mt-2 font-semibold text-white">
                    {service.title}
                  </div>
                  <div className="mt-2 text-white/75">{service.prompt}</div>
                </>
              ) : (
                <div className="text-white/75">
                  Select a service to generate a tailored message.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: form + action */}
        <div className="space-y-5">
          <div className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm">
            <div className="text-[11px] tracking-[0.22em] text-black/55">
              YOUR DETAILS
            </div>
            <div className="mt-2 text-lg font-semibold text-black">
              So we can respond properly.
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <FieldShell label="Full name" required error={errors.name}>
                <TextInput
                  value={form.name}
                  onChange={(v) => setForm((p) => ({ ...p, name: v }))}
                  placeholder="Your name"
                />
              </FieldShell>

              <FieldShell
                label="Phone (with country code)"
                required
                error={errors.phone}
              >
                <TextInput
                  value={form.phone}
                  onChange={(v) => setForm((p) => ({ ...p, phone: v }))}
                  placeholder="+971… / +44…"
                />
              </FieldShell>

              <FieldShell label="Email" required error={errors.email}>
                <TextInput
                  value={form.email}
                  onChange={(v) => setForm((p) => ({ ...p, email: v }))}
                  placeholder="name@email.com"
                />
              </FieldShell>

              <FieldShell label="Confirm email" required error={errors.email2}>
                <TextInput
                  value={form.email2}
                  onChange={(v) => setForm((p) => ({ ...p, email2: v }))}
                  placeholder="Repeat email"
                />
              </FieldShell>

              <div className="md:col-span-2">
                <FieldShell label="Preferred contact channel" required>
                  <Segmented
                    value={form.preferredChannel}
                    onChange={(v) =>
                      setForm((p) => ({ ...p, preferredChannel: v }))
                    }
                    options={["WhatsApp", "Call", "Email"]}
                  />
                </FieldShell>
              </div>

              {mode === "meeting" ? (
                <div className="md:col-span-2">
                  <FieldShell
                    label="Pick a meeting time"
                    required
                    error={errors.meetingChoice}
                    hint="This is a preference. We’ll confirm by email/WhatsApp."
                  >
                    <select
                      value={form.meetingChoice}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          meetingChoice: e.target.value,
                        }))
                      }
                      className="w-full bg-transparent text-sm text-black outline-none"
                    >
                      <option value="">Select…</option>
                      {slots.slice(0, 20).map((d) => (
                        <option
                          key={d.toISOString()}
                          value={formatLocalSlot(d)}
                        >
                          {formatLocalSlot(d)}
                        </option>
                      ))}
                    </select>
                  </FieldShell>
                </div>
              ) : null}

              <div className="md:col-span-2">
                <FieldShell
                  label="Notes (optional)"
                  hint="Be specific — helps us respond faster."
                >
                  <textarea
                    value={form.notes}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, notes: e.target.value }))
                    }
                    placeholder="What do you need, what’s your timeline, preferred areas, budget, etc."
                    className="h-28 w-full resize-none bg-transparent text-sm text-black outline-none placeholder:text-black/30"
                  />
                </FieldShell>
              </div>
            </div>
          </div>

          {/* Action area */}
          <div className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm">
            <div className="text-[11px] tracking-[0.22em] text-black/55">
              NEXT
            </div>
            <div className="mt-2 text-lg font-semibold text-black">
              Proceed in one click.
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  if (!canProceed) return;
                  if (mode === "call") window.location.href = CONTACT.phoneTel;
                  else if (mode === "whatsapp")
                    window.open(CONTACT.whatsappLink, "_blank", "noreferrer");
                  else openEmail(); // email + meeting both generate email lead
                }}
                disabled={!canProceed}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-semibold transition ${
                  canProceed
                    ? "bg-[#C8A45D] text-black hover:brightness-110"
                    : "bg-black/10 text-black/35 cursor-not-allowed"
                }`}
              >
                {mode === "call"
                  ? "Call now"
                  : mode === "whatsapp"
                  ? "Open WhatsApp"
                  : "Open pre-written email"}
                <Icon name="arrow" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm font-semibold text-black/70 hover:bg-black/5"
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-black/10 bg-black/[0.03] p-4 text-[12px] text-black/65">
              <div className="font-semibold text-black">Lead-gen note</div>
              <div className="mt-1">
                Email routes to <span className="font-semibold">Arthur</span>{" "}
                and <span className="font-semibold">Stuart</span> automatically.
                If you choose “Set up a meeting”, we’ll confirm the slot with
                you via your preferred channel.
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* =========================
   About Page
========================= */
export default function AboutPage() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* NAV WRAPPER (white pill) */}
      <div className="fixed left-0 right-0 top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 pt-4">
          <div className="rounded-[28px] border border-black/10 bg-white/95 shadow-ks backdrop-blur">
            <KeystneNav />
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-32">
          <div className="max-w-4xl">
            <div className="text-[11px] tracking-[0.22em] text-black/55">
              ABOUT
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-black md:text-6xl">
              Keystone is premium property support — built for speed, clarity
              and trust.
            </h1>
            <p className="mt-5 max-w-3xl text-base text-black/70 md:text-lg">
              We help clients move, rent, invest, and manage property in Dubai
              with a clean process, strong standards, and one point of
              accountability.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setContactOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C8A45D] px-6 py-4 text-sm font-semibold text-black hover:brightness-110"
                type="button"
              >
                Contact us <Icon name="arrow" />
              </button>

              <a
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-semibold text-black/70 hover:bg-black/5"
              >
                WhatsApp <Icon name="whatsapp" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-10">
          <div className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[28px] border border-black/10 bg-white p-7 shadow-sm">
              <div className="text-[11px] tracking-[0.22em] text-black/55">
                WHO WE ARE
              </div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                A boutique team with a simple promise.
              </h2>
              <p className="mt-4 text-sm text-black/65">
                Keystone is designed for clients who want premium execution
                without the drama. We keep everything clean: clear options,
                clear timelines, and the right support at every step.
              </p>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {[
                  {
                    title: "Clarity first",
                    desc: "We simplify decisions and make next steps obvious.",
                    icon: "spark" as const,
                  },
                  {
                    title: "High standards",
                    desc: "Quality checks, good partners, tidy documentation.",
                    icon: "shield" as const,
                  },
                  {
                    title: "One point of contact",
                    desc: "You always know who owns the outcome.",
                    icon: "check" as const,
                  },
                ].map((x) => (
                  <div
                    key={x.title}
                    className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-black/5 text-black/70">
                        <Icon name={x.icon} />
                      </span>
                      <div className="text-sm font-semibold text-black">
                        {x.title}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-black/65">{x.desc}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.03] p-4 text-sm text-black/70">
                <div className="font-semibold text-black">What we’re not</div>
                <div className="mt-1">
                  We’re not a marketplace with random listings. We’re a premium
                  service model — guided, structured, and built for outcomes.
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-black/10 bg-black p-7 text-white shadow-sm">
              <div className="text-[11px] tracking-[0.22em] text-white/55">
                FOCUS
              </div>
              <div className="mt-2 text-2xl font-semibold tracking-tight">
                Lead generation with real value.
              </div>
              <div className="mt-3 text-sm text-white/75">
                Everything on the site is designed to help you choose a path
                quickly — then we move fast on the details.
              </div>

              <div className="mt-6 space-y-3">
                {[
                  "Fast response: we aim to reply quickly via your preferred channel.",
                  "Clean information: fewer forms, better questions, better outcomes.",
                  "Premium experience: clear steps, minimal friction.",
                ].map((x) => (
                  <div
                    key={x}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <span className="mt-[2px] inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#C8A45D] text-black">
                      <Icon name="check" className="h-4 w-4" />
                    </span>
                    <div className="text-sm text-white/80">{x}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setContactOpen(true)}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90"
                type="button"
              >
                Contact us <Icon name="arrow" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO (4 services) */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-14">
          <div className="rounded-[28px] border border-black/10 bg-white p-7 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-[11px] tracking-[0.22em] text-black/55">
                  WHAT WE DO
                </div>
                <h3 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                  Four services. One premium standard.
                </h3>
                <p className="mt-3 max-w-3xl text-sm text-black/65">
                  Choose a path — we’ll tailor the next steps and respond with a
                  clean plan.
                </p>
              </div>
              <button
                onClick={() => setContactOpen(true)}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/90 md:mt-0"
                type="button"
              >
                Contact us <Icon name="arrow" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {SERVICES.map((s) => (
                <div
                  key={s.id}
                  className="relative overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-ks"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] via-transparent to-[#C8A45D]/10" />
                  <div className="relative p-6">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black/5 text-black/70">
                        <Icon name={s.icon} />
                      </div>
                      <button
                        onClick={() => setContactOpen(true)}
                        className="inline-flex items-center gap-2 rounded-full bg-[#C8A45D] px-4 py-2 text-[12px] font-semibold text-black hover:brightness-110"
                        type="button"
                      >
                        Enquire <Icon name="arrow" className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-4 text-lg font-semibold text-black">
                      {s.title}
                    </div>
                    <div className="mt-2 text-sm text-black/70">{s.prompt}</div>

                    <div className="mt-4 rounded-2xl border border-black/10 bg-black/[0.03] p-4 text-[12px] text-black/65">
                      This path will open a pre-written email and optional
                      meeting preferences.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 text-[12px] text-black/55">
            Disclaimer: Keystone provides property services and operational
            support. Where third parties are involved (e.g., brokers,
            maintenance providers), we coordinate and confirm next steps with
            you. All timelines and availability depend on market conditions.
          </div>
        </div>
      </section>

      <KeystneFooter />

      {/* Floating contact dock */}
      <ContactDock onContact={() => setContactOpen(true)} />

      {/* Contact modal */}
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
