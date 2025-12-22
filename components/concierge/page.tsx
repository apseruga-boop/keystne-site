"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

/**
 * app/concierge/page.tsx
 * Self-contained Concierge page (no config imports) to avoid “nothing changed” + export errors.
 *
 * Includes:
 * - Nav hides on scroll down, shows on scroll up
 * - Video hero
 * - Two concierge paths (Relocation / Curated viewing trip)
 * - Premium wizard modal (5 steps each) + summary
 * - Email summary + book call (mailto lead-gen)
 * - White contact dock with gold hover
 *
 * Colors:
 * - Gold: #C8A45D
 */

const GOLD = "#C8A45D";

// Replace these later with your real details
const CONTACT = {
  phoneDisplay: "+971 XX XXX XXXX",
  phoneTel: "tel:+971XXXXXXXXX",
  whatsappLink: "https://wa.me/971XXXXXXXXX",
  telegramLink: "https://t.me/keystne",
  wechatText: "WeChat ID: keystne",
  emailArthur: "arthur@keystne.com",
  emailStuart: "stuart@keystne.com",
};

// Replace later with your owned/licensed video
const HOME_VIDEOS = {
  hero: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
};

type ConciergeFlow = "relocation" | "viewing" | null;
type CallWhen = "ASAP" | "1 month" | "2 months" | "6 months";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function buildMailto(args: { subject: string; body: string }) {
  const to = CONTACT.emailArthur;
  const cc = CONTACT.emailStuart;
  const subject = encodeURIComponent(args.subject);
  const body = encodeURIComponent(args.body);
  return `mailto:${to}?cc=${cc}&subject=${subject}&body=${body}`;
}

/** Small inline icons (no external icon libs) */
function Icon({
  name,
  className = "h-4 w-4",
}: {
  name:
    | "whatsapp"
    | "phone"
    | "telegram"
    | "mail"
    | "calendar"
    | "wechat"
    | "arrow"
    | "check"
    | "x";
  className?: string;
}) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
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
          <path d="M4 6h16v12H4z" />
          <path d="M4 7l8 6 8-6" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <path d="M3 8h18" />
          <path d="M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
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
    case "wechat":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M8.5 11.5c-3.6 0-6.5 2.1-6.5 4.7 0 1 .4 1.9 1.1 2.7L2.5 22l3.2-1.6c.8.3 1.8.5 2.8.5 3.6 0 6.5-2.1 6.5-4.7S12.1 11.5 8.5 11.5z" />
          <path d="M15.5 2c3.6 0 6.5 2.1 6.5 4.7 0 1-.4 1.9-1.1 2.7l.6 2.9-3.2-1.6c-.8.3-1.8.5-2.8.5-3.6 0-6.5-2.1-6.5-4.7S11.9 2 15.5 2z" />
        </svg>
      );
    default:
      return null;
  }
}

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
          "relative w-full overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-2xl",
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
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
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
                ? "text-black"
                : "bg-black/5 text-black/70 hover:bg-black/10",
            ].join(" ")}
            style={active ? { backgroundColor: GOLD } : undefined}
            type="button"
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function Progress({ step, total }: { step: number; total: number }) {
  const pct = Math.round(((step + 1) / total) * 100);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] text-black/50">
        <div>
          Step <span className="font-semibold text-black/70">{step + 1}</span>{" "}
          of {total}
        </div>
        <div>{pct}%</div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: GOLD }}
        />
      </div>
    </div>
  );
}

