"use client";

import { useEffect, useRef, useState, useId, useCallback } from "react";
import {
  Copy,
  Check,
  Maximize,
  X,
  ZoomIn,
  ZoomOut,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Minimize2,
} from "lucide-react";

interface MermaidProps {
  chart: string;
}

const SCALE_STEP = 0.15;
const PAN_STEP = 80;

export default function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const id = useId().replace(/:/g, "");

  const [scale, setScale] = useState(1);
  const fitScaleRef = useRef(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  // Mouse drag refs
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const translateAtDragStart = useRef({ x: 0, y: 0 });

  // Touch refs
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  const lastPinchDistRef = useRef<number | null>(null);
  const scaleAtPinchStart = useRef(1);

  // ── Fit scale ──────────────────────────────────────────────────────────────
  const computeFitScale = useCallback(() => {
    const svgEl = measureRef.current?.querySelector("svg");
    if (!svgEl) return 1;
    const svgW = svgEl.getBoundingClientRect().width;
    const svgH = svgEl.getBoundingClientRect().height;
    if (!svgW || !svgH) return 1;
    const modalW = canvasRef.current?.getBoundingClientRect().width ?? window.innerWidth * 0.9;
    const modalH = canvasRef.current?.getBoundingClientRect().height ?? window.innerHeight * 0.9;
    const PADDING = 64;
    const scaleX = (modalW - PADDING) / svgW;
    const scaleY = (modalH - PADDING) / svgH;
    return parseFloat(Math.min(scaleX, scaleY).toFixed(3));
  }, []);

  // Reset to fit view when modal opens
  useEffect(() => {
    if (!isEnlarged) return;
    const r1 = requestAnimationFrame(() => {
      const r2 = requestAnimationFrame(() => {
        const fit = computeFitScale();
        fitScaleRef.current = fit;
        setScale(fit);
        setTranslate({ x: 0, y: 0 });
      });
      return () => cancelAnimationFrame(r2);
    });
    return () => cancelAnimationFrame(r1);
  }, [isEnlarged, computeFitScale]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isEnlarged ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isEnlarged]);

  // ── Render mermaid ─────────────────────────────────────────────────────────
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
          flowchart: { curve: "basis", padding: 20 },
          sequence: {
            diagramMarginX: 20, diagramMarginY: 10,
            actorMargin: 60, width: 150, height: 65,
            boxMargin: 10, boxTextMargin: 5, noteMargin: 10, messageMargin: 40,
          },
        });
        const uniqueId = `mermaid-${id}-${Math.random().toString(36).slice(2, 7)}`;
        const { svg: renderedSvg } = await mermaid.render(uniqueId, chart.trim());
        if (!cancelled) { setSvg(renderedSvg); setError(null); }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to render diagram");
      }
    }
    render();
    return () => { cancelled = true; };
  }, [chart, id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(chart.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Mouse handlers ─────────────────────────────────────────────────────────
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    translateAtDragStart.current = { ...translate };
    e.preventDefault();
  }, [translate]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setTranslate({
      x: translateAtDragStart.current.x + (e.clientX - dragStart.current.x),
      y: translateAtDragStart.current.y + (e.clientY - dragStart.current.y),
    });
  }, []);

  const onMouseUp = useCallback(() => { isDragging.current = false; }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP;
    const minS = fitScaleRef.current * 0.1;
    const maxS = fitScaleRef.current * 5;
    setScale((s) => parseFloat(Math.min(maxS, Math.max(minS, s + delta)).toFixed(3)));
  }, []);

  // ── Touch handlers (drag + pinch) ──────────────────────────────────────────
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      lastTouchRef.current = { x: t.clientX, y: t.clientY };
      translateAtDragStart.current = { ...translate };
      lastPinchDistRef.current = null;
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDistRef.current = Math.hypot(dx, dy);
      scaleAtPinchStart.current = scale;
      lastTouchRef.current = null;
    }
  }, [translate, scale]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1 && lastTouchRef.current) {
      const t = e.touches[0];
      const dx = t.clientX - lastTouchRef.current.x;
      const dy = t.clientY - lastTouchRef.current.y;
      lastTouchRef.current = { x: t.clientX, y: t.clientY };
      setTranslate((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    } else if (e.touches.length === 2 && lastPinchDistRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / lastPinchDistRef.current;
      const newScale = parseFloat(
        Math.min(fitScaleRef.current * 5, Math.max(fitScaleRef.current * 0.1, scaleAtPinchStart.current * ratio)).toFixed(3)
      );
      setScale(newScale);
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    lastTouchRef.current = null;
    lastPinchDistRef.current = null;
  }, []);

  // ── Controls ───────────────────────────────────────────────────────────────
  const zoom = (delta: number) => {
    const minS = fitScaleRef.current * 0.1;
    const maxS = fitScaleRef.current * 5;
    setScale((s) => parseFloat(Math.min(maxS, Math.max(minS, s + delta)).toFixed(3)));
  };
  // NOTE: pan(0, +PAN_STEP) moves diagram DOWN → user sees content move up → "up" button
  const pan = (dx: number, dy: number) =>
    setTranslate((t) => ({ x: t.x + dx, y: t.y + dy }));
  const resetView = () => {
    const fit = computeFitScale();
    fitScaleRef.current = fit;
    setScale(fit);
    setTranslate({ x: 0, y: 0 });
  };

  const displayPct = Math.round((scale / fitScaleRef.current) * 100);

  const btnClass =
    "p-1.5 bg-surface-container-high hover:bg-surface-container-highest active:bg-surface-container-highest border border-border-hairline rounded text-secondary hover:text-primary transition-colors shadow-sm touch-manipulation";

  // ── Early returns ──────────────────────────────────────────────────────────
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
      {/* Hidden off-screen div to measure actual SVG pixel size */}
      <div
        ref={measureRef}
        aria-hidden="true"
        style={{ position: "fixed", top: -9999, left: -9999, opacity: 0, pointerEvents: "none" }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />

      {/* ── Inline preview ── */}
      <div className="relative group my-8 border border-border-hairline bg-surface-container-low p-4 md:p-6 rounded-md">
        {/* Toolbar: always visible on mobile (no hover needed), fade-in on desktop */}
        <div className="absolute top-2 right-2 flex gap-2 z-10 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="p-1.5 bg-surface border border-border-hairline rounded text-secondary hover:text-primary transition-colors shadow-sm touch-manipulation"
            title="Copy diagram code"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
          <button
            onClick={() => setIsEnlarged(true)}
            className="p-1.5 bg-surface border border-border-hairline rounded text-secondary hover:text-primary transition-colors shadow-sm touch-manipulation"
            title="Enlarge diagram"
          >
            <Maximize size={14} />
          </button>
        </div>
        <div
          ref={ref}
          className="overflow-x-auto flex justify-center"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>

      {/* ── Enlarged Modal ── */}
      {isEnlarged && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-3 md:p-8"
          onClick={() => setIsEnlarged(false)}
        >
          <div
            className="relative w-full h-full max-w-6xl max-h-[92vh] bg-surface-container border border-border-hairline rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setIsEnlarged(false)}
              className="absolute top-3 right-3 z-20 p-2 text-secondary hover:text-primary transition-colors touch-manipulation"
              title="Close"
            >
              <X size={18} />
            </button>

            {/* Zoom % badge */}
            <div className="absolute top-3 left-3 z-20 px-2 py-1 bg-surface-container-high border border-border-hairline rounded text-xs font-mono text-secondary select-none">
              {displayPct}%
            </div>

            {/* Pan / zoom canvas */}
            <div
              ref={canvasRef}
              className="w-full h-full flex items-center justify-center overflow-hidden"
              style={{ cursor: isDragging.current ? "grabbing" : "grab", touchAction: "none" }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onWheel={onWheel}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div
                style={{
                  transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                  transformOrigin: "center center",
                  transition: isDragging.current ? "none" : "transform 0.06s ease-out",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            </div>

            {/* ── D-Pad — bottom right ──
                Grid:  col1   col2   col3
                row1:  [ ]    [↑]    [+]
                row2:  [←]   [⊡]    [→]
                row3:  [ ]    [↓]    [−]
            */}
            <div
              className="absolute bottom-3 right-3 z-20 grid gap-1"
              style={{ gridTemplateColumns: "repeat(3, auto)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Row 1 */}
              <div />
              {/* ↑ button: diagram moves UP → translate.y decreases */}
              <button onClick={() => pan(0, -PAN_STEP)} className={btnClass} title="Pan up">
                <ChevronUp size={16} />
              </button>
              <button onClick={() => zoom(SCALE_STEP)} className={btnClass} title="Zoom in">
                <ZoomIn size={16} />
              </button>

              {/* Row 2 */}
              <button onClick={() => pan(-PAN_STEP, 0)} className={btnClass} title="Pan left">
                <ChevronLeft size={16} />
              </button>
              <button onClick={resetView} className={btnClass} title="Fit / Reset">
                <Minimize2 size={14} />
              </button>
              <button onClick={() => pan(PAN_STEP, 0)} className={btnClass} title="Pan right">
                <ChevronRight size={16} />
              </button>

              {/* Row 3 */}
              <div />
              {/* ↓ button: diagram moves DOWN → translate.y increases */}
              <button onClick={() => pan(0, PAN_STEP)} className={btnClass} title="Pan down">
                <ChevronDown size={16} />
              </button>
              <button onClick={() => zoom(-SCALE_STEP)} className={btnClass} title="Zoom out">
                <ZoomOut size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
