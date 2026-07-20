import type { Metadata } from "next";
import IntroSection from "@/components/about/IntroSection";
import JourneyTimeline from "@/components/about/JourneyTimeline";
import InterestsTags from "@/components/about/InterestsTags";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="flex-grow w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-section-gap bg-surface">
      <header className="mb-24">
        <h1 className="text-headline-xl text-primary mb-4 md:mb-6">About</h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl">
          A bit more about who I am and how I got here.
        </p>
      </header>
      <IntroSection />
      <JourneyTimeline />
      <InterestsTags />
    </div>
  );
}
