"use client";

import type { Project } from "@/lib/projects";

interface ProjectGalleryProps {
  images: Project["images"];
}

export default function ProjectGallery({ images }: ProjectGalleryProps) {
  return (
    <section className="w-full relative -mx-margin-mobile md:mx-0 px-margin-mobile md:px-0">
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 scrollbar-hide pb-8">
        {images.map((img, i) => (
          <div
            key={i}
            className="snap-center shrink-0 w-[85vw] md:w-[800px] aspect-video border border-border-hairline bg-bg-off-white relative group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.label}
              className="w-full h-full object-cover"
            />
            {/* Label overlay */}
            <div className="absolute bottom-4 left-4 bg-surface/90 px-3 py-1 border border-border-hairline">
              <span className="text-label-mono text-primary">
                {String(i + 1).padStart(2, "0")} / {img.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
