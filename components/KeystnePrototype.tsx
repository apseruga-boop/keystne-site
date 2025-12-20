"use client";

import React, { useMemo, useState, useEffect } from "react";

/**
 * Keystne – premium fashion-style lead-gen website prototype (single file)
 * - Hover-play video tiles (Dior-inspired interaction) WITHOUT framer-motion
 * - Multi-channel contact (Call / WhatsApp / Telegram / WeChat / Email / Book a call)
 * - Lead form with validation + double-entry email checker
 * - Booking modal with date/time
 *
 * Notes:
 * - Replace VIDEO URLs with licensed/owned media.
 * - Wire submissions to CRM + email notifications.
 */

// ---------- Types ----------

type ServiceReason =
  | "Concierge (Relocation)"
  | "Brokerage & Investments"
  | "Leasing & Rentals"
  | "Property Management"
  | "General enquiry";

type CallWhen = "ASAP" | "1 month" | "2 months" | "6 months";

type LeadPayload = {
  name: string;
  email: string;
  emailConfirm: string;
  phone: string;
  reason: ServiceReason;
  when: CallWhen;
  preferredChannel:
    | "Call"
    | "WhatsApp"
    | "Telegram"
    | "WeChat"
    | "Email"
    | "Book a call";
  message: string;
};

// ---------- Utilities ----------

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function formatPhoneHint(input: string) {
  return input.replace(/[^0-9+\s()-]/g, "");
}

// ---------- Mock content (swap to live data later) ----------

const CONTACT = {
  phoneDisplay: "+971 XX XXX XXXX",
  phoneTel: "tel:+971XXXXXXXXX",
  whatsappLink: "https://wa.me/971XXXXXXXXX",
  telegramLink: "https://t.me/keystne",
  wechatHint: "WeChat ID: keystne",
  emailArthur: "mailto:arthur@keystne.com",
  emailStuart: "mailto:stuart@keystne.com",
};

const HOME_VIDEOS = {
  hero: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  concierge:
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  investments:
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  leasing:
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  management:
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
};

const DUBAI_AREAS = [
  "Downtown Dubai",
  "Dubai Marina",
  "Business Bay",
  "Palm Jumeirah",
  "Jumeirah Beach Residence (JBR)",
  "Jumeirah Lake Towers (JLT)",
  "Dubai Hills Estate",
  "Arabian Ranches",
  "Jumeirah Village Circle (JVC)",
  "Dubai Creek Harbour",
  "City Walk",
  "Al Barsha",
  "The Springs",
  "The Meadows",
  "Emirates Hills",
  "Dubai Silicon Oasis",
  "Mirdif",
  "Motor City",
];

// ---------- Tiny Icon Set (no external deps) ----------

function Icon({
  name,
  className = "h-4 w-4",
}: {
  name:
    | "phone"
    | "whatsapp"
    | "send"
    | "mail"
    | "calendar"
    | "map"
    | "chev"
    | "x"
    | "check"
    | "shield";
  className?: string;
}) {
  const common = `inline-block ${className}`;
  switch (name) {
    case "phone":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M7 3h3l1.2 5-2 1.2c1.2 2.5 3.1 4.5 5.6 5.6l1.2-2L21 14v3c0 1.1-.9 2-2 2-9.4 0-17-7.6-17-17 0-1.1.9-2 2-2Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "whatsapp":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 21a9 9 0 1 0-7.8-4.5L3 21l4.7-1.1A8.9 8.9 0 0 0 12 21Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M9.2 8.7c.2-.5.4-.6.8-.6h.6c.2 0 .5.1.6.5l.7 1.7c.1.3.1.6-.1.8l-.4.5c.6 1.1 1.6 2.1 2.7 2.7l.5-.4c.2-.2.5-.2.8-.1l1.7.7c.4.2.5.4.5.6v.6c0 .4-.1.6-.6.8-.6.3-1.7.4-3.2-.2-2.2-.9-4.8-3.5-5.7-5.7-.6-1.5-.5-2.6-.2-3.2Z"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
      );
    case "send":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M22 2 11 13"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M22 2 15 22l-4-9-9-4 20-7Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "mail":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6h16v12H4V6Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="m4 7 8 6 8-6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "calendar":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M7 3v3M17 3v3M4 8h16M5 6h14a1 1 0 0 1 1 1v14H4V7a1 1 0 0 1 1-1Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      );
    case "map":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 21s-6-4.4-6-10a6 6 0 1 1 12 0c0 5.6-6 10-6 10Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M12 11.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
      );
    case "chev":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="m9 18 6-6-6-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "x":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 6l12 12M18 6 6 18"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "check":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M20 6 9 17l-5-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "shield":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 2 20 6v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

