"use client";

import { useEffect, useRef, useState, useId } from "react";

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const id = useId().replace(/:/g, "");

  useEffect(() => {
    if (!chart?.trim()) return;

    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;

        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          darkMode: false,
          flowchart: {
            curve: "basis",
            padding: 20,
          },
          sequence: {
            diagramMarginX: 20,
            diagramMarginY: 10,
            actorMargin: 60,
            width: 150,
            height: 65,
            boxMargin: 10,
            boxTextMargin: 5,
            noteMargin: 10,
            messageMargin: 40,
          },
        });

        const uniqueId = `mermaid-${id}-${Math.random().toString(36).slice(2, 7)}`;
        const { svg: renderedSvg } = await mermaid.render(uniqueId, chart.trim());

        if (!cancelled) {
          setSvg(renderedSvg);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Mermaid render error:", err);
          setError(
            err instanceof Error ? err.message : "Failed to render diagram"
          );
        }
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <div className="my-8 p-4 border border-red-800/50 bg-red-950/20 font-mono text-[13px] text-red-400 overflow-x-auto">
        <p className="text-label-caps text-red-500 mb-2">Diagram Error</p>
        <pre className="whitespace-pre-wrap">{error}</pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="my-8 border border-border-hairline bg-surface-container-low p-8 flex items-center justify-center min-h-[120px]">
        <div className="flex items-center gap-3 text-secondary text-label-mono">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          Rendering diagram...
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="my-8 border border-border-hairline bg-surface-container-low p-4 md:p-6 overflow-x-auto flex justify-center"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
