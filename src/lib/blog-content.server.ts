/**
 * server-only: reads MDX files from disk.
 * NEVER import this from a Client Component.
 */
import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "src/content/blog");

/** Returns the raw MDX body for a slug, or null if the file doesn't exist. */
export function getPostContent(slug: string): string | null {
  for (const ext of [".mdx", ".md"]) {
    const filePath = path.join(CONTENT_DIR, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf-8");
    }
  }
  return null;
}
