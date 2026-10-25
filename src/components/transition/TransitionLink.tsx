"use client";

import Link from "next/link";
import { useTransitionContext } from "./TransitionProvider";

interface TransitionLinkProps {
  href: string;
  className?: string;
  title?: string;
  children: React.ReactNode;
  /** Called before the transition starts (e.g. close the mobile menu). */
  onNavigate?: () => void;
}

/** Drop-in replacement for internal next/link with a photo grid transition. */
export default function TransitionLink({
  href,
  className,
  title,
  children,
  onNavigate,
}: TransitionLinkProps) {
  const { go } = useTransitionContext();

  return (
    <Link
      href={href}
      className={className}
      title={title}
      onClick={(e) => {
        if (
          e.defaultPrevented ||
          e.button !== 0 ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey
        ) {
          return;
        }
        e.preventDefault();
        onNavigate?.();
        void go(href);
      }}
    >
      {children}
    </Link>
  );
}
