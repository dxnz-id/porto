"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Every route change creates a fresh Template instance — this always runs
    gsap.fromTo(
      el,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power4.out", clearProps: "all" }
    );
  }, []);

  return <div ref={ref}>{children}</div>;
}
