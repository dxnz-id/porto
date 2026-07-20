import type { Project } from "@/lib/projects";

interface ProjectMetadataProps {
  techStack: Project["techStack"];
  metadata: Project["metadata"];
}

export default function ProjectMetadata({
  techStack,
  metadata,
}: ProjectMetadataProps) {
  const metaItems = [
    { label: "ROLE", value: metadata.role },
    { label: "FOCUS", value: metadata.focus },
    { label: "SHIPPED", value: metadata.shipped },
    { label: "STACK", value: metadata.stackCount },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-border-hairline pt-12">
      {/* Left: Built With */}
      <div className="flex flex-col gap-6">
        <h2 className="text-label-caps text-secondary tracking-widest">
          BUILT WITH
        </h2>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 border border-border-hairline text-label-mono text-primary bg-bg-off-white"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Right: Metadata grid */}
      <div className="flex flex-col md:flex-row gap-12">
        {/* Vertical divider desktop */}
        <div className="hidden md:block w-px bg-border-hairline h-full" />
        <div className="grid grid-cols-2 gap-x-12 gap-y-8 flex-grow">
          {metaItems.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-label-caps text-secondary">{label}</span>
              <span className="text-body-md text-primary font-semibold">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
