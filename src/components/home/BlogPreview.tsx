"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { posts } from "@/lib/blog";
import SectionHeader from "@/components/ui/SectionHeader";

gsap.registerPlugin(ScrollTrigger);

export default function BlogPreview() {
  const listRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
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
        <SectionHeader label="Writing">
          <Link
            href="/blog"
            className="text-label-mono text-primary hover:text-secondary flex items-center gap-2 group transition-colors"
          >
            View all{" "}
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </SectionHeader>

        <div
          ref={listRef}
          className="flex flex-col border-t border-border-hairline"
        >
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group py-8 border-b border-border-hairline hover:bg-surface-container-low transition-colors duration-200 -mx-margin-mobile md:-mx-margin-desktop px-margin-mobile md:px-margin-desktop"
            >
              <div className="grid grid-cols-4 md:grid-cols-12 gap-gutter items-center">
                <div className="col-span-4 md:col-span-2 mb-4 md:mb-0">
                  <span className="text-label-mono text-secondary">
                    {post.date}
                  </span>
                </div>
                <div className="col-span-4 md:col-span-9">
                  <h3 className="text-headline-lg-mobile md:text-headline-lg text-primary group-hover:translate-x-2 transition-transform duration-300">
                    {post.title}
                  </h3>
                  <p className="text-body-md text-secondary mt-2 group-hover:translate-x-2 transition-transform duration-300">
                    {post.description}
                  </p>
                </div>
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
      </div>
    </section>
  );
}
