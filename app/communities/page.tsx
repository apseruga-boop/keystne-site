"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import KeystneNav from "../../components/site/KeystneNav";
import KeystneFooter from "../../components/site/KeystneFooter";
import { CONTACT } from "../../components/site/config";

/**
 * DISCOVER COMMUNITIES — Dubai
 * Locked-in version (white background, no video):
 * - Right side: Dubai communities in premium tiles (search + quick filters)
 * - Middle: Dubai map (stylised SVG) with markers
 * - Hover/click a community tile -> highlights marker on map + shows short key info
 * - Hover markers -> tooltip
 *
 * NOTE: Map is a clean stylised Dubai canvas (not a GIS boundary map).
 * We can swap to a real map provider later (Mapbox/Google) when you're ready.
 */

type Community = {
  id: string;
  name: string;
  areaType: "Urban" | "Waterfront" | "Family" | "Value" | "Luxury" | "Mixed";
  bestFor: string;
  vibe: string;
  keyLinks: string[];
  commuteNote: string;
  schools: string[];
  landmarks: string[];
  priceGuide: string; // simple
  marker: { x: number; y: number }; // svg coords (0..100)
};

function Icon({
  name,
  className = "h-4 w-4",
}: {
  name: "arrow" | "check" | "search" | "pin" | "x";
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
    case "search":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      );
    case "pin":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M12 21s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11z" />
          <circle cx="12" cy="10" r="2" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </svg>
      );
    default:
      return null;
  }
}

function buildMailto(args: { subject: string; body: string }) {
  const to = CONTACT.emailArthur;
  const cc = CONTACT.emailStuart;
  return `mailto:${to}?cc=${cc}&subject=${encodeURIComponent(
    args.subject
  )}&body=${encodeURIComponent(args.body)}`;
}

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
          WhatsApp us
        </a>
        <div className="mt-2 grid gap-1">
          <a
            className="flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] font-semibold text-black/75 hover:bg-[#C8A45D] hover:text-black"
            href={CONTACT.phoneTel}
          >
            Call
          </a>
          <a
            className="flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] font-semibold text-black/75 hover:bg-[#C8A45D] hover:text-black"
            href={CONTACT.telegramLink}
            target="_blank"
            rel="noreferrer"
          >
            Telegram
          </a>
          <a
            className="flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] font-semibold text-black/75 hover:bg-[#C8A45D] hover:text-black"
            href={buildMailto({
              subject: "Keystne — Discover Communities enquiry",
              body: "Hi Keystne team,\n\nI’d like help shortlisting Dubai communities.\n\nName:\nPhone:\nBudget:\nLifestyle:\nMove timeline:\n\nThank you",
            })}
          >
            Email
          </a>
        </div>
      </div>
    </div>
  );
}

