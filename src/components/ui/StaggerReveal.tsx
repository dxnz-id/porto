"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface StaggerRevealProps {
  children: React.ReactNode;
  className?: string;
  itemSelector?: string;
  stagger?: number;
  y?: number;
  duration?: number;
}

export default function StaggerReveal({
  children,
  className,
  itemSelector = ":scope > *",
  stagger = 0.1,
  y = 24,
  duration = 0.5,
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const items = el.querySelectorAll(itemSelector);
      if (!items.length) return;

      gsap.fromTo(
        items,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          ease: "power4.out",
          stagger,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className={className}
    >
      {children}
    </div>
  );
}
