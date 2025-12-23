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
    | "chart";
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
    case "chart":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M7 15l3-4 3 2 4-6" />
        </svg>
      );
    default:
      return null;
  }
}

/* =========================
   UI primitives (same style)
========================= */
function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  widthClass = "max-w-3xl",
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
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 md:items-center">
      <button
        aria-label="Close modal backdrop"
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={[
          "relative w-full overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-ks",
          widthClass,
        ].join(" ")}
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
        className={[
          "rounded-2xl border bg-white px-3 py-3 shadow-sm",
          error ? "border-red-400/60" : "border-black/10",
        ].join(" ")}
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
            className={[
              "rounded-full px-3 py-2 text-[12px] font-semibold transition",
              active
                ? "bg-[#C8A45D] text-black"
                : "bg-black/5 text-black/70 hover:bg-black/10",
            ].join(" ")}
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
   Contact dock — same as other pages
========================= */
function ContactDock() {
  return (
    <div className="fixed bottom-5 right-5 z-40 w-[240px] overflow-hidden rounded-[22px] border border-black/10 bg-white/90 shadow-ks backdrop-blur-xl">
      <div className="p-2">
        <a
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#C8A45D] px-3 py-3 text-[12px] font-semibold text-black hover:brightness-110"
          href={CONTACT.whatsappLink}
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="whatsapp" className="h-4 w-4" /> WhatsApp us
        </a>

        <div className="mt-2 grid gap-1">
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
              subject: "Keystne enquiry — Property management",
              body: "Hi Keystne team,\n\nI'd like to enquire about property management.\n\nName:\nPhone:\nProperty/community:\nTimeline:\nNotes:\n\nThank you",
            })}
          >
            <Icon name="mail" /> Email
          </a>
          <div className="flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] font-semibold text-black/55">
            {/* Keep WeChat line if your CONTACT config has it; fallback included */}
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
   Page: Property Management
========================= */
const COMMUNITIES = [
  "Downtown Dubai",
  "Business Bay",
  "DIFC",
  "City Walk",
  "Dubai Marina",
  "JBR",
  "JLT",
  "Palm Jumeirah",
  "Dubai Hills Estate",
  "Arabian Ranches",
  "JVC",
  "Dubai Creek Harbour",
  "Al Barsha",
  "Mirdif",
  "The Greens",
  "The Views",
  "Arabian Ranches 2",
  "Dubai South",
  "Dubai Silicon Oasis",
  "Motor City",
];

const PROPERTY_TYPES = [
  "Apartment",
  "Townhouse",
  "Villa",
  "Penthouse",
  "Mixed / not sure",
];

type LeadForm = {
  name: string;
  email: string;
  email2: string;
  phone: string;
  community: string;
  propertyType: string;
  bedrooms: string;
  status: string;
  startWhen: string;
  services: string[];
  notes: string;
  preferredChannel: string;
};

const SERVICE_TILES: Array<{
  id: string;
  title: string;
  desc: string;
  bullets: string[];
  icon: React.ComponentProps<typeof Icon>["name"];
}> = [
  {
    id: "tenant-placement",
    title: "Tenant placement (premium)",
    desc: "Marketing, viewings, screening, and a clean handover — without the noise.",
    bullets: [
      "Listing + enquiries",
      "Screening & selection",
      "Move-in coordination",
    ],
    icon: "spark",
  },
  {
    id: "rent-collection",
    title: "Rent collection + owner reporting",
    desc: "Reliable collection, reminders, and clear reporting you can actually use.",
    bullets: [
      "Collection & follow-up",
      "Owner statements",
      "Simple annual summary",
    ],
    icon: "chart",
  },
  {
    id: "maintenance",
    title: "Maintenance + repairs coordination",
    desc: "Fast response. Quality trades. Minimal disruption to your tenant.",
    bullets: ["Issue logging", "Quotes + approvals", "Completion confirmation"],
    icon: "wrench",
  },
  {
    id: "inspections",
    title: "Routine inspections",
    desc: "Protect condition, spot issues early, and keep standards high.",
    bullets: ["Scheduled checks", "Photo notes", "Action list + follow-up"],
    icon: "shield",
  },
  {
    id: "contracts",
    title: "Contracts + renewals support",
    desc: "Renewals, notices, and admin kept tidy — with a clear timeline.",
    bullets: ["Renewal reminders", "Documentation support", "Tenant comms"],
    icon: "doc",
  },
  {
    id: "utilities-compliance",
    title: "Utilities + compliance support",
    desc: "We help coordinate the practical bits that keep everything moving.",
    bullets: [
      "Move-in/out coordination",
      "Utility activation support",
      "Compliance checks (where relevant)",
    ],
    icon: "check",
  },
];

