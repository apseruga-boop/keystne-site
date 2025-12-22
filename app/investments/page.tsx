"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import KeystneNav from "../../components/site/KeystneNav";
import KeystneFooter from "../../components/site/KeystneFooter";
import { CONTACT } from "../../components/site/config";

/**
 * INVESTMENTS PAGE — "Invest with clarity."
 * - White background
 * - Top nav pill forced to white, text black, hover gold
 * - Premium investment calculator:
 *   1) Deposit (AED)
 *   2) Deposit % (min 10%)
 *   3) Desired community
 *   4) Strategy toggle: Long-term vs Airbnb
 * - Animated graph:
 *   - Shows projected monthly net income trend (illustrative)
 *   - Airbnb view overlays tourism season bands (high season) + higher volatility
 * - Lead-gen contact CTA + modal
 * - Clear T&Cs / disclaimers (not financial advice)
 *
 * Notes:
 * - Figures are illustrative placeholders (because live data requires API + sources).
 * - Structure + styling match the premium Keystne style used on your other pages.
 */

/** -------------------- Small helpers -------------------- */
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function fmtAED(n: number) {
  const v = isFinite(n) ? n : 0;
  return `AED ${Math.round(v).toLocaleString("en-US")}`;
}
function fmtPct(n: number) {
  return `${Math.round(n)}%`;
}

/** -------------------- Icons (no lucide-react) -------------------- */
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
    | "x"
    | "check"
    | "info";
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
    case "x":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </svg>
      );
    case "check":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M20 6L9 17l-5-5" />
        </svg>
      );
    case "info":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10z" />
          <path d="M12 10v7" />
          <path d="M12 7h.01" />
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

function buildMailto(args: { subject: string; body: string }) {
  const to = CONTACT.emailArthur;
  const cc = CONTACT.emailStuart;
  const subject = encodeURIComponent(args.subject);
  const body = encodeURIComponent(args.body);
  return `mailto:${to}?cc=${cc}&subject=${subject}&body=${body}`;
}

/** -------------------- Contact dock (same style as other pages) -------------------- */
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
              subject: "Keystne — Investment enquiry",
              body: "Hi Keystne team,\n\nI’d like to invest in Dubai.\n\nBudget / deposit:\nTarget community:\nStrategy (Long-term / Airbnb):\nTimeline:\n\nName:\nPhone:\nEmail:\n\nThank you",
            })}
          >
            <Icon name="mail" /> Email
          </a>

          {CONTACT.wechatText ? (
            <div className="flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] font-semibold text-black/55">
              {CONTACT.wechatText}
            </div>
          ) : null}
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

