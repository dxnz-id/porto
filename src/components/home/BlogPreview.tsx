import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { posts } from "@/lib/blog";

export default function BlogPreview() {
  return (
    <section
      id="blog"
      className="px-margin-mobile md:px-margin-desktop pt-section-gap pb-8"
    >
      {/* Section header */}
      <div className="flex justify-between items-end mb-12 border-b border-border-hairline pb-4">
        <h2 className="text-label-caps text-secondary uppercase tracking-widest">
          Writing
        </h2>
        <Link
          href="/blog"
          className="text-label-mono text-primary hover:text-secondary flex items-center gap-2 group transition-colors"
        >
          View all posts{" "}
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform duration-200"
          />
        </Link>
      </div>

      {/* Post list */}
      <div className="flex flex-col border-t border-border-hairline">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group py-8 border-b border-border-hairline hover:bg-surface-container-low transition-colors duration-200 -mx-margin-mobile md:-mx-margin-desktop px-margin-mobile md:px-margin-desktop"
          >
            <div className="grid grid-cols-4 md:grid-cols-12 gap-gutter items-center">
              {/* Date */}
              <div className="col-span-4 md:col-span-2 mb-4 md:mb-0">
                <span className="text-label-mono text-secondary">
                  {post.date}
                </span>
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

              {/* Arrow icon */}
              <div className="hidden md:flex md:col-span-1 justify-end">
                <ArrowUpRight
                  size={20}
                  className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
