"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import KeystneNav from "../../components/site/KeystneNav";
import KeystneFooter from "../../components/site/KeystneFooter";
import { CONTACT } from "../../components/site/config";

/** Investments — Invest with clarity (UPDATED per Arthur)
 * Changes made ONLY:
 * 1) Hide top nav when user starts scrolling down (re-appears when scrolling up)
 * 2) Make currency selector more visually prominent (bigger + less “calculator” feel)
 * Everything else kept as-is.
 */

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

function parseNumber(v: string) {
  const n = Number(String(v || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** Simple inline icons (NO lucide-react) */
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
    | "refresh";
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
    case "refresh":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M21 12a9 9 0 1 1-3-6.7" />
          <path d="M21 3v6h-6" />
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
  widthClass = "max-w-2xl",
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
  inputMode = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      inputMode={inputMode}
      className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/30"
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={[
        "w-full bg-transparent text-sm text-black outline-none",
        className,
      ].join(" ")}
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

/** Contact dock — same vibe/size as other pages */
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
              subject: "Keystne enquiry",
              body: "Hi Keystne team,\n\nI'd like to enquire about:\n\nName:\nPhone:\nPreferred contact time:\nDetails:\n\nThank you",
            })}
          >
            <Icon name="mail" /> Email
          </a>
          <div className="flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] font-semibold text-black/55">
            WeChat ID: {CONTACT.wechatText || "keystne"}
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

/* ---------- Investment Calculator ---------- */

const CURRENCIES = [
  "AED",
  "USD",
  "GBP",
  "EUR",
  "CAD",
  "AUD",
  "NZD",
  "CHF",
  "SGD",
  "ZAR",
  "NGN",
  "KES",
  "UGX",
  "RWF",
  "INR",
  "PKR",
];

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
  "Al Barsha",
  "Dubai Creek Harbour",
];

const COMMUNITY_FACTOR: Record<string, number> = {
  "Downtown Dubai": 1.05,
  DIFC: 1.05,
  "City Walk": 1.04,
  "Palm Jumeirah": 1.08,
  "Dubai Marina": 1.03,
  JBR: 1.03,
  "Dubai Hills Estate": 1.02,
  "Dubai Creek Harbour": 1.01,
  "Business Bay": 1.0,
  JLT: 0.98,
  "Arabian Ranches": 0.99,
  JVC: 0.96,
  "Al Barsha": 0.97,
};

type Strategy =
  | "Long-term lease"
  | "Short-term (Airbnb)"
  | "Mid-term (1–6 months)"
  | "Off-plan flip";

const STRATEGIES: Strategy[] = [
  "Long-term lease",
  "Short-term (Airbnb)",
  "Mid-term (1–6 months)",
  "Off-plan flip",
];

function defaultAssumptions(strategy: Strategy) {
  if (strategy === "Long-term lease") {
    return { netYield: 5.5, occupancy: 92, seasonalityUplift: 0 };
  }
  if (strategy === "Short-term (Airbnb)") {
    return { netYield: 7.5, occupancy: 75, seasonalityUplift: 18 };
  }
  if (strategy === "Mid-term (1–6 months)") {
    return { netYield: 6.5, occupancy: 82, seasonalityUplift: 8 };
  }
  // Off-plan flip (no occupancy; treat as annualised uplift)
  return { netYield: 10.0, occupancy: 0, seasonalityUplift: 0 };
}

type ShortlistCapture = {
  name: string;
  email: string;
  email2: string;
  phone: string;
};