/** -------------------- Contact modal (for lead-gen) -------------------- */
function ContactModal({
  open,
  onClose,
  preset,
}: {
  open: boolean;
  onClose: () => void;
  preset: {
    depositAED: number;
    depositPct: number;
    community: string;
    strategy: "long_term" | "airbnb";
    estProperty: number;
  };
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferred, setPreferred] = useState<
    "WhatsApp" | "Call" | "Telegram" | "Email"
  >("WhatsApp");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    if (message) return;
    setMessage(
      [
        `I’d like help investing in Dubai.`,
        ``,
        `Deposit: ${fmtAED(preset.depositAED)} (${fmtPct(preset.depositPct)})`,
        `Estimated property value: ${fmtAED(preset.estProperty)}`,
        `Target community: ${preset.community}`,
        `Strategy: ${
          preset.strategy === "airbnb"
            ? "Airbnb / short-let"
            : "Long-term rental"
        }`,
        ``,
        `Please advise on best buildings, yield expectations, and next steps.`,
      ].join("\n")
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const subject = `Keystne — Investment lead (${preset.community})`;
  const body = [
    `Hi Keystne team,`,
    ``,
    `Investment snapshot:`,
    `Deposit: ${fmtAED(preset.depositAED)} (${fmtPct(preset.depositPct)})`,
    `Estimated property value: ${fmtAED(preset.estProperty)}`,
    `Community: ${preset.community}`,
    `Strategy: ${
      preset.strategy === "airbnb" ? "Airbnb / short-let" : "Long-term rental"
    }`,
    ``,
    `Preferred contact: ${preferred}`,
    ``,
    `Name: ${name || "-"}`,
    `Phone: ${phone || "-"}`,
    `Email: ${email || "-"}`,
    ``,
    `Message:`,
    `${message || "-"}`,
    ``,
    `Thank you`,
  ].join("\n");

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[780px] overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-ks">
          <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
            <div>
              <div className="text-[11px] tracking-[0.22em] text-black/55">
                CONTACT
              </div>
              <div className="mt-1 text-xl font-semibold text-black">
                Speak to Keystne
              </div>
              <div className="mt-1 text-sm text-black/60">
                {preset.community} •{" "}
                {preset.strategy === "airbnb"
                  ? "Airbnb / short-let"
                  : "Long-term"}{" "}
                • {fmtAED(preset.estProperty)}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-3 py-2 text-[12px] font-semibold text-black/70 hover:bg-black/5"
            >
              <Icon name="x" className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-2">
            <div className="rounded-2xl border border-black/10 p-4">
              <label className="text-[11px] font-semibold text-black/60">
                Full name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/20"
                placeholder="Your name"
              />

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-[11px] font-semibold text-black/60">
                    Phone
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/20"
                    placeholder="+971..."
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-black/60">
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/20"
                    placeholder="you@email.com"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-[11px] font-semibold text-black/60">
                  Preferred contact method
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {(["WhatsApp", "Call", "Telegram", "Email"] as const).map(
                    (x) => (
                      <button
                        key={x}
                        type="button"
                        onClick={() => setPreferred(x)}
                        className={[
                          "rounded-2xl border px-3 py-3 text-[12px] font-semibold transition",
                          preferred === x
                            ? "border-black/15 bg-[#C8A45D]/20 text-black"
                            : "border-black/10 bg-white text-black/70 hover:bg-black/[0.03]",
                        ].join(" ")}
                      >
                        {x}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 p-4">
              <label className="text-[11px] font-semibold text-black/60">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-2 h-[214px] w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/20"
              />

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <a
                  className="inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-black/90"
                  href={buildMailto({ subject, body })}
                  onClick={onClose}
                >
                  Send request <Icon name="arrow" />
                </a>

                <div className="text-[11px] text-black/45">
                  Opens your email client with everything pre-filled.
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-black/10 px-6 py-4">
            <div className="text-[11px] text-black/55">
              Prefer instant chat?{" "}
              <a
                className="font-semibold text-black hover:text-[#C8A45D]"
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>{" "}
              •{" "}
              <a
                className="font-semibold text-black hover:text-[#C8A45D]"
                href={CONTACT.telegramLink}
                target="_blank"
                rel="noreferrer"
              >
                Telegram
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** -------------------- Communities + placeholder yield assumptions -------------------- */
type Community = {
  id: string;
  name: string;
  region: string;
  tag: string;
  // illustrative assumptions for projections (NOT advice)
  longTermYieldPct: number; // annual net yield (rough)
  airbnbYieldPct: number; // annual net yield (rough)
  airbnbSeasonalityBoost: number; // how spiky it gets
};

const COMMUNITIES: Community[] = [
  {
    id: "downtown",
    name: "Downtown Dubai",
    region: "Central",
    tag: "Landmark + walkable",
    longTermYieldPct: 5.0,
    airbnbYieldPct: 6.8,
    airbnbSeasonalityBoost: 1.25,
  },
  {
    id: "difc",
    name: "DIFC",
    region: "Central",
    tag: "Executive + premium",
    longTermYieldPct: 4.6,
    airbnbYieldPct: 6.2,
    airbnbSeasonalityBoost: 1.18,
  },
  {
    id: "businessbay",
    name: "Business Bay",
    region: "Central",
    tag: "Modern towers",
    longTermYieldPct: 5.4,
    airbnbYieldPct: 7.2,
    airbnbSeasonalityBoost: 1.22,
  },
  {
    id: "marina",
    name: "Dubai Marina",
    region: "New Dubai",
    tag: "Waterfront demand",
    longTermYieldPct: 5.6,
    airbnbYieldPct: 7.8,
    airbnbSeasonalityBoost: 1.35,
  },
  {
    id: "jbr",
    name: "JBR",
    region: "Coastal",
    tag: "Beachfront",
    longTermYieldPct: 5.1,
    airbnbYieldPct: 8.1,
    airbnbSeasonalityBoost: 1.4,
  },
  {
    id: "palm",
    name: "Palm Jumeirah",
    region: "Coastal",
    tag: "Luxury beachfront",
    longTermYieldPct: 4.2,
    airbnbYieldPct: 7.0,
    airbnbSeasonalityBoost: 1.45,
  },
  {
    id: "jlt",
    name: "JLT",
    region: "New Dubai",
    tag: "Value + metro",
    longTermYieldPct: 6.0,
    airbnbYieldPct: 7.0,
    airbnbSeasonalityBoost: 1.15,
  },
  {
    id: "dubaihills",
    name: "Dubai Hills Estate",
    region: "MBR / Emaar",
    tag: "Family masterplan",
    longTermYieldPct: 5.2,
    airbnbYieldPct: 6.1,
    airbnbSeasonalityBoost: 1.08,
  },
  {
    id: "creek",
    name: "Dubai Creek Harbour",
    region: "Creek",
    tag: "New waterfront",
    longTermYieldPct: 5.0,
    airbnbYieldPct: 6.5,
    airbnbSeasonalityBoost: 1.12,
  },
  {
    id: "jvc",
    name: "JVC",
    region: "New Dubai",
    tag: "Search favourite",
    longTermYieldPct: 6.6,
    airbnbYieldPct: 6.9,
    airbnbSeasonalityBoost: 1.1,
  },
  {
    id: "arabianranches",
    name: "Arabian Ranches",
    region: "Dubailand",
    tag: "Villas + family",
    longTermYieldPct: 4.8,
    airbnbYieldPct: 5.6,
    airbnbSeasonalityBoost: 1.05,
  },
];

/** -------------------- Animated chart (SVG) -------------------- */
type SeriesPoint = { month: string; value: number };
function buildSeries(args: {
  estProperty: number;
  strategy: "long_term" | "airbnb";
  community: Community;
}) {
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

  // base monthly net income from annual net yield %
  const annualYield =
    args.strategy === "airbnb"
      ? args.community.airbnbYieldPct
      : args.community.longTermYieldPct;
  const baseMonthly = (args.estProperty * (annualYield / 100)) / 12;

  // seasonality curve (illustrative; high season in Dubai tends to be Nov–Mar)
  const highSeason = new Set(["Nov", "Dec", "Jan", "Feb", "Mar"]);
  const shoulder = new Set(["Apr", "Oct"]);

  const series: SeriesPoint[] = months.map((m) => {
    if (args.strategy === "long_term") {
      // smoother: slight variation only
      const drift = m === "Jan" ? 0.98 : m === "Dec" ? 1.02 : 1.0;
      return { month: m, value: baseMonthly * drift };
    }

    // airbnb: more spiky with high-season uplift
    let mult = 1.0;
    if (highSeason.has(m)) mult = 1.0 * args.community.airbnbSeasonalityBoost;
    if (shoulder.has(m)) mult = 1.08;
    if (m === "Jun" || m === "Jul" || m === "Aug") mult = 0.82; // hotter months, slower (illustrative)

    // add a gentle ramp to feel “growth over time” on the graph
    const ramp = 0.96 + (months.indexOf(m) / 11) * 0.08;
    return { month: m, value: baseMonthly * mult * ramp };
  });

  return series;
}

function LineChart({
  series,
  mode,
}: {
  series: SeriesPoint[];
  mode: "long_term" | "airbnb";
}) {
  const ref = useRef<SVGPathElement | null>(null);
  const [draw, setDraw] = useState(0);

  useEffect(() => {
    // animate line draw
    let raf = 0;
    const start = performance.now();
    const dur = 700;

    const tick = (t: number) => {
      const p = clamp((t - start) / dur, 0, 1);
      setDraw(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [series, mode]);

  const w = 820;
  const h = 280;
  const padX = 40;
  const padY = 28;

  const values = series.map((d) => d.value);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);

  const x = (i: number) => padX + (i * (w - padX * 2)) / (series.length - 1);
  const y = (v: number) => {
    const t = (v - minV) / (maxV - minV || 1);
    return h - padY - t * (h - padY * 2);
  };

  const d = series
    .map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p.value)}`)
    .join(" ");

  // clip animation
  const clipW = padX + (w - padX * 2) * draw;

  // tourism “high season” overlay bands for Airbnb
  const highBands =
    mode === "airbnb"
      ? [
          { from: 10, to: 11 }, // Nov-Dec
          { from: 0, to: 2 }, // Jan-Mar (0..2)
        ]
      : [];

  return (
    <div className="rounded-[24px] border border-black/10 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] tracking-[0.22em] text-black/55">
            PROJECTION
          </div>
          <div className="mt-1 text-sm font-semibold text-black">
            {mode === "airbnb"
              ? "Airbnb / short-let (seasonal)"
              : "Long-term rental (stable)"}
          </div>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 py-2 text-[11px] font-semibold text-black/70">
          <Icon name="info" className="h-4 w-4" />
          Illustrative only
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <svg width={w} height={h} className="min-w-[820px]">
          {/* grid */}
          <g opacity={0.2} stroke="black">
            {[0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1={padX}
                x2={w - padX}
                y1={padY + ((h - padY * 2) * i) / 3}
                y2={padY + ((h - padY * 2) * i) / 3}
              />
            ))}
          </g>

          {/* high-season overlays for airbnb */}
          {highBands.map((b, idx) => {
            const x1 = x(b.from);
            const x2 = x(b.to);
            return (
              <rect
                key={idx}
                x={x1}
                y={padY}
                width={x2 - x1}
                height={h - padY * 2}
                fill="#C8A45D"
                opacity={0.1}
                rx={12}
              />
            );
          })}

          {/* axes labels */}
          <g fill="rgba(0,0,0,0.6)" fontSize={11} fontWeight={600}>
            <text x={padX} y={h - 8}>
              Jan
            </text>
            <text x={x(3) - 10} y={h - 8}>
              Apr
            </text>
            <text x={x(6) - 10} y={h - 8}>
              Jul
            </text>
            <text x={x(9) - 10} y={h - 8}>
              Oct
            </text>
            <text x={w - padX - 18} y={h - 8}>
              Dec
            </text>
          </g>

          {/* animated path clip */}
          <clipPath id="clipLine">
            <rect x={0} y={0} width={clipW} height={h} />
          </clipPath>

          {/* line */}
          <path
            ref={ref}
            d={d}
            fill="none"
            stroke="black"
            strokeWidth={3}
            clipPath="url(#clipLine)"
            strokeLinecap="round"
          />

          {/* points */}
          <g clipPath="url(#clipLine)">
            {series.map((p, i) => (
              <circle
                key={p.month}
                cx={x(i)}
                cy={y(p.value)}
                r={4}
                fill="#C8A45D"
              />
            ))}
          </g>
        </svg>
      </div>

      <div className="mt-3 text-[11px] text-black/55">
        {mode === "airbnb"
          ? "Gold bands highlight Dubai’s typical high-tourism season (illustrative)."
          : "Long-term is shown as a smoother, more stable line (illustrative)."}
      </div>
    </div>
  );
}

/** -------------------- Page -------------------- */
export default function InvestmentsPage() {
  // Nav hide on scroll (same behaviour you liked on other pages)
  const [navHidden, setNavHidden] = useState(false);
  const lastY = useRef(0);
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

  // Calculator state
  const [depositAED, setDepositAED] = useState<number>(300_000);
  const [depositPct, setDepositPct] = useState<number>(10); // min 10%
  const [communityId, setCommunityId] = useState<string>(COMMUNITIES[0].id);
  const [strategy, setStrategy] = useState<"long_term" | "airbnb">("long_term");

  const community = useMemo(
    () => COMMUNITIES.find((c) => c.id === communityId) || COMMUNITIES[0],
    [communityId]
  );

  const estProperty = useMemo(() => {
    const pct = clamp(depositPct, 10, 60) / 100;
    return depositAED / pct;
  }, [depositAED, depositPct]);

  // “What you can get” quick bands
  const estRange = useMemo(() => {
    // give a gentle band to feel realistic without claiming precision
    const low = estProperty * 0.92;
    const high = estProperty * 1.06;
    return { low, high };
  }, [estProperty]);

  const series = useMemo(
    () => buildSeries({ estProperty, strategy, community }),
    [estProperty, strategy, community]
  );

  // derived monthly net figure
  const estMonthly = useMemo(() => {
    const avg = series.reduce((a, b) => a + b.value, 0) / (series.length || 1);
    return avg;
  }, [series]);

  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Force NAV pill to white + black text + gold hover (same as you requested) */}
      <style jsx global>{`
        .ks-nav-white {
          background: #ffffff !important;
        }
        .ks-nav-white header,
        .ks-nav-white nav,
        .ks-nav-white > div,
        .ks-nav-white > header,
        .ks-nav-white > nav,
        .ks-nav-white [class*="rounded"],
        .ks-nav-white [class*="pill"],
        .ks-nav-white [class*="nav"] {
          background: #ffffff !important;
        }
        .ks-nav-white a,
        .ks-nav-white button,
        .ks-nav-white span,
        .ks-nav-white div {
          color: rgba(0, 0, 0, 0.92) !important;
        }
        .ks-nav-white a:hover,
        .ks-nav-white button:hover {
          color: #c8a45d !important;
        }
      `}</style>

      {/* Top Nav */}
      <div
        className={[
          "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
          navHidden
            ? "-translate-y-28 opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100",
        ].join(" ")}
      >
        <div className="ks-nav-white">
          <KeystneNav />
        </div>
      </div>

      {/* Hero */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 pt-28 pb-8">
          <div className="text-[11px] tracking-[0.22em] text-black/55">
            INVESTMENTS
          </div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-black md:text-5xl">
            Invest with clarity.
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-black/65">
            Quickly model what your deposit could unlock — then compare
            long-term vs Airbnb-style income patterns (illustrative).
          </p>
        </div>
      </section>

      {/* Main */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-14">
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            {/* LEFT: Calculator */}
            <div className="rounded-[28px] border border-black/10 bg-white shadow-ks overflow-hidden">
              <div className="border-b border-black/10 px-6 py-5">
                <div className="text-[11px] tracking-[0.22em] text-black/55">
                  CALCULATOR
                </div>
                <div className="mt-2 text-lg font-semibold text-black">
                  Deposit → estimated property value
                </div>
                <div className="mt-1 text-sm text-black/60">
                  We keep this simple: choose a deposit amount and a deposit
                  percentage (minimum 10%).
                </div>
              </div>

              <div className="p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Deposit */}
                  <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-semibold text-black/60">
                          Your deposit
                        </div>
                        <div className="mt-1 text-2xl font-semibold text-black">
                          {fmtAED(depositAED)}
                        </div>
                      </div>
                      <div className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.03] px-3 py-2 text-[11px] font-semibold text-black/70">
                        AED
                      </div>
                    </div>

                    <input
                      type="range"
                      min={50_000}
                      max={3_000_000}
                      step={10_000}
                      value={depositAED}
                      onChange={(e) => setDepositAED(Number(e.target.value))}
                      className="mt-4 w-full"
                    />

                    <div className="mt-2 flex items-center justify-between text-[11px] text-black/45">
                      <span>AED 50k</span>
                      <span>AED 3.0m</span>
                    </div>

                    <div className="mt-3">
                      <label className="text-[11px] font-semibold text-black/60">
                        Or type it
                      </label>
                      <input
                        value={depositAED}
                        onChange={(e) =>
                          setDepositAED(
                            clamp(
                              Number(e.target.value || 0),
                              50_000,
                              3_000_000
                            )
                          )
                        }
                        inputMode="numeric"
                        className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/20"
                      />
                    </div>
                  </div>

                  {/* Deposit % */}
                  <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-semibold text-black/60">
                          Deposit percentage
                        </div>
                        <div className="mt-1 text-2xl font-semibold text-black">
                          {fmtPct(depositPct)}
                        </div>
                        <div className="mt-1 text-[11px] text-black/45">
                          Minimum assumed: 10%
                        </div>
                      </div>
                      <div className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.03] px-3 py-2 text-[11px] font-semibold text-black/70">
                        %
                      </div>
                    </div>

                    <input
                      type="range"
                      min={10}
                      max={60}
                      step={1}
                      value={depositPct}
                      onChange={(e) => setDepositPct(Number(e.target.value))}
                      className="mt-4 w-full"
                    />

                    <div className="mt-2 flex items-center justify-between text-[11px] text-black/45">
                      <span>10%</span>
                      <span>60%</span>
                    </div>

                    <div className="mt-4 rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                      <div className="text-[11px] font-semibold text-black/60">
                        Estimated property value
                      </div>
                      <div className="mt-1 text-xl font-semibold text-black">
                        {fmtAED(estProperty)}
                      </div>
                      <div className="mt-1 text-[11px] text-black/45">
                        Range: {fmtAED(estRange.low)} — {fmtAED(estRange.high)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Community + Strategy */}
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                    <div className="text-[11px] font-semibold text-black/60">
                      Desired community
                    </div>
                    <select
                      value={communityId}
                      onChange={(e) => setCommunityId(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black outline-none focus:border-black/20"
                    >
                      {COMMUNITIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} — {c.tag}
                        </option>
                      ))}
                    </select>

                    <div className="mt-3 text-[12px] text-black/65">
                      <span className="font-semibold text-black">
                        {community.name}
                      </span>{" "}
                      <span className="text-black/45">
                        ({community.region})
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.03] px-3 py-2 text-[11px] font-semibold text-black/70">
                        Long-term (illustrative):{" "}
                        {community.longTermYieldPct.toFixed(1)}% net/yr
                      </span>
                      <span className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.03] px-3 py-2 text-[11px] font-semibold text-black/70">
                        Airbnb (illustrative):{" "}
                        {community.airbnbYieldPct.toFixed(1)}% net/yr
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                    <div className="text-[11px] font-semibold text-black/60">
                      Strategy
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setStrategy("long_term")}
                        className={[
                          "rounded-2xl border px-3 py-3 text-[12px] font-semibold transition",
                          strategy === "long_term"
                            ? "border-black/15 bg-[#C8A45D]/20 text-black"
                            : "border-black/10 bg-white text-black/70 hover:bg-black/[0.03]",
                        ].join(" ")}
                      >
                        Long-term
                      </button>
                      <button
                        type="button"
                        onClick={() => setStrategy("airbnb")}
                        className={[
                          "rounded-2xl border px-3 py-3 text-[12px] font-semibold transition",
                          strategy === "airbnb"
                            ? "border-black/15 bg-[#C8A45D]/20 text-black"
                            : "border-black/10 bg-white text-black/70 hover:bg-black/[0.03]",
                        ].join(" ")}
                      >
                        Airbnb
                      </button>
                    </div>

                    <div className="mt-4 rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                      <div className="text-[11px] font-semibold text-black/60">
                        Illustrative monthly net
                      </div>
                      <div className="mt-1 text-xl font-semibold text-black">
                        {fmtAED(estMonthly)}
                      </div>
                      <div className="mt-1 text-[11px] text-black/45">
                        This is a simplified illustration (fees, vacancy,
                        furnishing, financing, and taxes can change results).
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA row */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-black/10 bg-white p-4 shadow-sm">
                  <div>
                    <div className="text-sm font-semibold text-black">
                      Want this built into a real plan?
                    </div>
                    <div className="mt-1 text-[12px] text-black/60">
                      We’ll shortlist buildings, sanity-check yields, and map
                      the next steps.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setContactOpen(true)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-black/90"
                  >
                    Contact us <Icon name="arrow" />
                  </button>
                </div>

                {/* Disclaimer */}
                <div className="mt-5 rounded-[24px] border border-black/10 bg-white p-4">
                  <div className="flex items-start gap-2 text-[12px] text-black/65">
                    <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#C8A45D] text-black">
                      <Icon name="info" className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <span className="font-semibold text-black">
                        Important:
                      </span>{" "}
                      Keystne is not a financial institution. Figures shown are
                      illustrative estimates based on simplified assumptions and
                      do not constitute financial advice.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Graph + quick comparisons */}
            <div className="space-y-5">
              <LineChart series={series} mode={strategy} />

              <div className="rounded-[28px] border border-black/10 bg-white shadow-ks overflow-hidden">
                <div className="border-b border-black/10 px-6 py-5">
                  <div className="text-[11px] tracking-[0.22em] text-black/55">
                    WHAT THIS MEANS
                  </div>
                  <div className="mt-2 text-lg font-semibold text-black">
                    Quick interpretation
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid gap-3">
                    <div className="flex items-start gap-3 rounded-2xl border border-black/10 bg-white p-4">
                      <span className="mt-[2px] inline-flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
                        <Icon name="check" className="h-4 w-4" />
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-black">
                          Deposit → buying power
                        </div>
                        <div className="mt-1 text-[12px] text-black/65">
                          At {fmtPct(depositPct)}, your deposit of{" "}
                          <span className="font-semibold">
                            {fmtAED(depositAED)}
                          </span>{" "}
                          models an estimated property value around{" "}
                          <span className="font-semibold">
                            {fmtAED(estProperty)}
                          </span>
                          .
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-2xl border border-black/10 bg-white p-4">
                      <span className="mt-[2px] inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#C8A45D] text-black">
                        <Icon name="check" className="h-4 w-4" />
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-black">
                          Long-term vs Airbnb
                        </div>
                        <div className="mt-1 text-[12px] text-black/65">
                          Long-term tends to be steadier. Airbnb may lift during
                          high-tourism months (gold bands) but can swing more
                          through the year.
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-2xl border border-black/10 bg-white p-4">
                      <span className="mt-[2px] inline-flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
                        <Icon name="check" className="h-4 w-4" />
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-black">
                          Next step (premium)
                        </div>
                        <div className="mt-1 text-[12px] text-black/65">
                          We translate this into a real plan: building
                          shortlist, fees, vacancy assumptions, furnishing costs
                          (Airbnb), and a clean “go/no-go” recommendation.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                    <div className="text-[12px] text-black/65">
                      Want us to validate this with real comparables for{" "}
                      <span className="font-semibold">{community.name}</span>?
                    </div>
                    <button
                      type="button"
                      onClick={() => setContactOpen(true)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-3 text-[12px] font-semibold text-white hover:bg-black/90"
                    >
                      Get a shortlist <Icon name="arrow" />
                    </button>
                  </div>
                </div>
              </div>

              {/* T&Cs */}
              <div className="rounded-[28px] border border-black/10 bg-white shadow-ks overflow-hidden">
                <div className="border-b border-black/10 px-6 py-5">
                  <div className="text-[11px] tracking-[0.22em] text-black/55">
                    T&Cs
                  </div>
                  <div className="mt-2 text-lg font-semibold text-black">
                    Disclaimer
                  </div>
                </div>
                <div className="p-6 text-[12px] text-black/65 leading-relaxed">
                  <p>
                    This tool provides{" "}
                    <span className="font-semibold text-black">
                      illustrative projections
                    </span>{" "}
                    only. It does not constitute financial, legal, tax, or
                    investment advice. Actual outcomes vary based on property
                    type, building quality, fees, financing, market conditions,
                    vacancy, maintenance, and regulatory changes.
                  </p>
                  <p className="mt-3">
                    Airbnb / short-let projections are indicative and may be
                    affected by tourism cycles, platform fees, seasonality,
                    community rules, building policies, and licensing
                    requirements.
                  </p>
                  <p className="mt-3">
                    By using this page, you agree that Keystne is not
                    responsible for decisions made based on these estimates.
                    Please consult licensed professionals for financial and
                    legal guidance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <KeystneFooter />
      <ContactDock />

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        preset={{
          depositAED,
          depositPct,
          community: community.name,
          strategy,
          estProperty,
        }}
      />
    </div>
  );
}
