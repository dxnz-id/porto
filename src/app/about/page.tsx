import type { Metadata } from "next";
import IntroSection from "@/components/about/IntroSection";
import JourneyTimeline from "@/components/about/JourneyTimeline";
import InterestsTags from "@/components/about/InterestsTags";
import SectionReveal from "@/components/ui/SectionReveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Zidan — a fullstack developer from Indonesia, his journey, tech stack, and interests.",
};

export default function AboutPage() {
  return (
    <div className="flex-grow w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-section-gap bg-surface">
      <header className="mb-24">
        <h1 className="text-headline-xl text-primary mb-4 md:mb-6">About</h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl">
          A bit more about who I am and how I got here.
        </p>
      </header>
      {/* IntroSection has its own GSAP timeline */}
      <IntroSection />
      {/* JourneyTimeline has its own GSAP ScrollTrigger stagger */}
      <JourneyTimeline />
      <SectionReveal>
        <InterestsTags />
      </SectionReveal>
    </div>
  );
}
