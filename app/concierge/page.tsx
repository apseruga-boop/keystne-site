"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import KeystneNav from "../../components/site/KeystneNav";
import KeystneFooter from "../../components/site/KeystneFooter";
import ContactDock from "../../components/concierge/ContactDock";
import { CONTACT, MEDIA, DUBAI_AREAS } from "../../components/site/config";
import { IconArrowRight, IconX, IconCheck } from "../../components/site/Icons";

type CallWhen = "ASAP" | "1 month" | "2 months" | "6 months";
type Household = "Single" | "Couple" | "Family";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function mailtoConcierge(payload: {
  name: string;
  email: string;
  phone: string;
  when: CallWhen;
  country: string;
  household: Household | "";
  kids: "No" | "Yes";
  relocationDate: string;
  areaKnown: "No" | "Yes";
  area: string;
  budgetBand: string;
  notes: string;
  bookingDate?: string;
  bookingTime?: string;
}) {
  const to = CONTACT.emailArthur;
  const cc = CONTACT.emailStuart;

  const subject = encodeURIComponent(
    `Keystne enquiry — Concierge (Relocation)`
  );
  const body = encodeURIComponent(
    `Hi Keystne team,\n\n` +
      `I’d like a Concierge plan.\n\n` +
      `CONTACT\n` +
      `Name: ${payload.name}\n` +
      `Email: ${payload.email}\n` +
      `Phone: ${payload.phone}\n` +
      `When: ${payload.when}\n\n` +
      `RELOCATION DETAILS\n` +
      `Origin country: ${payload.country}\n` +
      `Household: ${payload.household || "-"}\n` +
      `Kids: ${payload.kids}\n` +
      `Relocation date: ${payload.relocationDate || "-"}\n` +
      `Area known: ${payload.areaKnown}\n` +
      `Preferred area: ${payload.area || "-"}\n` +
      `Budget band: ${payload.budgetBand || "-"}\n\n` +
      `CALL BOOKING (if provided)\n` +
      `Date: ${payload.bookingDate || "-"}\n` +
      `Time: ${payload.bookingTime || "-"}\n\n` +
      `NOTES\n` +
      `${payload.notes || "-"}\n\n` +
      `Thank you`
  );

  return `mailto:${to}?cc=${cc}&subject=${subject}&body=${body}`;
}

function StatPill({
  label,
  value,
  foot,
}: {
  label: string;
  value: string;
  foot: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/5 p-5">
      <div className="text-[11px] tracking-[0.22em] text-white/55">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-[#F7F3EA] md:text-3xl">
        {value}
      </div>
      <div className="mt-2 text-[11px] text-white/45">{foot}</div>
    </div>
  );
}

function PremiumToggle({
  label,
  value,
  onChange,
  a,
  b,
}: {
  label: string;
  value: "No" | "Yes";
  onChange: (v: "No" | "Yes") => void;
  a: string;
  b: string;
}) {
  return (
    <div className="space-y-2">
      <div className="text-[11px] tracking-[0.18em] text-white/55">{label}</div>
      <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
        <button
          type="button"
          onClick={() => onChange("No")}
          className={[
            "px-4 py-3 text-sm transition",
            value === "No"
              ? "bg-white/10 text-white"
              : "text-white/65 hover:bg-white/5",
          ].join(" ")}
        >
          {a}
        </button>
        <button
          type="button"
          onClick={() => onChange("Yes")}
          className={[
            "px-4 py-3 text-sm transition",
            value === "Yes"
              ? "bg-white/10 text-white"
              : "text-white/65 hover:bg-white/5",
          ].join(" ")}
        >
          {b}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between">
        <div className="text-[11px] tracking-[0.18em] text-white/55">
          {label}
        </div>
        {hint ? <div className="text-[11px] text-white/45">{hint}</div> : null}
      </div>
      {children}
    </div>
  );
}

function PremiumInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none",
        "placeholder:text-white/35 focus:border-[#C8A45D]/45 focus:ring-2 focus:ring-[#C8A45D]/10",
        props.className || "",
      ].join(" ")}
    />
  );
}

