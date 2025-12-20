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
      className="group relative block h-[420px] overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-ks"
      onMouseEnter={() => vidRef.current?.play().catch(() => undefined)}
      onMouseLeave={() => vidRef.current?.pause()}
      onFocus={() => vidRef.current?.play().catch(() => undefined)}
      onBlur={() => vidRef.current?.pause()}
    >
      <video
        ref={vidRef}
        className="absolute inset-0 h-full w-full object-cover opacity-80"
        src={video}
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/35 to-black/85" />

      {/* Vertical title strip */}
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
        <div className="text-[11px] tracking-[0.22em] text-white/55">
          KEYSTNE
        </div>
        <div className="mt-2 text-3xl font-semibold text-ksWhite">{title}</div>
        <div className="mt-3 max-w-md text-sm text-white/70">{sentence}</div>

        <div className="mt-6 inline-flex items-center gap-2 text-sm text-ksWhite">
          Explore{" "}
          <span className="transition group-hover:translate-x-1">→</span>
        </div>
      </div>

      <div className="absolute right-6 top-6 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] text-white/70 backdrop-blur">
        Hover to preview
      </div>
    </Link>
  );
}

function ContactDock() {
  return (
    <div
      id="contact"
      className="fixed bottom-5 right-5 z-40 w-[220px] overflow-hidden rounded-[22px] border border-white/10 bg-black/70 shadow-ks backdrop-blur-xl"
    >
      <div className="p-2">
        <a
          className="ks-btn-gold ks-gold-ring flex items-center justify-center rounded-2xl bg-black/55 px-3 py-3 text-[12px] text-ksWhite hover:bg-black/70"
          href={CONTACT.whatsappLink}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp us
        </a>

        <div className="mt-2 grid gap-1">
          <a
            className="rounded-2xl px-3 py-2 text-[12px] text-white/80 hover:bg-white/5"
            href={CONTACT.phoneTel}
          >
            Call
          </a>
          <a
            className="rounded-2xl px-3 py-2 text-[12px] text-white/80 hover:bg-white/5"
            href={CONTACT.telegramLink}
            target="_blank"
            rel="noreferrer"
          >
            Telegram
          </a>
          <a
            className="rounded-2xl px-3 py-2 text-[12px] text-white/80 hover:bg-white/5"
            href={mailtoFor("General enquiry")}
          >
            Email
          </a>
          <div className="rounded-2xl px-3 py-2 text-[11px] text-white/55">
            {CONTACT.wechatText}
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-[#C8A45D]/35 bg-black/55 px-3 py-3">
          <div className="text-[10px] tracking-[0.22em] text-white/55">
            DIRECT
          </div>
          <div className="mt-1 text-sm font-semibold text-ksWhite">
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
    <div className="min-h-screen bg-ksBlack text-ksWhite">
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/25 to-ksBlack" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-4 pb-14 pt-28">
          {/* Transparent hero box that disappears on scroll */}
          <div
            className={[
              "ks-glass ks-fade-up rounded-[28px] p-8 shadow-ks transition",
              hideHeroBox
                ? "pointer-events-none translate-y-2 opacity-0"
                : "opacity-100",
            ].join(" ")}
          >
            <div className="text-[11px] tracking-[0.22em] text-white/55">
              KEYSTNE • DUBAI
            </div>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
              Property, handled personally.
            </h1>

            <p className="mt-4 text-base text-white/70 md:text-lg">
              We specialize in premium property brokerage, leasing, and
              management, with a concierge-style service that delivers a
              seamless, personal experience for every client.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={heroMail}
                className="ks-btn-gold ks-gold-ring inline-flex items-center justify-center rounded-2xl bg-black/55 px-6 py-4 text-sm hover:bg-black/70"
              >
                Start with concierge →
              </a>

              <Link
                href="/communities"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm hover:bg-white/10"
              >
                Discover Dubai communities
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm hover:bg-white/10"
              >
                About us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-ksBlack">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-[11px] tracking-[0.22em] text-white/55">
            SERVICES
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Four pillars. One premium standard.
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
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
