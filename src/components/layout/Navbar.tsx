"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Menu } from "lucide-react";
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

  // GSAP: shrink navbar on scroll (h-20 → h-16, increase blur)
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
          className="text-headline-lg-mobile md:text-[32px] font-headline font-bold tracking-tighter text-primary"
        >
          DXNZ
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => {
            const isActive =
              href === "/"
                ? pathname === "/" || pathname.startsWith("/projects")
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={`text-label-caps px-2 py-1 relative group transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-secondary hover:text-primary"
                }`}
              >
                {label}
                {/* Underline — full width when active, expand on hover */}
                <span
                  className={`absolute bottom-0 left-1/2 h-0.5 bg-primary transition-all duration-300 ease-in-out -translate-x-1/2 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-primary"
          onClick={toggleMenu}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={closeMenu}
        navLinks={navLinks}
        pathname={pathname}
      />
    </>
  );
}
