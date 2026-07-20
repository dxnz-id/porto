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
    <section className="flex flex-col justify-center px-margin-mobile md:px-margin-desktop border-b border-border-hairline pt-32 pb-40">
      <div ref={containerRef} className="grid grid-cols-4 md:grid-cols-12 gap-gutter">
        <div className="col-span-4 md:col-span-10 md:col-start-2">
          <div className="mb-8">
            <h1 className="font-headline text-headline-lg-mobile md:text-headline-xl max-w-4xl">
              <span data-hero className="text-secondary block mb-2">
                Hey, I&apos;m Zidan.
              </span>
              <span data-hero className="text-primary">
                I build full-stack web applications that are simple to use, easy
                to maintain, and enjoyable to build.
              </span>
            </h1>
          </div>
          <Link
            data-hero=""
            href="#work"
            className="text-label-mono text-primary hover:text-secondary transition-colors flex items-center gap-2"
          >
            View Work <ArrowDown size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
