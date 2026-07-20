"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import projects from "@/lib/projects";
import ProjectCard from "./ProjectCard";
import SectionHeader from "@/components/ui/SectionHeader";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection() {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gridRef.current?.children;
      if (!cards?.length) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power4.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 88%",
            once: true,
          },
        },
      );
    },
    { scope: gridRef },
  );

  return (
    <section
      id="work"
      className="py-16 md:py-24 border-b border-border-hairline"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader label="Selected Work" />

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              isLast={i === projects.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
