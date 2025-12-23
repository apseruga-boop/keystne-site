"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";
import KeystneNav from "../../components/site/KeystneNav";
import KeystneFooter from "../../components/site/KeystneFooter";
import { CONTACT } from "../../components/site/config";

/**
 * ONLY CHANGES IN THIS VERSION:
 * 1) Top nav pill/box is WHITE (instead of grey), text stays black, hover gold
 * 2) “Contact us” now opens the contact pop-up form (modal) (you said it already exists — this ensures it shows)
 * 3) Communities list (right panel) scrolls all the way down (uses viewport-based max height + proper padding)
 *
 * Everything else is left as-is.
 */

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
          <path d="M21 12a9 9 0 0 1-12.7 7.4L4 20l1.2-3.1A8.5 8.5 0 1 1 20 11.5z" />
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

function buildMailto(args: { subject: string; body: string }) {
  const to = CONTACT.emailArthur;
  const cc = CONTACT.emailStuart;
  const subject = encodeURIComponent(args.subject);
  const body = encodeURIComponent(args.body);
  return `mailto:${to}?cc=${cc}&subject=${subject}&body=${body}`;
}

/** -------------------- Contact dock (unchanged) -------------------- */
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
              subject: "Keystne — Community enquiry",
              body: "Hi Keystne team,\n\nI'm interested in:\n\nCommunity:\nBudget / requirement:\nTimeline:\n\nName:\nPhone:\nEmail:\n\nThank you",
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

