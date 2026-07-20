import projects from "@/lib/projects";
import ProjectCard from "./ProjectCard";

export default function ProjectsSection() {
  return (
    <section
      id="work"
      className="py-16 md:py-24 border-b border-border-hairline"
    >
      {/* Section header */}
      <div className="px-margin-mobile md:px-margin-desktop mb-12">
        <p className="text-label-caps text-secondary mb-2">Selected Work</p>
        <div className="border-b border-border-hairline" />
      </div>

      {/* 2-col grid — no outer padding, cards have own padding */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            isLast={i === projects.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
