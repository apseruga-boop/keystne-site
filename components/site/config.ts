export const CONTACT = {
  phoneDisplay: "+971 XX XXX XXXX",
  phoneTel: "tel:+971XXXXXXXXX",
  whatsappLink: "https://wa.me/971XXXXXXXXX",
  telegramLink: "https://t.me/keystne",
  wechatText: "WeChat ID: keystne",
  emailArthur: "arthur@keystne.com",
  emailStuart: "stuart@keystne.com",
};

export const HOME_VIDEOS = {
  hero: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  concierge:
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  investments:
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  leasing:
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  management:
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
};

/**
 * Keep this export because your concierge route expects it.
 * We'll refine / reorder later using real Dubai community structure.
 */
export const DUBAI_AREAS = [
  "Downtown Dubai",
  "Dubai Marina",
  "Business Bay",
  "Palm Jumeirah",
  "Jumeirah Beach Residence (JBR)",
  "Jumeirah Lake Towers (JLT)",
  "Dubai Hills Estate",
  "Arabian Ranches",
  "Jumeirah Village Circle (JVC)",
  "Dubai Creek Harbour",
  "City Walk",
  "Al Barsha",
  "The Springs",
  "The Meadows",
  "Emirates Hills",
  "Dubai Silicon Oasis",
  "Mirdif",
  "Motor City",
];

/**
 * Keep this export because some pages you pasted earlier referenced MEDIA.
 * We can swap these URLs later to your licensed videos.
 */
export const MEDIA = {
  hero: HOME_VIDEOS.hero,
  concierge: HOME_VIDEOS.concierge,
  investments: HOME_VIDEOS.investments,
  leasing: HOME_VIDEOS.leasing,
  management: HOME_VIDEOS.management,
};

export const SERVICES = [
  {
    key: "concierge",
    title: "Concierge",
    sentence:
      "A personal, end-to-end journey — from viewing trips to owning your Dubai home.",
    href: "/concierge",
    video: HOME_VIDEOS.concierge,
  },
  {
    key: "investments",
    title: "Brokerage & Investments",
    sentence:
      "Expert guidance, market insight, and seamless execution — built for serious buyers.",
    href: "/investments",
    video: HOME_VIDEOS.investments,
  },
  {
    key: "rentals",
    title: "Long term rentals",
    sentence:
      "Trusted leasing support and guidance for living in Dubai with confidence.",
    href: "/leasing",
    video: HOME_VIDEOS.leasing,
  },
  {
    key: "management",
    title: "Property management",
    sentence:
      "We protect performance, handle operations, and keep ownership effortless.",
    href: "/management",
    video: HOME_VIDEOS.management,
  },
] as const;