const COMMUNITIES: Community[] = [
  {
    id: "downtown",
    name: "Downtown Dubai",
    areaType: "Urban",
    bestFor: "City living, walkability, premium towers",
    vibe: "Iconic, central, high-energy",
    keyLinks: ["Burj Khalifa", "Dubai Mall", "Boulevard"],
    commuteNote: "Central access to DIFC, Business Bay, City Walk.",
    schools: ["Nearby nurseries + private schools (short drive)"],
    landmarks: ["Burj Khalifa", "Dubai Opera", "Boulevard"],
    priceGuide: "Premium",
    marker: { x: 57, y: 52 },
  },
  {
    id: "difc",
    name: "DIFC",
    areaType: "Urban",
    bestFor: "Professionals, finance, luxury dining",
    vibe: "Sharp, premium, corporate-luxe",
    keyLinks: ["Gate Avenue", "Art galleries", "Top dining"],
    commuteNote: "Fast to Downtown + Sheikh Zayed Road.",
    schools: ["Nearby nurseries; top schools within 15–25 mins"],
    landmarks: ["DIFC Gate", "Gate Avenue"],
    priceGuide: "Premium",
    marker: { x: 53, y: 49 },
  },
  {
    id: "businessbay",
    name: "Business Bay",
    areaType: "Urban",
    bestFor: "Value vs Downtown, canalside living",
    vibe: "Modern, central, growing",
    keyLinks: ["Canal", "Towers", "Close to Downtown"],
    commuteNote: "Great for Downtown + SZR connections.",
    schools: ["Nurseries + schools within short drive"],
    landmarks: ["Dubai Canal", "Bay Avenue"],
    priceGuide: "Mid–Premium",
    marker: { x: 59, y: 56 },
  },
  {
    id: "dubaimarina",
    name: "Dubai Marina",
    areaType: "Waterfront",
    bestFor: "Waterfront lifestyle, rentals, expat hub",
    vibe: "Lively, social, skyline by the water",
    keyLinks: ["Marina Walk", "Beach access", "Restaurants"],
    commuteNote: "Great for JBR/JLT; peak-hour SZR traffic.",
    schools: ["Good school options in surrounding areas"],
    landmarks: ["Marina Walk", "Skydive Dubai"],
    priceGuide: "Mid–Premium",
    marker: { x: 79, y: 62 },
  },
  {
    id: "jbr",
    name: "JBR",
    areaType: "Waterfront",
    bestFor: "Beach living, short stays, lifestyle",
    vibe: "Beachfront, busy, holiday energy",
    keyLinks: ["The Beach", "Ain Dubai nearby", "Walkable strip"],
    commuteNote: "Walkable to Marina; good access to Tram/Metro (via Marina).",
    schools: ["School runs typically 15–30 mins depending on choice"],
    landmarks: ["The Beach", "JBR Walk"],
    priceGuide: "Premium",
    marker: { x: 83, y: 64 },
  },
  {
    id: "jlt",
    name: "JLT",
    areaType: "Value",
    bestFor: "Space/value near Marina, lakeside towers",
    vibe: "Practical, community feel, great value",
    keyLinks: ["Lakes", "Metro access", "Dining clusters"],
    commuteNote: "Easy Metro; strong connectivity.",
    schools: ["Strong school access within 15–25 mins"],
    landmarks: ["JLT Lakes", "Cluster dining"],
    priceGuide: "Value–Mid",
    marker: { x: 76, y: 59 },
  },
  {
    id: "palms",
    name: "Palm Jumeirah",
    areaType: "Luxury",
    bestFor: "Luxury beachfront, villas, iconic living",
    vibe: "Exclusive, resort-style, private",
    keyLinks: ["Beach clubs", "Luxury hotels", "Signature views"],
    commuteNote: "Short drive to Marina; SZR access via trunk exits.",
    schools: ["Top schools typically 20–35 mins depending on location"],
    landmarks: ["Atlantis", "Palm Boardwalk"],
    priceGuide: "Luxury",
    marker: { x: 73, y: 66 },
  },
  {
    id: "citywalk",
    name: "City Walk",
    areaType: "Urban",
    bestFor: "Low-rise luxury, walkable lifestyle",
    vibe: "Boutique, stylish, central",
    keyLinks: ["Retail", "Restaurants", "Easy access"],
    commuteNote: "Close to Downtown + Jumeirah + DIFC.",
    schools: ["Solid nursery/school access nearby"],
    landmarks: ["City Walk precinct"],
    priceGuide: "Premium",
    marker: { x: 49, y: 54 },
  },
  {
    id: "creek",
    name: "Dubai Creek Harbour",
    areaType: "Mixed",
    bestFor: "New waterfront community, future growth",
    vibe: "Modern, open, masterplanned",
    keyLinks: ["Waterfront", "Views", "New builds"],
    commuteNote: "Quick access to Festival City + Downtown (varies by route).",
    schools: ["Growing education options; many within 15–30 mins"],
    landmarks: ["Creek promenade"],
    priceGuide: "Mid–Premium",
    marker: { x: 66, y: 48 },
  },
  {
    id: "albarsha",
    name: "Al Barsha",
    areaType: "Value",
    bestFor: "Practical living, villas + low-rise, schools",
    vibe: "Convenient, family-practical",
    keyLinks: ["Mall of the Emirates", "School clusters", "Great access"],
    commuteNote: "Strong SZR access; easy movement across Dubai.",
    schools: ["Excellent school access (one of the main draws)"],
    landmarks: ["Mall of the Emirates"],
    priceGuide: "Value–Mid",
    marker: { x: 60, y: 64 },
  },
  {
    id: "dubaihills",
    name: "Dubai Hills Estate",
    areaType: "Family",
    bestFor: "Family living, parks, newer communities",
    vibe: "Green, modern, premium-family",
    keyLinks: ["Parks", "Golf", "Mall"],
    commuteNote: "Good access to Downtown + Marina via major roads.",
    schools: ["Strong school options in and around the area"],
    landmarks: ["Dubai Hills Mall", "Golf club"],
    priceGuide: "Mid–Premium",
    marker: { x: 56, y: 70 },
  },
  {
    id: "arabianranches",
    name: "Arabian Ranches",
    areaType: "Family",
    bestFor: "Villas, calm living, family set-up",
    vibe: "Quiet, spacious, established",
    keyLinks: ["Villas", "Community parks", "Family-focused"],
    commuteNote: "Drive-dependent; plan peak-hour routes.",
    schools: ["Good school access (drive)"],
    landmarks: ["Community parks", "Golf nearby"],
    priceGuide: "Mid–Premium",
    marker: { x: 44, y: 76 },
  },
  {
    id: "jvc",
    name: "JVC",
    areaType: "Value",
    bestFor: "Value apartments/townhouses, newer builds",
    vibe: "Fast-growing, practical, popular",
    keyLinks: ["Townhouses", "Apartments", "Strong rental demand"],
    commuteNote: "Drive-dependent; good access to key corridors.",
    schools: ["Multiple schools/nurseries within short drive"],
    landmarks: ["Community parks"],
    priceGuide: "Value–Mid",
    marker: { x: 67, y: 72 },
  },
  {
    id: "damachills",
    name: "DAMAC Hills",
    areaType: "Family",
    bestFor: "Golf community, villas + townhouses",
    vibe: "Residential, masterplanned, green",
    keyLinks: ["Golf", "Villas", "Community amenities"],
    commuteNote: "Drive-dependent; best if you’re okay with a commute.",
    schools: ["Schools reachable by car; choices vary by preference"],
    landmarks: ["Trump International Golf Club Dubai (area)"],
    priceGuide: "Mid",
    marker: { x: 53, y: 82 },
  },
  {
    id: "mirdif",
    name: "Mirdif",
    areaType: "Value",
    bestFor: "Local family vibe, villas, space",
    vibe: "Residential, calmer, value space",
    keyLinks: ["Villas", "Community feel", "Good value"],
    commuteNote: "Good access toward the north/east; drive-based.",
    schools: ["Several school options within the wider area"],
    landmarks: ["Mirdif City Centre (area)"],
    priceGuide: "Value",
    marker: { x: 78, y: 40 },
  },
];

