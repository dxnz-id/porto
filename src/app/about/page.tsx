import type { Metadata } from "next";
import AboutContent from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Zidan — a fullstack developer from Indonesia, his journey, tech stack, and interests.",
};

export default function AboutPage() {
  return <AboutContent />;
}
