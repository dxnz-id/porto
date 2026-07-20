import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/lib/blog";

interface BlogPostItemProps {
  post: BlogPost;
}

export default function BlogPostItem({ post }: BlogPostItemProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group py-8 border-b border-border-hairline hover:bg-surface-container-low transition-colors duration-200 -mx-margin-mobile md:-mx-margin-desktop px-margin-mobile md:px-margin-desktop block"
    >
      <div className="grid grid-cols-4 md:grid-cols-12 gap-gutter items-center">
        {/* Date */}
        <div className="col-span-4 md:col-span-2 mb-4 md:mb-0">
          <span className="text-label-mono text-secondary">{post.date}</span>
        </div>

        {/* Title + description */}
        <div className="col-span-4 md:col-span-9">
          <h3 className="text-headline-lg-mobile md:text-headline-lg text-primary group-hover:translate-x-2 transition-transform duration-300">
            {post.title}
          </h3>
          <p className="text-body-md text-secondary mt-2 group-hover:translate-x-2 transition-transform duration-300">
            {post.description}
          </p>
        </div>

        {/* Arrow */}
        <div className="hidden md:flex md:col-span-1 justify-end">
          <ArrowUpRight
            size={20}
            className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          />
        </div>
      </div>
    </Link>
  );
}
