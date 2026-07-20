import type { Metadata } from "next";
import { posts } from "@/lib/blog";
import BlogPostItem from "@/components/blog/BlogPostItem";

export const metadata: Metadata = {
  title: "Writing",
  description: "Thoughts on web development, Linux, and building things.",
};

export default function BlogPage() {
  return (
    <div className="flex-grow pt-20 pb-section-gap max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop">
      {/* Page header */}
      <header className="mb-24 pt-20 grid grid-cols-4 md:grid-cols-12 gap-gutter">
        <div className="col-span-4 md:col-span-8">
          <h1 className="text-headline-xl text-primary mb-4">Writing</h1>
          <p className="text-body-lg text-secondary max-w-lg">
            Thoughts on web development, Linux, and building things.
          </p>
        </div>
      </header>

      {/* Post list */}
      <div className="flex flex-col border-t border-border-hairline">
        {posts.map((post) => (
          <BlogPostItem key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
