import "./globals.css";
import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";

const diorLike = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "keystne.dubai",
  description: "Premium real estate services in Dubai.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={diorLike.className}>{children}</body>
    </html>
  );
}
