"use client";

import React, { useMemo, useState, useEffect } from "react";

/**
 * Concierge Page – single-file Next.js page (NO framer-motion, NO lucide-react)
 * - Premium hero + concierge proposition
 * - Relocation planner (simple logic)
 * - Lead modal (double email confirm + validation)
 * - Booking modal
 * - Sticky contact dock
 *
 * Drop into: ./app/concierge/page.tsx
 * Tailwind required.
 */

// -------------------- Inline Icons (no deps) --------------------

type IconProps = { className?: string; strokeWidth?: number };

function Svg({
  children,
  className = "h-4 w-4",
  strokeWidth = 2,
}: {
  children: React.ReactNode;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const PhoneIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.5a2 2 0 0 1-.45 2.11L8.1 9.4a16 16 0 0 0 6.5 6.5l1.07-1.05a2 2 0 0 1 2.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0 1 22 16.92z" />
  </Svg>
);

const MessageCircleIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.1 0-2.16-.2-3.14-.56L3 21l1.56-6.36c-.36-.98-.56-2.04-.56-3.14A8.5 8.5 0 1 1 21 11.5z" />
  </Svg>
);

const SendIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M22 2 11 13" />
    <path d="M22 2 15 22l-4-9-9-4 20-7z" />
  </Svg>
);

const MailIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M4 4h16v16H4z" opacity="0" />
    <path d="M4 6h16" />
    <path d="M4 6l8 7 8-7" />
    <path d="M4 18h16" opacity="0" />
    <path d="M4 6v12h16V6" />
  </Svg>
);

const CalendarIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <path d="M3 10h18" />
    <path d="M5 6h14a2 2 0 0 1 2 2v14H3V8a2 2 0 0 1 2-2z" />
  </Svg>
);

const MapPinIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11z" />
    <path d="M12 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
  </Svg>
);

const ChevronRightIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M9 18l6-6-6-6" />
  </Svg>
);

const XIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M18 6 6 18" />
    <path d="M6 6l12 12" />
  </Svg>
);

const CheckIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M20 6 9 17l-5-5" />
  </Svg>
);

const ShieldCheckIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 2 20 6v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" />
    <path d="M9 12l2 2 4-4" />
  </Svg>
);

const SparklesIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 2l1.2 4.2L17.4 7.5l-4.2 1.2L12 12l-1.2-3.3L6.6 7.5l4.2-1.3L12 2z" />
    <path d="M19 13l.7 2.3L22 16l-2.3.7L19 19l-.7-2.3L16 16l2.3-.7L19 13z" />
    <path d="M4 14l.7 2.3L7 17l-2.3.7L4 20l-.7-2.3L1 17l2.3-.7L4 14z" />
  </Svg>
);

const ArrowRightIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </Svg>
);

// -------------------- Helpers --------------------

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function formatPhoneHint(input: string) {
  return input.replace(/[^0-9+\s()-]/g, "");
}

// -------------------- Config --------------------

const BRAND = {
  name: "Keystne Concierge",
  city: "Dubai, UAE",
};

const CONTACT = {
  phoneDisplay: "+971 XX XXX XXXX",
  phoneTel: "tel:+971XXXXXXXXX",
  whatsappLink: "https://wa.me/971XXXXXXXXX",
  telegramLink: "https://t.me/keystne",
  emailPrimary: "mailto:arthur@keystne.com",
  emailSecondary: "mailto:stuart@keystne.com",
  wechatId: "keystne",
};

const MEDIA = {
  heroVideo:
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", // replace
};

const DUBAI_AREAS = [
  "Downtown Dubai",
  "Dubai Marina",
  "Business Bay",
  "Palm Jumeirah",
  "JBR (Jumeirah Beach Residence)",
  "JLT (Jumeirah Lake Towers)",
  "Dubai Hills Estate",
  "Arabian Ranches",
  "JVC (Jumeirah Village Circle)",
  "Dubai Creek Harbour",
  "City Walk",
  "Al Barsha",
  "The Springs",
  "Emirates Hills",
];

// -------------------- Types --------------------

type Household = "Single" | "Couple" | "Family";
type BudgetBand = "< 8k AED" | "8–15k AED" | "15–25k AED" | "25k+ AED";
type Channel =
  | "Call"
  | "WhatsApp"
  | "Telegram"
  | "WeChat"
  | "Email"
  | "Book a call";
type CallWhen = "ASAP" | "1 month" | "2 months" | "6 months";

type LeadPayload = {
  name: string;
  email: string;
  emailConfirm: string;
  phone: string;
  when: CallWhen;
  preferredChannel: Channel;
  message: string;
};

