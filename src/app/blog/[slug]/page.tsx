import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { posts, getPost, getAdjacentPosts } from "@/lib/blog";
import PostNavigation from "@/components/blog/PostNavigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

// Placeholder content per post (will be replaced with MDX later)
const placeholderContent: Record<string, string> = {
  "building-digital-library-laravel-filament": `
Building a sophisticated administrative interface doesn't have to be an exercise in tedious boilerplate. When tasked with creating a digital library system, I needed a tool that prioritized rapid development without sacrificing technical integrity. Enter Laravel Filament.

## Architecting the Database Schema

A solid foundation requires a precise schema. For a digital library, the relationship sits at Eloquent's core: books belong to authors, categories, and digital asset storage efficiently. For instance, this is handled seamlessly with Filament's powerful declarative UI to build a clean, modern, maintainable structure.

## Designing the Admin Panel

Configuring the Filament resource is where the magic happens. By defining the form and table schema declaratively, we can generate a complete CRUD interface with a few lines of code.

## Testing the Implementation

Testing is a crucial phase in the development lifecycle, ensuring that our digital library system, we focus on feature tests that simulate user interactions within the dashboard.
  `,
  "why-i-use-linux-for-development": `
After years of working on different operating systems, I made the switch to Linux as my primary development environment. Here's why I haven't looked back.

## Control and Transparency

Linux gives you complete control over your system. Unlike proprietary operating systems, you can see exactly what's running, why it's running, and how to stop it. This transparency is invaluable when debugging complex issues.

## The Terminal is a First-Class Citizen

Everything on Linux is designed to work beautifully from the command line. Package management, file operations, process management — all of it feels native and integrated.

## Performance and Resource Usage

A well-configured Linux system is remarkably lightweight. My development machine runs faster, cooler, and longer on battery than it did on any other OS.

## The Ecosystem Just Works

For web development specifically, Linux is where the tools were built. Docker, Node.js, Python, databases — everything runs natively without workarounds.
  `,
  "designing-minimal-interfaces": `
Minimal design is often misunderstood as "less work." In reality, achieving a truly minimal interface requires more thought, more iteration, and more restraint than piling on features.

## What Minimalism Actually Means

A minimal interface isn't one with few elements — it's one where every element serves a clear purpose. The challenge is knowing what to remove without sacrificing usability.

## Starting with User Goals

Before removing anything, understand what the user is trying to accomplish. Every design decision should map back to a specific user goal. If an element doesn't support a goal, it's a candidate for removal.

## Typography as Structure

In minimal design, typography does a lot of heavy lifting. Clear hierarchy through font weight, size, and spacing can replace visual clutter like borders, backgrounds, and decorative elements.

## White Space is Not Empty Space

White space guides attention, creates breathing room, and communicates relationships between elements. Treating it as wasted space is a common mistake that leads to cluttered, anxious-feeling interfaces.
  `,
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { prev, next } = getAdjacentPosts(slug);
  const content = placeholderContent[slug] ?? "";

  return (
    <div className="flex-grow max-w-[1440px] mx-auto w-full">
      <div className="px-margin-mobile md:px-margin-desktop pt-32 pb-section-gap max-w-3xl">
        {/* Back link */}
        <Link
          href="/blog"
          className="text-label-mono text-secondary hover:text-primary transition-colors flex items-center gap-2 mb-12 group"
        >
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform duration-200"
          />
          Back to Writing
        </Link>

        {/* Post header */}
        <header className="mb-16">
          <h1 className="text-headline-xl text-primary mb-6">{post.title}</h1>
          <div className="flex items-center gap-6">
            <span className="text-label-mono text-secondary">{post.date}</span>
            <span className="text-label-mono text-secondary">·</span>
            <span className="text-label-mono text-secondary">
              {post.readTime}
            </span>
          </div>
        </header>

        {/* Post content — plain text for now, MDX when content/blog/ is ready */}
        <article className="prose-custom">
          {content
            .trim()
            .split(/\n\n+/)
            .map((block, i) => {
              if (block.startsWith("## ")) {
                const id = block
                  .replace("## ", "")
                  .toLowerCase()
                  .replace(/\s+/g, "-");
                return (
                  <h2
                    key={i}
                    id={id}
                    className="text-headline-lg-mobile text-primary mt-16 mb-6 border-b border-border-hairline pb-4 scroll-mt-24"
                  >
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              return (
                <p
                  key={i}
                  className="text-body-lg text-on-surface leading-relaxed mb-6"
                >
                  {block}
                </p>
              );
            })}
        </article>
      </div>

      {/* Post navigation — full width */}
      <div className="px-margin-mobile md:px-margin-desktop">
        <PostNavigation prev={prev} next={next} />
      </div>
    </div>
  );
}
