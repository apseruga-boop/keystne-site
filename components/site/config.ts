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
  longterm:
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  management:
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
};

// Keep these exported so other pages never break builds.
export const DUBAI_AREAS = [
  "Downtown Dubai",
  "Dubai Marina",
  "Business Bay",
  "Palm Jumeirah",
  "JBR",
  "JLT",
  "Dubai Hills Estate",
  "JVC",
  "Dubai Creek Harbour",
  "City Walk",
];

export const MEDIA = {
  placeholder: true,
};

export const SERVICES = [
  {
    key: "concierge",
    title: "Concierge",
    sentence:
      "A personal end-to-end journey — from travel and viewings to purchase and settling in.",
    href: "/concierge",
    video: HOME_VIDEOS.concierge,
  },
  {
    key: "investments",
    title: "Brokerage & Investments",
    sentence:
      "Off-plan to secondary — guided with market insight and a seamless buying process.",
    href: "/investments",
    video: HOME_VIDEOS.investments,
  },
  {
    key: "longterm",
    title: "Long-Term Rentals",
    sentence:
      "Long-stay leasing made simple — area guidance, screening, and rental support.",
    href: "/long-term",
    video: HOME_VIDEOS.longterm,
  },
  {
    key: "management",
    title: "Property Management",
    sentence:
      "Hands-on management and performance oversight — you relax, we handle the detail.",
    href: "/property-management",
    video: HOME_VIDEOS.management,
  },
] as const;
