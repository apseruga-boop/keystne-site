export function buildMailto(params: {
  to: string[];
  subject: string;
  body: string;
}) {
  const enc = (s: string) => encodeURIComponent(s);
  return `mailto:${params.to.join(",")}?subject=${enc(
    params.subject
  )}&body=${enc(params.body)}`;
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function sanitizePhone(input: string) {
  return input.replace(/[^0-9+\s()-]/g, "");
}
