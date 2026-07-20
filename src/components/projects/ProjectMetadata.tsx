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
    { label: "Role", value: metadata.role },
    { label: "Focus", value: metadata.focus },
    { label: "Shipped", value: metadata.shipped },
    { label: "Stack", value: metadata.stackCount },
  ];

  return (
    <section>
      <div className="mb-10">
        <p className="text-label-caps text-secondary mb-2">Built With</p>
        <div className="border-b border-border-hairline" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Tech stack tags */}
        <div className="flex flex-wrap gap-2 content-start">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 border border-border-hairline text-label-mono text-primary bg-bg-off-white"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Right: Meta grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-8">
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