// ---------- UI Primitives ----------

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white/70 shadow-sm backdrop-blur-xl">
      {children}
    </div>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "outline";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm transition active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "bg-black text-white hover:bg-black/90"
      : variant === "outline"
      ? "border border-white/20 bg-white/5 text-white hover:bg-white/10"
      : "bg-transparent text-white hover:bg-white/10";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  hint,
  right,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  hint?: string;
  right?: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-end justify-between">
        <label className="text-xs font-medium tracking-wide text-black/70">
          {label} {required ? <span className="text-black/40">*</span> : null}
        </label>
        {hint ? (
          <span className="text-[11px] text-black/45">{hint}</span>
        ) : null}
      </div>
      <div
        className={`flex items-center gap-2 rounded-2xl border bg-white/70 px-3 py-2 shadow-sm backdrop-blur-xl ${
          error ? "border-red-500/40" : "border-black/10"
        }`}
      >
        <input
          value={value}
          type={type}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-black/30"
        />
        {right}
      </div>
      {error ? (
        <div className="text-[11px] text-red-600/80">{error}</div>
      ) : null}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium tracking-wide text-black/70">
        {label} {required ? <span className="text-black/40">*</span> : null}
      </label>
      <div className="rounded-2xl border border-black/10 bg-white/70 px-3 py-2 shadow-sm backdrop-blur-xl">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        >
          <option value="">Select…</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ---------- Modal (no framer-motion, CSS animations) ----------

