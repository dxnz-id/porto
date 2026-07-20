import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import projects from "@/lib/projects";
import ProjectGallery from "@/components/projects/ProjectGallery";
import ProjectMetadata from "@/components/projects/ProjectMetadata";
import KeyFeatures from "@/components/projects/KeyFeatures";
import ProjectNavigation from "@/components/projects/ProjectNavigation";
import SectionReveal from "@/components/ui/SectionReveal";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.description,
  };
}

function getAdjacentProjects(slug: string) {
  const idx = projects.findIndex((p) => p.slug === slug);
  return {
    prev: idx < projects.length - 1 ? projects[idx + 1] : null,
    next: idx > 0 ? projects[idx - 1] : null,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const { prev, next } = getAdjacentProjects(slug);

  return (
    <div className="flex-grow w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop pt-16 md:pt-20 pb-section-gap">
      {/* Back link */}
      <Link
        href="/#work"
        className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors text-label-mono mb-10 group"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform duration-200"
        />
        Back to Work
      </Link>

      {/* Main content */}
      <div className="flex flex-col gap-section-gap">
        {/* Header */}
        <header className="flex flex-col gap-6">
          <p className="text-label-caps text-secondary">Project</p>
          <h1 className="text-headline-lg-mobile md:text-headline-xl text-primary max-w-4xl">
            {project.name}
          </h1>
          <p className="text-body-lg text-secondary max-w-2xl">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 border border-border-hairline text-label-mono text-primary bg-bg-off-white"
              >
                {tag}
              </span>
            ))}
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 border border-border-hairline text-label-mono text-primary bg-bg-off-white"
              >
                {tech}
              </span>
            ))}
          </div>
        </header>

        {/* Gallery */}
        <SectionReveal>
          <ProjectGallery images={project.images} />
        </SectionReveal>

        {/* Metadata */}
        <SectionReveal>
          <ProjectMetadata
            techStack={project.techStack}
            metadata={project.metadata}
          />
        </SectionReveal>

        {/* Key Features */}
        <SectionReveal>
          <KeyFeatures features={project.features} />
        </SectionReveal>
      </div>

      {/* Project navigation */}
      <SectionReveal>
        <ProjectNavigation prev={prev} next={next} />
      </SectionReveal>
    </div>
  );
}
