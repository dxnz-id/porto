"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import TransitionLink from "@/components/transition/TransitionLink";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: readonly { href: string; label: string }[];
  pathname: string;
}

export default function MobileMenu({
  isOpen,
  onClose,
  navLinks,
  pathname,
}: MobileMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);

  useGSAP(
    () => {
      if (!overlayRef.current || !linksRef.current || !closeBtnRef.current) return;

      const links = linksRef.current.querySelectorAll("a");

      if (isOpen) {
        // Fade in background without moving the whole container
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power1.out" }
        );

        // Animate the "Close" text
        gsap.fromTo(
          closeBtnRef.current,
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power1.out", delay: 0.05 }
        );

        // Stagger the links
        gsap.fromTo(
          links,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power1.out",
            stagger: 0.07,
            delay: 0.1,
          }
        );

        // Fade in footer
        if (footerRef.current) {
          gsap.fromTo(
            footerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, delay: 0.3 }
          );
        }
      } else if (shouldRender) {
        // Animate out
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut",
          onComplete: () => setShouldRender(false),
        });
        gsap.to(links, {
          opacity: 0,
          y: -8,
          duration: 0.2,
          ease: "power2.inOut",
          stagger: 0.03,
        });
        gsap.to([closeBtnRef.current, footerRef.current], {
          opacity: 0,
          duration: 0.2,
          ease: "power2.inOut",
        });
      }
    },
    { dependencies: [isOpen, shouldRender] }
  );

  if (!shouldRender) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] bg-surface flex flex-col"
    >
      {/* Header — matches navbar */}
      <div className="flex justify-between items-center px-margin-mobile h-20 border-b border-border-hairline shrink-0">
        <TransitionLink
          href="/"
          className="font-headline font-bold tracking-tighter text-primary text-[24px]"
        >
          DXNZ
        </TransitionLink>
        <button
          ref={closeBtnRef}
          onClick={onClose}
          className="text-label-caps text-primary"
          aria-label="Close menu"
        >
          Close
        </button>
      </div>

      {/* Nav links — numbered, large, left-aligned */}
      <div
        ref={linksRef}
        className="flex flex-col justify-center flex-grow px-margin-mobile"
      >
        {navLinks.map(({ href, label }, i) => {
          const isActive =
            href === "/"
              ? pathname === "/" || pathname.startsWith("/projects")
              : pathname.startsWith(href);

          return (
            <TransitionLink
              key={href}
              href={href}
              className={`group flex items-baseline gap-4 py-5 border-b border-border-hairline transition-colors duration-200 ${
                isActive ? "text-primary" : "text-secondary"
              }`}
            >
              {/* Index */}
              <span className="text-[11px] font-mono tabular-nums text-secondary w-6 shrink-0">
                0{i + 1}
              </span>
              {/* Label */}
              <span
                className={`text-headline-lg-mobile tracking-tight transition-transform duration-300 ${
                  isActive ? "" : "group-hover:translate-x-1"
                }`}
              >
                {label}
              </span>
            </TransitionLink>
          );
        })}
      </div>

      {/* Footer info */}
      <div
        ref={footerRef}
        className="px-margin-mobile pb-8 pt-6 flex justify-between items-end shrink-0"
      >
        <div className="flex flex-col gap-1">
          <span className="text-label-caps text-secondary">Based in</span>
          <span className="text-body-md text-primary">Central Java, ID</span>
        </div>
        <span className="text-label-caps text-secondary">GMT+7</span>
      </div>
    </div>
  );
}
