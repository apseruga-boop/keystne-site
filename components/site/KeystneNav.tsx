"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type WeatherState = {
  tempC: number | null;
  code: number | null;
};

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function formatDubaiDate(d: Date) {
  // e.g. Mon, 22 Dec
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dubai",
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(d);
}

function formatDubaiTime(d: Date) {
  // e.g. 14:05
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dubai",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .formatToParts(d)
    .reduce<Record<string, string>>((acc, p) => {
      if (p.type !== "literal") acc[p.type] = p.value;
      return acc;
    }, {});
  return `${parts.hour ?? pad2(d.getHours())}:${
    parts.minute ?? pad2(d.getMinutes())
  }`;
}

function WeatherIcon({ code }: { code: number | null }) {
  // Open-Meteo weather codes: https://open-meteo.com/en/docs
  // Minimal premium icon set (inline SVG), mapped broadly.
  const kind = useMemo(() => {
    if (code === null) return "na";
    if (code === 0) return "sun";
    if ([1, 2, 3].includes(code)) return "cloud";
    if ([45, 48].includes(code)) return "fog";
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code))
      return "rain";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
    if ([95, 96, 99].includes(code)) return "storm";
    return "cloud";
  }, [code]);

  const common = "h-4 w-4 text-white/80";

  if (kind === "sun") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5 3.6 3.6M20.4 20.4 19 19M19 5l1.4-1.4M3.6 20.4 5 19"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (kind === "fog") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 10h16M6 14h12M5 18h14"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M7 10a5 5 0 0 1 10 0"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    );
  }

  if (kind === "rain") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8 15H7a4 4 0 1 1 1.2-7.8A6 6 0 0 1 20 9.5 3.5 3.5 0 0 1 19.5 16H18"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M9 19l-1 2M13 19l-1 2M17 19l-1 2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (kind === "storm") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8 14H7a4 4 0 1 1 1.2-7.8A6 6 0 0 1 20 8.5 3.5 3.5 0 0 1 19.5 15H17"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M13 12l-3 5h3l-2 5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // default cloud
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 18H7a4 4 0 1 1 1.2-7.8A6 6 0 0 1 20 12.5 3.5 3.5 0 0 1 19.5 19H9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DubaiBadge() {
  const [now, setNow] = useState(() => new Date());
  const [wx, setWx] = useState<WeatherState>({ tempC: null, code: null });

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30 * 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // Dubai coordinates
        const url =
          "https://api.open-meteo.com/v1/forecast?latitude=25.2048&longitude=55.2708&current=temperature_2m,weather_code&timezone=Asia%2FDubai";
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        const temp = data?.current?.temperature_2m;
        const code = data?.current?.weather_code;
        if (cancelled) return;
        setWx({
          tempC: typeof temp === "number" ? Math.round(temp) : null,
          code: typeof code === "number" ? code : null,
        });
      } catch {
        // silent fail: badge still shows time/date
      }
    }

    load();
    const refresh = setInterval(load, 10 * 60 * 1000); // refresh every 10min
    return () => {
      cancelled = true;
      clearInterval(refresh);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed left-5 top-5 z-[60] hidden md:block">
      <div className="rounded-2xl border border-white/10 bg-black/35 px-3 py-2 backdrop-blur-xl shadow-ks">
        <div className="flex items-center gap-2 text-[11px] tracking-[0.18em] text-white/70">
          <WeatherIcon code={wx.code} />
          <span>DUBAI</span>
          {wx.tempC !== null ? (
            <span className="text-[11px] tracking-[0.08em] text-white/80">
              {wx.tempC}°C
            </span>
          ) : null}
        </div>
        <div className="mt-1 text-[11px] text-white/65">
          {formatDubaiDate(now)}
        </div>
        <div className="text-sm font-semibold text-white/90">
          {formatDubaiTime(now)}
        </div>
      </div>
    </div>
  );
}

export default function KeystneNav() {
  return (
    <>
      <DubaiBadge />

      <div className="fixed left-0 right-0 top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 pt-4">
          <div className="flex items-center justify-between rounded-[28px] border border-white/10 bg-black/70 px-4 py-3 text-white shadow-ks backdrop-blur-xl">
            {/* Left: Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-white/10" />
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-wide">
                  keystne
                </div>
                <div className="text-[11px] text-white/60">
                  Real Estate • Dubai
                </div>
              </div>
            </Link>

            {/* Center: Nav */}
            <nav className="hidden items-center gap-6 text-xs text-white/70 md:flex">
              <Link className="hover:text-[var(--ks-gold)]" href="/concierge">
                Concierge
              </Link>
              <Link className="hover:text-[var(--ks-gold)]" href="/communities">
                Discover Dubai communities
              </Link>
              <Link className="hover:text-[var(--ks-gold)]" href="/investments">
                Investments
              </Link>
              <Link className="hover:text-[var(--ks-gold)]" href="/leasing">
                Long term rentals
              </Link>
              <Link className="hover:text-[var(--ks-gold)]" href="/management">
                Property management
              </Link>
              <Link className="hover:text-[var(--ks-gold)]" href="/about">
                About
              </Link>
            </nav>

            {/* Right: Small Contact */}
            <Link
              href="#contact"
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-white/75 hover:text-[var(--ks-gold)] hover:bg-white/10"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
