"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { X } from "lucide-react";

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

  useGSAP(
    () => {
      if (!overlayRef.current || !linksRef.current) return;

      const links = linksRef.current.querySelectorAll("a");

      if (isOpen) {
        // Animate in
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power2.out" }
        );
        gsap.fromTo(
          links,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.08,
            delay: 0.15,
          }
        );
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
      {/* Header row — matches navbar layout */}
      <div className="flex justify-between items-center px-margin-mobile h-20 border-b border-border-hairline">
        <Link
          href="/"
          onClick={onClose}
          className="text-headline-lg-mobile font-headline font-bold tracking-tighter text-primary"
        >
          DXNZ
        </Link>
        <button
          onClick={onClose}
          className="p-2 text-primary"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>

      {/* Nav links */}
      <div ref={linksRef} className="flex flex-col gap-2 px-margin-mobile pt-12">
        {navLinks.map(({ href, label }) => {
          const isActive =
            href === "/"
              ? pathname === "/" || pathname.startsWith("/projects")
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`text-headline-xl py-4 border-b border-border-hairline transition-colors ${
                isActive ? "text-primary" : "text-secondary hover:text-primary"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
