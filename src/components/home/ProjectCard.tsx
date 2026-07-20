"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "@/lib/projects";

interface ProjectCardProps {
  project: Project;
  isLast: boolean;
}

export default function ProjectCard({ project, isLast }: ProjectCardProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasCarousel = project.images.length > 1;

  const scrollTo = useCallback(
    (index: number) => {
      const el = carouselRef.current;
      if (!el) return;
      const next = (index + project.images.length) % project.images.length;
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
      setCurrentIndex(next);
    },
    [project.images.length]
  );

  const handlePrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      scrollTo(currentIndex - 1);
    },
    [currentIndex, scrollTo]
  );

  const handleNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      scrollTo(currentIndex + 1);
    },
    [currentIndex, scrollTo]
  );

  // Border logic: prototype shows border-right on all but last card in the row
  // Grid is 2-col desktop → cards at index 0,2,... get border-right
  const borderClass = isLast
    ? "border-b md:border-b-0"
    : "border-b md:border-r border-border-hairline";

  return (
    <article
      className={`${borderClass} p-margin-mobile md:p-margin-desktop hover:bg-bg-off-white transition-colors duration-300 flex flex-col h-full group`}
    >
      <Link href={`/projects/${project.slug}`} className="flex flex-col h-full">
        {/* Image / Carousel area */}
        <div className="mb-8 overflow-hidden bg-surface-container relative h-64 border border-border-hairline group/carousel">
          {hasCarousel ? (
            <>
              {/* Snap scroll track */}
              <div
                ref={carouselRef}
                className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
              >
                {project.images.map((img, i) => (
                  <div
                    key={i}
                    className="w-full h-full flex-shrink-0 snap-center relative"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt={img.label}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>

              {/* Prev button */}
              <button
                onClick={handlePrev}
                className="group/btn absolute left-0 top-0 bottom-0 w-1/4 z-20 flex items-center justify-start pl-4 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 ease-in-out"
                aria-label="Previous image"
              >
                <div className="rounded-full bg-surface/90 flex items-center justify-center text-primary group-hover/btn:bg-surface group-hover/btn:scale-105 transition-all duration-200 shadow-sm w-8 h-8">
                  <ChevronLeft size={20} />
                </div>
              </button>

              {/* Next button */}
              <button
                onClick={handleNext}
                className="group/btn absolute right-0 top-0 bottom-0 w-1/4 z-20 flex items-center justify-end pr-4 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 ease-in-out"
                aria-label="Next image"
              >
                <div className="rounded-full bg-surface/90 flex items-center justify-center text-primary group-hover/btn:bg-surface group-hover/btn:scale-105 transition-all duration-200 shadow-sm w-8 h-8">
                  <ChevronRight size={20} />
                </div>
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 ease-in-out">
                {project.images.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full shadow-sm transition-colors ${
                      i === currentIndex ? "bg-surface" : "bg-surface/40"
                    }`}
                  />
                ))}
              </div>
            </>
          ) : (
            // Static single image
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.images[0].src}
              alt={project.images[0].label}
              className="object-cover w-full h-full transition-all duration-500"
            />
          )}
        </div>

        {/* Text content */}
        <div className="flex-grow">
          <h3 className="text-headline-lg-mobile text-primary mb-4">
            {project.name}
          </h3>
          <p className="text-body-md text-secondary mb-6">
            {project.description}
          </p>
        </div>

        {/* Tech stack tags */}
        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border-hairline">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="text-label-mono text-on-surface-variant border border-border-hairline px-3 py-1"
            >
              {tech}
            </span>
          ))}
        </div>
      </Link>
    </article>
  );
}
