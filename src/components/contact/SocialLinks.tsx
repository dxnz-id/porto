import { ArrowUpRight } from "lucide-react";
import { SOCIALS } from "@/lib/socials";
import SocialIcon from "@/components/ui/SocialIcon";

export default function SocialLinks() {
  return (
    <div>
      <h2 className="text-label-caps text-secondary uppercase tracking-widest mb-8">
        Social
      </h2>
      <ul className="flex flex-col gap-4">
        {SOCIALS.map(({ label, href, icon }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-body-lg text-primary hover:text-secondary transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <SocialIcon name={icon} className="w-[18px] h-[18px] shrink-0" />
                {label}
              </div>
              <ArrowUpRight
                size={16}
                className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
