"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type EntryType = "milestone" | "project";

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  type: EntryType;
  subItems?: string[];
}

const entries: TimelineEntry[] = [
  {
    year: "2022",
    title: "Started Learning Programming",
    description:
      "Started learning programming in the first year of vocational high school, where I discovered an interest in web development and building software from scratch.",
    type: "milestone",
  },
  {
    year: "2022–2025",
    title: "Software & Game Development (PPLG)",
    description:
      "Studied Software & Game Development, building a strong foundation in programming, databases, and software engineering through coursework, competitions, and personal projects.",
    type: "milestone",
    subItems: [
      "2024 — Won 2nd Place in a university web design competition",
      "2024 — Received 3rd Place (Harapan III) in the Pelajar Pelopor Keselamatan Lalu Lintas competition with a microcontroller-based brake temperature detection project.",
    ],
  },
  {
    year: "2025",
    title: "Began Studying Informatics Engineering",
    description:
      "Started pursuing a Bachelor's degree in Informatics Engineering while continuing to build real-world software projects outside the classroom.",
    type: "milestone",
  },
  {
    year: "2025",
    title: "SIPUPS",
    description:
      "Built SIPUPS as a school project during vocational high school — a digital library management system using Laravel, focusing on maintainable architecture and practical admin workflows.",
    type: "project",
  },
  {
    year: "2025–2026",
    title: "LabNotes",
    description:
      "Built LabNotes, another school project — a laboratory management platform that expanded my experience designing full-stack applications and modern development workflows.",
    type: "project",
  },
  {
    year: "2026",
    title: "Siwayut Catering",
    description:
      "Developed Siwayut Catering as a university coursework project — a web-based administration system for a catering business, prioritizing simplicity and maintainable code.",
    type: "project",
  },
];

export default function JourneyTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = itemsRef.current?.querySelectorAll("[data-timeline-item]");
      if (!items?.length) return;

      gsap.fromTo(
        items,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: itemsRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="mb-section-gap">
      <h2 className="text-headline-lg-mobile text-primary mb-12 border-b border-border-hairline pb-4">
        Journey
      </h2>

      <div
        ref={itemsRef}
        className="relative pl-6 md:pl-12 border-l border-border-hairline ml-2 md:ml-4 space-y-16"
      >
        {entries.map((entry, i) => (
          <div key={i} data-timeline-item="" className="relative">
            {/* Dot indicator */}
            {entry.type === "milestone" ? (
              <div className="absolute -left-[31px] md:-left-[55px] top-1 w-3 h-3 bg-primary rounded-full ring-4 ring-surface" />
            ) : (
              <div className="absolute -left-[31px] md:-left-[55px] top-1 w-3 h-3 bg-surface border border-primary rounded-full ring-4 ring-surface" />
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-gutter">
              {/* Year */}
              <div className="md:col-span-1">
                <span className="text-label-mono text-on-surface-variant">
                  {entry.year}
                </span>
              </div>

              {/* Content */}
              <div className="md:col-span-3">
                <h3 className="text-body-lg font-semibold text-primary mb-2">
                  {entry.title}
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  {entry.description}
                </p>

                {/* Sub-items (competitions etc.) */}
                {entry.subItems && (
                  <ul className="space-y-3 border-l border-border-hairline pl-4 ml-1 mt-4">
                    {entry.subItems.map((item, j) => {
                      const [year, ...rest] = item.split(" — ");
                      return (
                        <li
                          key={j}
                          className="text-body-md text-on-surface-variant"
                        >
                          <span className="text-label-mono text-primary mr-2">
                            {year}
                          </span>
                          — {rest.join(" — ")}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
