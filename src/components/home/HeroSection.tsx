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
      // Line-by-line clip reveal — each line rises from overflow:hidden container
      const lines = Array.from(
        containerRef.current?.querySelectorAll("[data-line]") ?? []
      );
      const extras = Array.from(
        containerRef.current?.querySelectorAll("[data-extra]") ?? []
      );
      if (!lines.length) return;

      const tl = gsap.timeline({ delay: 0.2, defaults: { ease: "power4.out" } });

      tl.fromTo(lines, { y: "108%" }, { y: "0%", duration: 1.0, stagger: 0.12 });

      if (extras.length) {
        tl.fromTo(
          extras,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          "-=0.5"
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <section className="border-b border-border-hairline pt-16 md:pt-20 pb-24 md:pb-32">
      <div
        ref={containerRef}
        className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop"
      >
        {/* Label */}
        <div className="overflow-hidden mb-6">
          <p data-line className="text-label-caps text-secondary">
            Fullstack Developer
          </p>
        </div>

        {/* H1 — line-by-line clip reveal */}
        <h1 className="text-headline-lg-mobile md:text-headline-xl mb-8 max-w-3xl">
          <span className="overflow-hidden block">
            <span data-line className="block text-primary">
              I build full-stack web
            </span>
          </span>
          <span className="overflow-hidden block">
            <span data-line className="block text-primary">
              applications that are simple
            </span>
          </span>
          <span className="overflow-hidden block">
            <span data-line className="block text-primary">
              to use, easy to maintain,
            </span>
          </span>
          <span className="overflow-hidden block">
            <span data-line className="block text-secondary">
              and enjoyable to build.
            </span>
          </span>
        </h1>

        {/* CTA */}
        <Link
          data-extra=""
          href="#work"
          className="text-label-mono text-secondary hover:text-primary transition-colors inline-flex items-center gap-2 group"
        >
          View Work{" "}
          <ArrowDown
            size={16}
            className="group-hover:translate-y-0.5 transition-transform duration-200"
          />
        </Link>
      </div>
    </section>
  );
}
