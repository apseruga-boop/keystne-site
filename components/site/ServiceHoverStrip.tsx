"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import { SERVICES } from "./config";

export default function ServiceHoverStrip() {
  const [hoverKey, setHoverKey] = useState<string | null>(null);

  const active = useMemo(() => {
    return SERVICES.find((s) => s.key === hoverKey) || SERVICES[0];
  }, [hoverKey]);

  return (
    <div className="grid gap-6 md:grid-cols-12">
      {/* Vertical titles */}
      <div className="md:col-span-4">
        <div className="flex h-full flex-col justify-between rounded-ks border border-white/10 bg-white/5 p-6">
          <div>
            <div className="text-[11px] tracking-[0.22em] text-white/55">
              KEYSTNE
            </div>
            <div className="mt-3 text-2xl font-semibold">Services</div>
            <div className="mt-2 text-sm text-white/65">
              Hover to preview — click to open.
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {SERVICES.map((s) => (
              <Link
                key={s.key}
                href={s.href}
                onMouseEnter={() => setHoverKey(s.key)}
                onFocus={() => setHoverKey(s.key)}
                className={[
                  "block rounded-2xl border px-4 py-3 transition",
                  hoverKey === s.key
                    ? "border-ksGold/50 bg-black/40"
                    : "border-white/10 bg-black/20 hover:bg-black/35",
                ].join(" ")}
              >
                <div className="text-sm font-medium text-ksOffWhite">
                  {s.title}
                </div>
                <div className="mt-1 text-xs text-white/60">{s.sentence}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Hover preview video */}
      <div className="md:col-span-8">
        <div className="relative overflow-hidden rounded-ks border border-white/10 bg-black shadow-ks">
          <video
            className="h-[520px] w-full object-cover opacity-80"
            src={active.video}
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/70" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="text-[11px] tracking-[0.22em] text-white/55">
              {active.title.toUpperCase()}
            </div>
            <div className="mt-2 text-2xl font-semibold text-ksOffWhite">
              {active.sentence}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
