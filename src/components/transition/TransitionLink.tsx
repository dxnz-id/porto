"use client";

import Link from "next/link";
import { useTransition } from "./TransitionProvider";

interface TransitionLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  /** Called before the transition starts (e.g. close the mobile menu). */
  onNavigate?: () => void;
}

/** Drop-in replacement for internal next/link with a photo grid transition. */
export default function TransitionLink({
  href,
  className,
  children,
  onNavigate,
}: TransitionLinkProps) {
  const { go } = useTransition();

  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onNavigate?.();
        void go(href);
      }}
    >
      {children}
    </Link>
  );
}
