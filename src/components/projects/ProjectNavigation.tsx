import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Project } from "@/lib/projects";

interface ProjectNavigationProps {
  prev: Project | null;
  next: Project | null;
}

export default function ProjectNavigation({
  prev,
  next,
}: ProjectNavigationProps) {
  if (!prev && !next) return null;

  return (
    <div className="mt-12 pt-12 border-t border-border-hairline grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0">
      {/* Previous */}
      <div className="md:pr-8 md:border-r md:border-border-hairline">
        {prev ? (
          <Link
            href={`/projects/${prev.slug}`}
            className="group flex flex-col items-start hover:bg-surface-container-low transition-colors p-4 -ml-4"
          >
            <span className="text-label-caps text-secondary mb-2 flex items-center gap-2">
              <ArrowLeft
                size={14}
                className="group-hover:-translate-x-1 transition-transform duration-200"
              />
              Previous
            </span>
            <span className="text-body-lg font-semibold text-primary group-hover:text-primary">
              {prev.name}
            </span>
          </Link>
        ) : (
          <div className="p-4" />
        )}
      </div>

      {/* Next */}
      <div className="md:pl-8">
        {next ? (
          <Link
            href={`/projects/${next.slug}`}
            className="group flex flex-col items-end hover:bg-surface-container-low transition-colors p-4 -mr-4 text-right"
          >
            <span className="text-label-caps text-secondary mb-2 flex items-center gap-2">
              Next
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </span>
            <span className="text-body-lg font-semibold text-primary">
              {next.name}
            </span>
          </Link>
        ) : (
          <div className="p-4" />
        )}
      </div>
    </div>
  );
}
