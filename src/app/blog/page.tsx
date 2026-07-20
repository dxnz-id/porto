import type { Metadata } from "next";
import { posts } from "@/lib/blog";
import BlogPostItem from "@/components/blog/BlogPostItem";
import SectionReveal from "@/components/ui/SectionReveal";

export const metadata: Metadata = {
  title: "Writing",
  description: "Thoughts on web development, Linux, and building things.",
};

export default function BlogPage() {
  return (
    <div className="flex-grow pt-16 md:pt-20 pb-section-gap px-margin-mobile md:px-margin-desktop w-full max-w-7xl mx-auto">
      {/* Page header */}
      <header className="mb-16 md:mb-20">
        <p className="text-label-caps text-secondary mb-3">Blog</p>
        <h1 className="text-headline-lg-mobile md:text-headline-xl text-primary mb-4">
          Notes and <span className="text-secondary">thoughts.</span>
        </h1>
        <p className="text-body-lg text-secondary max-w-xl">
          Notes on web development, Linux, and the occasional deep dive.
        </p>
      </header>

      {/* Post list */}
      <SectionReveal>
        <div className="flex flex-col border-t border-border-hairline">
          {posts.map((post) => (
            <BlogPostItem key={post.slug} post={post} />
          ))}
        </div>
      </SectionReveal>
    </div>
  );
}
