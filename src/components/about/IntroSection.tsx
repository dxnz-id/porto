"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!photoRef.current || !textRef.current) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        photoRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.75 },
      ).fromTo(
        textRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.45",
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-section-gap items-start"
    >
      {/* Photo */}
      <div ref={photoRef} className="md:col-span-4 lg:col-span-3">
        <div className="aspect-[3/4] w-full border border-border-hairline relative overflow-hidden bg-bg-off-white">
          <Image
            src="/images/profile.jpg"
            alt="Portrait of Zidan"
            fill
            className="object-cover grayscale"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
            priority
          />
        </div>
      </div>

      {/* Intro text */}
      <div
        ref={textRef}
        className="md:col-span-8 lg:col-span-7 lg:col-start-5 pt-4 md:pt-0"
      >
        <p className="text-body-lg text-primary leading-relaxed">
          I&apos;m a full-stack developer from Indonesia who enjoys building
          clean, practical web applications with a focus on thoughtful system
          design. I like understanding how software works beneath the surface
          and believe good software should solve real problems while staying
          simple to use and maintain.
        </p>
      </div>
    </section>
  );
}
