"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowDown } from "lucide-react";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const targets = containerRef.current?.querySelectorAll("[data-hero]");
      if (!targets?.length) return;

      gsap.fromTo(
        targets,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.1,
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section className="border-b border-border-hairline pt-16 md:pt-20 pb-24 md:pb-32">
      {/* Inner container — matches max-w-7xl of interior pages */}
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
        <div ref={containerRef} className="grid grid-cols-4 md:grid-cols-12 gap-gutter">
          <div className="col-span-4 md:col-span-10 md:col-start-2">
            <p data-hero className="text-label-caps text-secondary mb-6">
              Fullstack Developer
            </p>
            <h1 data-hero className="text-headline-lg-mobile md:text-headline-xl text-primary max-w-3xl mb-8">
              I build full-stack web applications that are simple to use, easy
              to maintain, and enjoyable to build.
            </h1>
            <Link
              data-hero=""
              href="#work"
              className="text-label-mono text-secondary hover:text-primary transition-colors flex items-center gap-2 group"
            >
              View Work{" "}
              <ArrowDown
                size={16}
                className="group-hover:translate-y-0.5 transition-transform duration-200"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
