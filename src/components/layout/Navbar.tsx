"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import MobileMenu from "./MobileMenu";

const navLinks = [
  { href: "/", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useGSAP(() => {
    const header = document.getElementById("site-header");
    if (!header) return;

    const onScroll = () => {
      const scrolled = window.scrollY > 48;
      gsap.to(header, {
        height: scrolled ? 64 : 80,
        duration: 0.3,
        ease: "power2.out",
      });
      header.classList.toggle("backdrop-blur-lg", scrolled);
      header.classList.toggle("backdrop-blur-md", !scrolled);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  });

  const toggleMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <>
      <header
        id="site-header"
        className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 bg-surface/80 backdrop-blur-md border-b border-border-hairline transition-[height] duration-200 ease-in-out"
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-headline font-bold tracking-tighter text-primary text-[24px] md:text-[28px]"
        >
          DXNZ
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }, i) => {
            const isActive =
              href === "/"
                ? pathname === "/" || pathname.startsWith("/projects")
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={`group flex items-center gap-1.5 transition-colors duration-200 ${
                  isActive ? "text-primary" : "text-secondary hover:text-primary"
                }`}
              >
                {/* Index number */}
                <span className="text-[10px] font-mono tabular-nums leading-none opacity-50 group-hover:opacity-100 transition-opacity duration-200 mt-0.5">
                  0{i + 1}
                </span>
                <span className="text-label-caps">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile — text menu trigger */}
        <button
          className="md:hidden text-label-caps text-primary"
          onClick={toggleMenu}
          aria-label="Open menu"
        >
          Menu
        </button>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={closeMenu}
        navLinks={navLinks}
        pathname={pathname}
      />
    </>
  );
}
