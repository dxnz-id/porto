"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BlogPostItem from "@/components/blog/BlogPostItem";
import type { BlogPost } from "@/lib/blog";

gsap.registerPlugin(ScrollTrigger);

interface BlogContentProps {
  posts: BlogPost[];
}

export default function BlogContent({ posts }: BlogContentProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const lines = headerRef.current?.querySelectorAll("[data-h-line]");
      const extras = headerRef.current?.querySelectorAll("[data-h-extra]");
      const items = listRef.current?.children;

      if (!lines?.length) return;

      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
      });

      tl.fromTo(
        lines,
        { y: "108%" },
        { y: "0%", duration: 0.7, stagger: 0.1 },
      );

      if (extras?.length) {
        tl.fromTo(
          extras,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.06 },
          "-=0.3",
        );
      }

      if (items?.length) {
        tl.fromTo(
          items,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            scrollTrigger: {
              trigger: listRef.current,
              start: "top 88%",
              once: true,
            },
          },
          "-=0.1",
        );
      }
    },
    { scope: headerRef },
  );

  return (
    <div className="flex-grow pt-16 md:pt-20 pb-section-gap px-margin-mobile md:px-margin-desktop w-full max-w-7xl mx-auto">
      <div ref={headerRef}>
        <header className="mb-16 md:mb-20">
          <div className="overflow-hidden mb-3">
            <p data-h-line className="text-label-caps text-secondary">
              Blog
            </p>
          </div>
          <div className="overflow-hidden mb-4">
            <h1
              data-h-line
              className="text-headline-lg-mobile md:text-headline-xl text-primary"
            >
              Notes and <span className="text-secondary">thoughts.</span>
            </h1>
          </div>
          <div className="overflow-hidden">
            <p data-h-extra className="text-body-lg text-secondary max-w-xl">
              Notes on web development, Linux, and the occasional deep dive.
            </p>
          </div>
        </header>

        <div
          ref={listRef}
          className="flex flex-col border-t border-border-hairline"
        >
          {posts.map((post) => (
            <BlogPostItem key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
