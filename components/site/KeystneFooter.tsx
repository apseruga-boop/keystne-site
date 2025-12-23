"use client";

import React from "react";
import Link from "next/link";
import { CONTACT } from "./config";

function SocialIcon({
  name,
  className = "h-4 w-4",
}: {
  name: "instagram" | "facebook" | "linkedin";
  className?: string;
}) {
  const common = { className, fill: "none", stroke: "currentColor", strokeWidth: 2 };

  switch (name) {
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z" />
          <path d="M12 11a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
          <path d="M17.5 6.5h.01" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v3H7v3h3v6h3v-6h3l1-3h-4v-3c0-.6.4-1 1-1z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M4 4h4v16H4z" />
          <path d="M6 2.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
          <path d="M10 10h4v2c.6-1.2 1.8-2 3.5-2 2.8 0 4.5 1.8 4.5 5v7h-4v-6c0-1.6-.6-2.7-2-2.7s-2 1-2 2.7v6h-4z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function KeystneFooter() {
  const instagram = (CONTACT as any)?.instagramUrl || (CONTACT as any)?.instagram || "";
  const facebook = (CONTACT as any)?.facebookUrl || (CONTACT as any)?.facebook || "";
  const linkedin = (CONTACT as any)?.linkedinUrl || (CONTACT as any)?.linkedin || "";

  const socials = [
    { key: "instagram", href: instagram, label: "Instagram" },
    { key: "facebook", href: facebook, label: "Facebook" },
    { key: "linkedin", href: linkedin, label: "LinkedIn" },
  ].filter((s) => !!s.href);

  return (
    <footer className="bg-ksBlack text-ksWhite">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <div className="text-2xl font-semibold tracking-tight">keystne</div>
            <p className="mt-3 max-w-md text-sm text-white/70">
              We believe in redefining property experiences — turning complex
              transactions into moments of clarity, trust, and lasting value.
            </p>

            {/* CHANGE: social icons under the line above */}
            {socials.length ? (
              <div className="mt-5 flex items-center gap-2">
                {socials.map((s) => (
                  <a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-[#C8A45D] hover:text-black transition"
                  >
                    <SocialIcon name={s.key as any} />
                  </a>
                ))}
              </div>
            ) : null}

            <div className="mt-10 text-xs text-white/45">
              Keystne Real Estate — Registered in Dubai (details to be added).
            </div>
            <div className="mt-2 text-xs text-white/35">© 2025 Keystne. All rights reserved.</div>
          </div>

          <div className="md:justify-self-end">
            <div className="text-[11px] tracking-[0.22em] text-white/55">
              QUICK LINKS
            </div>
            <div className="mt-4 grid gap-2 text-sm text-white/75">
              <Link className="hover:text-white" href="/concierge">
                Concierge
              </Link>
              <Link className="hover:text-white" href="/communities">
                Discover Communities
              </Link>
              <Link className="hover:text-white" href="/investments">
                Investments
              </Link>
              <Link className="hover:text-white" href="/long-term">
                Long-Term
              </Link>
              <Link className="hover:text-white" href="/Property Management">
                Property Management
              </Link>
              <Link className="hover:text-white" href="/about">
                About
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
