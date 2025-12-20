// components/site/config.ts

export const CONTACT = {
  phoneDisplay: "+971 XX XXX XXXX",
  phoneTel: "tel:+971XXXXXXXXX",
  whatsappLink: "https://wa.me/971XXXXXXXXX",
  telegramLink: "https://t.me/keystne",
  wechatText: "WeChat: keystne",
  emailArthur: "arthur@keystne.com",
  emailStuart: "stuart@keystne.com",
};

export const MEDIA = {
  videos: {
    hero: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    concierge:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    investments:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    leasing:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    management:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  images: {},
};

// Keep compatibility with older imports:
export const HOME_VIDEOS = MEDIA.videos;

export const SERVICES = [
  {
    key: "concierge",
    title: "Concierge",
    sentence:
      "We organise your Dubai trip, viewings, and guide you personally through buying or relocating.",
    href: "/concierge",
    video: MEDIA.videos.concierge,
  },
  {
    key: "investments",
    title: "Brokerage & Investments",
    sentence:
      "Off-plan to secondary — curated options, market insight, and a clean end-to-end process.",
    href: "/investments",
    video: MEDIA.videos.investments,
  },
  {
    key: "leasing",
    title: "Leasing & Rentals",
    sentence:
      "Long-term rentals handled properly — shortlists, negotiation, screening, and move-in support.",
    href: "/leasing",
    video: MEDIA.videos.leasing,
  },
  {
    key: "management",
    title: "Property Management",
    sentence:
      "Hands-on management to maximise performance — maintenance, tenants, and reporting.",
    href: "/management",
    video: MEDIA.videos.management,
  },
] as const;

// ✅ Add this export to fix your build error:
export const DUBAI_AREAS = [
  "Downtown Dubai",
  "Dubai Marina",
  "Business Bay",
  "Palm Jumeirah",
  "Jumeirah Beach Residence (JBR)",
  "Jumeirah Lake Towers (JLT)",
  "City Walk",
  "DIFC",
  "Dubai Creek Harbour",
  "Dubai Hills Estate",
  "Arabian Ranches",
  "Jumeirah Village Circle (JVC)",
  "Jumeirah Village Triangle (JVT)",
  "The Springs",
  "The Meadows",
  "Emirates Hills",
  "Al Barsha",
  "Mirdif",
  "Motor City",
  "Dubai Sports City",
  "Dubai Silicon Oasis",
  "International City",
  "Jumeirah (Beach Road)",
  "Umm Suqeim",
  "Al Sufouh",
  "Bluewaters Island",
  "JBR (The Walk)",
  "The Palm (Crescent)",
  "Al Quoz",
  "Dubai South",
];
