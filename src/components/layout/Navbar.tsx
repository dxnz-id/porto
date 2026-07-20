"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
        className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 bg-surface/80 backdrop-blur-lg border-b border-border-hairline"
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
          {navLinks.map(({ href, label }) => {
            const isActive =
              href === "/"
                ? pathname === "/" || pathname.startsWith("/projects")
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={`text-label-caps transition-colors duration-200 ${
                  isActive
                    ? "text-primary"
                    : "text-secondary hover:text-primary"
                }`}
              >
                {label}
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
