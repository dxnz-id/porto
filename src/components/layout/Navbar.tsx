"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import MobileMenu from "./MobileMenu";
import TransitionLink from "@/components/transition/TransitionLink";

const navLinks = [
  { href: "/", label: "Index" },
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

  // Ensure menu closes when route changes (e.g. after a page transition finishes)
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const menuBtnRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    if (!menuBtnRef.current) return;
    if (mobileMenuOpen) {
      // Menu opens, animate "Menu" text out
      gsap.to(menuBtnRef.current, {
        opacity: 0,
        y: -8,
        duration: 0.2,
        ease: "power1.inOut",
      });
    } else {
      // Menu closes (or initial load), animate "Menu" text in
      gsap.fromTo(
        menuBtnRef.current,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.3, delay: 0.1, ease: "power1.out" }
      );
    }
  }, { dependencies: [mobileMenuOpen] });

  return (
    <>
      <header
        id="site-header"
        className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 bg-surface/80 backdrop-blur-lg border-b border-border-hairline"
      >
        {/* Logo */}
        <TransitionLink
          href="/"
          className="font-headline font-bold tracking-tighter text-primary text-[24px] md:text-[28px]"
        >
          DXNZ
        </TransitionLink>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center h-full">
          {navLinks.map(({ href, label }) => {
            const isActive =
              href === "/"
                ? pathname === "/" || pathname.startsWith("/projects")
                : pathname.startsWith(href);

            return (
              <TransitionLink
                key={href}
                href={href}
                className={`flex items-center h-full px-3 text-label-caps transition-colors duration-200 ${
                  isActive
                    ? "text-primary"
                    : "text-secondary hover:text-primary"
                }`}
              >
                {label}
              </TransitionLink>
            );
          })}
        </nav>

        {/* Mobile — text menu trigger */}
        <button
          ref={menuBtnRef}
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
