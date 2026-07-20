"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const techStack = [
  "Web Development",
  "System Design",
  "Linux",
  "UI/UX",
  "Open Source",
  "Performance Optimization",
];

export default function AboutPreview() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const interestsBorderRef = useRef<HTMLDivElement>(null);
  const interestsLabelRef = useRef<HTMLParagraphElement>(null);
  const interestsGridRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      if (!photoRef.current || !textRef.current) return;

      const interestItems = interestsGridRef.current?.querySelectorAll("li");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
        defaults: { ease: "power4.out" },
      });

      tl.fromTo(
        photoRef.current,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.7 }
      )
        .fromTo(
          textRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.45"
        )
        .fromTo(
          interestsBorderRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.4, transformOrigin: "left" },
          "-=0.35"
        )
        .fromTo(
          interestsLabelRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.3 },
          "-=0.2"
        );
      if (interestItems?.length) {
        tl.fromTo(
          interestItems,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.06 },
          "-=0.15"
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-16 md:py-24 border-b border-border-hairline bg-bg-off-white"
    >
      {/* Inner container */}
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Section header */}
        <div className="mb-12">
          <p className="text-label-caps text-secondary mb-2">About</p>
          <div className="border-b border-border-hairline" />
        </div>

        <div className="grid grid-cols-4 md:grid-cols-12 gap-gutter">
          {/* Photo */}
          <div ref={photoRef} className="col-span-4 md:col-span-4 mb-8 md:mb-0">
            <div className="w-full aspect-[3/4] border border-border-hairline bg-surface relative overflow-hidden">
              <Image
                src="/images/profile.jpg"
                alt="Portrait of Zidan"
                fill
                className="object-cover grayscale"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>

          {/* Text content */}
          <div
            ref={textRef}
            className="col-span-4 md:col-span-7 flex flex-col justify-center md:col-start-6"
          >
            <p className="text-body-lg text-primary mb-6 leading-relaxed">
              I&apos;m a full-stack developer from Indonesia who enjoys building
              web applications that are clean, fast, and practical. I primarily
              work with Laravel, Next.js, TypeScript, and SQL databases, and I
              like designing systems from the UI down to the database.
            </p>
            <Link
              href="/about"
              className="text-label-mono text-secondary hover:text-primary transition-colors flex items-center gap-2 mb-12 group"
            >
              Read more about me{" "}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </Link>

            {/* Tech Stack */}
            <div ref={interestsBorderRef} className="border-t border-border-hairline pt-8">
              <p ref={interestsLabelRef} className="text-label-caps text-secondary mb-6">Interests</p>
              <ul ref={interestsGridRef} className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8">
                {techStack.map((tech) => (
                  <li
                    key={tech}
                    className="text-label-mono text-primary border-b border-border-hairline pb-2"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