/** White dock + gold hover */
function ContactDock() {
  return (
    <div className="fixed bottom-5 right-5 z-40 w-[240px] overflow-hidden rounded-[22px] border border-black/10 bg-white/90 shadow-2xl backdrop-blur-xl">
      <div className="p-2">
        <a
          className="flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-[12px] font-semibold text-black hover:brightness-110"
          style={{ backgroundColor: GOLD }}
          href={CONTACT.whatsappLink}
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="whatsapp" className="h-4 w-4" />
          WhatsApp us
        </a>

        <div className="mt-2 grid gap-1">
          {[
            {
              label: "Call",
              icon: "phone" as const,
              href: CONTACT.phoneTel,
              external: false,
            },
            {
              label: "Telegram",
              icon: "telegram" as const,
              href: CONTACT.telegramLink,
              external: true,
            },
            {
              label: "Email",
              icon: "mail" as const,
              href: buildMailto({
                subject: "Keystne enquiry",
                body: "Hi Keystne team,\n\nI'd like to enquire about:\n\nName:\nPhone:\nPreferred contact time:\nDetails:\n\nThank you",
              }),
              external: false,
            },
          ].map((item) => (
            <a
              key={item.label}
              className="flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] font-semibold text-black/75 hover:text-black"
              style={{}}
              onMouseEnter={(e) => (
                (e.currentTarget.style.backgroundColor = GOLD),
                (e.currentTarget.style.color = "black")
              )}
              onMouseLeave={(e) => (
                (e.currentTarget.style.backgroundColor = "transparent"),
                (e.currentTarget.style.color = "rgba(0,0,0,0.75)")
              )}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer" : undefined}
            >
              <Icon name={item.icon} />
              {item.label}
            </a>
          ))}

          <div
            className="flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] font-semibold text-black/55"
            onMouseEnter={(e) => (
              (e.currentTarget.style.backgroundColor = GOLD),
              (e.currentTarget.style.color = "black")
            )}
            onMouseLeave={(e) => (
              (e.currentTarget.style.backgroundColor = "transparent"),
              (e.currentTarget.style.color = "rgba(0,0,0,0.55)")
            )}
          >
            <Icon name="wechat" />
            {CONTACT.wechatText}
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

type Step = {
  id: string;
  title: string;
  question: string;
  render: (state: any, setState: (patch: any) => void) => React.ReactNode;
  validate: (state: any) => string | null;
};

const RELOCATION_STEPS: Step[] = [
  {
    id: "origin",
    title: "Origin & timeline",
    question: "Where are you relocating from, and when?",
    render: (s, setS) => (
      <div className="grid gap-4 md:grid-cols-2">
        <FieldShell label="Origin country" required>
          <TextInput
            value={s.originCountry}
            onChange={(v) => setS({ originCountry: v })}
            placeholder="e.g., United Kingdom"
          />
        </FieldShell>
        <FieldShell label="Timeline" required>
          <SelectInput
            value={s.timeline}
            onChange={(v) => setS({ timeline: v })}
            options={["ASAP", "1–2 months", "3–6 months", "6+ months"]}
          />
        </FieldShell>

        <div className="md:col-span-2">
          <FieldShell label="Visa direction" hint="High-level only" required>
            <Segmented
              value={s.visaDirection}
              onChange={(v) => setS({ visaDirection: v })}
              options={[
                "Need guidance",
                "Employment visa",
                "Investor visa",
                "Already resident",
              ]}
            />
          </FieldShell>
        </div>
      </div>
    ),
    validate: (s) => {
      if (!s.originCountry?.trim()) return "Please add your origin country.";
      if (!s.timeline) return "Please select your timeline.";
      if (!s.visaDirection) return "Please choose a visa direction.";
      return null;
    },
  },
  {
    id: "household",
    title: "Household",
    question: "What does your household look like?",
    render: (s, setS) => (
      <div className="grid gap-4 md:grid-cols-2">
        <FieldShell label="Household" required>
          <Segmented
            value={s.household}
            onChange={(v) => setS({ household: v })}
            options={["Single", "Couple", "Family"]}
          />
        </FieldShell>
        <FieldShell label="Children" required>
          <Segmented
            value={s.kids}
            onChange={(v) => setS({ kids: v })}
            options={["No", "Yes"]}
          />
        </FieldShell>
        <div className="md:col-span-2">
          <FieldShell label="Lifestyle preference" required>
            <Segmented
              value={s.lifestyle}
              onChange={(v) => setS({ lifestyle: v })}
              options={["City", "Coastal", "Quiet", "Mixed"]}
            />
          </FieldShell>
        </div>
      </div>
    ),
    validate: (s) => {
      if (!s.household) return "Select household type.";
      if (!s.kids) return "Select children yes/no.";
      if (!s.lifestyle) return "Select a lifestyle preference.";
      return null;
    },
  },
  {
    id: "area",
    title: "Area direction",
    question: "Do you already know your preferred area?",
    render: (s, setS) => (
      <div className="grid gap-4 md:grid-cols-2">
        <FieldShell label="Preferred area known?" required>
          <Segmented
            value={s.areaKnown}
            onChange={(v) => setS({ areaKnown: v, area: "", budgetBand: "" })}
            options={["Not sure", "Known"]}
          />
        </FieldShell>

        {s.areaKnown === "Known" ? (
          <FieldShell label="Select area" required>
            <SelectInput
              value={s.area}
              onChange={(v) => setS({ area: v })}
              options={[
                "Downtown",
                "Dubai Marina",
                "Business Bay",
                "Palm Jumeirah",
                "JBR",
                "JLT",
                "Dubai Hills",
                "Arabian Ranches",
                "JVC",
                "Creek Harbour",
                "City Walk",
                "Al Barsha",
              ]}
            />
          </FieldShell>
        ) : (
          <FieldShell label="Monthly housing comfort band" required>
            <SelectInput
              value={s.budgetBand}
              onChange={(v) => setS({ budgetBand: v })}
              options={["< 8k AED", "8–15k AED", "15–25k AED", "25k+ AED"]}
            />
          </FieldShell>
        )}

        <div className="md:col-span-2 rounded-2xl border border-black/10 bg-black/[0.03] p-4 text-sm text-black/70">
          If you’re unsure, we’ll recommend 2–4 communities that match your
          lifestyle + budget.
        </div>
      </div>
    ),
    validate: (s) => {
      if (!s.areaKnown) return "Select whether you know your area.";
      if (s.areaKnown === "Known" && !s.area) return "Select an area.";
      if (s.areaKnown === "Not sure" && !s.budgetBand)
        return "Select a budget band.";
      return null;
    },
  },
  {
    id: "cost",
    title: "Cost preview",
    question: "Optional: quick cost-of-living preview (screening only).",
    render: (s, setS) => (
      <div className="grid gap-4 md:grid-cols-2">
        <FieldShell label="Monthly take-home (current)" hint="Your currency">
          <TextInput
            value={s.currentSalary}
            onChange={(v) => setS({ currentSalary: v })}
            placeholder="e.g., 6500"
          />
        </FieldShell>
        <FieldShell
          label="Monthly fixed costs (current)"
          hint="Rent + bills + transport"
        >
          <TextInput
            value={s.currentFixed}
            onChange={(v) => setS({ currentFixed: v })}
            placeholder="e.g., 3200"
          />
        </FieldShell>
        <FieldShell
          label="Monthly discretionary (current)"
          hint="Food + lifestyle"
        >
          <TextInput
            value={s.currentDiscretionary}
            onChange={(v) => setS({ currentDiscretionary: v })}
            placeholder="e.g., 900"
          />
        </FieldShell>
        <FieldShell label="Priority">
          <Segmented
            value={s.priority}
            onChange={(v) => setS({ priority: v })}
            options={["Comfort", "Balance", "Save more"]}
          />
        </FieldShell>

        <div className="md:col-span-2 rounded-2xl border border-black/10 bg-black/[0.03] p-4">
          <div className="text-[11px] tracking-[0.22em] text-black/55">
            PREVIEW
          </div>
          <div className="mt-2 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="text-[11px] text-black/50">
                Current net after costs
              </div>
              <div className="mt-1 text-xl font-semibold text-black">
                {computeCurrentNet(s)}
              </div>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="text-[11px] text-black/50">
                Dubai monthly estimate
              </div>
              <div className="mt-1 text-xl font-semibold text-black">
                {computeDubaiEstimate(s)}
              </div>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="text-[11px] text-black/50">Suggested runway</div>
              <div className="mt-1 text-xl font-semibold text-black">
                {computeRunwayWeeks(s)}
              </div>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-black/45">
            * Indicative only (screening). We validate on the call.
          </div>
        </div>
      </div>
    ),
    validate: () => null,
  },
  {
    id: "finish",
    title: "Finish",
    question: "We generate your relocation plan summary.",
    render: (s, setS) => (
      <div className="space-y-4">
        <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-4">
          <div className="text-[11px] tracking-[0.22em] text-black/55">
            WHAT YOU GET
          </div>
          <ul className="mt-3 space-y-2 text-sm text-black/75">
            {[
              "Area shortlist aligned to your lifestyle",
              "High-level visa pathway timeline guidance",
              "Relocation plan from discovery → keys-in-hand",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full text-black"
                  style={{ backgroundColor: GOLD }}
                >
                  <Icon name="check" className="h-4 w-4" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <FieldShell label="Anything else we should know?" hint="Optional">
          <textarea
            value={s.notes}
            onChange={(e) => setS({ notes: e.target.value })}
            placeholder="e.g., school options, quiet building, near metro…"
            className="h-28 w-full resize-none bg-transparent text-sm text-black outline-none placeholder:text-black/30"
          />
        </FieldShell>
      </div>
    ),
    validate: () => null,
  },
];

const VIEWING_STEPS: Step[] = [
  {
    id: "budget",
    title: "Budget & horizon",
    question: "What’s your budget and buying horizon?",
    render: (s, setS) => (
      <div className="grid gap-4 md:grid-cols-2">
        <FieldShell label="Budget range (AED)" required>
          <SelectInput
            value={s.budgetRange}
            onChange={(v) => setS({ budgetRange: v })}
            options={["750k – 1.5M", "1.5M – 3M", "3M – 6M", "6M+"]}
          />
        </FieldShell>
        <FieldShell label="Buying horizon" required>
          <SelectInput
            value={s.horizon}
            onChange={(v) => setS({ horizon: v })}
            options={["Now", "1–3 months", "3–6 months", "6+ months"]}
          />
        </FieldShell>
        <div className="md:col-span-2">
          <FieldShell label="Goal" required>
            <Segmented
              value={s.goal}
              onChange={(v) => setS({ goal: v })}
              options={["End-use", "Rental yield", "Capital growth", "Mixed"]}
            />
          </FieldShell>
        </div>
      </div>
    ),
    validate: (s) => {
      if (!s.budgetRange) return "Select a budget range.";
      if (!s.horizon) return "Select a buying horizon.";
      if (!s.goal) return "Select a goal.";
      return null;
    },
  },
  {
    id: "travel",
    title: "Travel timing",
    question: "When would you like to come to Dubai for viewings?",
    render: (s, setS) => (
      <div className="grid gap-4 md:grid-cols-2">
        <FieldShell label="Travel window" required>
          <SelectInput
            value={s.travelWindow}
            onChange={(v) => setS({ travelWindow: v })}
            options={[
              "Next 2 weeks",
              "This month",
              "Next 2–3 months",
              "Not sure",
            ]}
          />
        </FieldShell>
        <FieldShell
          label="Viewing intensity"
          required
          hint="How packed should the schedule be?"
        >
          <Segmented
            value={s.intensity}
            onChange={(v) => setS({ intensity: v })}
            options={["Light", "Balanced", "Intensive"]}
          />
        </FieldShell>
        <div className="md:col-span-2 rounded-2xl border border-black/10 bg-black/[0.03] p-4 text-sm text-black/70">
          We organise a curated itinerary: shortlist → area brief → viewings →
          next steps.
        </div>
      </div>
    ),
    validate: (s) => {
      if (!s.travelWindow) return "Select travel window.";
      if (!s.intensity) return "Select schedule intensity.";
      return null;
    },
  },
  {
    id: "property",
    title: "Property direction",
    question: "What type of property are you looking for?",
    render: (s, setS) => (
      <div className="grid gap-4 md:grid-cols-2">
        <FieldShell label="Property type" required>
          <SelectInput
            value={s.propertyType}
            onChange={(v) => setS({ propertyType: v })}
            options={["Apartment", "Townhouse", "Villa", "Mixed / not sure"]}
          />
        </FieldShell>
        <FieldShell label="Market type" required>
          <SelectInput
            value={s.marketType}
            onChange={(v) => setS({ marketType: v })}
            options={["Off-plan", "Secondary", "Both"]}
          />
        </FieldShell>
        <div className="md:col-span-2">
          <FieldShell label="Bedrooms (preference)" required>
            <Segmented
              value={s.beds}
              onChange={(v) => setS({ beds: v })}
              options={["Studio/1", "2", "3", "4+"]}
            />
          </FieldShell>
        </div>
      </div>
    ),
    validate: (s) => {
      if (!s.propertyType) return "Select property type.";
      if (!s.marketType) return "Select market type.";
      if (!s.beds) return "Select bedroom preference.";
      return null;
    },
  },
  {
    id: "areas",
    title: "Areas",
    question: "Do you have areas in mind, or should we recommend?",
    render: (s, setS) => (
      <div className="grid gap-4 md:grid-cols-2">
        <FieldShell label="Areas known?" required>
          <Segmented
            value={s.areasKnown}
            onChange={(v) => setS({ areasKnown: v, areas: "", vibe: "" })}
            options={["Not sure", "Known"]}
          />
        </FieldShell>

        {s.areasKnown === "Known" ? (
          <FieldShell label="Areas" hint="Comma-separated is fine" required>
            <TextInput
              value={s.areas}
              onChange={(v) => setS({ areas: v })}
              placeholder="e.g., Marina, Downtown, Business Bay"
            />
          </FieldShell>
        ) : (
          <FieldShell label="Vibe preference" required>
            <Segmented
              value={s.vibe}
              onChange={(v) => setS({ vibe: v })}
              options={["Prime", "Waterfront", "Family", "Value"]}
            />
          </FieldShell>
        )}

        <div className="md:col-span-2 rounded-2xl border border-black/10 bg-black/[0.03] p-4 text-sm text-black/70">
          We shortlist 6–10 options, then schedule viewings around your
          itinerary.
        </div>
      </div>
    ),
    validate: (s) => {
      if (!s.areasKnown) return "Select whether you know areas.";
      if (s.areasKnown === "Known" && !String(s.areas || "").trim())
        return "Add your areas.";
      if (s.areasKnown === "Not sure" && !s.vibe)
        return "Select a vibe preference.";
      return null;
    },
  },
  {
    id: "finish",
    title: "Finish",
    question: "We generate your viewing-trip plan summary.",
    render: (s, setS) => (
      <div className="space-y-4">
        <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-4">
          <div className="text-[11px] tracking-[0.22em] text-black/55">
            WHAT YOU GET
          </div>
          <ul className="mt-3 space-y-2 text-sm text-black/75">
            {[
              "Curated itinerary + scheduled viewings",
              "Shortlist aligned to your budget + goal",
              "Offer + paperwork guidance (high-level)",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full text-black"
                  style={{ backgroundColor: GOLD }}
                >
                  <Icon name="check" className="h-4 w-4" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <FieldShell label="Anything else we should tailor?" hint="Optional">
          <textarea
            value={s.notes}
            onChange={(e) => setS({ notes: e.target.value })}
            placeholder="e.g., prefer payment plan, near metro, ready tenants…"
            className="h-28 w-full resize-none bg-transparent text-sm text-black outline-none placeholder:text-black/30"
          />
        </FieldShell>
      </div>
    ),
    validate: () => null,
  },
];

function computeCurrentNet(s: any) {
  const salary = Number(String(s.currentSalary || "").replace(/[^0-9.]/g, ""));
  const fixed = Number(String(s.currentFixed || "").replace(/[^0-9.]/g, ""));
  const disc = Number(
    String(s.currentDiscretionary || "").replace(/[^0-9.]/g, "")
  );
  if (!salary) return "—";
  const net = salary - fixed - disc;
  if (!isFinite(net)) return "—";
  return `${net.toFixed(0)}`;
}

function computeDubaiEstimate(s: any) {
  const household = s.household || "Single";
  const kids = s.kids || "No";
  const band = s.budgetBand || "";
  const priority = s.priority || "Balance";

  let base = 12000;
  if (household === "Couple") base += 4000;
  if (household === "Family") base += 9000;
  if (kids === "Yes") base += 4500;

  if (band.includes("< 8k")) base -= 2500;
  if (band.includes("15–25k")) base += 4500;
  if (band.includes("25k+")) base += 9000;

  if (priority === "Save more") base -= 1500;
  if (priority === "Comfort") base += 1500;

  return `${clamp(Math.round(base), 8000, 40000)} AED / mo`;
}

function computeRunwayWeeks(s: any) {
  const household = s.household || "Single";
  const kids = s.kids || "No";
  let weeks = 6;
  if (household === "Couple") weeks += 1;
  if (household === "Family") weeks += 2;
  if (kids === "Yes") weeks += 3;
  if (s.areaKnown === "Not sure") weeks += 2;
  return `~${weeks} weeks`;
}

function buildRelocationSummary(state: any) {
  const lines: string[] = [];
  lines.push("CONCIERGE — RELOCATION SUMMARY");
  lines.push("");
  lines.push(`Origin country: ${state.originCountry || "-"}`);
  lines.push(`Timeline: ${state.timeline || "-"}`);
  lines.push(`Visa direction: ${state.visaDirection || "-"}`);
  lines.push("");
  lines.push(`Household: ${state.household || "-"}`);
  lines.push(`Children: ${state.kids || "-"}`);
  lines.push(`Lifestyle: ${state.lifestyle || "-"}`);
  lines.push("");
  lines.push(
    `Preferred area: ${
      state.areaKnown === "Known" ? state.area || "-" : "Not sure"
    }`
  );
  if (state.areaKnown !== "Known")
    lines.push(`Budget band: ${state.budgetBand || "-"}`);
  lines.push("");
  lines.push(`Estimated runway: ${computeRunwayWeeks(state)}`);
  lines.push(`Dubai monthly estimate: ${computeDubaiEstimate(state)}`);
  lines.push("");
  if (state.notes?.trim()) {
    lines.push("Notes:");
    lines.push(state.notes.trim());
  }
  return lines.join("\n");
}

function buildViewingSummary(state: any) {
  const lines: string[] = [];
  lines.push("CONCIERGE — CURATED VIEWING TRIP SUMMARY");
  lines.push("");
  lines.push(`Budget range: ${state.budgetRange || "-"}`);
  lines.push(`Buying horizon: ${state.horizon || "-"}`);
  lines.push(`Goal: ${state.goal || "-"}`);
  lines.push("");
  lines.push(`Travel window: ${state.travelWindow || "-"}`);
  lines.push(`Schedule intensity: ${state.intensity || "-"}`);
  lines.push("");
  lines.push(`Property type: ${state.propertyType || "-"}`);
  lines.push(`Market type: ${state.marketType || "-"}`);
  lines.push(`Bedrooms: ${state.beds || "-"}`);
  lines.push("");
  lines.push(
    `Areas: ${
      state.areasKnown === "Known"
        ? state.areas || "-"
        : `Recommend (${state.vibe || "-"})`
    }`
  );
  lines.push("");
  if (state.notes?.trim()) {
    lines.push("Notes:");
    lines.push(state.notes.trim());
  }
  return lines.join("\n");
}

type EmailCapture = {
  name: string;
  email: string;
  email2: string;
  phone: string;
};

function Wizard({
  open,
  onClose,
  flow,
}: {
  open: boolean;
  onClose: () => void;
  flow: ConciergeFlow;
}) {
  const steps = flow === "relocation" ? RELOCATION_STEPS : VIEWING_STEPS;

  const [stepIdx, setStepIdx] = useState(0);
  const [state, setState] = useState<any>(() => ({}));
  const [emailOpen, setEmailOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);

  const [capture, setCapture] = useState<EmailCapture>({
    name: "",
    email: "",
    email2: "",
    phone: "",
  });

  const [callWhen, setCallWhen] = useState<CallWhen>("ASAP");
  const [callDate, setCallDate] = useState("");
  const [callTime, setCallTime] = useState("");

  const resetAll = () => {
    setStepIdx(0);
    setState({});
    setEmailOpen(false);
    setBookOpen(false);
    setCapture({ name: "", email: "", email2: "", phone: "" });
    setCallWhen("ASAP");
    setCallDate("");
    setCallTime("");
  };

  useEffect(() => {
    if (open) resetAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, flow]);

  const current = steps[stepIdx];
  const setPatch = (patch: any) => setState((p: any) => ({ ...p, ...patch }));
  const err = useMemo(() => current?.validate(state) ?? null, [current, state]);
  const canNext = !err;

  const summaryText = useMemo(() => {
    if (flow === "relocation") return buildRelocationSummary(state);
    if (flow === "viewing") return buildViewingSummary(state);
    return "";
  }, [flow, state]);

  const emailErrors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!capture.name.trim()) e.name = "Add your name.";
    if (!capture.phone.trim()) e.phone = "Add your phone (with country code).";
    if (!capture.email.trim()) e.email = "Add your email.";
    else if (!isValidEmail(capture.email)) e.email = "Email looks incorrect.";
    if (!capture.email2.trim()) e.email2 = "Confirm your email.";
    else if (capture.email2.trim() !== capture.email.trim())
      e.email2 = "Emails do not match.";
    return e;
  }, [capture]);

  const canEmail = Object.keys(emailErrors).length === 0;
  const canBook = !!callDate && !!callTime && canEmail;

  const sendEmail = () => {
    const body = [
      `Client name: ${capture.name}`,
      `Client email: ${capture.email}`,
      `Client phone: ${capture.phone}`,
      `Preferred contact window: ${callWhen}`,
      "",
      summaryText,
    ].join("\n");

    const subject =
      flow === "relocation"
        ? "Keystne — Concierge (Relocation) summary"
        : "Keystne — Concierge (Curated Viewing Trip) summary";

    window.location.href = buildMailto({ subject, body });
  };

  const sendBooking = () => {
    const body = [
      `Booking request`,
      "",
      `Client name: ${capture.name}`,
      `Client email: ${capture.email}`,
      `Client phone: ${capture.phone}`,
      "",
      `Preferred call: ${callDate} at ${callTime} (Dubai time)`,
      "",
      summaryText,
    ].join("\n");

    const subject =
      flow === "relocation"
        ? "Keystne — Book a call (Relocation)"
        : "Keystne — Book a call (Viewing Trip)";

    window.location.href = buildMailto({ subject, body });
  };

  const headline =
    flow === "relocation" ? "Relocation Concierge" : "Curated Viewing Trip";
  const subtitle =
    flow === "relocation"
      ? "A guided relocation plan — shortlist, timeline, onboarding support."
      : "We organise your Dubai visit — shortlist + viewings + a clear process.";

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          onClose();
          resetAll();
        }}
        title={headline}
        subtitle={subtitle}
        widthClass="max-w-4xl"
      >
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <Progress step={stepIdx} total={steps.length} />

            <div className="rounded-[24px] border border-black/10 bg-white p-5 shadow-sm">
              <div className="text-[11px] tracking-[0.22em] text-black/55">
                {current.title.toUpperCase()}
              </div>
              <div className="mt-2 text-xl font-semibold text-black">
                {current.question}
              </div>

              <div className="mt-5">{current.render(state, setPatch)}</div>

              {err ? (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {err}
                </div>
              ) : null}

              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black/70 hover:bg-black/5 disabled:opacity-40"
                  disabled={stepIdx === 0}
                >
                  Back
                </button>

                {stepIdx < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      canNext &&
                      setStepIdx((i) => Math.min(steps.length - 1, i + 1))
                    }
                    className={[
                      "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition",
                      canNext
                        ? "text-black hover:brightness-110"
                        : "bg-black/10 text-black/35 cursor-not-allowed",
                    ].join(" ")}
                    style={canNext ? { backgroundColor: GOLD } : undefined}
                    disabled={!canNext}
                  >
                    Next <Icon name="arrow" />
                  </button>
                ) : (
                  <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={() => setEmailOpen(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-black hover:brightness-110"
                      style={{ backgroundColor: GOLD }}
                    >
                      Email this summary <Icon name="mail" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookOpen(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black/70 hover:bg-black/5"
                    >
                      Book a call <Icon name="calendar" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-black/10 bg-black p-5 text-white shadow-sm">
              <div className="text-[11px] tracking-[0.22em] text-white/55">
                LIVE SUMMARY
              </div>
              <div className="mt-3 whitespace-pre-wrap text-sm text-white/85">
                {summaryText ||
                  "Start answering questions to see your plan here."}
              </div>
            </div>

            <div className="rounded-[24px] border border-black/10 bg-white p-5 shadow-sm">
              <div className="text-[11px] tracking-[0.22em] text-black/55">
                WHY THIS WORKS
              </div>
              <div className="mt-2 text-sm text-black/70">
                You get a clear plan instantly. We get the context to tailor the
                next step — without wasting time.
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Email capture */}
      <Modal
        open={emailOpen}
        onClose={() => setEmailOpen(false)}
        title="Send your summary"
        subtitle="We’ll receive your details + summary via email."
        widthClass="max-w-2xl"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FieldShell label="Full name" required error={emailErrors.name}>
            <TextInput
              value={capture.name}
              onChange={(v) => setCapture((p) => ({ ...p, name: v }))}
              placeholder="Your name"
            />
          </FieldShell>

          <FieldShell
            label="Phone (with country code)"
            required
            error={emailErrors.phone}
          >
            <TextInput
              value={capture.phone}
              onChange={(v) => setCapture((p) => ({ ...p, phone: v }))}
              placeholder="+44… / +971…"
            />
          </FieldShell>

          <FieldShell label="Email" required error={emailErrors.email}>
            <TextInput
              value={capture.email}
              onChange={(v) => setCapture((p) => ({ ...p, email: v }))}
              placeholder="name@email.com"
            />
          </FieldShell>

          <FieldShell label="Confirm email" required error={emailErrors.email2}>
            <TextInput
              value={capture.email2}
              onChange={(v) => setCapture((p) => ({ ...p, email2: v }))}
              placeholder="Repeat email"
            />
          </FieldShell>

          <div className="md:col-span-2">
            <FieldShell label="Preferred contact window" required>
              <Segmented
                value={callWhen}
                onChange={setCallWhen}
                options={["ASAP", "1 month", "2 months", "6 months"]}
              />
            </FieldShell>
          </div>

          <div className="md:col-span-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setEmailOpen(false)}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black/70 hover:bg-black/5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={sendEmail}
              disabled={!canEmail}
              className={[
                "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition",
                canEmail
                  ? "text-black hover:brightness-110"
                  : "bg-black/10 text-black/35 cursor-not-allowed",
              ].join(" ")}
              style={canEmail ? { backgroundColor: GOLD } : undefined}
            >
              Open email <Icon name="arrow" />
            </button>
          </div>
        </div>
      </Modal>

      {/* Booking */}
      <Modal
        open={bookOpen}
        onClose={() => setBookOpen(false)}
        title="Book a call"
        subtitle="Pick a time — we’ll confirm on email."
        widthClass="max-w-2xl"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FieldShell label="Full name" required error={emailErrors.name}>
            <TextInput
              value={capture.name}
              onChange={(v) => setCapture((p) => ({ ...p, name: v }))}
              placeholder="Your name"
            />
          </FieldShell>

          <FieldShell
            label="Phone (with country code)"
            required
            error={emailErrors.phone}
          >
            <TextInput
              value={capture.phone}
              onChange={(v) => setCapture((p) => ({ ...p, phone: v }))}
              placeholder="+44… / +971…"
            />
          </FieldShell>

          <FieldShell label="Email" required error={emailErrors.email}>
            <TextInput
              value={capture.email}
              onChange={(v) => setCapture((p) => ({ ...p, email: v }))}
              placeholder="name@email.com"
            />
          </FieldShell>

          <FieldShell label="Confirm email" required error={emailErrors.email2}>
            <TextInput
              value={capture.email2}
              onChange={(v) => setCapture((p) => ({ ...p, email2: v }))}
              placeholder="Repeat email"
            />
          </FieldShell>

          <FieldShell label="Preferred date (Dubai time)" required>
            <TextInput value={callDate} onChange={setCallDate} type="date" />
          </FieldShell>

          <FieldShell label="Preferred time (Dubai time)" required>
            <TextInput value={callTime} onChange={setCallTime} type="time" />
          </FieldShell>

          <div className="md:col-span-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setBookOpen(false)}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black/70 hover:bg-black/5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={sendBooking}
              disabled={!canBook}
              className={[
                "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition",
                canBook
                  ? "text-black hover:brightness-110"
                  : "bg-black/10 text-black/35 cursor-not-allowed",
              ].join(" ")}
              style={canBook ? { backgroundColor: GOLD } : undefined}
            >
              Open booking email <Icon name="arrow" />
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function TopNav({ hidden }: { hidden: boolean }) {
  return (
    <div
      className={[
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
        hidden
          ? "-translate-y-28 opacity-0 pointer-events-none"
          : "translate-y-0 opacity-100",
      ].join(" ")}
    >
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-black/70 px-5 py-4 text-white shadow-2xl backdrop-blur-xl">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            keystne
          </Link>

          <div className="hidden items-center gap-6 text-sm font-semibold md:flex">
            {[
              { label: "Concierge", href: "/concierge" },
              { label: "Discover Communities", href: "/communities" },
              { label: "Investments", href: "/investments" },
              { label: "Long-Term", href: "/long-term" },
              { label: "Property Management", href: "/management" },
              { label: "About", href: "/about" },
            ].map((i) => (
              <Link
                key={i.label}
                href={i.href}
                className="transition"
                onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.85)")
                }
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                {i.label}
              </Link>
            ))}
          </div>

          <div className="text-[11px] tracking-[0.22em] text-white/70">
            DUBAI
          </div>
        </div>
      </div>
    </div>
  );
}

function PageFooter() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-lg font-semibold tracking-tight">keystne</div>
            <div className="mt-2 max-w-md text-sm text-white/70">
              Premium real estate services in Dubai — concierge relocation,
              brokerage & investments, long-term rentals, and property
              management.
            </div>
          </div>

          <div className="grid gap-2 text-sm text-white/75">
            <div className="flex flex-wrap gap-4">
              {[
                "Concierge",
                "Discover Communities",
                "Investments",
                "Long-Term",
                "Property Management",
                "About",
              ].map((t) => (
                <span key={t} className="text-white/65">
                  {t}
                </span>
              ))}
            </div>
            <div className="text-[11px] text-white/45">
              © {new Date().getFullYear()} Keystne. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function ConciergePage() {
  const [navHidden, setNavHidden] = useState(false);
  const lastY = useRef(0);

  const [flow, setFlow] = useState<ConciergeFlow>(null);
  const wizardOpen = flow !== null;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const delta = y - lastY.current;

      if (delta > 10) setNavHidden(true);
      if (delta < -10) setNavHidden(false);

      lastY.current = y;
    };

    lastY.current = window.scrollY || 0;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      <TopNav hidden={navHidden} />

      {/* HERO */}
      <section className="relative min-h-[70vh] overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-85"
          src={HOME_VIDEOS.hero}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/25 to-white" />

        <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-28">
          <div className="max-w-3xl">
            <div className="text-[11px] tracking-[0.22em] text-white/80">
              CONCIERGE • DUBAI
            </div>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-6xl">
              Concierge, done properly.
            </h1>

            <p className="mt-5 text-base text-white/85 md:text-lg">
              Two ways we support you: relocate seamlessly, or fly in for a
              curated viewing trip and invest with clarity.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setFlow("relocation")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-semibold text-black hover:brightness-110"
                style={{ backgroundColor: GOLD }}
              >
                Relocation concierge <Icon name="arrow" />
              </button>

              <button
                onClick={() => setFlow("viewing")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-4 text-sm font-semibold text-white hover:bg-white/15"
              >
                Curated viewing trip <Icon name="arrow" />
              </button>

              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-6 py-4 text-sm font-semibold text-white hover:bg-white/15"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="text-[11px] tracking-[0.22em] text-black/55">
            CHOOSE A PATH
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Pick what you need — we’ll do the rest.
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-black/65">
            Quick questions, premium experience. You get a clean summary you can
            email to yourself and use to book a call.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <button
              onClick={() => setFlow("relocation")}
              className="group relative overflow-hidden rounded-[28px] border border-black/10 bg-white text-left shadow-2xl transition hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] via-transparent to-[#C8A45D]/10" />
              <div className="relative p-7">
                <div className="text-[11px] tracking-[0.22em] text-black/55">
                  OPTION 01
                </div>
                <div className="mt-2 text-2xl font-semibold text-black">
                  Relocation concierge
                </div>
                <div className="mt-3 text-sm text-black/70">
                  Visa direction, area shortlist, and a smooth move-in flow —
                  handled personally.
                </div>

                <div
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-[12px] font-semibold text-white group-hover:text-black"
                  style={{}}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = GOLD)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "black")
                  }
                >
                  Start <Icon name="arrow" className="h-4 w-4" />
                </div>
              </div>
            </button>

            <button
              onClick={() => setFlow("viewing")}
              className="group relative overflow-hidden rounded-[28px] border border-black/10 bg-white text-left shadow-2xl transition hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] via-transparent to-[#C8A45D]/10" />
              <div className="relative p-7">
                <div className="text-[11px] tracking-[0.22em] text-black/55">
                  OPTION 02
                </div>
                <div className="mt-2 text-2xl font-semibold text-black">
                  Curated viewing trip
                </div>
                <div className="mt-3 text-sm text-black/70">
                  You fly in — we organise shortlist + viewings + next steps to
                  buy with confidence.
                </div>

                <div
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-[12px] font-semibold text-white group-hover:text-black"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = GOLD)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "black")
                  }
                >
                  Start <Icon name="arrow" className="h-4 w-4" />
                </div>
              </div>
            </button>
          </div>

          <div className="mt-12 rounded-[28px] border border-black/10 bg-black p-7 text-white">
            <div className="text-[11px] tracking-[0.22em] text-white/55">
              PROMISE
            </div>
            <div className="mt-2 text-2xl font-semibold">
              We keep it premium. We keep it personal.
            </div>
            <div className="mt-3 max-w-3xl text-sm text-white/80">
              Designed to feel easy — not boring form-filling. Answer a few
              prompts, get a clean plan.
            </div>
          </div>
        </div>
      </section>

      <PageFooter />
      <ContactDock />

      <Wizard open={wizardOpen} flow={flow} onClose={() => setFlow(null)} />
    </div>
  );
}
