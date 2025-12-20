"use client";

import React, { useMemo, useState } from "react";
import { IconArrowRight, IconCheck } from "../site/Icons";

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
  "Motor City"
];

export type ConciergeCalcSnapshot = {
  country: string;
  household: string;
  kids: string;
  relocationDate: string;
  area: string;
  budgetBand: string;
  estWeeks: number;
};

function Chip({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "inline-flex items-center justify-center rounded-full border px-4 py-2 text-xs transition",
        active
          ? "border-[#C8A45D]/55 bg-black/55 text-ksOffWhite"
          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function ConciergeCalculator({
  onOpenLead
}: {
  onOpenLead: (snapshot: ConciergeCalcSnapshot) => void;
}) {
  const [country, setCountry] = useState("");
  const [household, setHousehold] = useState<"Single" | "Couple" | "Family">("Single");
  const [kids, setKids] = useState<"No" | "Yes">("No");
  const [relocationDate, setRelocationDate] = useState("");
  const [areaKnown, setAreaKnown] = useState<"No" | "Yes">("No");
  const [area, setArea] = useState("");
  const [budgetBand, setBudgetBand] = useState<"< 8k" | "8–15k" | "15–25k" | "25k+">("8–15k");

  const [prioritySpeed, setPrioritySpeed] = useState(60); // 0..100
  const [priorityCost, setPriorityCost] = useState(40); // 0..100

  const estWeeks = useMemo(() => {
    // Premium “research-based” feel (still indicative logic)
    const base = 6;
    const kidWeeks = kids === "Yes" ? 3 : 0;
    const discovery = areaKnown === "Yes" ? 1 : 2;

    // priorities tilt the timeline slightly
    const speedBoost = Math.round((prioritySpeed - 50) / 25); // -2..+2
    const costDrag = Math.round((priorityCost - 50) / 35); // -1..+1

    const total = base + kidWeeks + discovery - speedBoost + costDrag;
    return Math.max(4, Math.min(14, total));
  }, [kids, areaKnown, prioritySpeed, priorityCost]);

  const stageList = useMemo(() => {
    const stages = [
      { t: "Profiling & eligibility", s: "Call + requirements, visa path, priorities." },
      { t: "Area & property shortlist", s: areaKnown === "Yes" ? "Refine your chosen community." : "Match budget → best-fit areas." },
      { t: "Viewing trip planning", s: "We organise your Dubai visit and viewings." },
      { t: "Offer, negotiation & contracting", s: "We handle the process, step-by-step." },
      kids === "Yes"
        ? { t: "School placement & fees", s: "Timelines, documents, and guidance." }
        : null,
      { t: "Move-in & settling", s: "Utilities, handover, and local setup." }
    ].filter(Boolean) as { t: string; s: string }[];

    return stages;
  }, [areaKnown, kids]);

  const canOpen = country.trim() && relocationDate;

  const snapshot: ConciergeCalcSnapshot = {
    country: country.trim(),
    household,
    kids,
    relocationDate,
    area: areaKnown === "Yes" ? area : "",
    budgetBand: areaKnown === "No" ? budgetBand : "",
    estWeeks
  };

  return (
    <div className="grid gap-6 md:grid-cols-12">
      {/* Left card */}
      <div className="md:col-span-6 rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-ks">
        <div className="text-[11px] tracking-[0.22em] text-white/55">
          RELOCATION PREVIEW
        </div>

        <div className="mt-3 text-2xl font-semibold">
          Build a personal plan in 60 seconds.
        </div>

        <div className="mt-2 text-sm text-white/65">
          Get a premium estimate now — unlock full costs and a step-by-step plan by emailing us.
        </div>

        <div className="mt-6 space-y-5">
          <div className="space-y-1">
            <div className="text-xs font-medium tracking-wide text-white/70">
              Origin country
            </div>
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g., United Kingdom"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-ksOffWhite outline-none placeholder:text-white/35"
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium tracking-wide text-white/70">
              Household
            </div>
            <div className="flex flex-wrap gap-2">
              {(["Single", "Couple", "Family"] as const).map((v) => (
                <Chip key={v} active={household === v} onClick={() => setHousehold(v)}>
                  {v}
                </Chip>
              ))}
              <Chip active={kids === "Yes"} onClick={() => setKids(kids === "Yes" ? "No" : "Yes")}>
                Kids: {kids}
              </Chip>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <div className="text-xs font-medium tracking-wide text-white/70">
                Target relocation date
              </div>
              <input
                type="date"
                value={relocationDate}
                onChange={(e) => setRelocationDate(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-ksOffWhite outline-none"
              />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium tracking-wide text-white/70">
                Preferred area known?
              </div>
              <div className="flex gap-2">
                <Chip active={areaKnown === "No"} onClick={() => { setAreaKnown("No"); setArea(""); }}>
                  No
                </Chip>
                <Chip active={areaKnown === "Yes"} onClick={() => setAreaKnown("Yes")}>
                  Yes
                </Chip>
              </div>
            </div>
          </div>

          {areaKnown === "Yes" ? (
            <div className="space-y-1">
              <div className="text-xs font-medium tracking-wide text-white/70">
                Preferred area
              </div>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-ksOffWhite outline-none"
              >
                <option value="">Select…</option>
                {DUBAI_AREAS.map((a) => (
                  <option key={a} value={a} className="text-black">
                    {a}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs font-medium tracking-wide text-white/70">
                Monthly budget band (AED)
              </div>
              <div className="flex flex-wrap gap-2">
                {(["< 8k", "8–15k", "15–25k", "25k+"] as const).map((b) => (
                  <Chip key={b} active={budgetBand === b} onClick={() => setBudgetBand(b)}>
                    {b}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          {/* premium sliders */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <div className="flex items-center justify-between text-xs text-white/70">
                <span>Priority: Speed</span>
                <span className="text-[#C8A45D]">{prioritySpeed}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={prioritySpeed}
                onChange={(e) => setPrioritySpeed(Number(e.target.value))}
                className="mt-3 w-full accent-[#C8A45D]"
              />
              <div className="mt-2 text-[11px] text-white/55">
                Faster timelines may trade off some flexibility.
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <div className="flex items-center justify-between text-xs text-white/70">
                <span>Priority: Cost control</span>
                <span className="text-[#C8A45D]">{priorityCost}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={priorityCost}
                onChange={(e) => setPriorityCost(Number(e.target.value))}
                className="mt-3 w-full accent-[#C8A45D]"
              />
              <div className="mt-2 text-[11px] text-white/55">
                Higher savings focus can extend the search slightly.
              </div>
            </div>
          </div>

          <button
            onClick={() => onOpenLead(snapshot)}
            disabled={!canOpen}
            className={[
              "w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm transition",
              "border border-[#C8A45D]/45 bg-black/55 hover:bg-black/70",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            ].join(" ")}
          >
            Get full costs & timeline <IconArrowRight className="h-4 w-4" />
          </button>

          <div className="text-[11px] text-white/50">
            Indicative preview. Final costs depend on preferences, availability, and timing.
          </div>
        </div>
      </div>

      {/* Right card */}
      <div className="md:col-span-6 rounded-[28px] border border-white/10 bg-black/40 p-6 shadow-ks">
        <div className="flex items-center justify-between">
          <div className="text-[11px] tracking-[0.22em] text-white/55">ESTIMATED TIMELINE</div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/70">
            <IconCheck className="h-4 w-4 text-[#C8A45D]" />
            Concierge-managed
          </div>
        </div>

        <div className="mt-4 text-4xl font-semibold">
          ~{estWeeks} <span className="text-base font-normal text-white/60">weeks</span>
        </div>

        <div className="mt-2 text-sm text-white/65">
          A practical guide from discovery to move-in — including school support if relevant.
        </div>

        <div className="mt-6 space-y-3">
          {stageList.map((s) => (
            <div
              key={s.t}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
            >
              <div className="text-sm font-medium text-white/85">{s.t}</div>
              <div className="mt-1 text-xs text-white/55">{s.s}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-[#C8A45D]/20 bg-black/55 p-4">
          <div className="text-xs text-white/65">What happens next</div>
          <div className="mt-2 text-sm text-white/85">
            You’ll receive a bespoke plan (costs + steps) — and we run the process with you personally.
          </div>
        </div>
      </div>
    </div>
  );
}
