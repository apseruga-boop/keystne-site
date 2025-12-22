"use client";

import React, { useEffect, useState } from "react";

export default function DubaiBadge() {
  const [now, setNow] = useState(new Date());
  const [tempC, setTempC] = useState<number | null>(null);
  const [code, setCode] = useState<number | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  // Weather via Open-Meteo (no key)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const url =
          "https://api.open-meteo.com/v1/forecast?latitude=25.2048&longitude=55.2708&current=temperature_2m,weather_code&timezone=Asia%2FDubai";
        const res = await fetch(url);
        const json = await res.json();
        if (cancelled) return;
        setTempC(json?.current?.temperature_2m ?? null);
        setCode(json?.current?.weather_code ?? null);
      } catch {
        // keep silent
      }
    }
    load();
    const r = setInterval(load, 10 * 60_000);
    return () => {
      cancelled = true;
      clearInterval(r);
    };
  }, []);

  const fmtDate = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dubai",
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(now);

  const fmtTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dubai",
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);

  function icon(w: number | null) {
    if (w == null) return "•";
    if (w === 0) return "☀︎";
    if (w >= 1 && w <= 3) return "⛅︎";
    if (w === 45 || w === 48) return "☁︎";
    if ((w >= 51 && w <= 67) || (w >= 80 && w <= 82)) return "☂︎";
    if (w >= 95 && w <= 99) return "⚡︎";
    return "☁︎";
  }

  return (
    <div
      className="pointer-events-none fixed left-7 top-[92px] z-50 select-none"
      style={{ color: "rgba(255,255,255,0.92)" }}
    >
      <div className="flex items-center gap-4">
        <div className="text-2xl leading-none">{icon(code)}</div>
        <div className="leading-tight">
          <div className="text-[12px] tracking-[0.18em] text-white/85">
            DUBAI
          </div>
          <div className="text-[15px] font-semibold">
            {fmtTime}{" "}
            <span className="text-white/70">
              • {fmtDate}
              {tempC == null ? "" : ` • ${Math.round(tempC)}°C`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
