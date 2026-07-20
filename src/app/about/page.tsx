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
    <div className="flex-grow pt-16 md:pt-20 pb-section-gap px-margin-mobile md:px-margin-desktop w-full max-w-7xl mx-auto">
      <header className="mb-16 md:mb-20">
        <p className="text-label-caps text-secondary mb-3">About</p>
        <h1 className="text-headline-lg-mobile md:text-headline-xl text-primary mb-4">
          Who I am.
        </h1>
        <p className="text-body-lg text-secondary max-w-2xl">
          Full-stack developer from Indonesia. I build practical software and
          enjoy understanding how things work beneath the surface.
        </p>
      </header>
      <IntroSection />
      <JourneyTimeline />
      <SectionReveal>
        <InterestsTags />
      </SectionReveal>
    </div>
  );
}
