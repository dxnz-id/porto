import projects from "@/lib/projects";
import ProjectCard from "./ProjectCard";

export default function ProjectsSection() {
  return (
    <section
      id="work"
      className="py-section-gap border-b border-border-hairline"
    >
      {/* Section label */}
      <div className="px-margin-mobile md:px-margin-desktop mb-12">
        <h2 className="text-label-caps text-secondary uppercase tracking-widest border-b border-border-hairline pb-4">
          Projects
        </h2>
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
