"use client";

import { useRef } from "react";
import TransitionLink from "@/components/transition/TransitionLink";
import { ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { posts } from "@/lib/blog";
import SectionHeader from "@/components/ui/SectionHeader";
import BlogPostItem from "@/components/blog/BlogPostItem";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export default function BlogPreview() {
  const listRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const items = listRef.current?.children;
      if (!items?.length) return;

      gsap.fromTo(
        items,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power4.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 88%",
            once: true,
          },
        },
      );
    },
    { scope: listRef },
  );

  return (
    <section id="blog" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
        <SectionHeader label="Writing" className="mb-0">
          <TransitionLink
            href="/blog"
            className="text-label-mono text-primary hover:text-secondary flex items-center gap-2 group transition-colors"
          >
            View all{" "}
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </TransitionLink>
        </SectionHeader>

        <div
          ref={listRef}
          className="flex flex-col"
        >
          {posts.map((post) => (
            <BlogPostItem key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
