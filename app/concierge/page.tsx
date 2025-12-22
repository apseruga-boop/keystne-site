"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import KeystneNav from "../../components/site/KeystneNav";
import KeystneFooter from "../../components/site/KeystneFooter";
import { CONTACT, HOME_VIDEOS } from "../../components/site/config";

/**
 * PAGE 2 — CONCIERGE (UPDATED)
 * Changes (ONLY what Arthur asked):
 * - Remove “Dubai” from top pill (now just CONCIERGE)
 * - Add Dubai time pill (same vibe as homepage; stable position)
 * - Remove “Back to home”
 * - Add “Compare” calculator button (salary + FX to AED, T&Cs, contact / refresh / email)
 * - Reduce spacing above option cards
 * - PROMISE box -> white background + black text; bring it up a bit
 * - Relocation wizard: origin country dropdown (no typing)
 * - Remove monthly running costs step from relocation (handled by Compare)
 * - Relocation summary: more bespoke + visa pathway guidance (high-level) + key move checklist
 * - Viewing trip finish: 10-step tick-box plan (generated from answers)
 * - Keep everything else as-is
 */

type ConciergeFlow = "relocation" | "viewing" | null;

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

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
    | "calendar"
    | "wechat"
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
          className="h-full rounded-full bg-[#C8A45D] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** Dubai time pill (stable) */
function DubaiTimePill() {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const timeText = useMemo(() => {
    try {
      return new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Dubai",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(now);
    } catch {
      return now.toLocaleTimeString();
    }
  }, [now]);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/90 px-4 py-2 text-[12px] font-semibold text-black shadow-ks backdrop-blur">
      <span className="h-2 w-2 rounded-full bg-[#C8A45D]" />
      Dubai time: <span className="text-black/75">{timeText}</span>
    </div>
  );
}

/** Contact dock — matches locked homepage style (white dock, gold hover) */
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
          <Icon name="whatsapp" className="h-4 w-4" />
          WhatsApp us
        </a>

        <div className="mt-2 grid gap-1">
          <a
            className="flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] font-semibold text-black/75 hover:bg-[#C8A45D] hover:text-black"
            href={CONTACT.phoneTel}
          >
            <Icon name="phone" />
            Call
          </a>

          <a
            className="flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] font-semibold text-black/75 hover:bg-[#C8A45D] hover:text-black"
            href={CONTACT.telegramLink}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="telegram" />
            Telegram
          </a>

          <a
            className="flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] font-semibold text-black/75 hover:bg-[#C8A45D] hover:text-black"
            href={buildMailto({
              subject: "Keystne enquiry",
              body: "Hi Keystne team,\n\nI'd like to enquire about:\n\nName:\nPhone:\nPreferred contact time:\nDetails:\n\nThank you",
            })}
          >
            <Icon name="mail" />
            Email
          </a>

          <div className="flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] font-semibold text-black/55">
            <Icon name="wechat" />
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

/* ---------- Compare Calculator (modal) ---------- */

const COUNTRIES = [
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Canada",
  "Australia",
  "New Zealand",
  "Ireland",
  "France",
  "Germany",
  "Netherlands",
  "Belgium",
  "Spain",
  "Italy",
  "Portugal",
  "Switzerland",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "South Africa",
  "Nigeria",
  "Ghana",
  "Kenya",
  "Uganda",
  "Rwanda",
  "Tanzania",
  "Ethiopia",
  "Egypt",
  "Morocco",
  "Algeria",
  "Tunisia",
  "Turkey",
  "Saudi Arabia",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Oman",
  "India",
  "Pakistan",
  "Bangladesh",
  "Sri Lanka",
  "Philippines",
  "Indonesia",
  "Malaysia",
  "Singapore",
  "China",
  "Japan",
  "South Korea",
  "Brazil",
  "Mexico",
  "Argentina",
  "Colombia",
];

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  "United Arab Emirates": "AED",
  "United Kingdom": "GBP",
  "United States": "USD",
  Canada: "CAD",
  Australia: "AUD",
  "New Zealand": "NZD",
  Ireland: "EUR",
  France: "EUR",
  Germany: "EUR",
  Netherlands: "EUR",
  Belgium: "EUR",
  Spain: "EUR",
  Italy: "EUR",
  Portugal: "EUR",
  Switzerland: "CHF",
  Sweden: "SEK",
  Norway: "NOK",
  Denmark: "DKK",
  Finland: "EUR",
  "South Africa": "ZAR",
  Nigeria: "NGN",
  Ghana: "GHS",
  Kenya: "KES",
  Uganda: "UGX",
  Rwanda: "RWF",
  Tanzania: "TZS",
  Ethiopia: "ETB",
  Egypt: "EGP",
  Morocco: "MAD",
  Algeria: "DZD",
  Tunisia: "TND",
  Turkey: "TRY",
  "Saudi Arabia": "SAR",
  Qatar: "QAR",
  Kuwait: "KWD",
  Bahrain: "BHD",
  Oman: "OMR",
  India: "INR",
  Pakistan: "PKR",
  Bangladesh: "BDT",
  "Sri Lanka": "LKR",
  Philippines: "PHP",
  Indonesia: "IDR",
  Malaysia: "MYR",
  Singapore: "SGD",
  China: "CNY",
  Japan: "JPY",
  "South Korea": "KRW",
  Brazil: "BRL",
  Mexico: "MXN",
  Argentina: "ARS",
  Colombia: "COP",
};

