export interface BlogPost {
  slug: string;
  date: string;
  title: string;
  description: string;
  readTime: string;
  noindex?: boolean;
}

// Static list — source of truth for slugs, metadata used in client components
export const posts: BlogPost[] = [
  {
    slug: "markdown-test",
    date: "10.25.26",
    title: "Markdown Test Page",
    description:
      "Every Markdown, MDX, math, and diagram case this blog renders, in one page.",
    readTime: "12 MIN READ",
    noindex: true,
  },
  {
    slug: "second-post",
    date: "10.24.26",
    title: "Second Post",
    description:
      "A short second entry so the blog index and prev/next navigation have both ends to test.",
    readTime: "1 MIN READ",
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAdjacentPosts(
  slug: string
): { prev: BlogPost | null; next: BlogPost | null } {
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx < posts.length - 1 ? posts[idx + 1] : null,
    next: idx > 0 ? posts[idx - 1] : null,
  };
}
