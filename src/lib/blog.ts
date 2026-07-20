export interface BlogPost {
  slug: string;
  date: string;
  title: string;
  description: string;
  readTime: string;
}

export const posts: BlogPost[] = [
  {
    slug: "building-digital-library-laravel-filament",
    date: "01.12.24",
    title: "Building a Digital Library with Laravel Filament",
    description:
      "Notes on building an admin-friendly library management system with Laravel and Filament.",
    readTime: "5 MIN READ",
  },
  {
    slug: "why-i-use-linux-for-development",
    date: "11.28.23",
    title: "Why I Use Linux for Development",
    description:
      "A few reasons Linux has become my daily driver for coding and self-hosting.",
    readTime: "4 MIN READ",
  },
  {
    slug: "designing-minimal-interfaces",
    date: "10.15.23",
    title: "Designing Minimal Interfaces That Stay Practical",
    description: "Thoughts on keeping UI simple without sacrificing usability.",
    readTime: "3 MIN READ",
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAdjacentPosts(
  slug: string
): { prev: BlogPost | null; next: BlogPost | null } {
  const idx = posts.findIndex((p) => p.slug === slug);
  return {
    prev: idx < posts.length - 1 ? posts[idx + 1] : null,
    next: idx > 0 ? posts[idx - 1] : null,
  };
}
