"use client";

import { useEffect, useRef, useState, useId } from "react";
import { Copy, Check, Maximize, X } from "lucide-react";

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
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

  const handleCopy = () => {
    navigator.clipboard.writeText(chart.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div className="my-8 p-4 border border-red-800/50 bg-red-950/20 font-mono text-[13px] text-red-400 overflow-x-auto rounded-md">
        <p className="text-label-caps text-red-500 mb-2">Diagram Error</p>
        <pre className="whitespace-pre-wrap">{error}</pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="my-8 border border-border-hairline bg-surface-container-low p-8 flex items-center justify-center min-h-[120px] rounded-md">
        <div className="flex items-center gap-3 text-secondary text-label-mono">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          Rendering diagram...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative group my-8 border border-border-hairline bg-surface-container-low p-4 md:p-6 rounded-md">
        {/* Toolbar */}
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="p-1.5 bg-surface border border-border-hairline rounded text-secondary hover:text-primary transition-colors shadow-sm"
            title="Copy diagram code"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
          <button
            onClick={() => setIsEnlarged(true)}
            className="p-1.5 bg-surface border border-border-hairline rounded text-secondary hover:text-primary transition-colors shadow-sm"
            title="Enlarge diagram"
          >
            <Maximize size={14} />
          </button>
        </div>

        {/* Diagram */}
        <div
          ref={ref}
          className="overflow-x-auto flex justify-center"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>

      {/* Enlarge Modal */}
      {isEnlarged && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsEnlarged(false)}
        >
          <div
            className="relative w-full h-full max-w-6xl max-h-[90vh] bg-surface-container border border-border-hairline overflow-auto flex items-center justify-center p-4 md:p-12 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsEnlarged(false)}
              className="absolute top-4 right-4 p-2 bg-surface-container-high hover:bg-surface-container-highest border border-border-hairline rounded text-secondary hover:text-primary transition-colors shadow-sm"
              title="Close diagram"
            >
              <X size={20} />
            </button>
            <div
              className="w-full flex justify-center scale-100 md:scale-125 transform-gpu transition-transform origin-center"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        </div>
      )}
    </>
  );
}
