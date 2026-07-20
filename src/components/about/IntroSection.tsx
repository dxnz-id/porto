"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import StackIcon from "tech-stack-icons";

export default function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const stackHeaderRef = useRef<HTMLDivElement>(null);
  const stackBorderRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!photoRef.current || !textRef.current) return;
      const categories = gsap.utils.toArray<HTMLElement>(".stack-category");
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        photoRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.75 },
      )
        .fromTo(
          textRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.45",
        )
        .fromTo(
          stackRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.2",
        )
        .fromTo(
          stackHeaderRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.3 },
          "-=0.35",
        )
        .fromTo(
          stackBorderRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.35, transformOrigin: "left" },
          "-=0.2",
        )
        .fromTo(
          categories,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.1 },
          "-=0.2",
        );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-16 md:mb-24 items-start"
    >
      {/* Photo */}
      <div ref={photoRef} className="md:col-span-4 lg:col-span-3">
        <div className="aspect-[3/4] w-full border border-border-hairline relative overflow-hidden bg-bg-off-white">
          <Image
            src="/images/profile.jpg"
            alt="Portrait of Zidan"
            fill
            className="object-cover grayscale"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
            priority
          />
        </div>
      </div>

      {/* Intro text + stack */}
      <div
        ref={textRef}
        className="md:col-span-8 lg:col-span-7 lg:col-start-5 pt-4 md:pt-0"
      >
        <p className="text-body-lg text-primary leading-relaxed mb-10">
          I&apos;m a full-stack developer from Indonesia who enjoys building
          clean, practical web applications with a focus on thoughtful system
          design. I like understanding how software works beneath the surface
          and believe good software should solve real problems while staying
          simple to use and maintain.
        </p>

        <div ref={stackRef}>
          <div ref={stackHeaderRef} className="mb-6">
            <p className="text-label-caps text-secondary mb-2">Stack</p>
            <div ref={stackBorderRef} className="border-b border-border-hairline" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
            {[
              { label: "Front End", items: [["TypeScript", "typescript"], ["React", "react"], ["Next.js", "nextjs2"], ["Tailwind CSS", "tailwindcss"], ["shadcn/ui", null]] },
              { label: "Back End", items: [["Laravel", "laravel"], ["PHP", "php"], ["Go", "go"], ["Node.js", "nodejs"], ["REST API", null]] },
              { label: "Database", items: [["MySQL", "mysql"], ["PostgreSQL", "postgresql"], ["SQLite", "sqlite"]] },
              { label: "Cloud & DevOps", items: [["Docker", "docker"], ["Linux", "linux"], ["AWS", "aws"], ["Firebase", "firebase"]] },
              { label: "Tools", items: [["Git", "git"], ["Figma", "figma"], ["Postman", "postman"]] },
            ].map(({ label, items }, i) => (
              <div key={label} className="stack-category">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-[11px] font-mono tabular-nums text-secondary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-label-caps text-primary">{label}</h3>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {items.map(([item, icon]) => (
                    <li
                      key={item}
                      className="flex items-center gap-1.5 px-3 py-1 border border-border-hairline text-label-mono text-primary bg-bg-off-white"
                    >
                      {icon && <StackIcon name={icon} variant="grayscale" className="w-4 h-4 shrink-0" />}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
