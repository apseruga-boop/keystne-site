"use client";

import React, { useMemo, useState } from "react";
import KeystneNav from "../../components/site/KeystneNav";
import KeystneFooter from "../../components/site/KeystneFooter";
import DubaiBadge from "../../components/site/DubaiBadge";
import ContactDock from "../../components/concierge/ContactDock";
import { CONTACT } from "../../components/site/config";

type Household = "Single" | "Couple" | "Family";
type CallWhen = "ASAP" | "1 month" | "2 months" | "6 months";

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
  "The Meadows",
  "Emirates Hills",
  "Motor City",
];

const PAGE_MEDIA = {
  hero: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  tile1:
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  tile2:
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function mailtoConcierge(payload: {
  name: string;
  email: string;
  phone: string;
  when: CallWhen;
  country: string;
  household: Household;
  kids: "Yes" | "No";
  date: string;
  areaMode: "Known" | "Not sure";
  area: string;
  budget: string;
  notes: string;
}) {
  const to = CONTACT.emailArthur;
  const cc = CONTACT.emailStuart;

  const subject = encodeURIComponent(
    "Keystne — Concierge (Relocation) enquiry"
  );
  const body = encodeURIComponent(
    [
      "Hi Keystne team,",
      "",
      "I’d like support with Concierge (Relocation).",
      "",
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone}`,
      `When should you call me: ${payload.when}`,
      "",
      `Origin country: ${payload.country}`,
      `Household: ${payload.household}`,
      `Kids: ${payload.kids}`,
      `Target relocation date: ${payload.date}`,
      "",
      `Preferred area: ${
        payload.areaMode === "Known" ? payload.area : "Not sure"
      }`,
      `Budget (if not sure): ${
        payload.areaMode === "Not sure" ? payload.budget : "-"
      }`,
      "",
      "Notes:",
      payload.notes || "-",
      "",
      "Thank you",
    ].join("\n")
  );

  return `mailto:${to}?cc=${cc}&subject=${subject}&body=${body}`;
}

function estimateWeeks(args: {
  kids: "Yes" | "No";
  household: Household;
  areaMode: "Known" | "Not sure";
}) {
  // premium “research-based placeholder” — we’ll refine later
  let weeks = 6; // base
  if (args.household === "Couple") weeks += 1;
  if (args.household === "Family") weeks += 2;
  if (args.kids === "Yes") weeks += 3; // school admissions + onboarding
  if (args.areaMode === "Not sure") weeks += 2; // discovery + matching
  return weeks;
}

function GoldDivider() {
  return (
    <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C8A45D]/60 to-transparent" />
  );
}

function Pill({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-white/5 p-5">
      <div className="text-[11px] tracking-[0.22em] text-white/55">STEP</div>
      <div className="mt-2 text-lg font-semibold text-white">{title}</div>
      <div className="mt-2 text-sm text-white/70">{desc}</div>
    </div>
  );
}

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
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 md:items-center">
      <button
        aria-label="Close modal backdrop"
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0a0a] shadow-ks">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <div className="text-base font-semibold tracking-wide text-white">
              {title}
            </div>
            {subtitle ? (
              <div className="mt-1 text-xs text-white/65">{subtitle}</div>
            ) : null}
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl px-3 py-2 text-[12px] font-semibold text-white/80 hover:bg-white/10"
          >
            Close
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-end justify-between">
        <label className="text-xs font-semibold tracking-wide text-white/80">
          {label} {required ? <span className="text-white/40">*</span> : null}
        </label>
      </div>
      <div
        className={[
          "flex items-center gap-2 rounded-2xl border px-3 py-3 backdrop-blur",
          error ? "border-red-400/40 bg-white/5" : "border-white/10 bg-white/5",
        ].join(" ")}
      >
        <input
          value={value}
          type={type}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
        />
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
      <label className="text-xs font-semibold tracking-wide text-white/80">
        {label} {required ? <span className="text-white/40">*</span> : null}
      </label>
      <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur">
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

export default function ConciergePage() {
  // Calculator / preview state
  const [country, setCountry] = useState("");
  const [household, setHousehold] = useState<Household | "">("");
  const [kids, setKids] = useState<"Yes" | "No">("No");
  const [date, setDate] = useState("");
  const [areaMode, setAreaMode] = useState<"Known" | "Not sure">("Not sure");
  const [area, setArea] = useState("");
  const [budget, setBudget] = useState("");

  // Lead modal
  const [open, setOpen] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadEmail2, setLeadEmail2] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [when, setWhen] = useState<CallWhen>("ASAP");
  const [notes, setNotes] = useState("");

  const weeks = useMemo(() => {
    if (!household)
      return estimateWeeks({ kids, household: "Single", areaMode });
    return estimateWeeks({ kids, household, areaMode });
  }, [kids, household, areaMode]);

  const readyForPreview =
    !!country &&
    !!household &&
    !!date &&
    (areaMode === "Known" ? !!area : !!budget);

  const leadErrors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!leadName.trim()) e.name = "Enter your name.";
    if (!leadEmail.trim()) e.email = "Enter your email.";
    else if (!isValidEmail(leadEmail)) e.email = "Email looks incorrect.";
    if (!leadEmail2.trim()) e.email2 = "Confirm your email.";
    else if (leadEmail2.trim() !== leadEmail.trim())
      e.email2 = "Emails do not match.";
    if (!leadPhone.trim()) e.phone = "Enter your phone (with country code).";
    return e;
  }, [leadName, leadEmail, leadEmail2, leadPhone]);

  const canSend = Object.keys(leadErrors).length === 0;

  const send = () => {
    const link = mailtoConcierge({
      name: leadName,
      email: leadEmail,
      phone: leadPhone,
      when,
      country,
      household: (household || "Single") as Household,
      kids,
      date,
      areaMode,
      area,
      budget,
      notes,
    });
    window.location.href = link;
  };

  return (
    <div className="min-h-screen bg-ksBlack text-ksWhite">
      <KeystneNav />
      <DubaiBadge />
      <ContactDock />

      {/* HERO */}
      <section className="relative min-h-[70vh] overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          src={PAGE_MEDIA.hero}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/40 to-ksBlack" />

        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-32">
          <div className="max-w-3xl">
            <div className="text-[11px] tracking-[0.22em] text-white/55">
              CONCIERGE • RELOCATION
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
              We handle your move personally — from the first call to keys in
              hand.
            </h1>
            <p className="mt-5 text-base text-white/70 md:text-lg">
              This is not a “handover” service. If you’ve found a property (or
              want to), we organise your trip to Dubai, curate viewings, guide
              offers, paperwork, and help you settle — including school
              onboarding if you have children.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setOpen(true)}
                className="ks-btn-gold ks-gold-ring inline-flex items-center justify-center rounded-2xl bg-white/15 px-6 py-4 text-sm font-semibold text-white hover:bg-white/20"
              >
                Get a concierge plan →
              </button>
              <a
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-semibold text-white hover:bg-white/15"
              >
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-ksBlack">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="text-[11px] tracking-[0.22em] text-white/55">
            HOW IT WORKS
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            A premium, guided process — end to end.
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <Pill
              title="1) Profile & goals"
              desc="We understand your budget, lifestyle, timeline, and non-negotiables."
            />
            <Pill
              title="2) Trip & viewings"
              desc="We organise a Dubai trip and curate a viewing schedule built around you."
            />
            <Pill
              title="3) Offer & paperwork"
              desc="We guide the offer, negotiation, documentation and process steps."
            />
            <Pill
              title="4) Move-in & support"
              desc="We help you settle — plus school setup if you’re relocating with kids."
            />
          </div>

          <div className="mt-10">
            <GoldDivider />
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="bg-ksBlack">
        <div className="mx-auto max-w-6xl px-4 pb-16">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left: Inputs */}
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="text-[11px] tracking-[0.22em] text-white/55">
                RELOCATION PREVIEW
              </div>
              <div className="mt-2 text-xl font-semibold text-white">
                Quick preview — unlock the full plan by email.
              </div>
              <div className="mt-2 text-sm text-white/65">
                This is a premium estimate to guide the next step. We’ll provide
                the full cost breakdown and timeline when you contact us.
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
                  onChange={(v) => setKids(v as "Yes" | "No")}
                  options={["No", "Yes"]}
                />

                <Input
                  label="Target relocation date"
                  value={date}
                  onChange={setDate}
                  type="date"
                  required
                />

                <Select
                  label="Preferred Dubai area"
                  value={areaMode}
                  onChange={(v) => {
                    const vv = v as "Known" | "Not sure";
                    setAreaMode(vv);
                    setArea("");
                    setBudget("");
                  }}
                  options={["Not sure", "Known"]}
                />

                {areaMode === "Known" ? (
                  <Select
                    label="Select area"
                    value={area}
                    onChange={setArea}
                    options={DUBAI_AREAS}
                    required
                  />
                ) : (
                  <Select
                    label="Monthly budget band"
                    value={budget}
                    onChange={setBudget}
                    options={[
                      "< 8k AED",
                      "8–15k AED",
                      "15–25k AED",
                      "25k+ AED",
                    ]}
                    required
                  />
                )}

                <button
                  onClick={() => setOpen(true)}
                  disabled={!readyForPreview}
                  className={[
                    "mt-2 inline-flex items-center justify-center rounded-2xl px-5 py-4 text-sm font-semibold transition",
                    readyForPreview
                      ? "bg-[#C8A45D] text-black hover:brightness-110"
                      : "bg-white/10 text-white/40 cursor-not-allowed",
                  ].join(" ")}
                >
                  See full relocation costs →
                </button>

                <div className="text-[11px] text-white/45">
                  Indicative preview only. Final plan depends on your
                  preferences and legal/visa requirements.
                </div>
              </div>
            </div>

            {/* Right: Outputs */}
            <div className="rounded-[28px] border border-white/10 bg-black/40 p-6">
              <div className="text-[11px] tracking-[0.22em] text-white/55">
                ESTIMATED TIMELINE
              </div>
              <div className="mt-2 text-4xl font-semibold text-white">
                ~{weeks} weeks
              </div>
              <div className="mt-2 text-sm text-white/70">
                A high-level guide from discovery to move-in. If you have
                children, we include school application + onboarding time.
              </div>

              <div className="mt-6 space-y-3">
                {[
                  "Discovery & profiling",
                  "Area match & shortlist",
                  "Trip planning & viewings",
                  "Offer & negotiation support",
                  kids === "Yes" ? "School applications & fees timeline" : null,
                  "Move-in & settling support",
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
                <div className="text-xs text-white/70">Next step</div>
                <div className="mt-2 text-sm text-white/85">
                  Share your details and we’ll send a bespoke cost breakdown + a
                  clear step-by-step plan — handled personally.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <KeystneFooter />

      {/* LEAD MODAL (mailto only) */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Get your concierge plan"
        subtitle="This will open your email with everything pre-filled to Arthur + Stuart."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Full name"
            value={leadName}
            onChange={setLeadName}
            required
            error={leadErrors.name}
          />
          <Input
            label="Phone (with country code)"
            value={leadPhone}
            onChange={setLeadPhone}
            required
            error={leadErrors.phone}
          />
          <Input
            label="Email"
            value={leadEmail}
            onChange={setLeadEmail}
            required
            error={leadErrors.email}
          />
          <Input
            label="Confirm email"
            value={leadEmail2}
            onChange={setLeadEmail2}
            required
            error={leadErrors.email2}
          />

          <Select
            label="When should we call you?"
            value={when}
            onChange={(v) => setWhen(v as CallWhen)}
            options={["ASAP", "1 month", "2 months", "6 months"]}
            required
          />

          <div className="md:col-span-2">
            <label className="text-xs font-semibold tracking-wide text-white/80">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific needs (visa, schools, viewing dates, budget, etc.)"
              className="mt-1 h-28 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none placeholder:text-white/30"
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[11px] text-white/55">
              Your email will open in your mail client — press send to reach us.
            </div>

            <button
              onClick={send}
              disabled={!canSend}
              className={[
                "inline-flex items-center justify-center rounded-2xl px-6 py-4 text-sm font-semibold transition",
                canSend
                  ? "bg-[#C8A45D] text-black hover:brightness-110"
                  : "bg-white/10 text-white/40 cursor-not-allowed",
              ].join(" ")}
            >
              Email Keystne →
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
