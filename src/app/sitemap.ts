import type { MetadataRoute } from "next";
import { posts } from "@/lib/blog";
import projects from "@/lib/projects";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/blog", "/about", "/contact"].map((path) => ({
    url: `${SITE_URL}${path}`,
  }));

  // The Markdown test page is noindex, so it stays out of the sitemap.
  const postRoutes = posts
    .filter((post) => post.slug !== "markdown-test")
    .map((post) => ({ url: `${SITE_URL}/blog/${post.slug}` }));

  const projectRoutes = projects.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
  }));

  return [...staticRoutes, ...postRoutes, ...projectRoutes];
}
