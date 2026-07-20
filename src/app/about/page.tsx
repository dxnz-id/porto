import type { Metadata } from "next";
import IntroSection from "@/components/about/IntroSection";
import JourneyTimeline from "@/components/about/JourneyTimeline";

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
        <h1 className="text-headline-lg-mobile md:text-headline-xl mb-4">
          <span className="text-primary">Who</span>{" "}
          <span className="text-secondary">I am.</span>
        </h1>
        <p className="text-body-lg text-secondary max-w-2xl">
          Full-stack developer from Indonesia. I build practical software and
          enjoy understanding how things work beneath the surface.
        </p>
      </header>
      <IntroSection />
      <JourneyTimeline />
    </div>
  );
}
