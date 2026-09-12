"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { shuffle } from "@/lib/shuffle";
import { computeGrid, TRANSITION_TILE_GAP } from "@/lib/transition-grid";
import TransitionOverlay from "./TransitionOverlay";

export type TransitionStatus = "idle" | "covering" | "revealing";

export interface GridConfig {
  cols: number;
  rows: number;
  /** Square cell edge in px — grid is always 1:1. */
  cellSize: number;
  /** Per-tile delay step for the cover (in) phase. */
  coverEach: number;
  /** Per-tile delay step for the reveal (out) phase. */
  staggerEach: number;
  /** Tile indexes in the order they appear (pre-shuffled). */
  coverOrder: number[];
  /** Tile indexes in the order they disappear (pre-shuffled). */
  order: number[];
}

const CELL_SIZES = [80];

// Total transition animation is exactly 0.5s: 0.25s cover + 0.25s reveal.
// The load-wait between them is extra and deliberate.
const COVER_TOTAL = 0.25;
const COVER_TILE_DURATION = 0.1;
const REVEAL_TOTAL = 0.25;
const REVEAL_TILE_DURATION = 0.1;

// Failsafe so the reveal always plays even if load detection stalls.
const LOAD_TIMEOUT = 2000;
const PAINT_BUFFER = 120;

function sameUrl(href: string | null): boolean {
  if (!href || typeof window === "undefined") return true;
  const hashIndex = href.indexOf("#");
  const target =
    hashIndex >= 0 ? href : href || window.location.pathname;
  return window.location.pathname + window.location.hash === target;
}

/** Resolve once the pushed route has applied, fonts are ready, and a beat has passed. */
function waitForPageLoaded(href: string | null): Promise<void> {
  const deadline = new Promise<void>((resolve) =>
    setTimeout(resolve, LOAD_TIMEOUT),
  );
  const loaded = (async () => {
    const start = Date.now();
    while (!sameUrl(href) && Date.now() - start < LOAD_TIMEOUT) {
      await new Promise((r) => setTimeout(r, 30));
    }
    try {
      await document.fonts.ready;
    } catch {
      /* fonts API unavailable — proceed */
    }
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r)),
    );
    await new Promise((r) => setTimeout(r, PAINT_BUFFER));
  })();
  return Promise.race([loaded, deadline]);
}

interface TransitionContextValue {
  go: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextValue>({
  go: () => {},
});

export function useTransition() {
  return useContext(TransitionContext);
}

interface TransitionProviderProps {
  photos: string[];
  children: React.ReactNode;
}

export default function TransitionProvider({
  photos,
  children,
}: TransitionProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<TransitionStatus>("idle");
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [gridConfig, setGridConfig] = useState<GridConfig | null>(null);
  const busyRef = useRef(false);
  const pendingHrefRef = useRef<string | null>(null);
  const lastPhotoRef = useRef<string | null>(null);
  const transitionGenRef = useRef(0);
  const childrenRef = useRef(children);
  childrenRef.current = children;
  // Frozen snapshot of the old page, shown while covering/waiting so the
  // new page only mounts (and its GSAP animations only fire) at reveal.
  const [frozenChildren, setFrozenChildren] =
    useState<React.ReactNode>(null);

  // Preload photos so the cover is never blank.
  useEffect(() => {
    photos.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [photos]);

  const canAnimate = useCallback(() => {
    if (typeof window === "undefined") return false;
    if (!photos.length) return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return false;
    try {
      return typeof gsap.to === "function";
    } catch {
      return false;
    }
  }, [photos]);

  const go = useCallback(
    (href: string) => {
      if (busyRef.current) return;
      // Read pathname directly without adding it to deps to keep Context value stable
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
      if (href === currentPath || !canAnimate()) {
        router.push(href);
        return;
      }

      busyRef.current = true;
      pendingHrefRef.current = href;
      transitionGenRef.current += 1;
      setFrozenChildren(childrenRef.current);

      // Never reuse the photo from the previous transition in a row.
      const candidates =
        photos.length > 1 && lastPhotoRef.current
          ? photos.filter((p) => p !== lastPhotoRef.current)
          : photos;
      const photo =
        candidates[Math.floor(Math.random() * candidates.length)];
      lastPhotoRef.current = photo;

      // Square cells flush with the left/right/top viewport edges;
      // excess rows overflow at the bottom (clipped by the overlay).
      const { cols, rows, cell: cellSize } = computeGrid(
        window.innerWidth,
        window.innerHeight,
        CELL_SIZES[Math.floor(Math.random() * CELL_SIZES.length)],
        TRANSITION_TILE_GAP,
      );
      const total = cols * rows;

      const coverOrder = shuffle(
        Array.from({ length: total }, (_, i) => i),
      );
      const order = shuffle(Array.from({ length: total }, (_, i) => i));
      const coverEach = (COVER_TOTAL - COVER_TILE_DURATION) / total;
      const staggerEach = (REVEAL_TOTAL - REVEAL_TILE_DURATION) / total;

      setActivePhoto(photo);
      setGridConfig({
        cols,
        rows,
        cellSize,
        coverEach,
        staggerEach,
        coverOrder,
        order,
      });
      setStatus("covering");
    },
    [photos, canAnimate, router],
  );

  const handleCovered = useCallback(() => {
    const href = pendingHrefRef.current;
    const gen = transitionGenRef.current;
    if (href) router.push(href);
    // Hold the frozen old page until the new route has loaded,
    // then swap + reveal together so page GSAP animations fire in sync.
    void waitForPageLoaded(href).then(() => {
      if (transitionGenRef.current !== gen || !pendingHrefRef.current) return;
      setStatus("revealing");
    });
  }, [router]);

  const handleRevealed = useCallback(() => {
    pendingHrefRef.current = null;
    busyRef.current = false;
    setStatus("idle");
    setActivePhoto(null);
    setGridConfig(null);
    setFrozenChildren(null);
  }, []);

  const value = useMemo(() => ({ go }), [go]);

  return (
    <TransitionContext.Provider value={value}>
      {status !== "idle" && activePhoto && gridConfig && (
        <TransitionOverlay
          photo={activePhoto}
          config={gridConfig}
          status={status}
          coverDuration={COVER_TILE_DURATION}
          revealTileDuration={REVEAL_TILE_DURATION}
          onCovered={handleCovered}
          onRevealed={handleRevealed}
        />
      )}
      {status === "idle" ? children : (frozenChildren ?? children)}
    </TransitionContext.Provider>
  );
}
