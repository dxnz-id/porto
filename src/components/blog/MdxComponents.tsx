import Mermaid from "@/components/blog/Mermaid";
import CodeBlock from "@/components/blog/CodeBlock";
import TransitionLink from "@/components/transition/TransitionLink";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MdxComponentMap = Record<string, React.ComponentType<any>>;

import { isValidElement, ReactNode } from "react";

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return extractText(props.children);
  }
  return "";
}

/** Markdown images and explicit <BlogImage> both use this. Markdown has no
 *  dimensions, so unknown images get a 3:2 box to reserve space. */
function BlogImage({
  src,
  alt,
  width,
  height,
}: {
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
}) {
  if (!width || !height) {
    return (
      <span className="block relative aspect-[3/2] my-8 border border-border-hairline bg-surface-container-low">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? ""}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-contain"
        />
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ""}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className="w-full h-auto border border-border-hairline my-8"
    />
  );
}

export const mdxComponents: MdxComponentMap = {
  /**
   * rehype-pretty-code wraps code blocks in a <figure data-rehype-pretty-code-figure>
   * We intercept this figure to extract raw text and determine if it's mermaid or a normal code block.
   */
  figure: ({ children, ...props }) => {
    if ("data-rehype-pretty-code-figure" in props) {
      const rawCode = extractText(children);

      // rehype-pretty-code puts data-language on the inner <pre> element
      const child = children as React.ReactElement<{
        "data-language"?: string;
      }> | null;
      const language =
        child && typeof child === "object" && "props" in child
          ? child.props?.["data-language"]
          : undefined;

      if (language === "mermaid") {
        return <Mermaid chart={rawCode} />;
      }

      return (
        <CodeBlock rawText={rawCode}>
          <figure {...props}>{children}</figure>
        </CodeBlock>
      );
    }
    return <figure {...props}>{children}</figure>;
  },

  code: ({ children, ...props }) => {
    // rehype-pretty-code adds data-language or data-theme to the <code> block inside the <pre>
    if ("data-language" in props || "data-theme" in props) {
      return <code {...props}>{children}</code>;
    }
    // Inline code styling
    return (
      <code className="font-mono text-[14px] px-1.5 py-0.5 bg-surface-container-low border border-border-hairline text-primary rounded-sm" {...props}>
        {children}
      </code>
    );
  },

  h1: ({ children, ...props }) => (
    <h1
      className="text-headline-lg-mobile md:text-headline-xl text-primary mt-12 mb-6 scroll-mt-24"
      {...props}
    >
      {children}
    </h1>
  ),

  h2: ({ children, ...props }) => (
    <h2
      className="text-headline-lg-mobile text-primary mt-16 mb-6 border-b border-border-hairline pb-4 scroll-mt-24"
      {...props}
    >
      {children}
    </h2>
  ),

  h3: ({ children, ...props }) => (
    <h3
      className="text-body-lg font-semibold text-primary mt-10 mb-4 scroll-mt-24"
      {...props}
    >
      {children}
    </h3>
  ),

  h4: ({ children, ...props }) => (
    <h4
      className="text-body-lg font-semibold text-primary mt-8 mb-3 scroll-mt-24"
      {...props}
    >
      {children}
    </h4>
  ),

  h5: ({ children, ...props }) => (
    <h5
      className="text-body-md font-semibold text-primary mt-6 mb-2 scroll-mt-24"
      {...props}
    >
      {children}
    </h5>
  ),

  h6: ({ children, ...props }) => (
    <h6
      className="text-label-caps text-secondary mt-6 mb-2 scroll-mt-24"
      {...props}
    >
      {children}
    </h6>
  ),

  p: ({ children, ...props }) => (
    <p className="text-body-lg text-on-surface leading-relaxed mb-6" {...props}>
      {children}
    </p>
  ),

  a: ({ children, href, title, ...props }) => {
    const className =
      "text-primary underline decoration-border-hairline hover:decoration-primary transition-colors";

    if (href?.startsWith("/")) {
      return (
        <TransitionLink href={href} title={title} className={className}>
          {children}
        </TransitionLink>
      );
    }

    return (
      <a
        href={href}
        title={title}
        className={className}
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },

  blockquote: ({ children, ...props }) => (
    <blockquote
      className="pl-6 border-l-2 border-primary italic text-secondary my-8"
      {...props}
    >
      {children}
    </blockquote>
  ),

  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-8">
      <table
        className="w-full border-collapse border border-border-hairline text-body-md"
        {...props}
      >
        {children}
      </table>
    </div>
  ),

  th: ({ children, ...props }) => (
    <th
      className="bg-surface-container-low text-label-caps text-secondary p-4 border border-border-hairline"
      {...props}
    >
      {children}
    </th>
  ),

  td: ({ children, ...props }) => (
    <td
      className="p-4 border border-border-hairline text-on-surface"
      {...props}
    >
      {children}
    </td>
  ),

  ul: ({ children, ...props }) => (
    <ul
      className="list-none flex flex-col gap-4 my-6 pl-4 border-l border-border-hairline ml-1"
      {...props}
    >
      {children}
    </ul>
  ),

  ol: ({ children, ...props }) => (
    <ol
      className="list-decimal list-outside flex flex-col gap-4 my-6 pl-6 text-body-lg text-on-surface"
      {...props}
    >
      {children}
    </ol>
  ),

  li: ({ children, ...props }) => (
    <li className="text-body-md text-on-surface" {...props}>
      {children}
    </li>
  ),

  hr: (props) => <hr className="border-border-hairline my-12" {...props} />,

  img: BlogImage,
  BlogImage,
};
