// app/long-term/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import KeystneNav from "../../components/site/KeystneNav";
import KeystneFooter from "../../components/site/KeystneFooter";
import { CONTACT } from "../../components/site/config";

type ImmigrationRule = {
  country: string;
  entry:
    | "Visa on arrival"
    | "Visa required before travel"
    | "Conditional visa on arrival"
    | "GCC visa-free";
  maxStay: string; // keep human-readable
  notes: string[];
  sourceHint: string; // keep short
};

type Service = {
  title: string;
  tag: string;
  bullets: string[];
  detailsTitle: string;
  detailsBody: string[];
  deliverables: string[];
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const GOLD = "#B89A5B";

/** mailto helper (keeps Arthur + Stuart connected via CONTACT like other pages) */
function buildMailto(args: { subject: string; body: string }) {
  const to = CONTACT.emailArthur;
  const cc = CONTACT.emailStuart;
  const subject = encodeURIComponent(args.subject);
  const body = encodeURIComponent(args.body);
  return `mailto:${to}?cc=${cc}&subject=${subject}&body=${body}`;
}

function parseVisaDays(maxStay: string) {
  const m = String(maxStay || "").match(/(\d+)\s*days/i);
  return m ? Number(m[1]) : null;
}

const IMMIGRATION: ImmigrationRule[] = [
  // 90-day (commonly referenced in airline summaries; illustrative only)
  {
    country: "United Kingdom",
    entry: "Visa on arrival",
    maxStay: "90 days (multiple-entry) within 6 months",
    notes: [
      "Designed for short stays; for long-term living/working you’ll typically need a residence visa (e.g., employment, investor, freelance, student).",
      "Rules can change—always verify before travel.",
    ],
    sourceHint: "Airline summary list (illustrative)",
  },
  {
    country: "United States",
    entry: "Visa on arrival",
    maxStay: "90 days (multiple-entry) within 6 months",
    notes: [
      "For long-term rentals, we usually align your tenancy timeline with your visa/residency pathway.",
      "Rules can change—always verify before travel.",
    ],
    sourceHint: "Airline summary list (illustrative)",
  },
  {
    country: "Canada",
    entry: "Visa on arrival",
    maxStay: "90 days (multiple-entry) within 6 months",
    notes: [
      "If you’re relocating for work, we can coordinate move-in dates around your employment visa process.",
      "Rules can change—always verify before travel.",
    ],
    sourceHint: "Airline summary list (illustrative)",
  },
  {
    country: "France",
    entry: "Visa on arrival",
    maxStay: "90 days (multiple-entry) within 6 months",
    notes: [
      "Short stays are usually straightforward; for long-term living/working you’ll typically need a residence visa route.",
      "Rules can change—always verify before travel.",
    ],
    sourceHint: "Airline summary list (illustrative)",
  },
  {
    country: "Germany",
    entry: "Visa on arrival",
    maxStay: "90 days (multiple-entry) within 6 months",
    notes: [
      "For longer stays, your residency pathway matters—plan lease timing accordingly.",
      "Rules can change—always verify before travel.",
    ],
    sourceHint: "Airline summary list (illustrative)",
  },
  {
    country: "Italy",
    entry: "Visa on arrival",
    maxStay: "90 days (multiple-entry) within 6 months",
    notes: [
      "For longer stays, confirm your residence status before signing long commitments.",
      "Rules can change—always verify before travel.",
    ],
    sourceHint: "Airline summary list (illustrative)",
  },
  {
    country: "Spain",
    entry: "Visa on arrival",
    maxStay: "90 days (multiple-entry) within 6 months",
    notes: [
      "For long-term relocation, align your lease length with your visa/residency timeline.",
      "Rules can change—always verify before travel.",
    ],
    sourceHint: "Airline summary list (illustrative)",
  },
  {
    country: "Netherlands",
    entry: "Visa on arrival",
    maxStay: "90 days (multiple-entry) within 6 months",
    notes: [
      "Short stays are typically manageable; long-term stays require a residency pathway.",
      "Rules can change—always verify before travel.",
    ],
    sourceHint: "Airline summary list (illustrative)",
  },
  {
    country: "Belgium",
    entry: "Visa on arrival",
    maxStay: "90 days (multiple-entry) within 6 months",
    notes: [
      "We help you plan tenancy timing so you don’t over-commit before residency is confirmed.",
      "Rules can change—always verify before travel.",
    ],
    sourceHint: "Airline summary list (illustrative)",
  },
  {
    country: "Switzerland",
    entry: "Visa on arrival",
    maxStay: "90 days (multiple-entry) within 6 months",
    notes: [
      "For long-term living, verify the right visa/residency route early.",
      "Rules can change—always verify before travel.",
    ],
    sourceHint: "Airline summary list (illustrative)",
  },
  {
    country: "Australia",
    entry: "Visa on arrival",
    maxStay: "90 days (multiple-entry) within 6 months",
    notes: [
      "For long-term relocation, plan lease commitments around residency confirmation.",
      "Rules can change—always verify before travel.",
    ],
    sourceHint: "Airline summary list (illustrative)",
  },
  {
    country: "New Zealand",
    entry: "Visa on arrival",
    maxStay: "90 days (multiple-entry) within 6 months",
    notes: [
      "If you’re moving for work, align move-in date with visa timelines.",
      "Rules can change—always verify before travel.",
    ],
    sourceHint: "Airline summary list (illustrative)",
  },
  {
    country: "Singapore",
    entry: "Visa on arrival",
    maxStay: "30 days (free on arrival)",
    notes: [
      "For longer stays, residency pathway planning is key before signing longer leases.",
      "Rules can change—always verify before travel.",
    ],
    sourceHint: "Airline summary list (illustrative)",
  },

  // 30-day examples (kept)
  {
    country: "Republic of Ireland",
    entry: "Visa on arrival",
    maxStay: "30 days (free on arrival)",
    notes: [
      "If you plan to stay longer, you’ll likely need to transition to a residency route.",
      "Rules can change—always verify before travel.",
    ],
    sourceHint: "Airline summary list (illustrative)",
  },
  {
    country: "Mauritius",
    entry: "Visa on arrival",
    maxStay: "30 days (free on arrival)",
    notes: [
      "For long-term living, we’ll guide you on the rental process timeline and what docs landlords typically request.",
      "Rules can change—always verify before travel.",
    ],
    sourceHint: "Airline summary list (illustrative)",
  },

  // GCC
  {
    country: "Saudi Arabia (GCC)",
    entry: "GCC visa-free",
    maxStay: "Visa-free entry (duration depends on UAE entry rules)",
    notes: [
      "GCC nationals often have simplified entry; confirm the exact duration/requirements before travel.",
      "Rules can change—always verify before travel.",
    ],
    sourceHint: "GCC entry note (illustrative)",
  },
  {
    country: "Kuwait (GCC)",
    entry: "GCC visa-free",
    maxStay: "Visa-free entry (duration depends on UAE entry rules)",
    notes: [
      "GCC nationals often have simplified entry; confirm the exact duration/requirements before travel.",
      "Rules can change—always verify before travel.",
    ],
    sourceHint: "GCC entry note (illustrative)",
  },
  {
    country: "Qatar (GCC)",
    entry: "GCC visa-free",
    maxStay: "Visa-free entry (duration depends on UAE entry rules)",
    notes: [
      "GCC nationals often have simplified entry; confirm the exact duration/requirements before travel.",
      "Rules can change—always verify before travel.",
    ],
    sourceHint: "GCC entry note (illustrative)",
  },

  // Conditional / Visa required (kept)
  {
    country: "India",
    entry: "Conditional visa on arrival",
    maxStay: "14 days (single-entry) if eligible",
    notes: [
      "Eligibility can depend on holding certain valid visas/residency permits (e.g., US/UK/EU etc.).",
      "If not eligible, you’ll need to arrange a visa before travel.",
      "Rules can change—always verify before travel.",
    ],
    sourceHint: "Airline summary note (illustrative)",
  },
  {
    country: "Kenya",
    entry: "Visa required before travel",
    maxStay: "Varies by visa type",
    notes: [
      "If your country is not on visa-on-arrival lists, you generally need to arrange a UAE visa before you travel.",
      "For long-term stays (work/relocation), a residence visa route is typically required.",
      "Rules can change—always verify before travel.",
    ],
    sourceHint: "Airline summary note (illustrative)",
  },
  {
    country: "Nigeria",
    entry: "Visa required before travel",
    maxStay: "Varies by visa type",
    notes: [
      "If your country is not on visa-on-arrival lists, you generally need to arrange a UAE visa before you travel.",
      "For long-term stays (work/relocation), a residence visa route is typically required.",
      "Rules can change—always verify before travel.",
    ],
    sourceHint: "Airline summary note (illustrative)",
  },
  {
    country: "South Africa",
    entry: "Visa required before travel",
    maxStay: "Varies by visa type",
    notes: [
      "If your country is not on visa-on-arrival lists, you generally need to arrange a UAE visa before you travel.",
      "For long-term stays (work/relocation), a residence visa route is typically required.",
      "Rules can change—always verify before travel.",
    ],
    sourceHint: "Airline summary note (illustrative)",
  },
  {
    country: "China",
    entry: "Visa required before travel",
    maxStay: "Varies by visa type",
    notes: [
      "You’ll typically need to arrange a UAE visa before travel.",
      "For long-term stays, a residence visa route is usually required.",
      "Rules can change—always verify before travel.",
    ],
    sourceHint: "Illustrative",
  },
  {
    country: "Pakistan",
    entry: "Visa required before travel",
    maxStay: "Varies by visa type",
    notes: [
      "You’ll typically need to arrange a UAE visa before travel.",
      "For long-term stays, a residence visa route is usually required.",
      "Rules can change—always verify before travel.",
    ],
    sourceHint: "Illustrative",
  },
];

const SERVICES: Service[] = [
  {
    title: "Tenant Matching",
    tag: "Find the right home fast",
    bullets: [
      "Requirements capture",
      "Shortlist in 24–72 hours",
      "Landlord-ready profile",
    ],
    detailsTitle: "Tenant Matching (Keystne)",
    detailsBody: [
      "We start with your work location, lifestyle, commute tolerance, and budget—then match you to realistic options in the right communities.",
      "You’ll receive a curated shortlist (not a long scroll), with clear trade-offs: space vs location, building quality, amenities, traffic patterns.",
    ],
    deliverables: [
      "Shortlist PDF",
      "Community comparison notes",
      "Viewing plan (remote or in-person)",
    ],
  },
  {
    title: "Remote Viewings",
    tag: "If you’re not in Dubai yet",
    bullets: ["Video walk-throughs", "Live call support", "Pros/cons summary"],
    detailsTitle: "Remote Viewings & Decision Support",
    detailsBody: [
      "If you’re overseas, we can coordinate agent viewings and support you live while you decide.",
      "We keep it practical: condition checks, noise/traffic cues, building management, and what to watch out for in contracts.",
    ],
    deliverables: [
      "Viewing recordings",
      "Decision matrix",
      "Negotiation prep notes",
    ],
  },
  {
    title: "Lease Negotiation",
    tag: "Protect your downside",
    bullets: [
      "Rent & cheques strategy",
      "Deposit terms",
      "Contract sanity check",
    ],
    detailsTitle: "Lease Negotiation & Terms",
    detailsBody: [
      "Dubai leasing can be simple—until it isn’t. We help you negotiate the key terms and avoid surprises.",
      "We focus on the practical items: payment structure, maintenance clauses, move-in condition, and timelines.",
    ],
    deliverables: [
      "Negotiation checklist",
      "Terms summary",
      "Move-in timeline",
    ],
  },
  {
    title: "Move-in Setup",
    tag: "Get operational quickly",
    bullets: [
      "DEWA/internet guidance",
      "Inventory & snag checks",
      "Handover coordination",
    ],
    detailsTitle: "Move-in & Setup",
    detailsBody: [
      "Once you’ve chosen a home, we help you move from ‘approved’ to ‘living’ with minimal friction.",
      "We coordinate handover steps and basic setup guidance so you’re not stuck in admin loops.",
    ],
    deliverables: [
      "Handover checklist",
      "Setup guidance",
      "Snag & inventory notes",
    ],
  },
  {
    title: "Corporate Rentals",
    tag: "For employers relocating staff",
    bullets: [
      "Bulk placement support",
      "Policy alignment",
      "Speed-focused sourcing",
    ],
    detailsTitle: "Corporate / Employer Supported Rentals",
    detailsBody: [
      "If your company is relocating you (or relocating multiple employees), we can align to policy and timelines.",
      "We’ll keep everything structured: approvals, shortlist formats, and consistent reporting.",
    ],
    deliverables: [
      "Corporate shortlist pack",
      "Policy-aligned options",
      "Placement timeline",
    ],
  },
  {
    title: "Renewals & Upgrades",
    tag: "Stay smart year-on-year",
    bullets: ["Renewal planning", "Upgrade options", "Rent check guidance"],
    detailsTitle: "Renewals, Upgrades & Next Move",
    detailsBody: [
      "Whether you’re renewing, upgrading, or moving communities, we help you plan early so you’re not rushed.",
      "We’ll recommend the cleanest path based on your lifestyle changes and commute needs.",
    ],
    deliverables: [
      "Renewal plan",
      "Alternative shortlist",
      "Decision support notes",
    ],
  },
];

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-full border px-3 py-1 text-xs"
      style={{
        borderColor: "rgba(0,0,0,0.12)",
        background: "rgba(255,255,255,0.7)",
      }}
    >
      {children}
    </span>
  );
}

