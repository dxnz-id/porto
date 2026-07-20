import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export interface NavItem {
  slug: string;
  title: string;
}

interface PrevNextNavProps {
  prev: NavItem | null;
  next: NavItem | null;
  hrefPrefix: string;
}

export default function PrevNextNav({
  prev,
  next,
  hrefPrefix,
}: PrevNextNavProps) {
  if (!prev && !next) return null;

  return (
    <nav className="grid grid-cols-2 border-t border-border-hairline mt-16">
      <div className="border-r border-border-hairline">
        {prev ? (
          <Link
            href={`${hrefPrefix}/${prev.slug}`}
            className="group flex flex-col gap-2 p-8 hover:bg-surface-container-low transition-colors duration-200"
          >
            <span className="text-label-caps text-secondary flex items-center gap-2">
              <ArrowLeft
                size={14}
                className="group-hover:-translate-x-1 transition-transform duration-200"
              />
              Previous
            </span>
            <span className="text-headline-lg-mobile text-primary line-clamp-2">
              {prev.title}
            </span>
          </Link>
        ) : (
          <div className="p-8" />
        )}
      </div>

      <div>
        {next ? (
          <Link
            href={`${hrefPrefix}/${next.slug}`}
            className="group flex flex-col gap-2 p-8 text-right hover:bg-surface-container-low transition-colors duration-200"
          >
            <span className="text-label-caps text-secondary flex items-center gap-2 justify-end">
              Next
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </span>
            <span className="text-headline-lg-mobile text-primary line-clamp-2">
              {next.title}
            </span>
          </Link>
        ) : (
          <div className="p-8" />
        )}
      </div>
    </nav>
  );
}
