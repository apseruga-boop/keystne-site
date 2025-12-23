"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import KeystneNav from "../components/site/KeystneNav";
import KeystneFooter from "../components/site/KeystneFooter";
import DubaiBadge from "../components/site/DubaiBadge";
import ContactDock from "../components/concierge/ContactDock";
import { HOME_VIDEOS, SERVICES } from "../components/site/config";

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
  const vidRef = useRef<HTMLIFrameElement | null>(null);

  return (
    <Link
      href={href}
      className="group relative block h-[460px] overflow-hidden border border-white/10 bg-black shadow-ks"
      // NOTE: YouTube iframe cannot be play/pause controlled like <video> without API.
      // Keeping handlers here would do nothing, so we leave them out to avoid errors.
      style={{ borderRadius: "0px" }}
    >
      <iframe
        ref={vidRef}
        className="absolute inset-0 h-full w-full object-cover opacity-85"
        src={video}
        title={title}
        frameBorder="0"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen={false}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/85" />

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

export default function HomePage() {
  const [hideHeroBox, setHideHeroBox] = useState(false);

  useEffect(() => {
    const onScroll = () => setHideHeroBox(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-ksBlack text-ksWhite">
      <KeystneNav />

      {/* FIXED (does NOT move) */}
      <DubaiBadge />

      {/* HERO */}
      <section className="relative min-h-[92vh] overflow-hidden">
        <iframe
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          src={HOME_VIDEOS.hero}
          title="Keystne Hero Video"
          frameBorder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen={false}
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

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/concierge"
                className="ks-btn-gold ks-gold-ring inline-flex items-center justify-center rounded-2xl bg-white/15 px-6 py-4 text-sm font-semibold text-white hover:bg-white/20"
              >
                Start with concierge →
              </Link>

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
          <div className="text-[11px] tracking-[0.22em] text-white/55">
            SERVICES
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Four pillars. One premium standard.
          </h2>

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
