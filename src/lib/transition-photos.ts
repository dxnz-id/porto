import { readdirSync } from "node:fs";
import { join } from "node:path";

const TRANSITIONS_DIR = join(process.cwd(), "public/images/transitions");
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

/**
 * Server-only: scan public/images/transitions at build/request time.
 * Never import this from a client component — pass the result as a prop.
 */
export function getTransitionPhotos(): string[] {
  try {
    return readdirSync(TRANSITIONS_DIR)
      .filter((file) => {
        const dot = file.lastIndexOf(".");
        if (dot < 0) return false;
        return EXTENSIONS.has(file.slice(dot).toLowerCase());
      })
      .sort()
      .map((file) => `/images/transitions/${file}`);
  } catch {
    return [];
  }
}
