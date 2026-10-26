import TransitionLink from "@/components/transition/TransitionLink";
import { Mail } from "lucide-react";
import { EMAIL, SOCIALS } from "@/lib/socials";
import SocialIcon from "@/components/ui/SocialIcon";

export default function Footer() {
  return (
    <footer className="w-full px-margin-mobile md:px-margin-desktop border-t border-border-hairline bg-surface py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        {/* Logo + Copyright */}
        <div className="flex flex-col gap-2">
          <TransitionLink
            href="/"
            className="font-headline text-[24px] text-primary font-bold tracking-tighter"
          >
            DXNZ
          </TransitionLink>
          <p className="text-label-mono text-[12px] text-secondary">
            © {new Date().getFullYear()} DXNZ. All rights reserved.
          </p>
        </div>

        {/* Social Links */}
        <nav className="flex flex-col md:flex-row gap-6 md:gap-8">
          <a
            href={`mailto:${EMAIL}`}
            className="text-secondary text-label-mono hover:text-primary transition-colors duration-150 ease-linear flex items-center gap-2"
          >
            <Mail size={18} />
            {EMAIL}
          </a>
          {SOCIALS.map(({ label, handle, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary text-label-mono hover:text-primary transition-colors duration-150 ease-linear flex items-center gap-2"
            >
              <SocialIcon name={icon} />
              {handle.replace(/^@/, "")}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
