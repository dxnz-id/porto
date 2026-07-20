import type { Metadata } from "next";
import { hankenGrotesk, inter, jetbrainsMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s — DXNZ",
    default: "DXNZ — Fullstack Developer",
  },
  description:
    "Portfolio of Zidan (dxnz.id), a fullstack developer from Indonesia building clean, practical web applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${hankenGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
