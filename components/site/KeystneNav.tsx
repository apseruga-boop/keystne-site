// components/site/KeystneNav.tsx
"use client";

import React from "react";
import Link from "next/link";

const GOLD = "#C8A45D";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function KeystneNav() {
  const links = [
    { label: "Concierge", href: "/concierge" },
    { label: "Discover Communities", href: "/communities" },
    { label: "Investments", href: "/investments" },
    { label: "Long-Term", href: "/long-term" },

    // ✅ ONLY CHANGE: this must match your folder name: app/Property Management/page.tsx
    // Next will encode the space, so the route is /Property%20Management
    { label: "Property Management", href: "/Property%20Management" },

    { label: "About", href: "/about" },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5">
      <div className="rounded-[28px] border border-black/10 bg-white shadow-ks">
        <div className="flex items-center justify-between gap-6 px-6 py-4">
          <Link
            href="/"
            className="text-3xl font-black tracking-tight text-black"
          >
            keystne
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cx(
                  "text-sm font-semibold text-black transition-colors"
                )}
                onMouseEnter={(e) =>
                  ((e.currentTarget.style.color as any) = GOLD)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget.style.color as any) = "black")
                }
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="md:hidden">
            <span
              className="inline-flex items-center rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs"
              style={{ background: "rgba(255,255,255,0.7)" }}
            >
              Menu
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
