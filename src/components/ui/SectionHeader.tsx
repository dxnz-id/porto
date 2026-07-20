"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SectionHeaderProps {
  label: string;
  className?: string;
  children?: React.ReactNode;
}

export default function SectionHeader({
  label,
  className = "",
  children,
}: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const lines = el.querySelectorAll<HTMLElement>("[data-sh-line]");
      const border = el.querySelector<HTMLElement>("[data-sh-border]");

      if (!lines.length) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
        defaults: { ease: "power4.out" },
      });

      tl.fromTo(
        lines,
        { y: "108%" },
        { y: "0%", duration: 0.5, stagger: 0.08 },
      );
      if (border) {
        tl.fromTo(
          border,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.4, transformOrigin: "left" },
          "-=0.2",
        );
      }
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`mb-12 ${className}`}>
      <div className="flex justify-between items-end mb-2">
        <div className="overflow-hidden">
          <p data-sh-line className="text-label-caps text-secondary">
            {label}
          </p>
        </div>
        {children && <div className="overflow-hidden">{children}</div>}
      </div>
      <div data-sh-border className="border-b border-border-hairline" />
    </div>
  );
}
