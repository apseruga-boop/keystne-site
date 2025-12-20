import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keystne — Dubai Real Estate",
  description:
    "Premium property brokerage, leasing, and management in Dubai with a concierge-style personal experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-ksBlack text-ksWhite">{children}</body>
    </html>
  );
}
