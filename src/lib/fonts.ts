import { Hanken_Grotesk, Inter, JetBrains_Mono } from "next/font/google";

export const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-headline",
});

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});