function Pill({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full px-3 py-2 text-[12px] font-semibold transition",
        active
          ? "bg-[#C8A45D] text-black"
          : "bg-black/5 text-black/70 hover:bg-black/10",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Tooltip({
  show,
  x,
  y,
  text,
}: {
  show: boolean;
  x: number;
  y: number;
  text: string;
}) {
  if (!show) return null;
  return (
    <div
      className="pointer-events-none absolute z-20 rounded-2xl border border-black/10 bg-white px-3 py-2 text-[12px] font-semibold text-black shadow-ks"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(12px, 12px)",
      }}
    >
      {text}
    </div>
  );
}

export default function DiscoverCommunitiesPage() {
  const [selectedId, setSelectedId] = useState<string>("downtown");
  const [hoverId, setHoverId] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Community["areaType"] | "All">("All");

  // tooltip tracking for map markers
  const mapWrapRef = useRef<HTMLDivElement | null>(null);
  const [tip, setTip] = useState<{
    show: boolean;
    x: number;
    y: number;
    text: string;
  }>({
    show: false,
    x: 0,
    y: 0,
    text: "",
  });

  const selected = useMemo(
    () =>
      COMMUNITIES.find((c) => c.id === (hoverId || selectedId)) ||
      COMMUNITIES[0],
    [selectedId, hoverId]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COMMUNITIES.filter((c) => {
      const okFilter = filter === "All" ? true : c.areaType === filter;
      const okQuery = !q
        ? true
        : [c.name, c.vibe, c.bestFor, c.areaType]
            .join(" ")
            .toLowerCase()
            .includes(q);
      return okFilter && okQuery;
    });
  }, [query, filter]);

  const activeId = hoverId || selectedId;

  const onMarkerEnter = (c: Community, evt: React.MouseEvent) => {
    const wrap = mapWrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    setTip({
      show: true,
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
      text: c.name,
    });
    setHoverId(c.id);
  };

  const onMarkerMove = (evt: React.MouseEvent) => {
    const wrap = mapWrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    setTip((p) => ({
      ...p,
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    }));
  };

  const onMarkerLeave = () => {
    setTip((p) => ({ ...p, show: false }));
    setHoverId(null);
  };

  useEffect(() => {
    // if filters reduce list and selected disappears, pick first
    if (!filtered.some((c) => c.id === selectedId) && filtered.length) {
      setSelectedId(filtered[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length, filter, query]);

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="fixed left-0 right-0 top-0 z-50">
        <KeystneNav />
      </div>

      {/* Header (white, no video) */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pt-28 pb-6">
          <div className="text-[11px] tracking-[0.22em] text-black/55">
            DISCOVER
          </div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-black md:text-5xl">
            Discover Dubai communities.
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-black/65">
            Pick a community on the right — we’ll highlight it on the map and
            show the key things people care about: location feel, schools
            direction, landmarks, and a simple price vibe.
          </p>
        </div>
      </section>

      {/* Main layout */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-14">
          <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
            {/* Middle: map + info */}
            <div className="space-y-4">
              <div
                ref={mapWrapRef}
                className="relative overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-ks"
              >
                <div className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
                  <div>
                    <div className="text-[11px] tracking-[0.22em] text-black/55">
                      MAP
                    </div>
                    <div className="mt-1 text-base font-semibold text-black">
                      Dubai overview
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-[12px] font-semibold text-black/70">
                    <Icon name="pin" /> {selected.name}
                  </div>
                </div>

                {/* Map canvas */}
                <div className="relative">
                  {/* tooltip */}
                  <Tooltip
                    show={tip.show}
                    x={tip.x}
                    y={tip.y}
                    text={tip.text}
                  />

                  <svg
                    viewBox="0 0 100 100"
                    className="h-[520px] w-full"
                    onMouseMove={onMarkerMove}
                  >
                    {/* Background */}
                    <defs>
                      <linearGradient id="sea" x1="0" x2="1">
                        <stop offset="0" stopColor="rgba(0,0,0,0.03)" />
                        <stop offset="1" stopColor="rgba(200,164,93,0.10)" />
                      </linearGradient>
                      <filter id="softGlow">
                        <feGaussianBlur stdDeviation="1.2" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Sea/Canvas */}
                    <rect
                      x="0"
                      y="0"
                      width="100"
                      height="100"
                      fill="url(#sea)"
                    />

                    {/* Stylised Dubai coastline/shape (clean, not GIS-accurate) */}
                    <path
                      d="M20 18 C30 15, 42 18, 52 24 C63 31, 72 42, 78 52 C84 62, 86 74, 82 84 C78 92, 66 95, 52 92 C38 89, 30 80, 24 68 C18 56, 15 44, 16 32 C17 25, 18 20, 20 18 Z"
                      fill="white"
                      stroke="rgba(0,0,0,0.12)"
                      strokeWidth="0.8"
                    />

                    {/* Soft “active region” highlight */}
                    <circle
                      cx={
                        COMMUNITIES.find((c) => c.id === activeId)?.marker.x ??
                        50
                      }
                      cy={
                        COMMUNITIES.find((c) => c.id === activeId)?.marker.y ??
                        50
                      }
                      r={9}
                      fill="rgba(200,164,93,0.22)"
                      stroke="rgba(200,164,93,0.35)"
                      strokeWidth="0.6"
                      filter="url(#softGlow)"
                    />

                    {/* Markers */}
                    {COMMUNITIES.map((c) => {
                      const isActive = c.id === activeId;
                      return (
                        <g key={c.id}>
                          <circle
                            cx={c.marker.x}
                            cy={c.marker.y}
                            r={isActive ? 2.4 : 1.9}
                            fill={isActive ? "#C8A45D" : "rgba(0,0,0,0.40)"}
                            stroke={
                              isActive
                                ? "rgba(0,0,0,0.35)"
                                : "rgba(255,255,255,0.9)"
                            }
                            strokeWidth={isActive ? 0.7 : 0.6}
                            style={{ cursor: "pointer" }}
                            onMouseEnter={(e) => onMarkerEnter(c, e)}
                            onMouseLeave={onMarkerLeave}
                            onClick={() => setSelectedId(c.id)}
                          />
                          {isActive ? (
                            <text
                              x={c.marker.x + 2.6}
                              y={c.marker.y - 2.0}
                              fontSize="3.2"
                              fill="rgba(0,0,0,0.75)"
                              fontFamily="ui-sans-serif, system-ui"
                            >
                              {c.name}
                            </text>
                          ) : null}
                        </g>
                      );
                    })}
                  </svg>

                  {/* Info card (short + clean) */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="rounded-[24px] border border-black/10 bg-white/95 p-5 shadow-ks backdrop-blur">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="text-[11px] tracking-[0.22em] text-black/55">
                            COMMUNITY SNAPSHOT
                          </div>
                          <div className="mt-1 text-2xl font-semibold text-black">
                            {selected.name}
                          </div>
                          <div className="mt-2 text-sm text-black/70">
                            <span className="font-semibold text-black">
                              {selected.vibe}
                            </span>{" "}
                            — {selected.bestFor}
                          </div>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-[12px] font-semibold text-white">
                          {selected.areaType} • {selected.priceGuide}
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <div className="rounded-2xl border border-black/10 bg-white p-4">
                          <div className="text-[11px] text-black/50">
                            Schools direction
                          </div>
                          <div className="mt-2 space-y-2">
                            {selected.schools.slice(0, 2).map((x) => (
                              <div
                                key={x}
                                className="flex items-start gap-2 text-sm text-black/75"
                              >
                                <span className="mt-[3px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#C8A45D] text-black">
                                  <Icon name="check" className="h-3.5 w-3.5" />
                                </span>
                                <span>{x}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-black/10 bg-white p-4">
                          <div className="text-[11px] text-black/50">
                            Landmarks
                          </div>
                          <div className="mt-2 space-y-2">
                            {selected.landmarks.slice(0, 3).map((x) => (
                              <div
                                key={x}
                                className="flex items-start gap-2 text-sm text-black/75"
                              >
                                <span className="mt-[3px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-black text-white">
                                  <Icon name="check" className="h-3.5 w-3.5" />
                                </span>
                                <span>{x}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-black/10 bg-white p-4">
                          <div className="text-[11px] text-black/50">
                            Practical note
                          </div>
                          <div className="mt-2 text-sm text-black/75">
                            {selected.commuteNote}
                          </div>
                          <div className="mt-3 text-[12px] font-semibold text-black/80">
                            Key highlights
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {selected.keyLinks.slice(0, 3).map((x) => (
                              <span
                                key={x}
                                className="rounded-full bg-black/5 px-3 py-2 text-[12px] font-semibold text-black/70"
                              >
                                {x}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                        <a
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black/70 hover:bg-black/5"
                          href={buildMailto({
                            subject: `Keystne — Community shortlist: ${selected.name}`,
                            body: [
                              "Hi Keystne team,",
                              "",
                              `I’m interested in: ${selected.name}`,
                              "",
                              "Please contact me to discuss a shortlist and options.",
                              "",
                              "Name:",
                              "Phone:",
                              "Budget:",
                              "Timeline:",
                            ].join("\n"),
                          })}
                        >
                          Contact us <Icon name="arrow" />
                        </a>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C8A45D] px-4 py-3 text-sm font-semibold text-black hover:brightness-110"
                          onClick={() => setHoverId(null)}
                        >
                          Keep this selected <Icon name="check" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tiny helper row */}
              <div className="rounded-[24px] border border-black/10 bg-white p-5 shadow-sm">
                <div className="text-[11px] tracking-[0.22em] text-black/55">
                  HOW TO USE
                </div>
                <div className="mt-2 text-sm text-black/70">
                  Hover or click a community on the right. It highlights on the
                  map and you get a short, clean snapshot.
                </div>
              </div>
            </div>

            {/* Right: Tiles list */}
            <div className="space-y-4">
              <div className="rounded-[28px] border border-black/10 bg-white p-5 shadow-ks">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] tracking-[0.22em] text-black/55">
                      COMMUNITIES
                    </div>
                    <div className="mt-1 text-base font-semibold text-black">
                      Dubai shortlist
                    </div>
                  </div>
                  <div className="rounded-full bg-black px-3 py-2 text-[12px] font-semibold text-white">
                    {filtered.length} shown
                  </div>
                </div>

                {/* Search */}
                <div className="mt-4 flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-3 shadow-sm">
                  <Icon name="search" className="h-4 w-4 text-black/50" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search a community (e.g., Marina, Downtown)"
                    className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/30"
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="rounded-xl px-2 py-1 text-black/55 hover:bg-black/5"
                      aria-label="Clear search"
                    >
                      <Icon name="x" />
                    </button>
                  ) : null}
                </div>

                {/* Filters */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {(
                    [
                      "All",
                      "Urban",
                      "Waterfront",
                      "Family",
                      "Value",
                      "Luxury",
                      "Mixed",
                    ] as const
                  ).map((x) => (
                    <Pill
                      key={x}
                      active={filter === x}
                      onClick={() => setFilter(x)}
                    >
                      {x}
                    </Pill>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-black/10 bg-white shadow-ks">
                <div className="max-h-[690px] overflow-auto p-4">
                  <div className="grid gap-3">
                    {filtered.map((c) => {
                      const active = c.id === activeId;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onMouseEnter={() => setHoverId(c.id)}
                          onMouseLeave={() => setHoverId(null)}
                          onClick={() => setSelectedId(c.id)}
                          className={[
                            "relative w-full overflow-hidden rounded-[22px] border text-left transition",
                            active
                              ? "border-[#C8A45D]/60 bg-[#C8A45D]/10 shadow-sm"
                              : "border-black/10 bg-white hover:bg-black/[0.02]",
                          ].join(" ")}
                        >
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-sm font-semibold text-black">
                                  {c.name}
                                </div>
                                <div className="mt-1 text-[12px] text-black/65">
                                  {c.areaType} • {c.priceGuide} • {c.vibe}
                                </div>
                              </div>
                              <div
                                className={[
                                  "rounded-full px-3 py-2 text-[12px] font-semibold",
                                  active
                                    ? "bg-black text-white"
                                    : "bg-black/5 text-black/70",
                                ].join(" ")}
                              >
                                View{" "}
                                <Icon
                                  name="arrow"
                                  className="ml-1 inline h-4 w-4"
                                />
                              </div>
                            </div>

                            <div className="mt-3 text-[12px] text-black/70">
                              {c.bestFor}
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {c.keyLinks.slice(0, 3).map((x) => (
                                <span
                                  key={x}
                                  className="rounded-full bg-black/5 px-3 py-2 text-[12px] font-semibold text-black/70"
                                >
                                  {x}
                                </span>
                              ))}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 rounded-2xl border border-black/10 bg-black/[0.03] p-4 text-[12px] text-black/65">
                    Want us to add more communities (or split by Villa /
                    Apartment / Off-plan)? Say the word and we’ll extend this
                    list.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <KeystneFooter />
      <ContactDock />
    </div>
  );
}
