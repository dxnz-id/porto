import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TransitionLink from "@/components/transition/TransitionLink";
import { ArrowLeft } from "lucide-react";
import { posts, getPost, getAdjacentPosts } from "@/lib/blog";
import { getPostContent } from "@/lib/blog-content.server";
import PrevNextNav from "@/components/ui/PrevNextNav";
import TableOfContents from "@/components/blog/TableOfContents";
import ShareSection from "@/components/blog/ShareSection";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/blog/MdxComponents";

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

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { prev, next } = getAdjacentPosts(slug);
  const content = getPostContent(slug);

  if (!content) notFound();

  return (
    <>
      {/* TOC — fixed right, xl only */}
      <TableOfContents articleId="post-article" />

      <div className="pt-16 md:pt-20 pb-section-gap px-margin-mobile md:px-margin-desktop w-full max-w-7xl mx-auto flex justify-center">
        <article className="w-full max-w-[700px]" id="post-article">
          {/* Back link */}
          <TransitionLink
            href="/blog"
            className="text-label-mono text-secondary hover:text-primary transition-colors flex items-center gap-2 mb-12 group"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
            Back to Writing
          </TransitionLink>

          {/* Post header */}
          <header className="mb-16">
            <h1 className="text-headline-lg-mobile md:text-headline-xl text-primary mb-6">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-label-mono text-secondary border-b border-border-hairline pb-6">
              <span>{post.date}</span>
              <span className="w-1 h-1 rounded-full bg-border-hairline" />
              <span>{post.readTime}</span>
            </div>
          </header>

          {/* Post content — rendered from MDX */}
          <div className="blog-content">
            <MDXRemote source={content} components={mdxComponents} />
          </div>

          {/* Share */}
          <ShareSection title={post.title} description={post.description} />

          {/* Post navigation */}
          <PrevNextNav
            prev={prev ? { slug: prev.slug, title: prev.title } : null}
            next={next ? { slug: next.slug, title: next.title } : null}
            hrefPrefix="/blog"
          />
        </article>
      </div>
    </>
  );
}