/** -------------------- Contact modal (pop-up) -------------------- */
function ContactModal({
  open,
  onClose,
  defaultCommunity,
}: {
  open: boolean;
  onClose: () => void;
  defaultCommunity: string;
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    // Keep community context fresh when re-opened
    setMessage((m) => m || `I’m interested in ${defaultCommunity}.`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultCommunity]);

  // NEW: prevent background scroll when modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const subject = `Keystne — Contact request (${defaultCommunity})`;
  const body = [
    `Hi Keystne team,`,
    ``,
    `Community: ${defaultCommunity}`,
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
        <div className="w-full max-w-[720px] overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-ks">
          <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
            <div>
              <div className="text-[11px] tracking-[0.22em] text-black/55">
                CONTACT
              </div>
              <div className="mt-1 text-xl font-semibold text-black">
                Contact Keystne
              </div>
              <div className="mt-1 text-sm text-black/60">
                Community: {defaultCommunity}
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
                What do you need help with?
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-2 h-[214px] w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/20"
                placeholder="Tell us what you’re looking for (budget, timeline, type, etc.)"
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
                  This opens your email client with everything pre-filled.
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-black/10 px-6 py-4">
            <div className="text-[11px] text-black/55">
              If you’d rather message immediately:{" "}
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
              </a>{" "}
              •{" "}
              <a
                className="font-semibold text-black hover:text-[#C8A45D]"
                href={CONTACT.phoneTel}
              >
                Call
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** -------------------- Communities (same list you had) -------------------- */
type Community = {
  id: string;
  name: string;
  region: string;
  vibe: string;
  knownFor: string[];
  schools: string[];
  access: string[];
  notes: string;
};

const COMMUNITIES: Community[] = [
  {
    id: "downtown",
    name: "Downtown Dubai",
    region: "Central Dubai",
    vibe: "Iconic skyline, walkable core, premium apartments.",
    knownFor: ["Burj Khalifa", "Dubai Mall", "Boulevard living"],
    schools: [
      "School options are typically a short drive (varies by building)",
    ],
    access: ["Strong roads", "Metro access nearby (area-dependent)"],
    notes: "Best for people who want landmark living and central convenience.",
  },
  {
    id: "difc",
    name: "DIFC",
    region: "Central Dubai",
    vibe: "Executive lifestyle, finance + dining + galleries.",
    knownFor: ["Fine dining", "Offices nearby", "Arts & culture"],
    schools: ["Central school commutes vary by route/traffic"],
    access: ["Metro nearby", "Excellent road links"],
    notes: "Great if you want work-to-home convenience with premium lifestyle.",
  },
  {
    id: "business-bay",
    name: "Business Bay",
    region: "Central Dubai",
    vibe: "Modern towers, canal-side living, close to Downtown.",
    knownFor: ["Canal promenade", "New towers", "Central access"],
    schools: ["Multiple options within driving distance (varies)"],
    access: ["Metro nearby", "Major highway access"],
    notes:
      "Popular for convenience and value vs Downtown (building quality varies).",
  },
  {
    id: "city-walk",
    name: "City Walk",
    region: "Central Dubai",
    vibe: "Low-rise, lifestyle-forward, walkable pockets.",
    knownFor: ["Cafes", "Retail", "Modern urban layout"],
    schools: ["Nearby central school options (varies)"],
    access: ["Quick access to SZR"],
    notes:
      "A clean, premium lifestyle pocket with strong central connectivity.",
  },

  {
    id: "marina",
    name: "Dubai Marina",
    region: "New Dubai (Coastal)",
    vibe: "Waterfront towers, high energy, strong rental demand.",
    knownFor: ["Marina Walk", "Restaurants", "Short-stay appeal"],
    schools: ["School clusters are a short drive (varies)"],
    access: ["Metro + tram coverage", "Strong coastal roads"],
    notes:
      "A classic choice for lifestyle + investment (views/building age vary).",
  },
  {
    id: "jbr",
    name: "JBR (Jumeirah Beach Residence)",
    region: "New Dubai (Coastal)",
    vibe: "Beachfront living with a social, walkable vibe.",
    knownFor: ["The Beach", "Beach clubs", "Sea views"],
    schools: ["Commute varies (traffic can impact)"],
    access: ["Tram links", "Coastal access"],
    notes: "If you want beach lifestyle at your doorstep, this is it.",
  },
  {
    id: "jlt",
    name: "JLT (Jumeirah Lake Towers)",
    region: "New Dubai",
    vibe: "Great value, community clusters, walkable pockets.",
    knownFor: ["Lakeside paths", "Value vs Marina", "Everyday convenience"],
    schools: ["Multiple options within driving distance (varies)"],
    access: ["Multiple metro stations", "Good road access"],
    notes:
      "A balanced pick: strong value, amenities, and central New Dubai access.",
  },
  {
    id: "bluewaters",
    name: "Bluewaters Island",
    region: "New Dubai (Coastal)",
    vibe: "Ultra-premium island living with a calmer feel.",
    knownFor: ["Island lifestyle", "Premium stock", "Coastal views"],
    schools: ["Commute varies"],
    access: ["Connected to JBR area", "Coastal roads"],
    notes: "For premium buyers who want island privacy near Marina/JBR.",
  },
  {
    id: "palm",
    name: "Palm Jumeirah",
    region: "Coastal / Islands",
    vibe: "Luxury beachfront apartments and villas.",
    knownFor: ["Beach lifestyle", "Luxury hotels", "Prestige address"],
    schools: ["Commute depends on frond/area"],
    access: ["Coastal roads", "Monorail access (area-dependent)"],
    notes:
      "A flagship luxury address with lifestyle value and strong brand equity.",
  },

  {
    id: "dubai-hills",
    name: "Dubai Hills Estate",
    region: "MBR / Emaar",
    vibe: "Master-planned, family-friendly, modern stock.",
    knownFor: ["Parks", "Golf", "Dubai Hills Mall"],
    schools: ["Family-focused; school options nearby (varies)"],
    access: ["Excellent highway access"],
    notes: "One of the strongest long-term family communities in Dubai.",
  },
  {
    id: "mbr-city",
    name: "Mohammed Bin Rashid City (MBR City)",
    region: "Central Expansion",
    vibe: "New luxury districts near central Dubai.",
    knownFor: ["New builds", "Premium master plans", "Central proximity"],
    schools: ["Nearby options vary by district"],
    access: ["Strong road access"],
    notes:
      "A premium growth corridor — best if you want newer stock near the core.",
  },
  {
    id: "creek-harbour",
    name: "Dubai Creek Harbour",
    region: "Creek / New Growth",
    vibe: "New waterfront skyline, long-term positioning.",
    knownFor: ["Promenades", "Views", "Modern towers"],
    schools: ["Nearby schools vary"],
    access: ["Road access; connectivity evolving"],
    notes: "Future-forward waterfront district with strong long-term appeal.",
  },

  {
    id: "jvc",
    name: "Jumeirah Village Circle (JVC)",
    region: "New Dubai",
    vibe: "Broad inventory, strong pricing range, growing amenities.",
    knownFor: ["Value", "New buildings", "Popular search area"],
    schools: ["Nearby schools (varies)"],
    access: ["Main roads access"],
    notes:
      "One of the most searched areas — stock quality varies by building/cluster.",
  },
  {
    id: "jvt",
    name: "Jumeirah Village Triangle (JVT)",
    region: "New Dubai",
    vibe: "Quieter than JVC, more townhouse/villa pockets.",
    knownFor: ["Lower density", "Family feel", "Good value"],
    schools: ["Nearby schools (varies)"],
    access: ["Good road access"],
    notes:
      "A calmer alternative to JVC with more space and a residential vibe.",
  },

  {
    id: "springs",
    name: "The Springs",
    region: "Emirates Living",
    vibe: "Established family townhouses/villas with parks and lakes.",
    knownFor: ["Community parks", "Lakes", "Family living"],
    schools: ["Established school commutes (varies)"],
    access: ["Strong road access"],
    notes:
      "A proven family community with stable demand and strong liveability.",
  },
  {
    id: "meadows",
    name: "The Meadows",
    region: "Emirates Living",
    vibe: "Spacious villas with mature landscaping.",
    knownFor: ["Large plots", "Quiet streets", "Premium villas"],
    schools: ["School commutes vary"],
    access: ["Strong road access"],
    notes: "Premium villa living with a mature, calm community feel.",
  },
  {
    id: "arabian-ranches",
    name: "Arabian Ranches",
    region: "Dubailand",
    vibe: "Classic villa community with a suburban family lifestyle.",
    knownFor: ["Family suburb", "Established community", "Villas"],
    schools: ["Family-oriented schools in wider area (varies)"],
    access: ["Road-based lifestyle"],
    notes: "A top choice for families prioritising space and community.",
  },
  {
    id: "damac-hills",
    name: "DAMAC Hills",
    region: "Dubailand",
    vibe: "Golf-adjacent master community with varied inventory.",
    knownFor: ["Amenities", "Villas/townhouses", "Value pockets"],
    schools: ["Nearby schools vary"],
    access: ["Road access"],
    notes:
      "A popular master community with broad stock and lifestyle amenities.",
  },

  {
    id: "al-barsha",
    name: "Al Barsha",
    region: "Central / New Dubai Edge",
    vibe: "Practical, central, broad pricing.",
    knownFor: ["Convenience", "Access", "Family-friendly"],
    schools: ["Many options nearby (varies)"],
    access: ["Excellent roads"],
    notes: "Strong practicality pick: central and easy to live in.",
  },
  {
    id: "barsha-heights",
    name: "Barsha Heights (TECOM)",
    region: "New Dubai",
    vibe: "Convenient towers near key business hubs.",
    knownFor: ["Value", "Location", "Access to Media/Internet City"],
    schools: ["Nearby options vary"],
    access: ["Good road links"],
    notes: "Convenience-first living; great for professionals.",
  },
  {
    id: "al-furjan",
    name: "Al Furjan",
    region: "New Dubai",
    vibe: "Family townhouses + apartments, growing amenities.",
    knownFor: ["Community feel", "Newer clusters", "Value vs coastal"],
    schools: ["Nearby schools vary"],
    access: ["Good road access"],
    notes: "A growing family area with broad inventory.",
  },
  {
    id: "discovery-gardens",
    name: "Discovery Gardens",
    region: "New Dubai",
    vibe: "Practical value apartments with greenery.",
    knownFor: ["Value", "Green pockets", "Community layout"],
    schools: ["Nearby options vary"],
    access: ["Good connectivity"],
    notes: "Value option with a community vibe.",
  },
  {
    id: "motor-city",
    name: "Motor City",
    region: "Dubailand Edge",
    vibe: "Community feel, calmer pace, good value.",
    knownFor: ["Walkable pockets", "Value", "Family vibe"],
    schools: ["Nearby schools vary"],
    access: ["Road access"],
    notes: "A nice mid-rise community feel away from the coastal rush.",
  },
  {
    id: "sports-city",
    name: "Dubai Sports City",
    region: "Dubailand Edge",
    vibe: "Value living with broad rental inventory.",
    knownFor: ["Value", "Wide stock", "Easy road access"],
    schools: ["Nearby schools vary"],
    access: ["Road access"],
    notes: "Value-forward option with convenient access to major roads.",
  },
  {
    id: "studio-city",
    name: "Dubai Studio City",
    region: "Dubailand Edge",
    vibe: "Newer buildings, quieter pockets.",
    knownFor: ["Newer stock", "Calm vibe", "Value"],
    schools: ["Nearby schools vary"],
    access: ["Road access"],
    notes: "Good for people who want newer stock and a calmer vibe.",
  },
  {
    id: "town-square",
    name: "Town Square",
    region: "Dubailand",
    vibe: "Master-planned family value community.",
    knownFor: ["Parks", "Community centres", "Value pricing"],
    schools: ["Nearby schools vary"],
    access: ["Road access"],
    notes: "Popular with families looking for value and planning.",
  },
  {
    id: "mudon",
    name: "Mudon",
    region: "Dubailand",
    vibe: "Family villas/townhouses with parks.",
    knownFor: ["Family vibe", "Parks", "Townhouses"],
    schools: ["Nearby schools vary"],
    access: ["Road access"],
    notes: "Strong family option with a suburban feel.",
  },
  {
    id: "remraam",
    name: "Remraam",
    region: "Dubailand",
    vibe: "Green, calmer, value apartments.",
    knownFor: ["Green spaces", "Value", "Quiet vibe"],
    schools: ["Nearby schools vary"],
    access: ["Road access"],
    notes: "A greener value pocket in Dubailand.",
  },
  {
    id: "jumeirah-park",
    name: "Jumeirah Park",
    region: "New Dubai",
    vibe: "Family villas with modern layouts.",
    knownFor: ["Bigger space", "Family living", "Newer villas"],
    schools: ["Nearby schools vary"],
    access: ["Good connectivity"],
    notes: "Popular for families wanting more space in New Dubai.",
  },
  {
    id: "jumeirah-islands",
    name: "Jumeirah Islands",
    region: "New Dubai",
    vibe: "Luxury villas in island clusters.",
    knownFor: ["Lake views", "Premium villas", "Privacy"],
    schools: ["Nearby schools vary"],
    access: ["Good road access"],
    notes: "Premium villa living with a distinctive community layout.",
  },
  {
    id: "emirates-hills",
    name: "Emirates Hills",
    region: "New Dubai",
    vibe: "Ultra-luxury villa enclave.",
    knownFor: ["Prestige", "Exclusive plots", "Luxury"],
    schools: ["Commute varies"],
    access: ["Prime positioning"],
    notes: "For top-tier luxury buyers.",
  },
  {
    id: "jumeirah-golf-estates",
    name: "Jumeirah Golf Estates",
    region: "New Dubai",
    vibe: "Golf lifestyle with premium villas.",
    knownFor: ["Golf", "Large homes", "Quiet"],
    schools: ["Commute varies"],
    access: ["Road access"],
    notes: "Premium golf community with a calm pace.",
  },
  {
    id: "festival-city",
    name: "Dubai Festival City",
    region: "Creek / Central",
    vibe: "Creekside living with strong amenities.",
    knownFor: ["Festival City Mall", "Creek views", "Family-friendly"],
    schools: ["Nearby schools vary"],
    access: ["Strong roads"],
    notes: "Family-friendly area anchored by major retail and amenities.",
  },
  {
    id: "al-jaddaf",
    name: "Al Jaddaf",
    region: "Creek / Central",
    vibe: "Central value + new towers by the Creek.",
    knownFor: ["Central", "Creek adjacency", "New stock"],
    schools: ["Nearby schools vary"],
    access: ["Great central roads"],
    notes: "Convenient creekside central living.",
  },
  {
    id: "d3",
    name: "Dubai Design District (d3)",
    region: "Central Expansion",
    vibe: "Modern, creative, new district.",
    knownFor: ["Design scene", "Modern builds", "Central proximity"],
    schools: ["Nearby options vary"],
    access: ["Road access"],
    notes: "Great for people who like modern urban energy.",
  },
  {
    id: "port-rashid",
    name: "Mina Rashid (Port Rashid)",
    region: "Coastal / Central",
    vibe: "New marina-led waterfront district.",
    knownFor: ["Marina", "New waterfront projects", "Coastal vibe"],
    schools: ["Nearby options vary"],
    access: ["Road access"],
    notes: "Waterfront regeneration with newer premium inventory.",
  },
  {
    id: "dubai-south",
    name: "Dubai South",
    region: "South Dubai",
    vibe: "Growth corridor near Al Maktoum airport (area-dependent).",
    knownFor: ["New districts", "Future growth", "Value pockets"],
    schools: ["Evolving options"],
    access: ["Road access"],
    notes: "For people aligned to long-term growth in South Dubai.",
  },
  {
    id: "emaar-south",
    name: "Emaar South",
    region: "South Dubai",
    vibe: "Master-planned community with newer stock.",
    knownFor: ["Master plan", "Golf direction", "New builds"],
    schools: ["Evolving options"],
    access: ["Road access"],
    notes: "Newer master community in South Dubai corridor.",
  },
];

/** -------------------- Google Maps helpers -------------------- */
function isGoogleReady() {
  return typeof window !== "undefined" && !!(window as any).google?.maps;
}

type PlaceCache = {
  bounds?: google.maps.LatLngBoundsLiteral;
  location?: google.maps.LatLngLiteral;
};

function communityQuery(name: string) {
  return `${name}, Dubai, UAE`;
}

/** -------------------- Page -------------------- */
export default function DiscoverCommunitiesPage() {
  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  // Nav hide on scroll (same behavior)
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

  // Selection
  const [selectedId, setSelectedId] = useState<string>(
    COMMUNITIES[0]?.id || ""
  );
  const selected = useMemo(
    () => COMMUNITIES.find((c) => c.id === selectedId) || COMMUNITIES[0],
    [selectedId]
  );

  // Contact pop-up
  const [contactOpen, setContactOpen] = useState(false);

  // Map
  const mapElRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const placesRef = useRef<google.maps.places.PlacesService | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const highlightRef = useRef<google.maps.Rectangle | null>(null);
  const cacheRef = useRef<Record<string, PlaceCache>>({});

  const [mapMode, setMapMode] = useState<"js" | "embed">("embed");
  const [mapReady, setMapReady] = useState(false);
  const [mapMsg, setMapMsg] = useState<string>("");

  const initMap = () => {
    try {
      if (!mapsKey) return;
      if (!mapElRef.current) return;
      if (!isGoogleReady()) return;

      const center = { lat: 25.2048, lng: 55.2708 };
      const map = new google.maps.Map(mapElRef.current, {
        center,
        zoom: 11,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      mapRef.current = map;
      placesRef.current = new google.maps.places.PlacesService(map);

      markerRef.current = new google.maps.Marker({ map, visible: false });
      highlightRef.current = new google.maps.Rectangle({
        map,
        strokeColor: "#C8A45D",
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor: "#C8A45D",
        fillOpacity: 0.08,
        clickable: false,
      });

      setMapMode("js");
      setMapReady(true);
      setMapMsg("");

      // focus initial
      focusCommunity(selectedId);
    } catch {
      setMapMode("embed");
      setMapMsg("Live map didn’t load — showing fallback map.");
    }
  };

  const focusCommunity = (id: string) => {
    const c = COMMUNITIES.find((x) => x.id === id);
    const map = mapRef.current;
    const places = placesRef.current;
    if (!c || !map || !places || !isGoogleReady()) return;

    const cached = cacheRef.current[id];
    if (cached?.bounds || cached?.location) {
      applyFocus(cached);
      return;
    }

    const query = communityQuery(c.name);

    places.textSearch({ query }, (results, status) => {
      if (
        status !== google.maps.places.PlacesServiceStatus.OK ||
        !results?.length
      ) {
        setMapMsg(
          "Some areas may not resolve instantly. Try another community."
        );
        map.panTo({ lat: 25.2048, lng: 55.2708 });
        map.setZoom(11);
        return;
      }

      const first = results[0];
      const viewport = first.geometry?.viewport;
      const location = first.geometry?.location;

      const boundsLiteral: google.maps.LatLngBoundsLiteral | undefined =
        viewport
          ? {
              east: viewport.getNorthEast().lng(),
              north: viewport.getNorthEast().lat(),
              west: viewport.getSouthWest().lng(),
              south: viewport.getSouthWest().lat(),
            }
          : undefined;

      const locLiteral: google.maps.LatLngLiteral | undefined = location
        ? { lat: location.lat(), lng: location.lng() }
        : undefined;

      const payload: PlaceCache = {
        bounds: boundsLiteral,
        location: locLiteral,
      };
      cacheRef.current[id] = payload;
      applyFocus(payload);
    });
  };

  const applyFocus = (place: PlaceCache) => {
    const map = mapRef.current;
    if (!map) return;

    if (place.bounds) {
      const b = new google.maps.LatLngBounds(
        { lat: place.bounds.south, lng: place.bounds.west },
        { lat: place.bounds.north, lng: place.bounds.east }
      );
      map.fitBounds(b);
      if (highlightRef.current) highlightRef.current.setBounds(b);
    } else if (place.location) {
      map.panTo(place.location);
      map.setZoom(13);
      if (highlightRef.current) highlightRef.current.setMap(null);
      highlightRef.current = null;
    }

    if (place.location && markerRef.current) {
      markerRef.current.setPosition(place.location);
      markerRef.current.setVisible(true);
    }
  };

  useEffect(() => {
    if (mapMode !== "js") return;
    if (!mapReady) return;
    focusCommunity(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, mapMode, mapReady]);

  const onPick = (id: string) => {
    setSelectedId(id);
  };

  const embedSrc = useMemo(() => {
    const base = "https://www.google.com/maps?q=";
    const q = encodeURIComponent(
      selected?.name ? `${selected.name}, Dubai` : "Dubai"
    );
    return `${base}${q}&output=embed`;
  }, [selected]);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* NAV skin (NOW WHITE) */}
      <style jsx global>{`
        .ks-nav-white {
          background: transparent !important;
        }
        /* Force the pill/box + any nav wrappers to white */
        .ks-nav-white,
        .ks-nav-white header,
        .ks-nav-white nav,
        .ks-nav-white > div,
        .ks-nav-white > header,
        .ks-nav-white > nav {
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

      {/* Load Google Maps JS if key exists (otherwise fallback embed) */}
      {mapsKey ? (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${mapsKey}&libraries=places`}
          strategy="afterInteractive"
          onLoad={initMap}
          onError={() => {
            setMapMode("embed");
            setMapMsg("Live map didn’t load — showing fallback map.");
          }}
        />
      ) : null}

      {/* White nav wrapper + hide on scroll down */}
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

      {/* Header */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 pt-28 pb-6">
          <div className="text-[11px] tracking-[0.22em] text-black/55">
            DISCOVER
          </div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-black md:text-5xl">
            Discover Dubai communities.
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-black/65">
            Click a community on the right to view a simple overview and see it
            on the map.
          </p>
        </div>
      </section>

      {/* Main layout */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-14">
          <div className="grid gap-5 md:grid-cols-[1.6fr_0.9fr]">
            {/* MAP + SUMMARY */}
            <div className="rounded-[28px] border border-black/10 bg-white shadow-ks overflow-hidden">
              <div className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
                <div>
                  <div className="text-[11px] tracking-[0.22em] text-black/55">
                    MAP
                  </div>
                  <div className="mt-1 text-sm font-semibold text-black">
                    {selected?.name}{" "}
                    <span className="text-black/45 font-medium">
                      — {selected?.region}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {mapMode === "js" ? (
                    <span className="text-[11px] text-black/45">Live map</span>
                  ) : (
                    <span className="text-[11px] text-black/45">Map</span>
                  )}
                  {mapsKey ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (mapsKey) {
                          setMapMsg("");
                          if (isGoogleReady()) initMap();
                        }
                      }}
                      className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2 text-[12px] font-semibold text-black/70 hover:bg-black/5"
                    >
                      <Icon name="refresh" className="h-4 w-4" /> Refresh
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Map area */}
              <div className="relative">
                {mapMode === "js" ? (
                  <div
                    ref={mapElRef}
                    className="h-[520px] w-full bg-black/[0.03]"
                  />
                ) : (
                  <iframe
                    title="Dubai map"
                    src={embedSrc}
                    className="h-[520px] w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                )}

                {mapMsg ? (
                  <div className="absolute left-4 right-4 top-4">
                    <div className="rounded-[22px] border border-black/10 bg-white/95 p-4 shadow-ks backdrop-blur">
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-sm text-black/70">{mapMsg}</div>
                        <button
                          type="button"
                          onClick={() => setMapMsg("")}
                          className="rounded-2xl px-3 py-2 text-[12px] font-semibold text-black/70 hover:bg-black/5"
                        >
                          <Icon name="x" />
                        </button>
                      </div>
                      {!mapsKey ? (
                        <div className="mt-2 text-[11px] text-black/50">
                          Add{" "}
                          <span className="font-semibold">
                            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                          </span>{" "}
                          to enable the live highlighted map.
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* SUMMARY (still bottom) */}
              <div className="border-t border-black/10 p-5">
                <div className="text-[11px] tracking-[0.22em] text-black/55">
                  SUMMARY
                </div>
                <div className="mt-2 text-2xl font-semibold text-black">
                  {selected?.name}
                </div>
                <div className="mt-2 text-sm text-black/70">
                  {selected?.vibe}
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                    <div className="text-[11px] font-semibold text-black/60">
                      Known for
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(selected?.knownFor || []).slice(0, 6).map((x) => (
                        <span
                          key={x}
                          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 py-2 text-[12px] font-semibold text-black/75"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[#C8A45D]" />
                          {x}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                    <div className="text-[11px] font-semibold text-black/60">
                      Quick notes
                    </div>
                    <div className="mt-2 text-sm text-black/70">
                      {selected?.notes}
                    </div>
                    <div className="mt-3 text-[11px] text-black/45">
                      Schools + commutes depend on building choice, route and
                      traffic.
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                    <div className="text-[11px] font-semibold text-black/60">
                      Schools
                    </div>
                    <ul className="mt-2 space-y-2 text-[12px] text-black/70">
                      {(selected?.schools || []).slice(0, 2).map((x) => (
                        <li key={x} className="flex items-start gap-2">
                          <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#C8A45D] text-black">
                            <Icon name="check" className="h-3.5 w-3.5" />
                          </span>
                          <span>{x}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                    <div className="text-[11px] font-semibold text-black/60">
                      Access
                    </div>
                    <ul className="mt-2 space-y-2 text-[12px] text-black/70">
                      {(selected?.access || []).slice(0, 2).map((x) => (
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

                {/* CONTACT US (NOW OPENS POP-UP) */}
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-black/90"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setContactOpen(true);
                    }}
                  >
                    Contact us <Icon name="arrow" />
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE (ONLY change: scroll area max-height so it doesn't cut off) */}
            <div className="rounded-[28px] border border-black/10 bg-white shadow-ks overflow-hidden">
              <div className="border-b border-black/10 px-5 py-4">
                <div className="text-[11px] tracking-[0.22em] text-black/55">
                  COMMUNITIES
                </div>
                <div className="mt-1 text-sm text-black/65">
                  Select one to see it on the map + overview.
                </div>
              </div>

              {/* Changed from max-h-[680px] to viewport-based so it scrolls fully */}
              <div className="max-h-[calc(100dvh-260px)] max-h-[calc(100vh-260px)] overflow-y-auto p-4 pb-10">
                <div className="grid gap-3">
                  {COMMUNITIES.map((c) => {
                    const active = c.id === selectedId;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          onPick(c.id);
                          if (mapMode === "js") focusCommunity(c.id);
                        }}
                        className={[
                          "group relative overflow-hidden rounded-[22px] border text-left transition",
                          active
                            ? "border-black/15 bg-[#C8A45D]/15"
                            : "border-black/10 bg-white hover:border-black/15 hover:bg-black/[0.02]",
                        ].join(" ")}
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-semibold text-black">
                                {c.name}
                              </div>
                              <div className="mt-1 text-[12px] text-black/55">
                                {c.region}
                              </div>
                            </div>
                            <div
                              className={[
                                "mt-1 inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold transition",
                                active
                                  ? "bg-black text-white"
                                  : "bg-black/5 text-black/70 group-hover:bg-black group-hover:text-white",
                              ].join(" ")}
                            >
                              View <Icon name="arrow" className="h-4 w-4" />
                            </div>
                          </div>

                          <div className="mt-3 text-[12px] text-black/70 line-clamp-2">
                            {c.vibe}
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {c.knownFor.slice(0, 3).map((x) => (
                              <span
                                key={x}
                                className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-2 text-[11px] font-semibold text-black/70"
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
              </div>
            </div>
          </div>
        </div>
      </section>

      <KeystneFooter />
      <ContactDock />

      {/* Contact pop-up */}
      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        defaultCommunity={selected?.name || "Dubai"}
      />
    </div>
  );
}
