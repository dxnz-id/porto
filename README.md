# DXNZ Portfolio

Personal portfolio and blog for Zidan (dxnz.id), built with Next.js 16 (App Router), React 19, Tailwind CSS 4, GSAP, and MDX.

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build (all pages prerendered) |
| `pnpm start` | Serve the production build |
| `pnpm typecheck` | TypeScript check |
| `pnpm lint` | ESLint |
| `pnpm test` | Unit tests for pure helpers (`node:test`) |

## Layout

- `src/app` — routes: home, `/blog`, `/blog/[slug]`, `/about`, `/contact`, `/projects/[slug]`
- `src/components` — UI grouped by feature
- `src/lib` — data and helpers; `blog.ts` and `projects.ts` are the metadata sources
- `src/content/blog` — MDX post bodies, no frontmatter
- `public/images` — profile and transition photos

## Content

Posts are listed in `src/lib/blog.ts`; the matching body lives at
`src/content/blog/<slug>.mdx`. Add both to publish a post. Metadata is not
read from the MDX file.

`/blog/markdown-test` is an intentional test bed for the Markdown/MDX
pipeline. It is marked `noindex` and left out of the sitemap.

## Environment

`NEXT_PUBLIC_SITE_URL` overrides the canonical site URL used by metadata,
`sitemap.xml`, and `robots.txt`. Default: `https://dxnz.id`.
