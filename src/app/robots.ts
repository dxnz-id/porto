import type { MetadataRoute } from "next";
import { posts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: posts
        .filter((post) => post.noindex)
        .map((post) => `/blog/${post.slug}`),
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
