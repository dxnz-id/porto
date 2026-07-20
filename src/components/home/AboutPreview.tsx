"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const techStack = [
  "TypeScript",
  "Laravel",
  "Next.js",
  "React",
  "MySQL",
  "Docker",
  "Linux",
  "Tailwind CSS",
];

export default function AboutPreview() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!photoRef.current || !textRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.fromTo(
        photoRef.current,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      ).fromTo(
        textRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=0.45"
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-section-gap px-margin-mobile md:px-margin-desktop border-b border-border-hairline bg-bg-off-white"
    >
      <div className="grid grid-cols-4 md:grid-cols-12 gap-gutter">
        {/* Photo */}
        <div
          ref={photoRef}
          className="col-span-4 md:col-span-4 mb-8 md:mb-0"
        >
          <div className="w-full aspect-[3/4] border border-border-hairline bg-surface relative overflow-hidden">
            <Image
              src="/images/profile.jpg"
              alt="Portrait of Zidan"
              fill
              className="object-cover grayscale"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </div>

        {/* Text content */}
        <div
          ref={textRef}
          className="col-span-4 md:col-span-7 flex flex-col justify-center md:col-start-6"
        >
          <h2 className="text-label-caps text-secondary uppercase tracking-widest mb-8">
            About
          </h2>
          <p className="text-body-lg text-primary mb-6 leading-relaxed">
            I&apos;m a full-stack developer from Indonesia who enjoys building
            web applications that are clean, fast, and practical. I primarily
            work with Laravel, Next.js, TypeScript, and SQL databases, and I
            like designing systems from the UI down to the database. Beyond
            writing code, I&apos;m interested in Linux, self-hosting,
            performance optimization, and understanding how software works
            beneath the surface. I believe good software isn&apos;t defined by
            complexity — it should solve real problems while staying simple to
            use and maintain.
          </p>
          <Link
            href="/about"
            className="text-label-mono text-secondary hover:text-primary transition-colors flex items-center gap-2 mt-2 group mb-12"
          >
            Read more about me{" "}
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>

          {/* Tech Stack */}
          <div className="border-t border-border-hairline pt-8">
            <h3 className="text-label-caps text-secondary uppercase tracking-widest mb-6">
              Tech Stack
            </h3>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8">
              {techStack.map((tech) => (
                <li
                  key={tech}
                  className="text-label-mono text-primary flex items-center border-b border-border-hairline pb-2"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
