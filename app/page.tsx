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

/** Simple inline SVG icons (NO lucide-react) */
function Icon({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl ks-icon-chip">
      {children}
    </span>
  );
}

function IPhone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M8 4h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        stroke="rgba(200,164,93,1)"
        strokeWidth="1.6"
      />
      <path
        d="M10 7h4"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IWhatsapp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 12a8 8 0 0 1-12.9 6.2L4 20l1.9-3.1A8 8 0 1 1 20 12Z"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 9.4c.2-.6.6-.7 1-.5l.7.5c.3.2.4.5.3.8l-.2.6c-.1.3 0 .6.2.9.6.8 1.3 1.5 2.1 2.1.3.2.6.3.9.2l.6-.2c.3-.1.6 0 .8.3l.5.7c.2.4.1.8-.5 1-.7.4-1.6.3-2.7-.2-1.4-.7-3-2.3-3.7-3.7-.5-1.1-.6-2-.2-2.7Z"
        fill="rgba(34,197,94,0.95)"
      />
    </svg>
  );
}

function ITelegram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 5 3.7 11.9c-.8.3-.8 1.5.1 1.8l4.3 1.4 1.7 5c.3.9 1.5 1 2 .2l2.6-3.5 4.6 3.4c.7.5 1.8.1 2-.8L22 6.3c.2-.9-.6-1.6-1.5-1.3Z"
        fill="rgba(59,130,246,0.95)"
      />
    </svg>
  );
}

function ICalendar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 3v3M17 3v3"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M5 7h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"
        stroke="rgba(200,164,93,1)"
        strokeWidth="1.6"
      />
      <path
        d="M7 11h4"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IMail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16v10H4V7Z" stroke="rgba(200,164,93,1)" strokeWidth="1.6" />
      <path
        d="m4 8 8 6 8-6"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
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
      className="group relative block h-[520px] overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-ks"
      onMouseEnter={() => vidRef.current?.play().catch(() => undefined)}
      onMouseLeave={() => vidRef.current?.pause()}
      onFocus={() => vidRef.current?.play().catch(() => undefined)}
      onBlur={() => vidRef.current?.pause()}
    >
      <video
        ref={vidRef}
        className="absolute inset-0 h-full w-full object-cover opacity-85"
        src={video}
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black/85" />

      {/* Vertical title strip (keep) */}
      <div className="absolute left-6 top-6 flex h-[calc(100%-48px)] items-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="h-10 w-[1px] bg-white/25" />
          <div className="rotate-180 text-[11px] tracking-[0.35em] text-white/70 [writing-mode:vertical-rl]">
            {title.toUpperCase()}
          </div>
          <div className="h-10 w-[1px] bg-white/25" />
        </div>
      </div>

      <div className="relative flex h-full flex-col justify-end p-7 pl-16">
        {/* Removed the small “KEYSTNE” line (per your instruction) */}
        <div className="text-3xl font-semibold text-white">{title}</div>
        <div className="mt-3 max-w-md text-sm text-white/70">{sentence}</div>

        <div className="mt-7 inline-flex items-center gap-2 text-sm text-white">
          Explore{" "}
          <span className="transition group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  );
}

function ContactDock() {
  const mail = useMemo(() => mailtoFor("General enquiry"), []);

  return (
    <div
      id="contact"
      className="fixed bottom-5 right-5 z-40 w-[220px] overflow-hidden rounded-[22px] border border-white/10 bg-black/70 shadow-ks backdrop-blur-xl"
    >
      <div className="p-2">
        {/* WhatsApp primary (more visible) */}
        <a
          className="flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-[12px] font-medium ks-btn-gold"
          href={CONTACT.whatsappLink}
          target="_blank"
          rel="noreferrer"
        >
          <span className="inline-flex h-2 w-2 rounded-full bg-green-400" />
          WhatsApp us
        </a>

        <div className="mt-2 grid gap-1">
          <a
            className="flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] text-white/85 hover:bg-white/5"
            href={CONTACT.phoneTel}
          >
            <Icon>
              <IPhone />
            </Icon>
            Call
          </a>

          <a
            className="flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] text-white/85 hover:bg-white/5"
            href={CONTACT.telegramLink}
            target="_blank"
            rel="noreferrer"
          >
            <Icon>
              <ITelegram />
            </Icon>
            Telegram
          </a>

          <a
            className="flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] text-white/85 hover:bg-white/5"
            href={mail}
          >
            <Icon>
              <IMail />
            </Icon>
            Email
          </a>

          <div className="flex items-center gap-2 rounded-2xl px-3 py-2 text-[11px] text-white/65">
            <Icon>
              <ICalendar />
            </Icon>
            Book a call (next)
          </div>

          <div className="rounded-2xl px-3 py-2 text-[11px] text-white/55">
            {CONTACT.wechatText}
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-white/10 bg-black/55 px-3 py-3">
          <div className="text-[10px] tracking-[0.22em] text-white/55">
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

export default function HomePage() {
  const [hideHeroBox, setHideHeroBox] = useState(false);

  useEffect(() => {
    const onScroll = () => setHideHeroBox(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const heroMail = useMemo(() => mailtoFor("Concierge (Relocation)"), []);

  return (
    <div className="min-h-screen bg-[var(--ks-black)] text-white">
      <KeystneNav />

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
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/25 to-[var(--ks-black)]" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-4 pb-14 pt-28">
          {/* Transparent hero box that disappears on scroll */}
          <div
            className={[
              "ks-glass rounded-[28px] p-8 shadow-ks transition",
              hideHeroBox
                ? "pointer-events-none translate-y-2 opacity-0"
                : "opacity-100",
            ].join(" ")}
          >
            {/* keystne.dubai lowercase */}
            <div className="text-[11px] tracking-[0.22em] text-white/70">
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

            {/* Buttons more visible */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={heroMail}
                className="inline-flex items-center justify-center rounded-2xl px-6 py-4 text-sm ks-btn-gold"
              >
                Start with concierge →
              </a>

              <Link
                href="/communities"
                className="inline-flex items-center justify-center rounded-2xl px-6 py-4 text-sm ks-btn-ghost"
              >
                Discover Dubai communities
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-2xl px-6 py-4 text-sm ks-btn-ghost"
              >
                About us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES (moved up closer to hero) */}
      <section className="bg-[var(--ks-black)] -mt-6">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-10">
          <div className="text-[11px] tracking-[0.22em] text-white/55">
            SERVICES
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Four pillars. One premium standard.
          </h2>

          {/* Dior-like row */}
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
