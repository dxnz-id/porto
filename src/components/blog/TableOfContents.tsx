"use client";

import { useEffect, useRef, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

export default function TableOfContents({
  articleId,
}: {
  articleId: string;
}) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Parse headings from the article on mount
  useEffect(() => {
    const article = document.getElementById(articleId);
    if (!article) return;

    const nodes = article.querySelectorAll<HTMLHeadingElement>("h2, h3");
    const parsed: Heading[] = [];

    nodes.forEach((node) => {
      if (!node.id) return;
      parsed.push({
        id: node.id,
        text: node.textContent ?? "",
        level: node.tagName === "H2" ? 2 : 3,
      });
    });

    setHeadings(parsed);
  }, [articleId]);

  // IntersectionObserver to track active heading
  useEffect(() => {
    if (!headings.length) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the first intersecting heading
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0,
      }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [headings]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  };

  if (!headings.length) return null;

  return (
    <nav
      className="hidden xl:flex fixed top-1/2 -translate-y-1/2 right-0 z-40 w-[240px] justify-end pr-8 group"
      aria-label="Table of contents"
    >
      <div className="flex flex-col gap-[5px] items-end w-full">
        {headings.map(({ id, text, level }) => {
          const isActive = activeId === id;
          const barWidth = level === 2 ? 16 : 10;

          return (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className="flex items-center gap-3 group/item cursor-pointer"
              title={text}
            >
              {/* Label — visible on group hover */}
              <span
                className={`text-[11px] leading-none font-mono tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                  isActive ? "text-primary" : "text-secondary"
                }`}
              >
                {text.length > 28 ? text.slice(0, 28) + "…" : text}
              </span>

              {/* Bar indicator */}
              <div
                style={{ width: barWidth }}
                className={`h-0.5 transition-all duration-200 rounded-full ${
                  isActive
                    ? "bg-primary opacity-100"
                    : "bg-secondary/40 group-hover/item:bg-secondary opacity-60"
                }`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
