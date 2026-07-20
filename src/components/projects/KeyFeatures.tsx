import type { Project } from "@/lib/projects";

interface KeyFeaturesProps {
  features: Project["features"];
}

export default function KeyFeatures({ features }: KeyFeaturesProps) {
  return (
    <section>
      <div className="mb-10">
        <p className="text-label-caps text-secondary mb-2">Key Features</p>
        <div className="border-b border-border-hairline" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {features.map(({ title, description }) => (
          <div
            key={title}
            className="border-t border-border-hairline pt-6 flex flex-col gap-2"
          >
            <h3 className="text-label-mono font-bold text-primary">{title}</h3>
            <p className="text-body-md text-secondary">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