function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    const t = setTimeout(() => setMounted(false), 180);
    return () => clearTimeout(t);
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center p-4 md:items-center ${
        open ? "ks-fadeIn" : "ks-fadeOut"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm ${
          open ? "ks-fadeIn" : "ks-fadeOut"
        }`}
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/15 bg-[#0a0a0a] text-white shadow-2xl ${
          open ? "ks-popIn" : "ks-popOut"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <div className="text-base font-semibold tracking-wide">{title}</div>
            {subtitle ? (
              <div className="mt-1 text-xs text-white/65">{subtitle}</div>
            ) : null}
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl p-2 text-white/70 hover:bg-white/10"
            aria-label="Close"
          >
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ---------- Core Components ----------

function Nav({ onOpenLead }: { onOpenLead: () => void }) {
  return (
    <div className="fixed left-0 right-0 top-0 z-40">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-4 flex items-center justify-between rounded-3xl border border-white/10 bg-black/70 px-4 py-3 text-white shadow-lg backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-white/10" />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide">keystne</div>
              <div className="text-[11px] text-white/60">
                Real Estate • Dubai
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-6 text-xs text-white/70 md:flex">
            <a className="hover:text-white" href="#concierge">
              Concierge
            </a>
            <a className="hover:text-white" href="#invest">
              Investments
            </a>
            <a className="hover:text-white" href="#leasing">
              Leasing
            </a>
            <a className="hover:text-white" href="#management">
              Management
            </a>
            <a className="hover:text-white" href="#about">
              About
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onOpenLead} className="text-white">
              Get a bespoke plan <Icon name="chev" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero({ onOpenLead }: { onOpenLead: () => void }) {
  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-black text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        src={HOME_VIDEOS.hero}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/30 to-[#0b0b0b]" />

      <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-4 pb-14 pt-28">
        <div className="max-w-2xl ks-slideUp">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-white/75">
            <Icon name="shield" className="h-4 w-4" />
            Dubai-focused • Bespoke service • Lead-generation prototype
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            Dubai, tailored to you.
          </h1>

          <p className="mt-4 text-base text-white/75 md:text-lg">
            From relocation to investments, we handle the journey personally —
            with a premium, concierge-first approach.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button onClick={onOpenLead} className="px-6">
              Get a bespoke plan <Icon name="chev" className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.assign("#concierge")}
              className="text-white"
            >
              Explore services
            </Button>
          </div>

          <div className="mt-5 text-[11px] text-white/55">
            We’ll follow up via your preferred channel. Your details stay
            private.
          </div>
        </div>
      </div>
    </section>
  );
}

function HoverVideoTile({
  title,
  subtitle,
  video,
  onClick,
}: {
  title: string;
  subtitle: string;
  video: string;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      onClick={onClick}
      className="group relative h-[360px] w-full overflow-hidden rounded-[28px] border border-white/10 bg-black text-left shadow-xl transition-transform duration-200 hover:-translate-y-1"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        src={video}
        muted
        loop
        playsInline
        ref={(el) => {
          if (!el) return;
          if (hover) el.play().catch(() => undefined);
          else el.pause();
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/35 to-black/75" />
      <div className="relative flex h-full flex-col justify-end p-6">
        <div className="text-[11px] text-white/60">{subtitle}</div>
        <div className="mt-2 text-2xl font-semibold tracking-tight text-white">
          {title}
        </div>
        <div className="mt-4 inline-flex items-center gap-2 text-sm text-white/80">
          Explore <Icon name="chev" className="h-4 w-4" />
        </div>
      </div>
      <div className="absolute left-6 top-6 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-white/70 backdrop-blur">
        Hover to preview
      </div>
    </button>
  );
}

function ServicesGrid({ onJump }: { onJump: (id: string) => void }) {
  return (
    <section className="bg-[#0b0b0b] text-white">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-4 md:grid-cols-2">
          <HoverVideoTile
            title="Concierge (Relocation)"
            subtitle="Move personally, not alone"
            video={HOME_VIDEOS.concierge}
            onClick={() => onJump("concierge")}
          />
          <HoverVideoTile
            title="Brokerage & Investments"
            subtitle="Off-plan to secondary, done right"
            video={HOME_VIDEOS.investments}
            onClick={() => onJump("invest")}
          />
          <HoverVideoTile
            title="Leasing & Rentals"
            subtitle="Long-term living, made simple"
            video={HOME_VIDEOS.leasing}
            onClick={() => onJump("leasing")}
          />
          <HoverVideoTile
            title="Property Management"
            subtitle="Relax — we handle performance"
            video={HOME_VIDEOS.management}
            onClick={() => onJump("management")}
          />
        </div>
      </div>
    </section>
  );
}

function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="bg-[#0b0b0b] text-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="max-w-3xl">
          <div className="text-[11px] tracking-[0.18em] text-white/55">
            {eyebrow}
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-white/70">{description}</p>
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function ConciergeCalculator({
  onOpenLead,
}: {
  onOpenLead: (prefill?: Partial<LeadPayload>) => void;
}) {
  const [country, setCountry] = useState("");
  const [household, setHousehold] = useState("");
  const [kids, setKids] = useState("No");
  const [relocationDate, setRelocationDate] = useState("");
  const [areaKnown, setAreaKnown] = useState("No");
  const [area, setArea] = useState("");
  const [budgetBand, setBudgetBand] = useState("");

  const timeline = useMemo(() => {
    const base = 6; // weeks
    const kidWeeks = kids === "Yes" ? 3 : 0;
    const areaWeeks = areaKnown === "Yes" ? 1 : 2;
    return base + kidWeeks + areaWeeks;
  }, [kids, areaKnown]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <div className="p-6">
          <div className="text-sm font-semibold text-black">
            Relocation preview
          </div>
          <div className="mt-1 text-xs text-black/60">
            Quick estimate now — unlock full breakdown after you share your
            details.
          </div>

          <div className="mt-6 grid gap-4">
            <Input
              label="Origin country"
              value={country}
              onChange={setCountry}
              placeholder="e.g., United Kingdom"
              required
            />
            <Select
              label="Household"
              value={household}
              onChange={setHousehold}
              options={["Single", "Couple", "Family"]}
              required
            />
            <Select
              label="Kids"
              value={kids}
              onChange={setKids}
              options={["No", "Yes"]}
            />
            <Input
              label="Target relocation date"
              value={relocationDate}
              onChange={setRelocationDate}
              type="date"
              required
            />
            <Select
              label="Do you know your preferred area?"
              value={areaKnown}
              onChange={(v) => {
                setAreaKnown(v);
                setArea("");
                setBudgetBand("");
              }}
              options={["No", "Yes"]}
            />
            {areaKnown === "Yes" ? (
              <Select
                label="Preferred area"
                value={area}
                onChange={setArea}
                options={DUBAI_AREAS}
              />
            ) : (
              <Select
                label="Monthly budget band"
                value={budgetBand}
                onChange={setBudgetBand}
                options={["< 8k AED", "8–15k AED", "15–25k AED", "25k+ AED"]}
              />
            )}

            <Button
              onClick={() =>
                onOpenLead({
                  reason: "Concierge (Relocation)",
                  message: `Relocation preview request — Country: ${
                    country || "-"
                  }, Household: ${household || "-"}, Kids: ${kids}, Date: ${
                    relocationDate || "-"
                  }, Area: ${area || "TBD"}, Budget: ${budgetBand || "-"}.`,
                })
              }
              disabled={!country || !household || !relocationDate}
              className="mt-2"
            >
              See full costs & timeline <Icon name="chev" className="h-4 w-4" />
            </Button>

            <div className="mt-1 text-[11px] text-black/45">
              Indicative estimate only — final costs depend on your preferences
              and timelines.
            </div>
          </div>
        </div>
      </Card>

      <div className="rounded-[28px] border border-white/10 bg-black/40 p-6">
        <div className="flex items-center gap-2 text-xs text-white/70">
          <Icon name="check" className="h-4 w-4" />
          Your personalised journey
        </div>
        <div className="mt-3 text-3xl font-semibold">~{timeline} weeks</div>
        <div className="mt-2 text-white/65">
          A high-level guide from discovery to move-in (and school setup if
          relevant).
        </div>

        <div className="mt-6 space-y-3">
          {[
            "Discovery & profiling",
            "Paperwork & eligibility",
            "Shortlist & viewings",
            "Offer & contracting",
            kids === "Yes" ? "School placement & fees" : null,
            "Move-in & settling",
          ]
            .filter(Boolean)
            .map((s) => (
              <div
                key={String(s)}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div className="text-sm text-white/85">{String(s)}</div>
                <div className="text-[11px] text-white/55">Included</div>
              </div>
            ))}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-white/70">What you’ll get next</div>
          <div className="mt-2 text-sm text-white/85">
            A bespoke cost breakdown + a clear plan we run with you personally.
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadModal({
  open,
  onClose,
  prefill,
  onBook,
}: {
  open: boolean;
  onClose: () => void;
  prefill?: Partial<LeadPayload>;
  onBook: (lead: LeadPayload) => void;
}) {
  const [payload, setPayload] = useState<LeadPayload>(() => ({
    name: prefill?.name || "",
    email: prefill?.email || "",
    emailConfirm: prefill?.emailConfirm || "",
    phone: prefill?.phone || "",
    reason: prefill?.reason || "General enquiry",
    when: prefill?.when || "ASAP",
    preferredChannel: prefill?.preferredChannel || "Book a call",
    message: prefill?.message || "",
  }));

  useEffect(() => {
    if (!open) return;
    setPayload((p) => ({
      ...p,
      ...prefill,
      reason: (prefill?.reason as ServiceReason) || p.reason,
      message: prefill?.message ?? p.message,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!payload.name.trim()) e.name = "Please enter your name.";
    if (!payload.email.trim()) e.email = "Please enter your email.";
    else if (!isValidEmail(payload.email)) e.email = "Email looks incorrect.";
    if (!payload.emailConfirm.trim())
      e.emailConfirm = "Please confirm your email.";
    else if (payload.emailConfirm.trim() !== payload.email.trim())
      e.emailConfirm = "Emails do not match.";
    if (!payload.phone.trim()) e.phone = "Please enter a phone number.";
    return e;
  }, [payload]);

  const canSubmit = Object.keys(errors).length === 0;

  const submit = () => {
    if (payload.preferredChannel === "Book a call" && payload.when === "ASAP") {
      onBook(payload);
      return;
    }
    alert(
      "Lead captured (prototype). Next: wire to CRM + email notifications."
    );
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Get a bespoke plan"
      subtitle="Premium, personal support — we’ll contact you via your preferred channel."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Full name"
          value={payload.name}
          onChange={(v) => setPayload((p) => ({ ...p, name: v }))}
          required
          error={errors.name}
        />
        <Input
          label="Phone"
          value={payload.phone}
          onChange={(v) =>
            setPayload((p) => ({ ...p, phone: formatPhoneHint(v) }))
          }
          required
          hint="Include country code"
          error={errors.phone}
        />

        <Input
          label="Email"
          value={payload.email}
          onChange={(v) => setPayload((p) => ({ ...p, email: v }))}
          required
          error={errors.email}
          right={
            payload.email && isValidEmail(payload.email) ? (
              <span className="text-black/60">
                <Icon name="check" className="h-4 w-4" />
              </span>
            ) : null
          }
        />
        <Input
          label="Confirm email"
          value={payload.emailConfirm}
          onChange={(v) => setPayload((p) => ({ ...p, emailConfirm: v }))}
          required
          error={errors.emailConfirm}
        />

        <Select
          label="Reason"
          value={payload.reason}
          onChange={(v) =>
            setPayload((p) => ({ ...p, reason: v as ServiceReason }))
          }
          options={[
            "Concierge (Relocation)",
            "Brokerage & Investments",
            "Leasing & Rentals",
            "Property Management",
            "General enquiry",
          ]}
          required
        />

        <Select
          label="When should we contact you?"
          value={payload.when}
          onChange={(v) => setPayload((p) => ({ ...p, when: v as CallWhen }))}
          options={["ASAP", "1 month", "2 months", "6 months"]}
          required
        />

        <Select
          label="Preferred channel"
          value={payload.preferredChannel}
          onChange={(v) =>
            setPayload((p) => ({
              ...p,
              preferredChannel: v as LeadPayload["preferredChannel"],
            }))
          }
          options={[
            "Book a call",
            "Call",
            "WhatsApp",
            "Telegram",
            "WeChat",
            "Email",
          ]}
          required
        />

        <div className="md:col-span-2">
          <label className="text-xs font-medium tracking-wide text-white/70">
            Optional notes
          </label>
          <textarea
            value={payload.message}
            onChange={(e) =>
              setPayload((p) => ({ ...p, message: e.target.value }))
            }
            placeholder="Tell us what you need and any timeline constraints."
            className="mt-1 h-28 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35"
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-[11px] text-white/55">
            By submitting, you agree we can contact you about this request.
          </div>
          <Button onClick={submit} disabled={!canSubmit}>
            Continue <Icon name="chev" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function BookingModal({
  open,
  onClose,
  lead,
}: {
  open: boolean;
  onClose: () => void;
  lead?: LeadPayload;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const canBook = !!date && !!time;

  const book = () => {
    alert(
      `Booked (prototype): ${date} ${time}\nName: ${lead?.name}\nEmail: ${lead?.email}`
    );
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Schedule your call"
      subtitle="Pick a time that suits you — we’ll confirm immediately."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Preferred date"
          value={date}
          onChange={setDate}
          type="date"
          required
        />
        <Input
          label="Preferred time"
          value={time}
          onChange={setTime}
          type="time"
          required
        />

        <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-white/70">Confirm details</div>
          <div className="mt-2 text-sm text-white/85">
            {lead?.name} • {lead?.email} • {lead?.phone}
          </div>
          <div className="mt-1 text-[11px] text-white/55">
            Reason: {lead?.reason}
          </div>
        </div>

        <div className="md:col-span-2 flex items-center justify-end">
          <Button onClick={book} disabled={!canBook}>
            Confirm booking <Icon name="calendar" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function ContactDock({ onLead }: { onLead: () => void }) {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-2">
      <div className="rounded-[22px] border border-black/10 bg-white/75 p-2 shadow-lg backdrop-blur-xl">
        <a
          href={CONTACT.phoneTel}
          className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm hover:bg-black/5"
        >
          <Icon name="phone" className="h-4 w-4" />
          Call
        </a>
        <a
          href={CONTACT.whatsappLink}
          className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm hover:bg-black/5"
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="whatsapp" className="h-4 w-4" />
          WhatsApp
        </a>
        <a
          href={CONTACT.telegramLink}
          className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm hover:bg-black/5"
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="send" className="h-4 w-4" />
          Telegram
        </a>
        <button
          onClick={onLead}
          className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm hover:bg-black/5"
        >
          <Icon name="calendar" className="h-4 w-4" />
          Book a call
        </button>
        <a
          href={CONTACT.emailArthur}
          className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm hover:bg-black/5"
        >
          <Icon name="mail" className="h-4 w-4" />
          Email
        </a>
        <div className="px-3 py-2 text-[11px] text-black/55">
          WeChat: <span className="font-medium text-black/70">keystne</span>
        </div>
      </div>

      <div className="rounded-[22px] border border-black/10 bg-black px-4 py-3 text-white shadow-lg">
        <div className="text-[11px] text-white/70">Direct</div>
        <div className="text-sm font-semibold">{CONTACT.phoneDisplay}</div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-[#070707] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="text-lg font-semibold tracking-wide">keystne</div>
            <div className="mt-2 max-w-md text-sm text-white/65">
              Premium real estate services in Dubai — concierge relocation,
              brokerage & investments, leasing, and property management.
            </div>
          </div>
          <div className="grid gap-3 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <Icon name="map" className="h-4 w-4" /> Dubai, UAE
            </div>
            <div className="flex items-center gap-2">
              <Icon name="phone" className="h-4 w-4" /> {CONTACT.phoneDisplay}
            </div>
            <div className="flex items-center gap-2">
              <Icon name="mail" className="h-4 w-4" /> arthur@keystne.com •
              stuart@keystne.com
            </div>
          </div>
        </div>
        <div className="mt-10 text-[11px] text-white/45">
          © {new Date().getFullYear()} Keystne. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// ---------- Page ----------

export default function KeystnePrototype() {
  const [leadOpen, setLeadOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [prefill, setPrefill] = useState<Partial<LeadPayload> | undefined>(
    undefined
  );
  const [pendingLead, setPendingLead] = useState<LeadPayload | undefined>(
    undefined
  );

  const openLead = (p?: Partial<LeadPayload>) => {
    setPrefill(p);
    setLeadOpen(true);
  };

  const onBook = (lead: LeadPayload) => {
    setPendingLead(lead);
    setLeadOpen(false);
    setBookingOpen(true);
  };

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b]">
      {/* Global CSS animations (no extra deps) */}
      <style jsx global>{`
        .ks-slideUp {
          animation: ksSlideUp 520ms cubic-bezier(0.2, 0.9, 0.2, 1) both;
        }
        @keyframes ksSlideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .ks-fadeIn {
          animation: ksFadeIn 160ms ease-out both;
        }
        .ks-fadeOut {
          animation: ksFadeOut 160ms ease-in both;
        }
        @keyframes ksFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes ksFadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        .ks-popIn {
          animation: ksPopIn 180ms cubic-bezier(0.2, 0.9, 0.2, 1) both;
        }
        .ks-popOut {
          animation: ksPopOut 180ms ease-in both;
        }
        @keyframes ksPopIn {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes ksPopOut {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(14px) scale(0.985);
          }
        }
      `}</style>

      <Nav onOpenLead={() => openLead()} />
      <Hero onOpenLead={() => openLead()} />
      <ServicesGrid onJump={jump} />

      <SectionShell
        id="concierge"
        eyebrow="CONCIERGE"
        title="Relocation, handled personally."
        description="A bespoke journey — from finding a home to settling in, including school support if you have children."
      >
        <ConciergeCalculator onOpenLead={openLead} />
      </SectionShell>

      <SectionShell
        id="invest"
        eyebrow="BROKERAGE & INVESTMENTS"
        title="Invest with clarity."
        description="Top-of-page KPIs and investor tools go here (market value, projections, process timelines, yield comparison)."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {["Market size", "2026 outlook", "5-year projection"].map((k) => (
            <div
              key={k}
              className="rounded-[28px] border border-white/10 bg-white/5 p-6"
            >
              <div className="text-[11px] text-white/60">{k}</div>
              <div className="mt-2 text-2xl font-semibold">—</div>
              <div className="mt-2 text-xs text-white/55">
                Add public sources + a “source” drawer per KPI.
              </div>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="leasing"
        eyebrow="LEASING & RENTALS"
        title="Long-term living, simplified."
        description="Cost-of-stay calculator + trusted guidance — with area recommendations if you’re unsure."
      >
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-white/70">
          Leasing calculator module placeholder.
        </div>
      </SectionShell>

      <SectionShell
        id="management"
        eyebrow="PROPERTY MANAGEMENT"
        title="Performance, without the stress."
        description="Strategic advice, maintenance planning, and hands-on management — supported by your management platform."
      >
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-white/70">
          Property management module placeholder.
        </div>
      </SectionShell>

      <SectionShell
        id="about"
        eyebrow="ABOUT"
        title="Premium service. Serious network."
        description="Insert Keystne credentials and partner network here (from deck)."
      >
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-white/70">
          About section placeholder.
        </div>
      </SectionShell>

      <Footer />
      <ContactDock onLead={() => openLead()} />

      <LeadModal
        open={leadOpen}
        onClose={() => setLeadOpen(false)}
        prefill={prefill}
        onBook={onBook}
      />
      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        lead={pendingLead}
      />
    </div>
  );
}