function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
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
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
          <div>
            <div className="text-xs tracking-[0.25em] text-black/60">
              DETAILS
            </div>
            <div className="mt-1 text-xl font-semibold text-black">{title}</div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border px-3 py-2 text-sm text-black hover:bg-black/5"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/** Simple inline icons (NO lucide-react) */
function Icon({
  name,
  className = "h-4 w-4",
}: {
  name: "whatsapp" | "phone" | "telegram" | "mail";
  className?: string;
}) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
  };
  switch (name) {
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

/** Contact dock — match the rest of the site (same as other pages) */
function ContactDock({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="fixed bottom-5 right-5 z-40 w-[240px] overflow-hidden rounded-[22px] border border-black/10 bg-white/90 shadow-ks backdrop-blur-xl">
      <div className="p-2">
        <button
          type="button"
          onClick={onOpen}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#C8A45D] px-3 py-3 text-[12px] font-semibold text-black hover:brightness-110"
        >
          <Icon name="whatsapp" className="h-4 w-4" /> WhatsApp us
        </button>
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
              subject: "Keystne — Long-term rental enquiry",
              body: "Hi Keystne team,\n\nI'd like to enquire about long-term rentals:\n\nName:\nPhone:\nMove-in date:\nBudget (AED/month):\nAreas/requirements:\n\nThank you",
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

function ContactModal({
  open,
  onClose,
  defaultTopic,
}: {
  open: boolean;
  onClose: () => void;
  defaultTopic: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [budget, setBudget] = useState("");
  const [moveIn, setMoveIn] = useState("");
  const [notes, setNotes] = useState("");

  const mailtoHref = useMemo(() => {
    const body = [
      `Name: ${name || "-"}`,
      `Email: ${email || "-"}`,
      `From country: ${country || "-"}`,
      `Budget (AED/month): ${budget || "-"}`,
      `Move-in: ${moveIn || "-"}`,
      ``,
      `Notes:`,
      notes || "-",
    ].join("\n");

    return buildMailto({
      subject: defaultTopic,
      body,
    });
  }, [name, email, country, budget, moveIn, notes, defaultTopic]);

  return (
    <Modal open={open} title="Contact Keystne" onClose={onClose}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-xs text-black/60">Name</span>
          <input
            className="rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
            style={{ borderColor: "rgba(0,0,0,0.12)" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs text-black/60">Email</span>
          <input
            className="rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
            style={{ borderColor: "rgba(0,0,0,0.12)" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs text-black/60">
            Country you’re moving from
          </span>
          <input
            className="rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
            style={{ borderColor: "rgba(0,0,0,0.12)" }}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g., Canada"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs text-black/60">Budget (AED/month)</span>
          <input
            className="rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
            style={{ borderColor: "rgba(0,0,0,0.12)" }}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g., 12,000"
          />
        </label>

        <label className="grid gap-1 sm:col-span-2">
          <span className="text-xs text-black/60">Preferred move-in date</span>
          <input
            type="date"
            className="rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
            style={{ borderColor: "rgba(0,0,0,0.12)" }}
            value={moveIn}
            onChange={(e) => setMoveIn(e.target.value)}
          />
        </label>

        <label className="grid gap-1 sm:col-span-2">
          <span className="text-xs text-black/60">
            Anything else (areas, commute, bedrooms, pets, etc.)
          </span>
          <textarea
            className="min-h-[110px] rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
            style={{ borderColor: "rgba(0,0,0,0.12)" }}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tell us what you need…"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={onClose}
          className="rounded-full border px-5 py-3 text-sm text-black hover:bg-black/5"
        >
          Not now
        </button>

        <a
          href={mailtoHref}
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-black"
          style={{ background: GOLD }}
        >
          Send enquiry
        </a>
      </div>

      <div className="mt-4 text-xs text-black/50">
        By sending, you agree that Keystne may contact you about your enquiry.
        We don’t provide legal or financial advice.
      </div>
    </Modal>
  );
}

export default function LongTermRentalsPage() {
  const [selectedCountry, setSelectedCountry] =
    useState<string>("United Kingdom");
  const [openService, setOpenService] = useState<Service | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

  // Hide top nav on scroll (disappears as soon as user starts scrolling down)
  const [showTopNav, setShowTopNav] = useState(true);
  useEffect(() => {
    const onScroll = () => setShowTopNav(window.scrollY <= 5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const rule = useMemo(() => {
    return (
      IMMIGRATION.find((r) => r.country === selectedCountry) ?? IMMIGRATION[0]
    );
  }, [selectedCountry]);

  const countries = useMemo(() => IMMIGRATION.map((r) => r.country).sort(), []);

  const visaLine = useMemo(() => {
    if (rule.entry === "Visa required before travel") {
      return {
        tone: "warn" as const,
        text: "You need to apply for a UAE visa before travel.",
      };
    }
    const days = parseVisaDays(rule.maxStay);
    if (days) {
      return {
        tone: "ok" as const,
        text: `You can stay up to ${days} days in Dubai without applying in advance (illustrative — verify eligibility).`,
      };
    }
    return {
      tone: "ok" as const,
      text: "Entry may be possible without applying in advance (illustrative — verify eligibility and duration).",
    };
  }, [rule]);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* NAV — match other pages + hide on scroll */}
      <div
        className={cx(
          "fixed left-0 right-0 top-0 z-50 bg-white text-black transition-transform duration-200",
          showTopNav ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <KeystneNav />
      </div>

      <main className="mx-auto max-w-6xl px-4 pt-28">
        <div className="text-xs tracking-[0.35em] text-black/50">
          LONG-TERM RENTALS
        </div>
        <h1 className="mt-3 text-5xl font-black tracking-tight">
          Settle in Dubai, smoothly.
        </h1>
        <p className="mt-4 max-w-3xl text-base text-black/70">
          Tell us where you’re coming from — we’ll show the typical entry
          pathway (illustrative) and help you secure the right long-term home
          with a premium, low-stress process.
        </p>

        {/* Immigration panel */}
        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_1.95fr]">
          <div className="rounded-3xl border bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <div className="text-xs tracking-[0.35em] text-black/50">
                START HERE
              </div>
              <Pill>Immigration snapshot</Pill>
            </div>

            <div className="mt-4 text-lg font-semibold">
              Where are you moving from?
            </div>

            <div className="mt-3">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2"
                style={{ borderColor: "rgba(0,0,0,0.12)" }}
              >
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Visa-free days / visa required line directly below the country selector */}
            <div
              className={cx(
                "mt-4 rounded-2xl border bg-white p-4 text-sm",
                visaLine.tone === "warn" ? "text-black/80" : "text-black/80"
              )}
              style={{ borderColor: "rgba(0,0,0,0.10)" }}
            >
              <div className="text-xs tracking-[0.25em] text-black/50">
                SUMMARY
              </div>
              <div className="mt-2">{visaLine.text}</div>
            </div>

            {/* Shortlist CTA immediately below (as requested) */}
            <button
              onClick={() => setContactOpen(true)}
              className="mt-4 w-full rounded-full px-5 py-3 text-sm font-semibold text-black"
              style={{ background: GOLD }}
            >
              Request a rental shortlist
            </button>

            <div className="mt-4 text-xs text-black/50">
              We’ll reply with a shortlist plan + next steps. No spam.
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-7 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs tracking-[0.35em] text-black/50">
                  ENTRY GUIDANCE
                </div>
                <div className="mt-2 text-2xl font-black">{rule.country}</div>
              </div>
              <div className="flex gap-2">
                <Pill>{rule.entry}</Pill>
                <Pill>{rule.maxStay}</Pill>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div
                className="rounded-2xl border bg-white p-5"
                style={{ borderColor: "rgba(0,0,0,0.10)" }}
              >
                <div className="text-sm font-semibold">
                  What this usually means
                </div>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-black/70">
                  {rule.notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>

              <div
                className="rounded-2xl border bg-white p-5"
                style={{ borderColor: "rgba(0,0,0,0.10)" }}
              >
                <div className="text-sm font-semibold">
                  Keystne’s practical approach
                </div>
                <ul className="mt-3 space-y-2 text-sm text-black/70">
                  <li>
                    • Align tenancy timing with your visa/residency path (so you
                    don’t over-commit).
                  </li>
                  <li>
                    • Structure your application for landlords: profile, income
                    proof, and readiness.
                  </li>
                  <li>
                    • Keep your first lease simple, then upgrade once you’re
                    settled.
                  </li>
                </ul>
                <div className="mt-4 text-xs text-black/50">
                  Source hint:{" "}
                  <span className="text-black/70">{rule.sourceHint}</span>
                </div>
              </div>
            </div>

            <div
              className="mt-5 rounded-2xl border bg-white p-5 text-sm text-black/70"
              style={{ borderColor: "rgba(0,0,0,0.10)" }}
            >
              <span className="font-semibold text-black">Important:</span> This
              is an illustrative snapshot for lead guidance and planning only.
              Immigration rules can change without notice. Always verify your
              specific eligibility and documentation with official UAE channels
              before traveling or signing contracts.
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs tracking-[0.35em] text-black/50">
                SERVICES
              </div>
              <h2 className="mt-2 text-3xl font-black">
                Everything you need for a long-term rental.
              </h2>
            </div>
            <a
              href="/communities"
              className="inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-black/5"
              style={{ borderColor: "rgba(0,0,0,0.12)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget.style.borderColor as any) = GOLD)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget.style.borderColor as any) =
                  "rgba(0,0,0,0.12)")
              }
            >
              Discover communities →
            </a>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <button
                key={s.title}
                onClick={() => setOpenService(s)}
                className="group rounded-3xl border bg-white p-6 text-left shadow-[0_18px_50px_rgba(0,0,0,0.06)] transition hover:-translate-y-[1px]"
                style={{ borderColor: "rgba(0,0,0,0.10)" }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-lg font-black">{s.title}</div>
                  <span
                    className="rounded-full border px-3 py-1 text-[11px]"
                    style={{
                      borderColor: "rgba(0,0,0,0.12)",
                      color: "rgba(0,0,0,0.7)",
                    }}
                  >
                    View
                  </span>
                </div>

                <div className="mt-2 text-sm text-black/70">{s.tag}</div>

                <ul className="mt-4 space-y-2 text-sm text-black/70">
                  {s.bullets.map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-black">
                  Learn more{" "}
                  <span
                    className="transition-transform group-hover:translate-x-0.5"
                    style={{ color: GOLD }}
                  >
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Simple T&Cs (outside boxes as requested style) */}
        <section className="mt-12">
          <div className="text-xs tracking-[0.35em] text-black/50">T&Cs</div>
          <div className="mt-3 space-y-2 text-sm text-black/70">
            <p>
              Keystne provides concierge and property support services only. We
              do not provide legal, immigration, or financial advice.
            </p>
            <p>
              Any immigration guidance shown is illustrative and may be
              incomplete or out of date. You should confirm requirements with
              official UAE sources before traveling, signing leases, or making
              relocation decisions.
            </p>
            <p>
              Rental availability, pricing, and landlord requirements vary by
              building, community, season, and individual application strength.
            </p>
          </div>
        </section>
      </main>

      {/* Footer — match other pages */}
      <KeystneFooter />

      {/* Service details modal */}
      <Modal
        open={!!openService}
        title={openService?.detailsTitle ?? ""}
        onClose={() => setOpenService(null)}
      >
        {openService && (
          <div className="space-y-5">
            <div className="space-y-2 text-sm text-black/70">
              {openService.detailsBody.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div
              className="rounded-2xl border bg-white p-5"
              style={{ borderColor: "rgba(0,0,0,0.10)" }}
            >
              <div className="text-sm font-semibold text-black">
                What you get
              </div>
              <ul className="mt-3 space-y-2 text-sm text-black/70">
                {openService.deliverables.map((d) => (
                  <li key={d}>• {d}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={() => setOpenService(null)}
                className="rounded-full border px-5 py-3 text-sm text-black hover:bg-black/5"
              >
                Back
              </button>
              <button
                onClick={() => {
                  setOpenService(null);
                  setContactOpen(true);
                }}
                className="rounded-full px-6 py-3 text-sm font-semibold text-black"
                style={{ background: GOLD }}
              >
                Get a shortlist
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Contact popup */}
      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        defaultTopic="Keystne — Long-term rental enquiry"
      />

      {/* Floating contact box — match other pages */}
      <ContactDock onOpen={() => setContactOpen(true)} />
    </div>
  );
}
