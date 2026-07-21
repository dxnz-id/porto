import { ExternalLink } from "lucide-react";

interface ProjectLink {
  label: string;
  href: string;
}

interface ProjectLinksProps {
  links: ProjectLink[];
}

export default function ProjectLinks({ links }: ProjectLinksProps) {
  if (!links || links.length === 0) return null;

  return (
    <div>
      <div className="mb-10">
        <p className="text-label-caps text-secondary mb-2">See it live</p>
        <div className="border-b border-border-hairline" />
      </div>
      <div className="flex flex-wrap gap-3">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border border-border-hairline text-label-mono text-primary bg-bg-off-white hover:bg-border-hairline transition-colors"
          >
            <ExternalLink size={14} />
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
