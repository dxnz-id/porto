import type { Metadata } from "next";
import { posts } from "@/lib/blog";
import BlogContent from "@/components/blog/BlogContent";

export const metadata: Metadata = {
  title: "Writing",
  description: "Thoughts on web development, Linux, and building things.",
};

export default function BlogPage() {
  return <BlogContent posts={posts} />;
}