function parseNumber(v: string) {
  const n = Number(String(v || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function CompareModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [country, setCountry] = useState("United Kingdom");
  const [currency, setCurrency] = useState("GBP");
  const [salary, setSalary] = useState("");
  const [loading, setLoading] = useState(false);
  const [fx, setFx] = useState<number | null>(null);
  const [fxNote, setFxNote] = useState<string>("");

  useEffect(() => {
    const cur = COUNTRY_TO_CURRENCY[country] || "";
    if (cur) setCurrency(cur);
  }, [country]);

  const salaryNum = useMemo(() => parseNumber(salary), [salary]);

  const salaryAED = useMemo(() => {
    if (!fx || !salaryNum) return null;
    return salaryNum * fx;
  }, [fx, salaryNum]);

  const refresh = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    // fetch once when opening
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const emailBreakdown = () => {
    const body = [
      "KEYSTNE — COST COMPARISON (LEAD-GEN)",
      "",
      `Country: ${country}`,
      `Currency: ${currency}`,
      `Monthly salary (input): ${salary || "-"}`,
      fx ? `FX: 1 ${currency} = ${fx} AED` : "FX: (not available)",
      salaryAED
        ? `Salary in AED (estimate): ${salaryAED.toFixed(0)} AED / month`
        : "Salary in AED: —",
      "",
      "T&Cs:",
      "- FX rates are indicative and can change. This is guidance, not financial advice.",
      "- Cost-of-living varies by lifestyle, household size, and location in Dubai.",
      "- We confirm assumptions during a call.",
      "",
      fxNote ? `Note: ${fxNote}` : "",
    ].join("\n");

    window.location.href = buildMailto({
      subject: "Keystne — Cost comparison breakdown",
      body,
    });
  };

  const contactUs = () => {
    const body = [
      "Hi Keystne team,",
      "",
      "I’d like help with relocating / comparing costs.",
      "",
      `Country: ${country}`,
      `Currency: ${currency}`,
      `Monthly salary: ${salary || "-"}`,
      fx ? `FX used: 1 ${currency} = ${fx} AED` : "",
      salaryAED ? `AED estimate: ${salaryAED.toFixed(0)} AED / month` : "",
      "",
      "Please contact me to discuss next steps.",
    ].join("\n");

    window.location.href = buildMailto({
      subject: "Keystne — Contact request (Cost comparison)",
      body,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Compare: your country vs Dubai"
      subtitle="Quick salary → AED conversion with simple guidance (lead-gen)."
      widthClass="max-w-3xl"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <FieldShell label="Country (where you're coming from)" required>
          <SelectInput
            value={country}
            onChange={setCountry}
            options={COUNTRIES}
          />
        </FieldShell>

        <FieldShell
          label="Currency"
          required
          hint="Auto-set from country (editable)"
        >
          <TextInput
            value={currency}
            onChange={setCurrency}
            placeholder="e.g., GBP"
          />
        </FieldShell>

        <div className="md:col-span-2">
          <FieldShell
            label="Monthly salary (your country)"
            required
            hint="Numbers only"
          >
            <TextInput
              value={salary}
              onChange={setSalary}
              placeholder="e.g., 6500"
            />
          </FieldShell>
        </div>

        <div className="md:col-span-2 rounded-2xl border border-black/10 bg-black/[0.03] p-4">
          <div className="text-[11px] tracking-[0.22em] text-black/55">
            RESULT
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="text-[11px] text-black/50">FX rate</div>
              <div className="mt-1 text-lg font-semibold text-black">
                {fx ? `1 ${currency} = ${fx.toFixed(4)} AED` : "—"}
              </div>
              <div className="mt-1 text-[11px] text-black/45">
                {fxNote || ""}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="text-[11px] text-black/50">
                Salary in AED (estimate)
              </div>
              <div className="mt-1 text-lg font-semibold text-black">
                {salaryAED ? `${salaryAED.toFixed(0)} AED / mo` : "—"}
              </div>
              <div className="mt-1 text-[11px] text-black/45">
                Uses live FX when available.
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="text-[11px] text-black/50">Next best step</div>
              <div className="mt-1 text-lg font-semibold text-black">
                Book a call
              </div>
              <div className="mt-1 text-[11px] text-black/45">
                We tailor to household + lifestyle.
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4 text-[12px] text-black/70">
            <div className="font-semibold text-black">T&Cs</div>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>FX rates are indicative and can change daily.</li>
              <li>This tool gives guidance only — not financial advice.</li>
              <li>
                Cost-of-living depends on lifestyle, household size and area
                choice.
              </li>
              <li>We confirm assumptions during your call.</li>
            </ul>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={refresh}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black/70 hover:bg-black/5"
            >
              <Icon name="refresh" />
              Refresh FX
            </button>
            <button
              type="button"
              onClick={contactUs}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-black/90"
            >
              Contact us <Icon name="arrow" />
            </button>
            <button
              type="button"
              onClick={emailBreakdown}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C8A45D] px-4 py-3 text-sm font-semibold text-black hover:brightness-110"
              disabled={!salaryNum}
            >
              Email breakdown <Icon name="mail" />
            </button>
          </div>

          {loading ? (
            <div className="mt-3 text-[11px] text-black/55">
              Fetching live FX…
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}

/* ---------- Wizard (updated relocation + viewing) ---------- */

type Step = {
  id: string;
  title: string;
  question: string;
  render: (state: any, setState: (patch: any) => void) => React.ReactNode;
  validate: (state: any) => string | null;
};

function computeRunwayWeeksRelocation(s: any) {
  // clean logic (no scribbles / no cost math)
  const household = s.household || "Single";
  const kids = s.kids || "No";
  const areaKnown = s.areaKnown || "Not sure";

  let weeks = 6;
  if (household === "Couple") weeks += 1;
  if (household === "Family") weeks += 2;
  if (kids === "Yes") weeks += 3;
  if (areaKnown === "Not sure") weeks += 2;

  return weeks;
}

function visaGuidance(visaDirection: string) {
  // High-level guidance only (safe + lead-gen friendly)
  const common = [
    "Passport validity and entry permissions (depend on nationality)",
    "Emirates ID setup and medical checks (where relevant)",
    "Banking + proof of address / salary documentation",
    "Family sponsorship pathway (if applicable)",
  ];

  if (visaDirection === "Employment visa") {
    return [
      "Employer-led employment visa (most common)",
      "Timeline depends on employer onboarding and approvals",
      ...common,
    ];
  }
  if (visaDirection === "Investor visa") {
    return [
      "Investor / partner pathway (structure depends on investment type)",
      "Golden Visa eligibility can apply for some profiles (case-by-case)",
      ...common,
    ];
  }
  if (visaDirection === "Already resident") {
    return [
      "Residency transfer / status check (depends on your current visa type)",
      "Housing + community shortlist becomes priority",
      ...common,
    ];
  }
  return [
    "We’ll recommend the best pathway based on your profile (high-level first)",
    "We’ll validate requirements and documents during your call",
    ...common,
  ];
}

const RELOCATION_STEPS: Step[] = [
  {
    id: "origin",
    title: "Origin & timeline",
    question: "Where are you relocating from, and what’s your timeline?",
    render: (s, setS) => (
      <div className="grid gap-4 md:grid-cols-2">
        <FieldShell label="Origin country" required hint="Pick from the list">
          <SelectInput
            value={s.originCountry}
            onChange={(v) => setS({ originCountry: v })}
            options={COUNTRIES}
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
          <FieldShell
            label="Visa direction"
            hint="High-level guidance. We confirm on a call."
            required
          >
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
      if (!s.originCountry) return "Please select your origin country.";
      if (!s.timeline) return "Please select your timeline.";
      if (!s.visaDirection) return "Please choose a visa direction.";
      return null;
    },
  },
  {
    id: "household",
    title: "Household",
    question: "Tell us your household setup — so we tailor areas and the plan.",
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
    question: "Do you already have a preferred Dubai area?",
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
                "Downtown Dubai",
                "Dubai Marina",
                "Business Bay",
                "Palm Jumeirah",
                "JBR",
                "JLT",
                "Dubai Hills Estate",
                "Arabian Ranches",
                "JVC",
                "Dubai Creek Harbour",
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
          If you’re not sure on area, we’ll recommend 2–4 communities that match
          your lifestyle + budget.
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
    id: "finish",
    title: "Finish",
    question:
      "We’ll generate a clear relocation plan summary — tailored to you.",
    render: (s, setS) => (
      <div className="space-y-4">
        <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-4">
          <div className="text-[11px] tracking-[0.22em] text-black/55">
            YOUR PLAN
          </div>
          <div className="mt-2 text-sm text-black/70">
            You’re relocating from{" "}
            <span className="font-semibold text-black">
              {s.originCountry || "—"}
            </span>
            . Based on what you selected, your suggested runway is:
          </div>

          <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
            <div className="text-[11px] text-black/50">Suggested runway</div>
            <div className="mt-1 text-2xl font-semibold text-black">
              ~{computeRunwayWeeksRelocation(s)} weeks
            </div>
            <div className="mt-1 text-[11px] text-black/45">
              This is a planning estimate — we tighten it once we speak.
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
            <div className="text-[11px] tracking-[0.22em] text-black/55">
              VISA PATHWAYS (HIGH-LEVEL)
            </div>
            <ul className="mt-2 space-y-2 text-sm text-black/75">
              {visaGuidance(s.visaDirection || "Need guidance").map(
                (x: string) => (
                  <li key={x} className="flex items-start gap-2">
                    <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#C8A45D] text-black">
                      <Icon name="check" className="h-3.5 w-3.5" />
                    </span>
                    <span>{x}</span>
                  </li>
                )
              )}
            </ul>
            <div className="mt-3 text-[11px] text-black/45">
              Note: Rules vary by nationality and change over time. We confirm
              details on a call.
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
            <div className="text-[11px] tracking-[0.22em] text-black/55">
              WHAT YOU NEED BEFORE YOU MOVE
            </div>
            <ul className="mt-2 space-y-2 text-sm text-black/75">
              {[
                "A clean document pack: passport, photos, basic proof of income",
                "Area shortlist aligned to your lifestyle (and schools if needed)",
                "Housing approach: lease vs buy-first (we’ll advise)",
                "First 30-days checklist: SIM/banking/transport/building setup",
              ].map((x) => (
                <li key={x} className="flex items-start gap-2">
                  <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-black text-white">
                    <Icon name="check" className="h-3.5 w-3.5" />
                  </span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <FieldShell label="Anything else we should know?" hint="Optional">
          <textarea
            value={s.notes}
            onChange={(e) => setS({ notes: e.target.value })}
            placeholder="e.g., schools, near metro, quiet building, short-term rental first, etc."
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
    question: "What’s your budget range and buying horizon?",
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
          We’ll organise a curated itinerary: optional pickup, area brief, and
          viewings that fit your pace.
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
          We’ll shortlist options, then schedule viewings around your trip.
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
    question: "Here’s your step-by-step plan (tick-box style).",
    render: (s) => {
      const horizon = s.horizon || "—";
      const intensity = s.intensity || "Balanced";
      const plan = [
        "Intro call — confirm goals, budget and timeline",
        "Agree shortlist criteria (areas, property type, yield vs end-use)",
        "Build shortlist (6–10 options) aligned to your preferences",
        "Lock viewing schedule (pace matched to your intensity)",
        "Arrange trip logistics (optional pickup / route plan)",
        "Conduct viewings + area brief on the ground",
        "Shortlist final 1–3 options and compare payment plans",
        "Offer strategy + negotiation guidance (high-level)",
        "Paperwork checklist + timelines (high-level)",
        `Target next step: ${horizon} horizon — we keep momentum`,
      ];

      return (
        <div className="space-y-4">
          <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-4">
            <div className="text-[11px] tracking-[0.22em] text-black/55">
              YOUR VIEWING TRIP PLAN
            </div>
            <div className="mt-2 text-sm text-black/70">
              You selected{" "}
              <span className="font-semibold text-black">{intensity}</span>{" "}
              intensity. Here’s the process we run with you:
            </div>

            <div className="mt-4 space-y-2">
              {plan.map((x) => (
                <div
                  key={x}
                  className="flex items-start gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-sm"
                >
                  <div className="mt-[2px] h-5 w-5 rounded-md border border-black/20 bg-white" />
                  <div className="text-sm text-black/75">{x}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 text-[11px] text-black/45">
              Designed for lead-gen: quick, clear, not overwhelming.
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="text-[11px] tracking-[0.22em] text-black/55">
              WHAT WE NEED FROM YOU
            </div>
            <div className="mt-2 text-sm text-black/70">
              Just confirm your availability + preferred contact channel, and
              we’ll take it from there.
            </div>
          </div>
        </div>
      );
    },
    validate: () => null,
  },
];

type EmailCapture = {
  name: string;
  email: string;
  email2: string;
  phone: string;
};

function buildRelocationSummary(state: any) {
  const runway = computeRunwayWeeksRelocation(state);
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
  lines.push(`Suggested runway: ~${runway} weeks`);
  lines.push("");
  lines.push("Visa pathways (high-level):");
  visaGuidance(state.visaDirection || "Need guidance").forEach((v: string) =>
    lines.push(`- ${v}`)
  );
  lines.push("");
  lines.push("Key move checklist:");
  [
    "Document pack: passport, photos, proof of income",
    "Area shortlist + school direction (if needed)",
    "Housing approach: lease vs buy-first",
    "First 30-days checklist: SIM, banking, transport, building setup",
  ].forEach((x) => lines.push(`- ${x}`));
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
  lines.push(`Intensity: ${state.intensity || "-"}`);
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
  lines.push("Step-by-step plan included on screen (tick-box style).");
  lines.push("");
  if (state.notes?.trim()) {
    lines.push("Notes:");
    lines.push(state.notes.trim());
  }
  return lines.join("\n");
}

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

  const [callDate, setCallDate] = useState("");
  const [callTime, setCallTime] = useState("");

  const resetAll = () => {
    setStepIdx(0);
    setState({});
    setEmailOpen(false);
    setBookOpen(false);
    setCapture({ name: "", email: "", email2: "", phone: "" });
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
      ? "A guided relocation plan — area shortlist + onboarding support."
      : "We organise your Dubai visit — shortlist + viewings + a clear process to buy with confidence.";

  // tiny smooth transition (not “scribbly”)
  const key = `${flow}-${stepIdx}`;
  const contentRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    el.classList.remove("opacity-100", "translate-y-0");
    el.classList.add("opacity-0", "translate-y-2");
    const t = window.setTimeout(() => {
      el.classList.remove("opacity-0", "translate-y-2");
      el.classList.add("opacity-100", "translate-y-0");
    }, 10);
    return () => window.clearTimeout(t);
  }, [key]);

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

              <div
                ref={contentRef}
                className="mt-5 transition-all duration-300 opacity-100 translate-y-0"
                key={key}
              >
                {current.render(state, setPatch)}
              </div>

              {err ? (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {err}
                </div>
              ) : null}

              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black/70 hover:bg-black/5"
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
                        ? "bg-[#C8A45D] text-black hover:brightness-110"
                        : "bg-black/10 text-black/35 cursor-not-allowed",
                    ].join(" ")}
                    disabled={!canNext}
                  >
                    Next <Icon name="arrow" />
                  </button>
                ) : (
                  <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={() => setEmailOpen(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C8A45D] px-5 py-3 text-sm font-semibold text-black hover:brightness-110"
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
                You get a clear plan instantly. We get the context we need to
                tailor the next step — without wasting time.
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={emailOpen}
        onClose={() => setEmailOpen(false)}
        title="Send your summary"
        subtitle="We’ll receive your details + the summary via email (lead-gen)."
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
                  ? "bg-[#C8A45D] text-black hover:brightness-110"
                  : "bg-black/10 text-black/35 cursor-not-allowed",
              ].join(" ")}
            >
              Open email <Icon name="arrow" />
            </button>
          </div>
        </div>
      </Modal>

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
            <input
              value={callDate}
              onChange={(e) => setCallDate(e.target.value)}
              type="date"
              className="w-full bg-transparent text-sm text-black outline-none"
            />
          </FieldShell>

          <FieldShell label="Preferred time (Dubai time)" required>
            <input
              value={callTime}
              onChange={(e) => setCallTime(e.target.value)}
              type="time"
              className="w-full bg-transparent text-sm text-black outline-none"
            />
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
                  ? "bg-[#C8A45D] text-black hover:brightness-110"
                  : "bg-black/10 text-black/35 cursor-not-allowed",
              ].join(" ")}
            >
              Open booking email <Icon name="arrow" />
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

/* ---------- Page ---------- */

export default function ConciergePage() {
  // NAV hide-on-scroll-down (page-only)
  const [navHidden, setNavHidden] = useState(false);
  const lastY = useRef(0);

  // Wizard open state
  const [flow, setFlow] = useState<ConciergeFlow>(null);
  const wizardOpen = flow !== null;

  // Compare modal
  const [compareOpen, setCompareOpen] = useState(false);

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
      {/* Wrapper to hide/show nav on scroll direction */}
      <div
        className={[
          "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
          navHidden
            ? "-translate-y-28 opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100",
        ].join(" ")}
      >
        <KeystneNav />
      </div>

      {/* HERO (video stays) */}
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
            {/* Removed DUBAI */}
            <div className="text-[11px] tracking-[0.22em] text-white/80">
              CONCIERGE
            </div>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-6xl">
              Concierge, done properly.
            </h1>

            <p className="mt-5 text-base text-white/85 md:text-lg">
              Two ways we support you: relocate seamlessly, or fly in for a
              curated viewing trip and invest with clarity.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {/* Buttons: Relocation / Viewing / Compare (no Back Home) */}
              <button
                onClick={() => setFlow("relocation")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C8A45D] px-6 py-4 text-sm font-semibold text-black hover:brightness-110"
              >
                Relocation concierge <Icon name="arrow" />
              </button>

              <button
                onClick={() => setFlow("viewing")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-4 text-sm font-semibold text-white hover:bg-white/15"
              >
                Curated viewing trip <Icon name="arrow" />
              </button>

              <button
                onClick={() => setCompareOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-4 text-sm font-semibold text-white hover:bg-white/15"
              >
                Compare <Icon name="arrow" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dubai time pill — stable position (same vibe) */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="-mt-6 flex justify-center">
            <DubaiTimePill />
          </div>
        </div>
      </section>

      {/* BODY — light premium */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="text-[11px] tracking-[0.22em] text-black/55">
            CHOOSE A PATH
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Pick what you need — we’ll do the rest.
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-black/65">
            We keep the questions simple (lead-gen), then generate a clear
            summary you can email to yourself and use to book a call.
          </p>

          {/* Reduced spacing here */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <button
              onClick={() => setFlow("relocation")}
              className="group relative overflow-hidden rounded-[28px] border border-black/10 bg-white text-left shadow-ks transition hover:-translate-y-1"
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
                  A guided plan: visa direction, area shortlist, and a smooth
                  move-in flow — handled personally.
                </div>

                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-[12px] font-semibold text-white group-hover:bg-[#C8A45D] group-hover:text-black">
                  Start <Icon name="arrow" className="h-4 w-4" />
                </div>
              </div>
            </button>

            <button
              onClick={() => setFlow("viewing")}
              className="group relative overflow-hidden rounded-[28px] border border-black/10 bg-white text-left shadow-ks transition hover:-translate-y-1"
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

                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-[12px] font-semibold text-white group-hover:bg-[#C8A45D] group-hover:text-black">
                  Start <Icon name="arrow" className="h-4 w-4" />
                </div>
              </div>
            </button>
          </div>

          {/* PROMISE — now white + black text, pulled up slightly */}
          <div className="mt-8 rounded-[28px] border border-black/10 bg-white p-7 text-black shadow-sm">
            <div className="text-[11px] tracking-[0.22em] text-black/55">
              PROMISE
            </div>
            <div className="mt-2 text-2xl font-semibold">
              We keep it premium. We keep it personal.
            </div>
            <div className="mt-3 max-w-3xl text-sm text-black/70">
              This is designed to be quick, not “boring form-filling”. You
              answer a few guided prompts, then you get a clean summary + an
              easy next step.
            </div>
          </div>
        </div>
      </section>

      <KeystneFooter />
      <ContactDock />

      <Wizard open={wizardOpen} flow={flow} onClose={() => setFlow(null)} />
      <CompareModal open={compareOpen} onClose={() => setCompareOpen(false)} />
    </div>
  );
}
