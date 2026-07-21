"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ProjectCascadeProps {
  gallery: React.ReactNode;
  links: React.ReactNode;
  metadata: React.ReactNode;
  features: React.ReactNode;
  navigation: React.ReactNode;
}

export default function ProjectCascade({
  gallery,
  links,
  metadata,
  features,
  navigation,
}: ProjectCascadeProps) {
  const sectionsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const sections = sectionsRef.current?.children;
      if (!sections?.length) return;

      gsap.fromTo(
        sections,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power4.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionsRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    },
    { scope: sectionsRef },
  );

  return (
    <div ref={sectionsRef} className="flex flex-col gap-16 md:gap-24">
      {[gallery, links, metadata, features, navigation].map((child, i) => (
        <div key={i}>{child}</div>
      ))}
    </div>
  );
}