function PremiumSelect({
  value,
  onChange,
  options,
  placeholder = "Select…",
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-[#C8A45D]/45 focus:ring-2 focus:ring-[#C8A45D]/10"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o} className="bg-black">
          {o}
        </option>
      ))}
    </select>
  );
}

function ModalShell({
  open,
  title,
  subtitle,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 md:items-center">
      <button
        aria-label="Close overlay"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0a0a] shadow-ks">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <div className="text-base font-semibold tracking-wide text-[#F7F3EA]">
              {title}
            </div>
            {subtitle ? (
              <div className="mt-1 text-xs text-white/60">{subtitle}</div>
            ) : null}
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl p-2 text-white/70 hover:bg-white/10"
            aria-label="Close"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function HoverVideoTile({
  title,
  sentence,
  video,
  href,
}: {
  title: string;
  sentence: string;
  video: string;
  href?: string;
}) {
  const [hover, setHover] = useState(false);

  const content = (
    <div
      className="group relative block h-[420px] overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-ks"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      tabIndex={0}
    >
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-75"
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/35 to-black/85" />

      <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] text-white/70 backdrop-blur">
        Hover to preview
      </div>

      <div className="relative flex h-full flex-col justify-end p-7">
        <div className="text-[11px] tracking-[0.22em] text-white/55">
          KEYSTNE • CONCIERGE
        </div>
        <div className="mt-2 text-3xl font-semibold text-[#F7F3EA]">
          {title}
        </div>
        <div className="mt-3 max-w-md text-sm text-white/70">{sentence}</div>
        <div className="mt-6 inline-flex items-center gap-2 text-sm text-[#F7F3EA]">
          Learn more{" "}
          <span className="transition group-hover:translate-x-1">→</span>
        </div>
      </div>
    </div>
  );

  if (!href) return content;
  return <Link href={href}>{content}</Link>;
}

export default function ConciergePage() {
  // Calculator inputs
  const [country, setCountry] = useState("");
  const [household, setHousehold] = useState<Household | "">("");
  const [kids, setKids] = useState<"No" | "Yes">("No");
  const [relocationDate, setRelocationDate] = useState("");
  const [areaKnown, setAreaKnown] = useState<"No" | "Yes">("No");
  const [area, setArea] = useState("");
  const [budgetBand, setBudgetBand] = useState("");

  // Lead modal inputs
  const [leadOpen, setLeadOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");
  const [phone, setPhone] = useState("");
  const [when, setWhen] = useState<CallWhen>("ASAP");
  const [notes, setNotes] = useState("");

  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");

  const timelineWeeks = useMemo(() => {
    // Premium-feel, but simple logic (replace with researched model later)
    const base = 6; // weeks
    const kidsAdd = kids === "Yes" ? 3 : 0;
    const areaAdd = areaKnown === "Yes" ? 1 : 2;
    const householdAdd =
      household === "Family" ? 2 : household === "Couple" ? 1 : 0;
    return base + kidsAdd + areaAdd + householdAdd;
  }, [kids, areaKnown, household]);

  const schoolAddOn =
    kids === "Yes"
      ? "School admissions + fees guidance included"
      : "No school setup needed";

  const uaeCommunityEstimate = useMemo(() => {
    // Placeholder “publicly available numbers” feel (swap to real data later)
    if (!country.trim()) return "—";
    const seed = country
      .toLowerCase()
      .split("")
      .reduce((a, c) => a + c.charCodeAt(0), 0);
    const approx = Math.max(12000, (seed * 37) % 420000);
    return `${approx.toLocaleString()}+`;
  }, [country]);

  const canOpenLead = !!country && !!household && !!relocationDate;
  const emailOk = isValidEmail(email);
  const emailMatch = email.trim() && email.trim() === email2.trim();

  const leadReady =
    name.trim().length >= 2 &&
    emailOk &&
    emailMatch &&
    phone.trim().length >= 6 &&
    country.trim().length >= 2;

  function openLeadFlow() {
    if (!canOpenLead) return;
    setLeadOpen(true);
  }

  function submitLead() {
    if (!leadReady) return;

    // If ASAP, encourage booking modal (premium flow)
    if (when === "ASAP") {
      setLeadOpen(false);
      setBookingOpen(true);
      return;
    }

    const href = mailtoConcierge({
      name,
      email,
      phone,
      when,
      country,
      household,
      kids,
      relocationDate,
      areaKnown,
      area,
      budgetBand,
      notes,
    });

    window.location.href = href;
  }

  function confirmBookingAndEmail() {
    if (!leadReady) return;

    const href = mailtoConcierge({
      name,
      email,
      phone,
      when,
      country,
      household,
      kids,
      relocationDate,
      areaKnown,
      area,
      budgetBand,
      notes,
      bookingDate,
      bookingTime,
    });

    window.location.href = href;
    setBookingOpen(false);
  }

  return (
    <div className="min-h-screen bg-ksBlack text-ksWhite">
      <KeystneNav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <video
            className="h-[92vh] w-full object-cover opacity-70"
            src={MEDIA.videos.concierge || MEDIA.videos.hero}
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-ksBlack" />
        </div>

        <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-4 pb-14 pt-28">
          <div className="ks-glass ks-fade-up rounded-[28px] p-8 shadow-ks">
            <div className="text-[11px] tracking-[0.22em] text-white/55">
              CONCIERGE • RELOCATION • INVESTOR TRIPS
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
              We handle Dubai personally — start to finish.
            </h1>
            <p className="mt-4 text-base text-white/70 md:text-lg">
              The concierge service is built for people relocating or investing
              from abroad. You tell us your goals — we organise the trip, curate
              viewings, and guide you through the full buying or move-in
              journey, including school support if you have children.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openLeadFlow}
                disabled={!canOpenLead}
                className={[
                  "ks-btn-gold ks-gold-ring inline-flex items-center justify-center rounded-2xl bg-black/55 px-6 py-4 text-sm text-ksWhite hover:bg-black/70",
                  !canOpenLead ? "opacity-50 cursor-not-allowed" : "",
                ].join(" ")}
              >
                Get your concierge plan <IconArrowRight className="h-4 w-4" />
              </button>

              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm hover:bg-white/10"
              >
                About us
              </Link>

              <Link
                href="/communities"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm hover:bg-white/10"
              >
                Discover Dubai communities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-ksBlack">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-4 md:grid-cols-3">
            <StatPill
              label="COMMUNITY"
              value={uaeCommunityEstimate}
              foot="Estimated UAE residents from your selected country (placeholder — swap to public source later)."
            />
            <StatPill
              label="TIMELINE"
              value={`~${timelineWeeks} weeks`}
              foot={`Includes profiling, shortlisting, viewings, contracting, and move-in. ${schoolAddOn}.`}
            />
            <StatPill
              label="SERVICE STYLE"
              value="Bespoke"
              foot="One-to-one handling: we plan, coordinate, and move with you — not a generic process."
            />
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <HoverVideoTile
              title="Investor Trip & Viewings"
              sentence="We organise your Dubai visit, curate viewings, and guide you through the purchase journey personally."
              video={MEDIA.videos.investments || MEDIA.videos.concierge}
            />
            <HoverVideoTile
              title="Relocation & Settlement"
              sentence="From area selection to move-in — including school support where needed — we manage the transition end-to-end."
              video={MEDIA.videos.leasing || MEDIA.videos.concierge}
            />
          </div>

          {/* Calculator */}
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <div className="text-[11px] tracking-[0.22em] text-white/55">
                RELOCATION PREVIEW
              </div>
              <div className="mt-2 text-2xl font-semibold text-[#F7F3EA]">
                Build a premium estimate — then we personalise it.
              </div>
              <div className="mt-3 text-sm text-white/65">
                This is a quick preview to shape your journey. For a full
                breakdown, you’ll email us your details.
              </div>

              <div className="mt-6 grid gap-4">
                <Field
                  label="Origin country"
                  hint="Used for community + cost assumptions"
                >
                  <PremiumInput
                    placeholder="e.g., United Kingdom"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </Field>

                <Field label="Household">
                  <PremiumSelect
                    value={household}
                    onChange={(v) => setHousehold(v as Household)}
                    options={["Single", "Couple", "Family"]}
                  />
                </Field>

                <PremiumToggle
                  label="Kids"
                  value={kids}
                  onChange={setKids}
                  a="No"
                  b="Yes"
                />

                <Field label="Target relocation date">
                  <PremiumInput
                    type="date"
                    value={relocationDate}
                    onChange={(e) => setRelocationDate(e.target.value)}
                  />
                </Field>

                <PremiumToggle
                  label="Do you know your preferred area?"
                  value={areaKnown}
                  onChange={(v) => {
                    setAreaKnown(v);
                    setArea("");
                    setBudgetBand("");
                  }}
                  a="No"
                  b="Yes"
                />

                {areaKnown === "Yes" ? (
                  <Field label="Preferred area">
                    <PremiumSelect
                      value={area}
                      onChange={setArea}
                      options={DUBAI_AREAS}
                    />
                  </Field>
                ) : (
                  <Field label="Monthly budget band">
                    <PremiumSelect
                      value={budgetBand}
                      onChange={setBudgetBand}
                      options={[
                        "< 8k AED",
                        "8–15k AED",
                        "15–25k AED",
                        "25k+ AED",
                      ]}
                    />
                  </Field>
                )}

                <button
                  type="button"
                  onClick={openLeadFlow}
                  disabled={!canOpenLead}
                  className={[
                    "ks-btn-gold ks-gold-ring mt-2 inline-flex items-center justify-center rounded-2xl bg-black/55 px-6 py-4 text-sm text-ksWhite hover:bg-black/70",
                    !canOpenLead ? "opacity-50 cursor-not-allowed" : "",
                  ].join(" ")}
                >
                  See full costs & timeline{" "}
                  <IconArrowRight className="h-4 w-4" />
                </button>

                <div className="text-[11px] text-white/45">
                  Indicative preview only — final costs depend on your
                  preferences, timelines, and availability.
                </div>
              </div>
            </div>

            {/* Right side: premium “step-by-step guide” */}
            <div className="rounded-[28px] border border-white/10 bg-black/40 p-6">
              <div className="text-[11px] tracking-[0.22em] text-white/55">
                HOW IT WORKS
              </div>
              <div className="mt-2 text-2xl font-semibold text-[#F7F3EA]">
                Your journey, guided personally.
              </div>

              <div className="mt-6 space-y-3">
                {[
                  {
                    t: "Profile & plan",
                    d: "We align on goals, budget, timeline, and visa/relocation needs.",
                  },
                  {
                    t: "Curate areas & properties",
                    d: "We shortlist based on lifestyle, commute, schools, and value.",
                  },
                  {
                    t: "Organise your Dubai trip",
                    d: "Flights, stays, and a focused itinerary — viewings included.",
                  },
                  {
                    t: "Negotiate & secure",
                    d: "We guide contracts, deposits, developer checks, and closing steps.",
                  },
                  {
                    t:
                      kids === "Yes"
                        ? "School setup & fees guidance"
                        : "Move-in & settlement",
                    d:
                      kids === "Yes"
                        ? "We support school selection, admissions, and fee planning."
                        : "Utilities, move-in coordination, and settling support.",
                  },
                  {
                    t: "Ongoing support",
                    d: "You always have someone on your side in Dubai.",
                  },
                ].map((s) => (
                  <div
                    key={s.t}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#F7F3EA]">
                      <IconCheck className="h-4 w-4" />
                      {s.t}
                    </div>
                    <div className="mt-2 text-sm text-white/65">{s.d}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-[#C8A45D]/25 bg-black/55 p-4">
                <div className="text-[11px] tracking-[0.22em] text-white/55">
                  LEAD GEN
                </div>
                <div className="mt-2 text-sm text-white/75">
                  Ready? Send your details and we’ll respond with a bespoke plan
                  (email goes directly to Arthur & Stuart).
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <KeystneFooter />

      {/* Dock uses modal handlers */}
      <ContactDock
        reason="Concierge (Relocation)"
        onOpenLead={() => setLeadOpen(true)}
        onBookCall={() => {
          setLeadOpen(true);
          setWhen("ASAP");
        }}
      />

      {/* Lead Modal */}
      <ModalShell
        open={leadOpen}
        onClose={() => setLeadOpen(false)}
        title="Concierge plan request"
        subtitle="This will open your email to Arthur & Stuart (no CRM — fastest path)."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Full name">
            <PremiumInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </Field>

          <Field label="Phone" hint="Include country code">
            <PremiumInput
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+971…"
            />
          </Field>

          <Field
            label="Email"
            hint={email && !emailOk ? "Email looks wrong" : ""}
          >
            <div className="relative">
              <PremiumInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
              />
              {emailOk ? (
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/70">
                  <IconCheck className="h-4 w-4" />
                </div>
              ) : null}
            </div>
          </Field>

          <Field
            label="Confirm email"
            hint={email2 && !emailMatch ? "Emails do not match" : ""}
          >
            <PremiumInput
              value={email2}
              onChange={(e) => setEmail2(e.target.value)}
              placeholder="Confirm email"
            />
          </Field>

          <Field label="When should we contact you?">
            <PremiumSelect
              value={when}
              onChange={(v) => setWhen(v as CallWhen)}
              options={["ASAP", "1 month", "2 months", "6 months"]}
            />
          </Field>

          <Field label="Summary" hint="Auto-filled from your preview">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/70">
              <div>
                Country: <span className="text-white">{country || "-"}</span>
              </div>
              <div>
                Household:{" "}
                <span className="text-white">{household || "-"}</span>
              </div>
              <div>
                Kids: <span className="text-white">{kids}</span>
              </div>
              <div>
                Date:{" "}
                <span className="text-white">{relocationDate || "-"}</span>
              </div>
              <div>
                Area:{" "}
                <span className="text-white">
                  {areaKnown === "Yes" ? area || "-" : "TBD"}
                </span>
              </div>
              <div>
                Budget:{" "}
                <span className="text-white">
                  {areaKnown === "No" ? budgetBand || "-" : "-"}
                </span>
              </div>
            </div>
          </Field>

          <div className="md:col-span-2">
            <div className="text-[11px] tracking-[0.18em] text-white/55">
              NOTES (OPTIONAL)
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything we should know? (visa timeline, areas you like, investment goals, school requirements...)"
              className="mt-2 h-28 w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#C8A45D]/45 focus:ring-2 focus:ring-[#C8A45D]/10"
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[11px] text-white/45">
              If you choose ASAP, we’ll prompt you to pick a date/time for a
              call.
            </div>
            <button
              type="button"
              onClick={submitLead}
              disabled={!leadReady}
              className={[
                "ks-btn-gold ks-gold-ring inline-flex items-center justify-center rounded-2xl bg-black/55 px-6 py-4 text-sm text-ksWhite hover:bg-black/70",
                !leadReady ? "opacity-50 cursor-not-allowed" : "",
              ].join(" ")}
            >
              Continue <IconArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </ModalShell>

      {/* Booking Modal (only if ASAP) */}
      <ModalShell
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        title="Book your call"
        subtitle="Pick a date/time — then we’ll open the email with everything included."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Preferred date">
            <PremiumInput
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />
          </Field>

          <Field label="Preferred time">
            <PremiumInput
              type="time"
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
            />
          </Field>

          <div className="md:col-span-2 rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/70">
            <div className="text-[11px] tracking-[0.18em] text-white/55">
              CONFIRM
            </div>
            <div className="mt-2 text-white/80">
              {name || "—"} • {email || "—"} • {phone || "—"}
            </div>
          </div>

          <div className="md:col-span-2 flex items-center justify-end">
            <button
              type="button"
              onClick={confirmBookingAndEmail}
              disabled={!bookingDate || !bookingTime || !leadReady}
              className={[
                "ks-btn-gold ks-gold-ring inline-flex items-center justify-center rounded-2xl bg-black/55 px-6 py-4 text-sm text-ksWhite hover:bg-black/70",
                !bookingDate || !bookingTime || !leadReady
                  ? "opacity-50 cursor-not-allowed"
                  : "",
              ].join(" ")}
            >
              Confirm & email us <IconArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </ModalShell>
    </div>
  );
}
