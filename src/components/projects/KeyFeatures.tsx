import type { Project } from "@/lib/projects";

interface KeyFeaturesProps {
  features: Project["features"];
}

export default function KeyFeatures({ features }: KeyFeaturesProps) {
  return (
    <section className="border-t border-border-hairline pt-12 flex flex-col gap-8">
      <h2 className="text-headline-lg-mobile md:text-headline-lg text-primary">
        Key Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {features.map(({ title, description }) => (
          <div
            key={title}
            className="border-t border-border-hairline pt-6 flex flex-col gap-2"
          >
            <h4 className="text-label-mono font-bold text-primary">{title}</h4>
            <p className="text-body-md text-secondary">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