function ServiceModal({
  open,
  onClose,
  tile,
  onStart,
}: {
  open: boolean;
  onClose: () => void;
  tile: (typeof SERVICE_TILES)[number] | null;
  onStart: () => void;
}) {
  if (!tile) return null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={tile.title}
      subtitle="Quick overview (premium + clean)."
      widthClass="max-w-2xl"
    >
      <div className="grid gap-4">
        <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-4 text-sm text-black/70">
          {tile.desc}
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <div className="text-[11px] tracking-[0.22em] text-black/55">
            WHAT’S INCLUDED
          </div>
          <ul className="mt-3 space-y-2 text-sm text-black/75">
            {tile.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#C8A45D] text-black">
                  <Icon name="check" className="h-3.5 w-3.5" />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black/70 hover:bg-black/5"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C8A45D] px-5 py-3 text-sm font-semibold text-black hover:brightness-110"
          >
            Request this service <Icon name="arrow" />
          </button>
        </div>
      </div>
    </Modal>
  );
}

function LeadModal({
  open,
  onClose,
  presetServices,
  title = "Request property management",
}: {
  open: boolean;
  onClose: () => void;
  presetServices?: string[];
  title?: string;
}) {
  const [form, setForm] = useState<LeadForm>({
    name: "",
    email: "",
    email2: "",
    phone: "",
    community: "",
    propertyType: "",
    bedrooms: "",
    status: "",
    startWhen: "",
    services: presetServices || [],
    notes: "",
    preferredChannel: "WhatsApp",
  });

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Add your name.";
    if (!form.phone.trim()) e.phone = "Add your phone (with country code).";
    if (!form.email.trim()) e.email = "Add your email.";
    else if (!isValidEmail(form.email)) e.email = "Email looks incorrect.";
    if (!form.email2.trim()) e.email2 = "Confirm your email.";
    else if (form.email2.trim() !== form.email.trim())
      e.email2 = "Emails do not match.";

    if (!form.community) e.community = "Select a community.";
    if (!form.propertyType) e.propertyType = "Select a property type.";
    if (!form.bedrooms) e.bedrooms = "Select bedrooms.";
    if (!form.status) e.status = "Select property status.";
    if (!form.startWhen) e.startWhen = "Select a start timeline.";
    if (!form.services.length) e.services = "Pick at least one service.";
    return e;
  }, [form]);

  const canSubmit = Object.keys(errors).length === 0;

  const toggleService = (s: string) => {
    setForm((p) => {
      const has = p.services.includes(s);
      return {
        ...p,
        services: has ? p.services.filter((x) => x !== s) : [...p.services, s],
      };
    });
  };

  const submit = () => {
    const body = [
      "KEYSTNE — PROPERTY MANAGEMENT LEAD",
      "",
      `Client name: ${form.name}`,
      `Client email: ${form.email}`,
      `Client phone: ${form.phone}`,
      `Preferred channel: ${form.preferredChannel}`,
      "",
      `Community: ${form.community}`,
      `Property type: ${form.propertyType}`,
      `Bedrooms: ${form.bedrooms}`,
      `Status: ${form.status}`,
      `Start timeline: ${form.startWhen}`,
      "",
      `Services requested: ${form.services.join(", ")}`,
      "",
      form.notes?.trim() ? `Notes:\n${form.notes.trim()}` : "Notes: (none)",
      "",
      "Disclaimer: This is an enquiry. Final scope and fees are confirmed after a call and property review.",
    ].join("\n");

    window.location.href = buildMailto({
      subject: "Keystne — Property management enquiry",
      body,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle="Quick details → we’ll respond fast (lead-gen)."
      widthClass="max-w-4xl"
    >
      <div className="grid gap-5 md:grid-cols-2">
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

        <div className="md:col-span-2 grid gap-4 md:grid-cols-3">
          <FieldShell label="Community" required error={errors.community}>
            <SelectInput
              value={form.community}
              onChange={(v) => setForm((p) => ({ ...p, community: v }))}
              options={COMMUNITIES}
            />
          </FieldShell>

          <FieldShell
            label="Property type"
            required
            error={errors.propertyType}
          >
            <SelectInput
              value={form.propertyType}
              onChange={(v) => setForm((p) => ({ ...p, propertyType: v }))}
              options={PROPERTY_TYPES}
            />
          </FieldShell>

          <FieldShell label="Bedrooms" required error={errors.bedrooms}>
            <SelectInput
              value={form.bedrooms}
              onChange={(v) => setForm((p) => ({ ...p, bedrooms: v }))}
              options={["Studio", "1", "2", "3", "4+"]}
            />
          </FieldShell>
        </div>

        <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
          <FieldShell label="Property status" required error={errors.status}>
            <SelectInput
              value={form.status}
              onChange={(v) => setForm((p) => ({ ...p, status: v }))}
              options={["Vacant", "Currently tenanted", "Not sure"]}
            />
          </FieldShell>

          <FieldShell
            label="When do you want us to start?"
            required
            error={errors.startWhen}
          >
            <SelectInput
              value={form.startWhen}
              onChange={(v) => setForm((p) => ({ ...p, startWhen: v }))}
              options={["ASAP", "This month", "Next 1–2 months", "3+ months"]}
            />
          </FieldShell>
        </div>

        <div className="md:col-span-2">
          <FieldShell label="Preferred contact channel" required>
            <Segmented
              value={form.preferredChannel}
              onChange={(v) => setForm((p) => ({ ...p, preferredChannel: v }))}
              options={["WhatsApp", "Call", "Email"]}
            />
          </FieldShell>
        </div>

        <div className="md:col-span-2">
          <div className="flex items-end justify-between gap-3">
            <div className="text-xs font-semibold tracking-wide text-black/70">
              Services you want <span className="text-black/35">*</span>
            </div>
            {errors.services ? (
              <div className="text-[11px] text-red-600/85">
                {errors.services}
              </div>
            ) : null}
          </div>

          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {SERVICE_TILES.map((t) => {
              const active = form.services.includes(t.title);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleService(t.title)}
                  className={[
                    "flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition",
                    active
                      ? "border-[#C8A45D]/70 bg-[#C8A45D]/15 text-black"
                      : "border-black/10 bg-white text-black/70 hover:bg-black/5",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={[
                        "inline-flex h-8 w-8 items-center justify-center rounded-2xl",
                        active
                          ? "bg-[#C8A45D] text-black"
                          : "bg-black/5 text-black/70",
                      ].join(" ")}
                    >
                      <Icon name={t.icon} />
                    </span>
                    {t.title}
                  </span>
                  <span
                    className={[
                      "inline-flex h-5 w-5 items-center justify-center rounded-full",
                      active
                        ? "bg-[#C8A45D] text-black"
                        : "bg-black/10 text-black/40",
                    ].join(" ")}
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
        </div>

        <div className="md:col-span-2">
          <FieldShell
            label="Notes (optional)"
            hint="Any specifics we should know?"
          >
            <textarea
              value={form.notes}
              onChange={(e) =>
                setForm((p) => ({ ...p, notes: e.target.value }))
              }
              placeholder="e.g., tenant issue, maintenance backlog, overseas owner, prefer monthly reporting, etc."
              className="h-28 w-full resize-none bg-transparent text-sm text-black outline-none placeholder:text-black/30"
            />
          </FieldShell>
        </div>

        <div className="md:col-span-2 rounded-2xl border border-black/10 bg-black/[0.03] p-4 text-[12px] text-black/70">
          <div className="font-semibold text-black">Note</div>
          <div className="mt-1">
            We’ll confirm scope and fees after a quick call. Timelines,
            compliance steps and utilities processes can vary by building,
            tenancy status and current requirements.
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black/70 hover:bg-black/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className={[
              "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition",
              canSubmit
                ? "bg-[#C8A45D] text-black hover:brightness-110"
                : "bg-black/10 text-black/35 cursor-not-allowed",
            ].join(" ")}
          >
            Open email <Icon name="arrow" />
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default function PropertyManagementPage() {
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [selectedTile, setSelectedTile] = useState<
    (typeof SERVICE_TILES)[number] | null
  >(null);

  const openService = (tile: (typeof SERVICE_TILES)[number]) => {
    setSelectedTile(tile);
    setServiceModalOpen(true);
  };

  const startLeadFromTile = (tile?: (typeof SERVICE_TILES)[number] | null) => {
    setServiceModalOpen(false);
    setSelectedTile(tile || null);
    setLeadOpen(true);
  };

  const presetServices = useMemo(() => {
    if (!selectedTile) return [];
    return [selectedTile.title];
  }, [selectedTile]);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* NAV WRAPPER (keeps the white pill look consistent) */}
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
              PROPERTY MANAGEMENT
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-black md:text-6xl">
              Premium management, without the headaches.
            </h1>
            <p className="mt-5 max-w-3xl text-base text-black/70 md:text-lg">
              We protect your asset, keep standards high, and give you clean
              visibility — rent, maintenance, contracts and updates — in one
              place.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  setSelectedTile(null);
                  setLeadOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C8A45D] px-6 py-4 text-sm font-semibold text-black hover:brightness-110"
              >
                Request management <Icon name="arrow" />
              </button>

              <a
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-semibold text-black/70 hover:bg-black/5"
              >
                WhatsApp us <Icon name="whatsapp" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-6">
          <div className="rounded-[28px] border border-black/10 bg-white p-7 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-[11px] tracking-[0.22em] text-black/55">
                  WHAT WE DO
                </div>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                  A complete, premium management stack.
                </h2>
                <p className="mt-3 max-w-3xl text-sm text-black/65">
                  Typical scope includes tenant placement, rent collection,
                  inspections, maintenance coordination, renewals support, and
                  admin utilities assistance — tailored to your property and how
                  hands-on you want to be.
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedTile(null);
                  setLeadOpen(true);
                }}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/90 md:mt-0"
              >
                Get a quote <Icon name="arrow" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {SERVICE_TILES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => openService(t)}
                  className="group relative overflow-hidden rounded-[28px] border border-black/10 bg-white text-left shadow-ks transition hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] via-transparent to-[#C8A45D]/10" />
                  <div className="relative p-6">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black/5 text-black/70 group-hover:bg-[#C8A45D] group-hover:text-black">
                        <Icon name={t.icon} />
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-black px-3 py-2 text-[12px] font-semibold text-white group-hover:bg-[#C8A45D] group-hover:text-black">
                        View <Icon name="arrow" className="h-4 w-4" />
                      </div>
                    </div>

                    <div className="mt-4 text-lg font-semibold text-black">
                      {t.title}
                    </div>
                    <div className="mt-2 text-sm text-black/70">{t.desc}</div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {t.bullets.slice(0, 3).map((b) => (
                        <span
                          key={b}
                          className="rounded-full border border-black/10 bg-white px-3 py-2 text-[11px] font-semibold text-black/70"
                        >
                          {b}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 text-[11px] text-black/45">
                      Tap to see details — then request a quote.
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD / PORTAL */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-12">
          <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[28px] border border-black/10 bg-white p-7 shadow-sm">
              <div className="text-[11px] tracking-[0.22em] text-black/55">
                OWNER PORTAL
              </div>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Dashboard + app access (premium experience).
              </h3>
              <p className="mt-3 text-sm text-black/65">
                Once you’re onboarded, you get access to a clean dashboard (and
                app view) so you can track the essentials: payments, contracts,
                maintenance, and property insights — without chasing updates.
              </p>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {[
                  {
                    title: "Payments",
                    desc: "Rent status, receipts, owner statements.",
                    icon: "chart" as const,
                  },
                  {
                    title: "Contracts",
                    desc: "Tenancy documents, renewals, key dates.",
                    icon: "doc" as const,
                  },
                  {
                    title: "Maintenance",
                    desc: "Requests, approvals, completion updates.",
                    icon: "wrench" as const,
                  },
                  {
                    title: "Insights",
                    desc: "High-level trends and practical prompts.",
                    icon: "spark" as const,
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

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                <button
                  onClick={() => {
                    setSelectedTile(null);
                    setLeadOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C8A45D] px-5 py-3 text-sm font-semibold text-black hover:brightness-110"
                >
                  Request access <Icon name="arrow" />
                </button>
                <a
                  href={buildMailto({
                    subject: "Keystne — Owner portal demo request",
                    body: "Hi Keystne team,\n\nPlease share a quick demo / overview of the property management dashboard + app.\n\nName:\nPhone:\nProperty/community:\nTimeline:\n\nThank you",
                  })}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black/70 hover:bg-black/5"
                >
                  Email demo request <Icon name="mail" />
                </a>
              </div>
            </div>

            <div className="rounded-[28px] border border-black/10 bg-black p-7 text-white shadow-sm">
              <div className="text-[11px] tracking-[0.22em] text-white/55">
                THE PROMISE
              </div>
              <div className="mt-2 text-2xl font-semibold tracking-tight">
                Clean operations. Clear visibility.
              </div>
              <div className="mt-3 text-sm text-white/75">
                We’re built for owners who want premium standards and fast
                response — especially overseas owners or busy professionals.
              </div>

              <div className="mt-6 space-y-3">
                {[
                  "One point of contact — no chasing multiple people.",
                  "Fast triage on issues, with clear approvals where needed.",
                  "Regular updates that are short, useful, and honest.",
                  "A tidy document trail: contracts, key dates, status.",
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

              <div className="mt-6">
                <button
                  onClick={() => {
                    setSelectedTile(null);
                    setLeadOpen(true);
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90"
                >
                  Start here (quote) <Icon name="arrow" />
                </button>
              </div>
            </div>
          </div>

          {/* FOOTNOTE / DISCLAIMER */}
          <div className="mt-6 text-[12px] text-black/55">
            Disclaimer: We provide operational support and coordination for
            property management. Final scope depends on the property, tenancy
            status, building requirements, and current regulatory/utility
            processes. We confirm assumptions on a call.
          </div>
        </div>
      </section>

      <KeystneFooter />
      <ContactDock />

      {/* Modals */}
      <ServiceModal
        open={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        tile={selectedTile}
        onStart={() => startLeadFromTile(selectedTile)}
      />
      <LeadModal
        open={leadOpen}
        onClose={() => setLeadOpen(false)}
        presetServices={presetServices}
        title={
          selectedTile
            ? `Request: ${selectedTile.title}`
            : "Request property management"
        }
      />
    </div>
  );
}
