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
          theme: "dark",
          darkMode: true,
          themeVariables: {
            // Background
            background: "transparent",
            mainBkg: "#1a1a2e",
            // Node/box colors
            nodeBorder: "#a78bfa",
            clusterBkg: "#16213e",
            // Font
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "14px",
            // Primary colors
            primaryColor: "#1e1b4b",
            primaryBorderColor: "#818cf8",
            primaryTextColor: "#e2e8f0",
            // Secondary
            secondaryColor: "#0f3460",
            secondaryBorderColor: "#6366f1",
            secondaryTextColor: "#e2e8f0",
            // Tertiary
            tertiaryColor: "#134e4a",
            tertiaryBorderColor: "#10b981",
            tertiaryTextColor: "#e2e8f0",
            // Lines and text
            lineColor: "#64748b",
            textColor: "#e2e8f0",
            labelColor: "#e2e8f0",
            // Sequence diagram
            actorBkg: "#1e1b4b",
            actorBorder: "#818cf8",
            actorTextColor: "#e2e8f0",
            actorLineColor: "#64748b",
            signalColor: "#94a3b8",
            signalTextColor: "#e2e8f0",
            activationBkgColor: "#0f172a",
            activationBorderColor: "#475569",
            labelBoxBkgColor: "#1e293b",
            labelBoxBorderColor: "#475569",
            labelTextColor: "#94a3b8",
            loopTextColor: "#94a3b8",
            noteBkgColor: "#1e293b",
            noteBorderColor: "#475569",
            noteTextColor: "#e2e8f0",
          },
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