// -------------------- UI Primitives --------------------

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl">
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
      ? "bg-white text-black hover:bg-white/90"
      : variant === "outline"
      ? "border border-white/15 bg-transparent text-white hover:bg-white/10"
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
        <label className="text-xs font-medium tracking-wide text-white/80">
          {label} {required ? <span className="text-white/40">*</span> : null}
        </label>
        {hint ? (
          <span className="text-[11px] text-white/45">{hint}</span>
        ) : null}
      </div>
      <div
        className={`flex items-center gap-2 rounded-2xl border px-3 py-2 shadow-sm backdrop-blur-xl ${
          error
            ? "border-red-500/40 bg-red-500/5"
            : "border-white/10 bg-white/5"
        }`}
      >
        <input
          value={value}
          type={type}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
        />
        {right}
      </div>
      {error ? (
        <div className="text-[11px] text-red-300/90">{error}</div>
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
      <label className="text-xs font-medium tracking-wide text-white/80">
        {label} {required ? <span className="text-white/40">*</span> : null}
      </label>
      <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 shadow-sm backdrop-blur-xl">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-white outline-none"
        >
          <option value="">Select…</option>
          {options.map((o) => (
            <option key={o} value={o} className="text-black">
              {o}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Modal({
  open,
  onClose,
  title,
  children,
  subtitle,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 md:items-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0a0a] text-white shadow-2xl">
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
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// -------------------- Sections --------------------

function TopBar({ onOpenLead }: { onOpenLead: () => void }) {
  return (
    <div className="fixed left-0 right-0 top-0 z-40">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-4 flex items-center justify-between rounded-3xl border border-white/10 bg-black/70 px-4 py-3 text-white shadow-lg backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-white/10" />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide">
                {BRAND.name}
              </div>
              <div className="text-[11px] text-white/60">
                Relocation • Lifestyle • Setup
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-6 text-xs text-white/70 md:flex">
            <a className="hover:text-white" href="#scope">
              What we do
            </a>
            <a className="hover:text-white" href="#how">
              How it works
            </a>
            <a className="hover:text-white" href="#planner">
              Planner
            </a>
            <a className="hover:text-white" href="#faq">
              FAQ
            </a>
          </div>

          <Button variant="ghost" onClick={onOpenLead} className="text-white">
            Get started <ChevronRightIcon className="h-4 w-4" />
          </Button>
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
        src={MEDIA.heroVideo}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-[#0b0b0b]" />

      <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-4 pb-14 pt-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-white/75">
            <ShieldCheckIcon className="h-4 w-4" />
            Private • Bespoke • Handled end-to-end
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            Dubai move, done properly.
          </h1>

          <p className="mt-4 max-w-2xl text-base text-white/75 md:text-lg">
            We plan your relocation like a concierge should — home search,
            viewings, paperwork support, move-in setup, and the lifestyle
            details people forget until it’s stressful.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button onClick={onOpenLead} className="px-6">
              Get your plan <ArrowRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.assign("#planner")}
            >
              Use the planner
            </Button>
          </div>

          <div className="mt-6 grid max-w-2xl grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { k: "Response", v: "Same day" },
              { k: "Viewings", v: "Curated" },
              { k: "Setup", v: "Move-in ready" },
              { k: "Privacy", v: "Always" },
            ].map((x) => (
              <div
                key={x.k}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="text-[11px] text-white/55">{x.k}</div>
                <div className="mt-1 text-sm font-semibold">{x.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Scope() {
  const items = [
    {
      title: "Home search & shortlisting",
      desc: "We narrow the market quickly based on your lifestyle, commute, and budget.",
    },
    {
      title: "Viewings & negotiation support",
      desc: "Curated tours, fast comparisons, and support through offers and terms.",
    },
    {
      title: "Paperwork & move-in support",
      desc: "Guidance on the process steps so you don’t lose time or miss details.",
    },
    {
      title: "Lifestyle setup",
      desc: "Utilities, SIM, school shortlists, clinic proximity, and local essentials.",
    },
  ];

  return (
    <section id="scope" className="bg-[#0b0b0b] text-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="max-w-3xl">
          <div className="text-[11px] tracking-[0.18em] text-white/55">
            CONCIERGE SCOPE
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            What we do, end-to-end.
          </h2>
          <p className="mt-3 text-white/70">
            This is not “send me listings and good luck.” It’s a managed
            relocation — designed to reduce stress and wasted time.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {items.map((i) => (
            <Card key={i.title}>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <SparklesIcon className="h-4 w-4" />
                  Included
                </div>
                <div className="mt-2 text-xl font-semibold">{i.title}</div>
                <div className="mt-2 text-sm text-white/70">{i.desc}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ onOpenLead }: { onOpenLead: () => void }) {
  const steps = [
    {
      n: "01",
      t: "Profile",
      d: "We capture your needs, lifestyle, and timeline.",
    },
    { n: "02", t: "Curate", d: "We shortlist options that actually match." },
    { n: "03", t: "View", d: "We plan viewings efficiently and compare fast." },
    {
      n: "04",
      t: "Close",
      d: "We support through terms, deposit, and move-in prep.",
    },
  ];

  return (
    <section id="how" className="bg-[#0b0b0b] text-white">
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="text-[11px] tracking-[0.18em] text-white/55">
                PROCESS
              </div>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                How it works (simple).
              </h3>
              <p className="mt-2 text-sm text-white/70">
                You’ll always know what’s next, what we need from you, and what
                we’re handling for you.
              </p>
            </div>
            <Button variant="outline" onClick={onOpenLead}>
              Start now <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {steps.map((s) => (
              <div
                key={s.n}
                className="rounded-3xl border border-white/10 bg-white/5 p-5"
              >
                <div className="text-[11px] text-white/55">{s.n}</div>
                <div className="mt-2 text-base font-semibold">{s.t}</div>
                <div className="mt-2 text-sm text-white/70">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Planner({ onPrefill }: { onPrefill: (msg: string) => void }) {
  const [country, setCountry] = useState("");
  const [household, setHousehold] = useState<Household | "">("");
  const [kids, setKids] = useState<"No" | "Yes">("No");
  const [relocationDate, setRelocationDate] = useState("");
  const [areaKnown, setAreaKnown] = useState<"No" | "Yes">("No");
  const [area, setArea] = useState("");
  const [budget, setBudget] = useState<BudgetBand | "">("");

  const outputs = useMemo(() => {
    let baseWeeks = 5;
    if (household === "Family") baseWeeks += 2;
    if (kids === "Yes") baseWeeks += 2;
    if (areaKnown === "No") baseWeeks += 1;

    let complexity = 1;
    if (household === "Couple") complexity = 1.15;
    if (household === "Family") complexity = 1.35;
    if (kids === "Yes") complexity += 0.15;

    const baseBudgetMap: Record<string, [number, number]> = {
      "< 8k AED": [4500, 9000],
      "8–15k AED": [7000, 14000],
      "15–25k AED": [10000, 20000],
      "25k+ AED": [12000, 28000],
    };

    const [min, max] =
      budget && baseBudgetMap[budget] ? baseBudgetMap[budget] : [0, 0];
    const estMin = Math.round(min * complexity);
    const estMax = Math.round(max * complexity);

    return { weeks: baseWeeks, estMin, estMax };
  }, [household, kids, areaKnown, budget]);

  const canContinue =
    !!country &&
    !!household &&
    !!relocationDate &&
    (areaKnown === "Yes" ? !!area : !!budget);

  const prefillMessage = () => {
    const msg = [
      `Concierge planner request:`,
      `Origin: ${country || "-"}`,
      `Household: ${household || "-"}`,
      `Kids: ${kids}`,
      `Target date: ${relocationDate || "-"}`,
      `Preferred area known: ${areaKnown}`,
      `Area: ${areaKnown === "Yes" ? area || "-" : "TBD"}`,
      `Budget band: ${areaKnown === "No" ? budget || "-" : "N/A"}`,
      `Planner output: ~${outputs.weeks} weeks. Est. band: ${
        outputs.estMin ? `${outputs.estMin}–${outputs.estMax} AED` : "TBD"
      }`,
    ].join(" | ");
    onPrefill(msg);
  };

  return (
    <section id="planner" className="bg-[#0b0b0b] text-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="max-w-3xl">
          <div className="text-[11px] tracking-[0.18em] text-white/55">
            PLANNER
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Plan your move in 60 seconds.
          </h2>
          <p className="mt-3 text-white/70">
            Quick inputs. You’ll get a realistic timeline and we’ll take it from
            there.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card>
            <div className="p-6">
              <div className="text-sm font-semibold">Your details</div>
              <div className="mt-1 text-xs text-white/60">
                This is a preview — we’ll confirm everything on a call.
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
                  onChange={(v) => setHousehold(v as Household)}
                  options={["Single", "Couple", "Family"]}
                  required
                />

                <Select
                  label="Kids"
                  value={kids}
                  onChange={(v) => setKids(v as "No" | "Yes")}
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
                    setAreaKnown(v as "No" | "Yes");
                    setArea("");
                    setBudget("");
                  }}
                  options={["No", "Yes"]}
                />

                {areaKnown === "Yes" ? (
                  <Select
                    label="Preferred area"
                    value={area}
                    onChange={setArea}
                    options={DUBAI_AREAS}
                    required
                  />
                ) : (
                  <Select
                    label="Monthly budget band"
                    value={budget}
                    onChange={(v) => setBudget(v as BudgetBand)}
                    options={[
                      "< 8k AED",
                      "8–15k AED",
                      "15–25k AED",
                      "25k+ AED",
                    ]}
                    required
                  />
                )}

                <Button
                  onClick={prefillMessage}
                  disabled={!canContinue}
                  className="mt-2"
                >
                  Continue <ChevronRightIcon className="h-4 w-4" />
                </Button>

                <div className="text-[11px] text-white/45">
                  Indicative only — final timeline and costs depend on inventory
                  and your preferences.
                </div>
              </div>
            </div>
          </Card>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-2 text-xs text-white/70">
              <CheckIcon className="h-4 w-4" />
              Your preview
            </div>

            <div className="mt-4 rounded-3xl border border-white/10 bg-black/30 p-5">
              <div className="text-[11px] text-white/60">
                Estimated timeline
              </div>
              <div className="mt-2 text-4xl font-semibold">
                ~{outputs.weeks} weeks
              </div>
              <div className="mt-2 text-sm text-white/70">
                From profiling → shortlist → viewings → move-in setup.
              </div>
            </div>

            <div className="mt-4 rounded-3xl border border-white/10 bg-black/30 p-5">
              <div className="text-[11px] text-white/60">
                Estimated support band
              </div>
              <div className="mt-2 text-2xl font-semibold">
                {outputs.estMin
                  ? `${outputs.estMin.toLocaleString()}–${outputs.estMax.toLocaleString()} AED`
                  : "TBD"}
              </div>
              <div className="mt-2 text-sm text-white/70">
                This is a placeholder band (not a quote). We confirm after a
                short call.
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {[
                "Shortlist in 48–72 hrs once profiled",
                "Viewings planned efficiently",
                "Move-in essentials checklist",
                "Privacy-first communication",
              ].map((x) => (
                <div
                  key={x}
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/75"
                >
                  {x}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LeadModal({
  open,
  onClose,
  prefillMessage,
  onBook,
}: {
  open: boolean;
  onClose: () => void;
  prefillMessage?: string;
  onBook: (lead: LeadPayload) => void;
}) {
  const [payload, setPayload] = useState<LeadPayload>(() => ({
    name: "",
    email: "",
    emailConfirm: "",
    phone: "",
    when: "ASAP",
    preferredChannel: "Book a call",
    message: prefillMessage || "",
  }));

  useEffect(() => {
    if (!open) return;
    setPayload((p) => ({ ...p, message: prefillMessage || p.message }));
  }, [open, prefillMessage]);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!payload.name.trim()) e.name = "Enter your name.";
    if (!payload.email.trim()) e.email = "Enter your email.";
    else if (!isValidEmail(payload.email)) e.email = "Email looks incorrect.";
    if (!payload.emailConfirm.trim()) e.emailConfirm = "Confirm your email.";
    else if (payload.emailConfirm.trim() !== payload.email.trim())
      e.emailConfirm = "Emails do not match.";
    if (!payload.phone.trim()) e.phone = "Enter a phone number.";
    return e;
  }, [payload]);

  const canSubmit = Object.keys(errors).length === 0;

  const submit = () => {
    if (payload.preferredChannel === "Book a call" && payload.when === "ASAP") {
      onBook(payload);
      return;
    }
    alert("Captured (prototype). Wire to CRM + notifications.");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Get your concierge plan"
      subtitle="We’ll contact you via your preferred channel."
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
              <CheckIcon className="h-4 w-4 text-white/70" />
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
            setPayload((p) => ({ ...p, preferredChannel: v as Channel }))
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
          <label className="text-xs font-medium tracking-wide text-white/80">
            Notes (optional)
          </label>
          <textarea
            value={payload.message}
            onChange={(e) =>
              setPayload((p) => ({ ...p, message: e.target.value }))
            }
            placeholder="Tell us your target move date, preferred areas, and anything important."
            className="mt-1 h-28 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35"
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-[11px] text-white/55">
            By submitting, you agree we can contact you about this request.
          </div>
          <Button onClick={submit} disabled={!canSubmit}>
            Continue <ChevronRightIcon className="h-4 w-4" />
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
      `Booked (prototype): ${date} ${time}\n${lead?.name} • ${lead?.email}`
    );
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Schedule your call"
      subtitle="Pick a time that suits you — we’ll confirm."
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
        </div>

        <div className="md:col-span-2 flex items-center justify-end">
          <Button onClick={book} disabled={!canBook}>
            Confirm booking <CalendarIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function ContactDock({ onLead }: { onLead: () => void }) {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-2">
      <div className="rounded-[22px] border border-white/10 bg-white/80 p-2 text-black shadow-lg backdrop-blur-xl">
        <a
          href={CONTACT.phoneTel}
          className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm hover:bg-black/5"
        >
          <PhoneIcon className="h-4 w-4" />
          Call
        </a>
        <a
          href={CONTACT.whatsappLink}
          className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm hover:bg-black/5"
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircleIcon className="h-4 w-4" />
          WhatsApp
        </a>
        <a
          href={CONTACT.telegramLink}
          className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm hover:bg-black/5"
          target="_blank"
          rel="noreferrer"
        >
          <SendIcon className="h-4 w-4" />
          Telegram
        </a>
        <button
          onClick={onLead}
          className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm hover:bg-black/5"
        >
          <CalendarIcon className="h-4 w-4" />
          Book a call
        </button>
        <a
          href={CONTACT.emailPrimary}
          className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm hover:bg-black/5"
        >
          <MailIcon className="h-4 w-4" />
          Email
        </a>
        <div className="px-3 py-2 text-[11px] text-black/55">
          WeChat:{" "}
          <span className="font-medium text-black/70">{CONTACT.wechatId}</span>
        </div>
      </div>

      <div className="rounded-[22px] border border-white/10 bg-black px-4 py-3 text-white shadow-lg">
        <div className="text-[11px] text-white/70">Direct</div>
        <div className="text-sm font-semibold">{CONTACT.phoneDisplay}</div>
      </div>
    </div>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "How fast can you start?",
      a: "Same day. We’ll profile your needs and start curating options immediately.",
    },
    {
      q: "Do you handle school planning?",
      a: "Yes — we’ll shortlist based on location, commute, and your preferences.",
    },
    {
      q: "Is the planner a quote?",
      a: "No. It’s an indicative band to set expectations. Final details come after a quick call.",
    },
    {
      q: "How do we communicate?",
      a: "Whatever you prefer — WhatsApp, call, email, Telegram, WeChat, or a scheduled call.",
    },
  ];

  return (
    <section id="faq" className="bg-[#0b0b0b] text-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="max-w-3xl">
          <div className="text-[11px] tracking-[0.18em] text-white/55">FAQ</div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Quick answers.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {faqs.map((f) => (
            <div
              key={f.q}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="text-base font-semibold">{f.q}</div>
              <div className="mt-2 text-sm text-white/70">{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#070707] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="text-lg font-semibold tracking-wide">
              {BRAND.name}
            </div>
            <div className="mt-2 max-w-md text-sm text-white/65">
              Premium relocation concierge in Dubai — curated support, private
              comms, and a simple process.
            </div>
          </div>
          <div className="grid gap-3 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4" /> {BRAND.city}
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4" /> {CONTACT.phoneDisplay}
            </div>
            <div className="flex items-center gap-2">
              <MailIcon className="h-4 w-4" /> arthur@keystne.com •
              stuart@keystne.com
            </div>
          </div>
        </div>
        <div className="mt-10 text-[11px] text-white/45">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// -------------------- Page --------------------

export default function ConciergePage() {
  const [leadOpen, setLeadOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [prefillMsg, setPrefillMsg] = useState<string | undefined>(undefined);
  const [pendingLead, setPendingLead] = useState<LeadPayload | undefined>(
    undefined
  );

  const openLead = (msg?: string) => {
    setPrefillMsg(msg);
    setLeadOpen(true);
  };

  const onBook = (lead: LeadPayload) => {
    setPendingLead(lead);
    setLeadOpen(false);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b]">
      <TopBar onOpenLead={() => openLead()} />
      <Hero onOpenLead={() => openLead()} />

      <Scope />
      <HowItWorks onOpenLead={() => openLead()} />
      <Planner onPrefill={(msg) => openLead(msg)} />
      <FAQ />
      <Footer />

      <ContactDock onLead={() => openLead()} />

      <LeadModal
        open={leadOpen}
        onClose={() => setLeadOpen(false)}
        prefillMessage={prefillMsg}
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
