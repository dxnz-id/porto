import type { Metadata } from "next";
import { hankenGrotesk, inter, jetbrainsMono } from "@/lib/fonts";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TransitionProvider from "@/components/transition/TransitionProvider";
import { getTransitionPhotos } from "@/lib/transition-photos";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://dxnz.id"
  ),
  title: {
    template: "%s — DXNZ",
    default: "DXNZ — Fullstack Developer",
  },
  description:
    "Portfolio of Zidan (dxnz.id), a fullstack developer from Indonesia building clean, practical web applications.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "DXNZ",
    title: "DXNZ — Fullstack Developer",
    description:
      "Portfolio of Zidan (dxnz.id), a fullstack developer from Indonesia building clean, practical web applications.",
    images: [
      {
        url: "/images/profile.jpg",
        width: 800,
        height: 600,
        alt: "DXNZ — Fullstack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DXNZ — Fullstack Developer",
    description:
      "Portfolio of Zidan (dxnz.id), a fullstack developer from Indonesia building clean, practical web applications.",
    images: ["/images/profile.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const transitionPhotos = getTransitionPhotos();

  return (
    <html
      lang="en"
      className={`${hankenGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <TransitionProvider photos={transitionPhotos}>
          <Navbar />
          <main className="flex-grow pt-20">{children}</main>
          <Footer />
        </TransitionProvider>
      </body>
    </html>
  );
}