export default function InvestmentsPage() {
  // NAV hide on scroll down / show on scroll up (disappear as soon as scrolling starts)
  const [navHidden, setNavHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const delta = y - lastY.current;

      if (y > 0 && delta > 0) setNavHidden(true);
      if (delta < 0) setNavHidden(false);

      lastY.current = y;
    };
    lastY.current = window.scrollY || 0;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // FX
  const [currency, setCurrency] = useState<string>("USD");
  const [depositLocal, setDepositLocal] = useState<string>("20000");
  const [fx, setFx] = useState<number | null>(null); // 1 CUR = fx AED
  const [fxNote, setFxNote] = useState<string>("");
  const [fxLoading, setFxLoading] = useState(false);

  // Buying power
  const [depositPct, setDepositPct] = useState<number>(10); // min 10
  const [community, setCommunity] = useState<string>("Downtown Dubai");

  // Strategy (percentages only)
  const [strategy, setStrategy] = useState<Strategy>("Long-term lease");

  // Lead gen modal
  const [shortlistOpen, setShortlistOpen] = useState(false);
  const [capture, setCapture] = useState<ShortlistCapture>({
    name: "",
    email: "",
    email2: "",
    phone: "",
  });

  const depositLocalNum = useMemo(
    () => parseNumber(depositLocal),
    [depositLocal]
  );

  const refreshFx = async () => {
    if (!currency) return;
    setFxLoading(true);
    setFx(null);
    setFxNote("");
    try {
      // free FX endpoint (no key) — base = selected currency
      const res = await fetch(`https://open.er-api.com/v6/latest/${currency}`);
      const json = await res.json();
      const rate = json?.rates?.AED;
      if (!rate || !Number.isFinite(rate)) throw new Error("No AED rate");
      setFx(rate);
      const updated = json?.time_last_update_utc || "";
      setFxNote(updated ? `FX updated: ${updated}` : "FX updated (live)");
    } catch {
      setFxNote("Could not fetch live FX right now — try refresh again.");
    } finally {
      setFxLoading(false);
    }
  };

  useEffect(() => {
    refreshFx();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  const depositAED = useMemo(() => {
    if (!depositLocalNum) return 0;
    if (currency === "AED") return depositLocalNum;
    if (!fx) return 0;
    return depositLocalNum * fx;
  }, [depositLocalNum, currency, fx]);

  const pctSafe = useMemo(
    () => Math.max(10, Math.min(60, depositPct)),
    [depositPct]
  );

  const estimatedPropertyValue = useMemo(() => {
    if (!depositAED || !pctSafe) return 0;
    const base = depositAED / (pctSafe / 100);
    const factor = COMMUNITY_FACTOR[community] ?? 1;
    return base * factor;
  }, [depositAED, pctSafe, community]);

  const assumptions = useMemo(() => defaultAssumptions(strategy), [strategy]);

  // Errors for shortlist
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

  const canSend = Object.keys(emailErrors).length === 0;

  const openShortlistEmail = () => {
    const factor = COMMUNITY_FACTOR[community] ?? 1;
    const body = [
      "KEYSTNE — SHORTLIST REQUEST (INVESTMENTS)",
      "",
      `Client name: ${capture.name}`,
      `Client email: ${capture.email}`,
      `Client phone: ${capture.phone}`,
      "",
      "Inputs:",
      `- Deposit (local): ${depositLocalNum || 0} ${currency}`,
      `- FX: ${
        currency === "AED"
          ? "n/a (AED)"
          : fx
          ? `1 ${currency} = ${fx} AED`
          : "not available"
      }`,
      `- Deposit in AED (estimate): ${
        depositAED ? `${Math.round(depositAED).toLocaleString()} AED` : "—"
      }`,
      `- Deposit % assumed: ${pctSafe}%`,
      `- Desired community: ${community} (factor ${factor})`,
      `- Strategy: ${strategy}`,
      "",
      "Outputs (illustrative):",
      `- Estimated buying power (property value): ${
        estimatedPropertyValue
          ? `${Math.round(estimatedPropertyValue).toLocaleString()} AED`
          : "—"
      }`,
      `- Net yield (illustrative): ${assumptions.netYield}% p.a.`,
      strategy === "Off-plan flip"
        ? `- Annualised uplift (illustrative): ${assumptions.netYield}% (no occupancy)`
        : `- Occupancy (illustrative): ${assumptions.occupancy}%`,
      strategy === "Short-term (Airbnb)"
        ? `- Seasonality uplift (illustrative): +${assumptions.seasonalityUplift}% in peak months`
        : "",
      "",
      "Note:",
      "- We’ll validate with real comparable listings and current market conditions.",
      "- This is guidance only (not financial advice).",
      "",
      fxNote ? `FX note: ${fxNote}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = buildMailto({
      subject: "Keystne — Shortlist request (Investments)",
      body,
    });
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* NAV (forced white top bar background + black text) */}
      <div
        className={[
          "fixed left-0 right-0 top-0 z-50 bg-white text-black transition-all duration-300",
          navHidden ? "-translate-y-28 opacity-0 pointer-events-none" : "",
        ].join(" ")}
      >
        <KeystneNav />
      </div>

      {/* PAGE */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-28">
          <div className="text-[11px] tracking-[0.22em] text-black/55">
            INVESTMENTS
          </div>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight text-black md:text-6xl">
            Invest with clarity.
          </h1>
          <p className="mt-4 max-w-3xl text-sm text-black/65">
            Quickly model what your deposit could unlock — then compare
            investment approaches (illustrative).
          </p>

          {/* Discover communities button (hover gold like rest) */}
          <div className="mt-6">
            <Link
              href="/communities"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black/70 hover:bg-[#C8A45D] hover:text-black"
            >
              Discover communities <Icon name="arrow" />
            </Link>
          </div>

          {/* Stacked layout: calculator on top, what this means below */}
          <div className="mt-6 grid gap-6">
            {/* CALCULATOR */}
            <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-ks">
              <div className="text-[11px] tracking-[0.22em] text-black/55">
                CALCULATOR
              </div>
              <div className="mt-2 text-2xl font-semibold text-black">
                Deposit → estimated buying power
              </div>
              <div className="mt-2 text-sm text-black/65">
                Enter your deposit in your local currency. We convert to AED
                (live FX when available), then estimate what property value that
                could unlock (illustrative).
              </div>

              <div className="mt-5 grid gap-4">
                <FieldShell
                  label="Your deposit (local)"
                  required
                  hint="Choose your currency + type an amount"
                >
                  {/* ONLY VISUAL CHANGE: make currency selector stand out more */}
                  <div className="grid gap-3 md:grid-cols-[0.6fr_1.4fr]">
                    <div className="rounded-2xl border border-black/10 bg-white px-3 py-3 shadow-sm">
                      <div className="text-[10px] tracking-[0.22em] text-black/45">
                        CURRENCY
                      </div>
                      <div className="mt-1">
                        <SelectInput
                          value={currency}
                          onChange={setCurrency}
                          options={CURRENCIES}
                          className="text-[15px] font-semibold text-black"
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-white px-3 py-3 shadow-sm">
                      <div className="text-[10px] tracking-[0.22em] text-black/45">
                        AMOUNT
                      </div>
                      <div className="mt-1">
                        <TextInput
                          value={depositLocal}
                          onChange={setDepositLocal}
                          placeholder="e.g., 20000"
                          inputMode="decimal"
                        />
                      </div>
                    </div>
                  </div>
                </FieldShell>

                <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] text-black/50">
                        Deposit in AED (estimate)
                      </div>
                      <div className="mt-1 text-xl font-semibold text-black">
                        {depositAED
                          ? `${Math.round(depositAED).toLocaleString()} AED`
                          : "—"}
                      </div>
                      <div className="mt-1 text-[11px] text-black/45">
                        {currency === "AED"
                          ? "No conversion needed."
                          : fx
                          ? `1 ${currency} = ${fx.toFixed(4)} AED`
                          : "FX not available."}{" "}
                        {fxNote ? `• ${fxNote}` : ""}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={refreshFx}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black/70 hover:bg-black/5"
                    >
                      <Icon name="refresh" /> Refresh FX
                    </button>
                  </div>
                  {fxLoading ? (
                    <div className="mt-2 text-[11px] text-black/55">
                      Fetching live FX…
                    </div>
                  ) : null}
                </div>

                <FieldShell
                  label="Deposit percentage assumed (minimum 10%)"
                  required
                  hint="Illustrative only"
                >
                  <div className="grid gap-3">
                    <input
                      type="range"
                      min={10}
                      max={60}
                      value={pctSafe}
                      onChange={(e) => setDepositPct(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-[12px] text-black/60">
                      <span>10%</span>
                      <span className="font-semibold text-black">
                        {pctSafe}%
                      </span>
                      <span>60%</span>
                    </div>
                  </div>
                </FieldShell>

                <FieldShell
                  label="Desired community"
                  required
                  hint="Affects estimate (illustrative factor)"
                >
                  <SelectInput
                    value={community}
                    onChange={setCommunity}
                    options={COMMUNITIES}
                  />
                </FieldShell>

                <FieldShell
                  label="Investment approach"
                  required
                  hint="Percentages only (no monetary promises)"
                >
                  <Segmented
                    value={strategy}
                    onChange={(v) => setStrategy(v as Strategy)}
                    options={STRATEGIES}
                  />
                </FieldShell>

                {/* RESULT */}
                <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-4">
                  <div className="text-[11px] tracking-[0.22em] text-black/55">
                    RESULT
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <div className="text-[11px] text-black/50">
                        Estimated buying power (property value)
                      </div>
                      <div className="mt-1 text-2xl font-semibold text-black">
                        {estimatedPropertyValue
                          ? `${Math.round(
                              estimatedPropertyValue
                            ).toLocaleString()} AED`
                          : "—"}
                      </div>
                      <div className="mt-1 text-[11px] text-black/45">
                        Uses deposit AED ÷ deposit% × community factor
                        (illustrative).
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <div className="text-[11px] text-black/50">
                        Strategy snapshot (illustrative)
                      </div>
                      <div className="mt-2 space-y-2 text-sm text-black/75">
                        <div className="flex items-center justify-between">
                          <span>Net yield</span>
                          <span className="font-semibold text-black">
                            {assumptions.netYield}% p.a.
                          </span>
                        </div>
                        {strategy === "Off-plan flip" ? (
                          <div className="flex items-center justify-between">
                            <span>Annualised uplift</span>
                            <span className="font-semibold text-black">
                              {assumptions.netYield}%
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span>Occupancy</span>
                            <span className="font-semibold text-black">
                              {assumptions.occupancy}%
                            </span>
                          </div>
                        )}
                        {strategy === "Short-term (Airbnb)" ? (
                          <div className="flex items-center justify-between">
                            <span>Peak-season uplift</span>
                            <span className="font-semibold text-black">
                              +{assumptions.seasonalityUplift}%
                            </span>
                          </div>
                        ) : null}
                        <div className="text-[11px] text-black/45">
                          These are indicative ranges for explanation only — we
                          validate with real comps.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setShortlistOpen(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/90"
                    >
                      Get a shortlist <Icon name="arrow" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* INTERPRETATION */}
            <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-ks">
              <div className="text-[11px] tracking-[0.22em] text-black/55">
                WHAT THIS MEANS
              </div>
              <div className="mt-2 text-2xl font-semibold text-black">
                Quick interpretation
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-black/10 bg-white px-4 py-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="mt-[2px] inline-flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
                      <Icon name="check" className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-black">
                        Deposit → buying power
                      </div>
                      <div className="mt-1 text-sm text-black/65">
                        We convert your deposit to AED and estimate the property
                        value it could unlock at your chosen deposit %.
                        Community selection adjusts the estimate (illustrative).
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white px-4 py-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="mt-[2px] inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#C8A45D] text-black">
                      <Icon name="check" className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-black">
                        Strategy options (finance-aware)
                      </div>
                      <div className="mt-1 text-sm text-black/65">
                        Long-term is typically steadier. Short-term can
                        outperform in peak tourism months but swings more.
                        Mid-term sits between. Off-plan flips are
                        timing-dependent. We’ll validate assumptions with comps.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white px-4 py-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="mt-[2px] inline-flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
                      <Icon name="check" className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-black">
                        Next step (premium)
                      </div>
                      <div className="mt-1 text-sm text-black/65">
                        We translate this into a real plan: shortlist,
                        comparable listings, fees, vacancy assumptions,
                        furnishing (if relevant), and a clear go / no-go view.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-black/10 bg-white px-4 py-4 shadow-sm">
                  <div className="text-sm text-black/65">
                    Want us to validate this with real comparables for{" "}
                    <span className="font-semibold text-black">
                      {community}
                    </span>
                    ?
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShortlistOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/90"
                  >
                    Get a shortlist <Icon name="arrow" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer outside the box (plain black on white) */}
          <div className="mt-10 max-w-5xl">
            <div className="text-[11px] tracking-[0.22em] text-black/55">
              T&amp;Cs
            </div>
            <div className="mt-2 text-sm text-black/70">
              <p className="mb-2">
                <span className="font-semibold text-black">Disclaimer:</span>{" "}
                This calculator is illustrative only. Keystne is not a financial
                institution and does not provide financial advice. All estimates
                depend on market conditions, unit type, building quality,
                service charges, financing, and your personal profile.
              </p>
              <p className="mb-2">
                FX rates are indicative and can change daily.
                Yields/occupancy/uplift figures shown are general guidance used
                to explain investment patterns — we validate assumptions with
                live comparables during a call.
              </p>
            </div>
          </div>
        </div>
      </section>

      <KeystneFooter />
      <ContactDock />

      {/* Shortlist modal (email to Arthur + Stuart via mailto) */}
      <Modal
        open={shortlistOpen}
        onClose={() => setShortlistOpen(false)}
        title="Get a shortlist"
        subtitle="Share your details — we’ll respond with curated options (lead-gen)."
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

          <div className="md:col-span-2 rounded-2xl border border-black/10 bg-black/[0.03] p-4 text-sm text-black/70">
            We’ll use your inputs to send a first-pass shortlist — then validate
            with real comps on a quick call.
          </div>

          <div className="md:col-span-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShortlistOpen(false)}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black/70 hover:bg-black/5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={openShortlistEmail}
              disabled={!canSend}
              className={[
                "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition",
                canSend
                  ? "bg-[#C8A45D] text-black hover:brightness-110"
                  : "bg-black/10 text-black/35 cursor-not-allowed",
              ].join(" ")}
            >
              Open email <Icon name="arrow" />
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
