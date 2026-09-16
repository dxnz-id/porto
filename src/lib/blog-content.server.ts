/**
 * server-only: reads MDX files from disk using gray-matter.
 * NEVER import this from a Client Component.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "src/content/blog");

/**
 * Returns the raw MDX body (without frontmatter) for a given slug.
 * Returns null if the file doesn't exist.
 */
export function getPostContent(slug: string): string | null {
  for (const ext of [".mdx", ".md"]) {
    const filePath = path.join(CONTENT_DIR, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const { content } = matter(raw);
      return content;
    }
  }
  return null;
}
