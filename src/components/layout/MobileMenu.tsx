"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

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

  useGSAP(
    () => {
      if (!overlayRef.current || !linksRef.current) return;

      const links = linksRef.current.querySelectorAll("a");

      if (isOpen) {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }
        );
        gsap.fromTo(
          links,
          { opacity: 0, x: -16 },
          {
            opacity: 1,
            x: 0,
            duration: 0.35,
            ease: "power2.out",
            stagger: 0.07,
            delay: 0.1,
          }
        );
        if (footerRef.current) {
          gsap.fromTo(
            footerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, delay: 0.4 }
          );
        }
      }
    },
    { dependencies: [isOpen] }
  );

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] bg-surface flex flex-col"
    >
      {/* Header — matches navbar */}
      <div className="flex justify-between items-center px-margin-mobile h-20 border-b border-border-hairline shrink-0">
        <Link
          href="/"
          onClick={onClose}
          className="font-headline font-bold tracking-tighter text-primary text-[24px]"
        >
          DXNZ
        </Link>
        <button
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
            <Link
              key={href}
              href={href}
              onClick={onClose}
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
            </Link>
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
