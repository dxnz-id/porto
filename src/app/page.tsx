import HeroSection from "@/components/home/HeroSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import AboutPreview from "@/components/home/AboutPreview";
import BlogPreview from "@/components/home/BlogPreview";
import SectionReveal from "@/components/ui/SectionReveal";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SectionReveal>
        <ProjectsSection />
      </SectionReveal>
      {/* AboutPreview has its own GSAP ScrollTrigger internally */}
      <AboutPreview />
      <SectionReveal>
        <BlogPreview />
      </SectionReveal>
    </>
  );
}
