import Mermaid from "@/components/blog/Mermaid";
import CodeBlock from "@/components/blog/CodeBlock";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MdxComponentMap = Record<string, React.ComponentType<any>>;

export const mdxComponents: MdxComponentMap = {
  /**
   * `pre` receives props directly from MDX AST — at this point `children`
   * is a React element whose `type` is the *string* "code" (the raw HTML tag),
   * NOT our custom `code` component, because MDX composes component
   * substitutions bottom-up.  The `className` from the fenced-code info
   * string (e.g. `language-mermaid`) is passed directly on the `<code>` node.
   *
   * Strategy: inspect `children.props.className` before returning.
   * If it contains "language-mermaid", delegate to <Mermaid>.
   */
  pre: (props) => {
    // props.children is the raw React element for the inner <code>
    const child = props.children as React.ReactElement<{
      className?: string;
      children?: string;
    }> | null;

    const className =
      child && typeof child === "object" && "props" in child
        ? (child.props?.className ?? "")
        : "";

    const rawText =
      child && typeof child === "object" && "props" in child
        ? (child.props?.children ?? "")
        : "";

    const rawCode = typeof rawText === "string" ? rawText : "";
    
    if (className.includes("language-mermaid")) {
      return <Mermaid chart={rawCode} />;
    }

    return <CodeBlock rawText={rawCode}>{props.children}</CodeBlock>;
  },

  /**
   * `code` handles inline code.  When inside a <pre>, MDX doesn't call this
   * for fenced code blocks that have been intercepted by our `pre` component.
   * This only fires for inline `code` spans.
   */
  code: ({ children, className }) => {
    // Fenced blocks have className like "language-xxx" — don't apply
    // inline styling to them (though in practice pre intercepts first).
    if (className?.startsWith("language-")) {
      return <code className={className}>{children}</code>;
    }
    return (
      <code className="font-mono text-[14px] px-1.5 py-0.5 bg-surface-container-low border border-border-hairline text-primary">
        {children}
      </code>
    );
  },

  h2: ({ children, ...props }) => {
    const id = children
      ?.toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
    return (
      <h2
        id={id}
        className="text-headline-lg-mobile text-primary mt-16 mb-6 border-b border-border-hairline pb-4 scroll-mt-24"
        {...props}
      >
        {children}
      </h2>
    );
  },

  h3: ({ children, ...props }) => {
    const id = children
      ?.toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
    return (
      <h3
        id={id}
        className="text-body-lg font-semibold text-primary mt-10 mb-4 scroll-mt-24"
        {...props}
      >
        {children}
      </h3>
    );
  },

  p: ({ children }) => (
    <p className="text-body-lg text-on-surface leading-relaxed mb-6">
      {children}
    </p>
  ),

  a: ({ children, href }) => (
    <a
      href={href}
      className="text-primary underline decoration-border-hairline hover:decoration-primary transition-colors"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),

  blockquote: ({ children }) => (
    <blockquote className="pl-6 border-l-2 border-primary italic text-secondary my-8">
      {children}
    </blockquote>
  ),

  table: ({ children }) => (
    <div className="overflow-x-auto my-8">
      <table className="w-full border-collapse border border-border-hairline text-body-md">
        {children}
      </table>
    </div>
  ),

  th: ({ children }) => (
    <th className="bg-surface-container-low text-label-caps text-secondary p-4 border border-border-hairline text-left">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="p-4 border border-border-hairline text-on-surface">
      {children}
    </td>
  ),

  ul: ({ children }) => (
    <ul className="list-none flex flex-col gap-4 my-6 pl-4 border-l border-border-hairline ml-1">
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol className="list-decimal list-outside flex flex-col gap-4 my-6 pl-6 text-body-lg text-on-surface">
      {children}
    </ol>
  ),

  li: ({ children }) => (
    <li className="text-body-md text-on-surface">{children}</li>
  ),

  hr: () => <hr className="border-border-hairline my-12" />,

  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ""}
      className="w-full border border-border-hairline my-8"
    />
  ),
};
