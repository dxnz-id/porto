"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import IntroSection from "@/components/about/IntroSection";
import JourneyTimeline from "@/components/about/JourneyTimeline";

export default function AboutContent() {
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const lines = headerRef.current?.querySelectorAll("[data-h-line]");
      const extras = headerRef.current?.querySelectorAll("[data-h-extra]");

      if (!lines?.length) return;

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        lines,
        { y: "108%" },
        { y: "0%", duration: 0.7, stagger: 0.1 },
      );

      if (extras?.length) {
        tl.fromTo(
          extras,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.06 },
          "-=0.3",
        );
      }
    },
    { scope: headerRef },
  );

  return (
    <div className="flex-grow pt-16 md:pt-20 pb-section-gap px-margin-mobile md:px-margin-desktop w-full max-w-7xl mx-auto">
      <div ref={headerRef}>
        <header className="mb-16 md:mb-20">
          <div className="overflow-hidden mb-3">
            <p data-h-line className="text-label-caps text-secondary">
              About
            </p>
          </div>
          <div className="overflow-hidden mb-4">
            <h1
              data-h-line
              className="text-headline-lg-mobile md:text-headline-xl"
            >
              <span className="text-primary">Who</span>{" "}
              <span className="text-secondary">I am.</span>
            </h1>
          </div>
          <div className="overflow-hidden">
            <p
              data-h-extra
              className="text-body-lg text-secondary max-w-2xl"
            >
              Full-stack developer from Indonesia. I build practical software
              and enjoy understanding how things work beneath the surface.
            </p>
          </div>
        </header>
      </div>
      <IntroSection />
      <JourneyTimeline />
    </div>
  );
}
