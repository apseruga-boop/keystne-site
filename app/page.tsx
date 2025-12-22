"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import KeystneNav from "../components/site/KeystneNav";
import KeystneFooter from "../components/site/KeystneFooter";
import { CONTACT, HOME_VIDEOS, SERVICES } from "../components/site/config";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function mailtoFor(reason: string, bodyOverride?: string) {
  const to = CONTACT.emailArthur;
  const cc = CONTACT.emailStuart;

  const subject = encodeURIComponent(`Keystne enquiry — ${reason}`);
  const body = encodeURIComponent(
    bodyOverride ||
      `Hi Keystne team,\n\nI'm interested in: ${reason}\n\nName:\nPhone:\nPreferred contact time:\nDetails:\n\nThank you`
  );

  return `mailto:${to}?cc=${cc}&subject=${subject}&body=${body}`;
}

function Modal({
  open,
  title,
  subtitle,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 md:items-center">
      <button
        aria-label="Close modal overlay"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-[28px] border border-white/10 bg-ksBlack shadow-ks">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div>
            <div className="text-[11px] tracking-[0.22em] text-white/55">
              KEYSTNE
            </div>
            <div className="mt-1 text-lg font-semibold text-ksWhite">
              {title}
            </div>
            {subtitle ? (
              <div className="mt-1 text-sm text-white/65">{subtitle}</div>
            ) : null}
          </div>

          <button
            onClick={onClose}
            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function VideoTile({
  title,
  sentence,
  href,
  video,
  onHover,
  isActive,
}: {
  title: string;
  sentence: string;
  href: string;
  video: string;
  onHover?: () => void;
  isActive?: boolean;
}) {
  const vidRef = useRef<HTMLVideoElement | null>(null);

  return (
    <Link
      href={href}
      className={[
        "group relative block h-[420px] overflow-hidden rounded-[28px] border bg-black shadow-ks transition",
        isActive ? "border-[#C8A45D]/45" : "border-white/10",
      ].join(" ")}
      onMouseEnter={() => {
        onHover?.();
        vidRef.current?.play().catch(() => undefined);
      }}
      onMouseLeave={() => vidRef.current?.pause()}
      onFocus={() => {
        onHover?.();
        vidRef.current?.play().catch(() => undefined);
      }}
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
    </Link>
  );
}

function ContactDock() {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");
  const [phone, setPhone] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Enter your name.";
    if (!phone.trim()) e.phone = "Enter your phone number.";
    if (!email.trim()) e.email = "Enter your email.";
    else if (!isValidEmail(email)) e.email = "Email looks incorrect.";
    if (!email2.trim()) e.email2 = "Confirm your email.";
    else if (email2.trim() !== email.trim()) e.email2 = "Emails do not match.";
    if (!day) e.day = "Pick a date.";
    if (!time) e.time = "Pick a time.";
    return e;
  }, [name, phone, email, email2, day, time]);

  const canSubmit = Object.keys(errors).length === 0;

  const submit = () => {
    const body = [
      "Hi Keystne team,",
      "",
      "I'd like to book a call.",
      "",
      `Name: ${name || "-"}`,
      `Email: ${email || "-"}`,
      `Phone: ${phone || "-"}`,
      `Preferred date: ${day || "-"}`,
      `Preferred time: ${time || "-"}`,
      "",
      "Thank you",
    ].join("\n");

    window.location.href = mailtoFor("Book a call", body);
    setOpen(false);
  };

  return (
    <>
      <div
        id="contact"
        className="fixed bottom-5 right-5 z-40 w-[220px] overflow-hidden rounded-[22px] border border-white/10 bg-black/75 shadow-ks backdrop-blur-xl"
      >
        <div className="p-2">
          {/* WhatsApp – premium + noticeable */}
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

            <button
              className="rounded-2xl px-3 py-2 text-left text-[12px] text-white/80 hover:bg-white/5"
              onClick={() => setOpen(true)}
            >
              Book a call
            </button>

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

      <Modal
        open={open}
        title="Book a call"
        subtitle="Choose a time that works — we’ll take it from there."
        onClose={() => setOpen(false)}
      >
        <div className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <div className="text-[11px] tracking-[0.18em] text-white/55">
                NAME
              </div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={[
                  "mt-2 w-full rounded-2xl border bg-white/5 px-4 py-3 text-sm text-white outline-none",
                  errors.name ? "border-red-500/50" : "border-white/10",
                ].join(" ")}
                placeholder="Your full name"
              />
              {errors.name ? (
                <div className="mt-1 text-[11px] text-red-300">
                  {errors.name}
                </div>
              ) : null}
            </div>

            <div>
              <div className="text-[11px] tracking-[0.18em] text-white/55">
                PHONE
              </div>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={[
                  "mt-2 w-full rounded-2xl border bg-white/5 px-4 py-3 text-sm text-white outline-none",
                  errors.phone ? "border-red-500/50" : "border-white/10",
                ].join(" ")}
                placeholder="+971..."
              />
              {errors.phone ? (
                <div className="mt-1 text-[11px] text-red-300">
                  {errors.phone}
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <div className="text-[11px] tracking-[0.18em] text-white/55">
                EMAIL
              </div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={[
                  "mt-2 w-full rounded-2xl border bg-white/5 px-4 py-3 text-sm text-white outline-none",
                  errors.email ? "border-red-500/50" : "border-white/10",
                ].join(" ")}
                placeholder="you@email.com"
              />
              {errors.email ? (
                <div className="mt-1 text-[11px] text-red-300">
                  {errors.email}
                </div>
              ) : null}
            </div>

            <div>
              <div className="text-[11px] tracking-[0.18em] text-white/55">
                CONFIRM EMAIL
              </div>
              <input
                value={email2}
                onChange={(e) => setEmail2(e.target.value)}
                className={[
                  "mt-2 w-full rounded-2xl border bg-white/5 px-4 py-3 text-sm text-white outline-none",
                  errors.email2 ? "border-red-500/50" : "border-white/10",
                ].join(" ")}
                placeholder="Repeat email"
              />
              {errors.email2 ? (
                <div className="mt-1 text-[11px] text-red-300">
                  {errors.email2}
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <div className="text-[11px] tracking-[0.18em] text-white/55">
                DATE
              </div>
              <input
                type="date"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className={[
                  "mt-2 w-full rounded-2xl border bg-white/5 px-4 py-3 text-sm text-white outline-none",
                  errors.day ? "border-red-500/50" : "border-white/10",
                ].join(" ")}
              />
              {errors.day ? (
                <div className="mt-1 text-[11px] text-red-300">
                  {errors.day}
                </div>
              ) : null}
            </div>

            <div>
              <div className="text-[11px] tracking-[0.18em] text-white/55">
                TIME
              </div>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={[
                  "mt-2 w-full rounded-2xl border bg-white/5 px-4 py-3 text-sm text-white outline-none",
                  errors.time ? "border-red-500/50" : "border-white/10",
                ].join(" ")}
              />
              {errors.time ? (
                <div className="mt-1 text-[11px] text-red-300">
                  {errors.time}
                </div>
              ) : null}
            </div>
          </div>

          <button
            onClick={submit}
            disabled={!canSubmit}
            className={[
              "mt-2 w-full rounded-2xl px-5 py-4 text-sm font-medium transition",
              canSubmit
                ? "ks-btn-gold ks-gold-ring bg-black/55 text-ksWhite hover:bg-black/70"
                : "cursor-not-allowed border border-white/10 bg-white/5 text-white/40",
            ].join(" ")}
          >
            Confirm & email us →
          </button>

          <div className="text-[11px] text-white/45">
            This sends an email to Arthur (cc Stuart) with your preferred
            date/time.
          </div>
        </div>
      </Modal>
    </>
  );
}

export default function HomePage() {
  const [hideHeroBox, setHideHeroBox] = useState(false);
  const [activeKey, setActiveKey] = useState<string>(SERVICES[0]?.key || "");

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
              "ks-glass ks-fade-up rounded-[28px] p-10 shadow-ks transition",
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

          {/* Horizontal line (all 4) — “KE*STNE” style */}
          <div className="mt-6 rounded-[22px] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
            <div className="text-[11px] tracking-[0.22em] text-white/55">
              KEYSTNE
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] tracking-[0.22em] text-white/75">
              {SERVICES.map((s, idx) => (
                <button
                  key={s.key}
                  onMouseEnter={() => setActiveKey(s.key)}
                  onFocus={() => setActiveKey(s.key)}
                  className={[
                    "transition hover:text-ksWhite",
                    activeKey === s.key ? "text-ksWhite" : "text-white/65",
                  ].join(" ")}
                >
                  {s.title.toUpperCase()}
                  {idx < SERVICES.length - 1 ? (
                    <span className="ml-4 text-white/25">—</span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {SERVICES.map((s) => (
              <VideoTile
                key={s.key}
                title={s.title}
                sentence={s.sentence}
                href={s.href}
                video={s.video}
                onHover={() => setActiveKey(s.key)}
                isActive={activeKey === s.key}
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
