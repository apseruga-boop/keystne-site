"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import KeystneNav from "../components/site/KeystneNav";
import KeystneFooter from "../components/site/KeystneFooter";
import { CONTACT, HOME_VIDEOS, SERVICES } from "../components/site/config";

function mailtoFor(reason: string) {
  const to = CONTACT.emailArthur;
  const cc = CONTACT.emailStuart;

  const subject = encodeURIComponent(`Keystne enquiry — ${reason}`);
  const body = encodeURIComponent(
    `Hi Keystne team,\n\nI'm interested in: ${reason}\n\nName:\nPhone:\nPreferred contact time:\nDetails:\n\nThank you`
  );

  return `mailto:${to}?cc=${cc}&subject=${subject}&body=${body}`;
}

/** Dubai time + weather (no box, premium, white, visible) */
function DubaiWeatherBadge({
  mode,
  targetRef,
}: {
  mode: "topLeft" | "servicesCenter";
  targetRef: React.RefObject<HTMLDivElement>;
}) {
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  const [now, setNow] = useState(new Date());
  const [tempC, setTempC] = useState<number | null>(null);
  const [code, setCode] = useState<number | null>(null);

  // Time tick
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  // Weather (Open-Meteo, no key)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        // Dubai coords
        const url =
          "https://api.open-meteo.com/v1/forecast?latitude=25.2048&longitude=55.2708&current=temperature_2m,weather_code&timezone=Asia%2FDubai";
        const res = await fetch(url);
        const json = await res.json();
        if (cancelled) return;
        setTempC(json?.current?.temperature_2m ?? null);
        setCode(json?.current?.weather_code ?? null);
      } catch {
        // silent
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

  function weatherIcon(w: number | null) {
    // Minimal mapping (premium + clear)
    if (w == null) return "•";
    // 0 clear, 1-3 mainly clear/partly, 45/48 fog, 51-67 drizzle/rain, 71-77 snow, 80-82 showers, 95-99 thunder
    if (w === 0) return "☀︎";
    if (w >= 1 && w <= 3) return "⛅︎";
    if (w === 45 || w === 48) return "☁︎";
    if ((w >= 51 && w <= 67) || (w >= 80 && w <= 82)) return "☂︎";
    if (w >= 95 && w <= 99) return "⚡︎";
    return "☁︎";
  }

  // Dynamic move: top-left -> under Services header center
  useEffect(() => {
    function compute() {
      const badge = badgeRef.current;
      if (!badge) return;

      if (mode === "topLeft") {
        setPos({ left: 24, top: 90 });
        return;
      }

      const target = targetRef.current;
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const bw = badge.offsetWidth;
      const left = Math.max(12, rect.left + rect.width / 2 - bw / 2);
      const top = Math.max(12, rect.top + 12);
      setPos({ left, top });
    }

    compute();
    const onScroll = () => requestAnimationFrame(compute);
    const onResize = () => requestAnimationFrame(compute);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [mode, targetRef]);

  return (
    <div
      ref={badgeRef}
      style={{
        position: "fixed",
        left: pos?.left ?? 24,
        top: pos?.top ?? 90,
        zIndex: 60,
        transition: "left 500ms ease, top 500ms ease, transform 500ms ease",
        transform: mode === "servicesCenter" ? "scale(1.12)" : "scale(1)",
      }}
      className="select-none text-white"
    >
      <div className="flex items-center gap-3">
        <div className="text-xl leading-none">{weatherIcon(code)}</div>
        <div className="leading-tight">
          <div className="text-[12px] tracking-[0.18em] text-white/80">
            DUBAI
          </div>
          <div className="text-sm font-semibold">
            {fmtTime}{" "}
            <span className="text-white/65">
              • {fmtDate}
              {tempC == null ? "" : ` • ${Math.round(tempC)}°C`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoTile({
  title,
  sentence,
  href,
  video,
}: {
  title: string;
  sentence: string;
  href: string;
  video: string;
}) {
  const vidRef = useRef<HTMLVideoElement | null>(null);

  return (
    <Link
      href={href}
      className="group relative block h-[460px] overflow-hidden border border-white/10 bg-black shadow-ks"
      onMouseEnter={() => vidRef.current?.play().catch(() => undefined)}
      onMouseLeave={() => vidRef.current?.pause()}
      onFocus={() => vidRef.current?.play().catch(() => undefined)}
      onBlur={() => vidRef.current?.pause()}
      style={{ borderRadius: "0px" }}
    >
      <video
        ref={vidRef}
        className="absolute inset-0 h-full w-full object-cover opacity-85"
        src={video}
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/85" />

      {/* Removed the left vertical strip (per instruction) */}
      <div className="relative flex h-full flex-col justify-end p-7">
        <div className="mt-2 text-3xl font-semibold text-white">{title}</div>
        <div className="mt-3 max-w-md text-sm text-white/70">{sentence}</div>

        <div className="mt-6 inline-flex items-center gap-2 text-sm text-white">
          Explore{" "}
          <span className="transition group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  );
}

function ContactDock() {
  return (
    <div
      id="contact"
      className="fixed bottom-5 right-5 z-50 w-[240px] overflow-hidden rounded-[22px] border border-black/10 bg-white/90 shadow-ks backdrop-blur-xl"
    >
      <div className="p-2">
        <a
          className="ks-btn-gold ks-gold-ring flex items-center justify-center rounded-2xl bg-black px-3 py-3 text-[12px] font-semibold text-white hover:bg-black/90"
          href={CONTACT.whatsappLink}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>

        <div className="mt-2 grid gap-1">
          <a
            className="rounded-2xl px-3 py-2 text-[12px] font-semibold text-black/80 hover:bg-black/5"
            href={CONTACT.phoneTel}
          >
            Call
          </a>
          <a
            className="rounded-2xl px-3 py-2 text-[12px] font-semibold text-black/80 hover:bg-black/5"
            href={CONTACT.telegramLink}
            target="_blank"
            rel="noreferrer"
          >
            Telegram
          </a>
          <a
            className="rounded-2xl px-3 py-2 text-[12px] font-semibold text-black/80 hover:bg-black/5"
            href={mailtoFor("General enquiry")}
          >
            Email
          </a>

          <div className="rounded-2xl px-3 py-2 text-[11px] text-black/55">
            {CONTACT.wechatText}
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-black/10 bg-white px-3 py-3">
          <div className="text-[10px] tracking-[0.22em] text-black/55">
            DIRECT
          </div>
          <div className="mt-1 text-sm font-semibold text-black">
            {CONTACT.phoneDisplay}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [hideHeroBox, setHideHeroBox] = useState(false);
  const servicesHeaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setHideHeroBox(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const heroMail = useMemo(() => mailtoFor("Concierge (Relocation)"), []);

  return (
    <div className="min-h-screen bg-ksBlack text-ksWhite">
      <KeystneNav />

      {/* Weather badge: moves when hero box disappears */}
      <DubaiWeatherBadge
        mode={hideHeroBox ? "servicesCenter" : "topLeft"}
        targetRef={servicesHeaderRef}
      />

      {/* HERO */}
      <section className="relative min-h-[92vh] overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          src={HOME_VIDEOS.hero}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/25 to-ksBlack" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-4 pb-14 pt-28">
          <div
            className={[
              "ks-glass ks-fade-up rounded-[28px] p-8 shadow-ks transition",
              hideHeroBox
                ? "pointer-events-none translate-y-2 opacity-0"
                : "opacity-100",
            ].join(" ")}
          >
            <div className="text-[11px] tracking-[0.22em] text-white/55">
              keystne.dubai
            </div>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
              Property, handled personally.
            </h1>

            <p className="mt-4 text-base text-white/70 md:text-lg">
              We specialize in premium property brokerage, leasing, and
              management, with a concierge-style service that delivers a
              seamless, personal experience for every client.
            </p>

            {/* Buttons visible (not black on black) */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={heroMail}
                className="ks-btn-gold ks-gold-ring inline-flex items-center justify-center rounded-2xl bg-white/15 px-6 py-4 text-sm font-semibold text-white hover:bg-white/20"
              >
                Start with concierge →
              </a>

              <Link
                href="/communities"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-semibold text-white hover:bg-white/15"
              >
                Discover Dubai communities
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-semibold text-white hover:bg-white/15"
              >
                About us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-ksBlack">
        <div className="mx-auto max-w-6xl px-4 py-12">
          {/* Target position for weather badge when it moves */}
          <div ref={servicesHeaderRef} className="pt-2" />

          <div className="text-[11px] tracking-[0.22em] text-white/55">
            SERVICES
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Four pillars. One premium standard.
          </h2>

          {/* Tiles MUST touch: gap-0, grid columns 4 on desktop */}
          <div className="mt-8 grid gap-0 overflow-hidden rounded-[18px] border border-white/10 md:grid-cols-4">
            {SERVICES.map((s) => (
              <VideoTile
                key={s.key}
                title={s.title}
                sentence={s.sentence}
                href={s.href}
                video={s.video}
              />
            ))}
          </div>
        </div>
      </section>

      <KeystneFooter />
      <ContactDock />
    </div>
  );
}
