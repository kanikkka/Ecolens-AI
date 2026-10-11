import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoLens AI",
  description:
    "Scan. Understand. Act. Make an Impact. An AI-powered sustainability platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
