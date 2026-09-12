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

const CELL_SIZES = [64, 80, 96, 112];

const COVER_BUDGET = 0.4;
const COVER_TILE_DURATION = 0.12;
const REVEAL_TILE_DURATION = 0.25;
const REVEAL_BUDGET_MIN = 0.8;
const REVEAL_BUDGET_MAX = 1.2;

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

      // Never reuse the photo from the previous transition in a row.
      const candidates =
        photos.length > 1 && lastPhotoRef.current
          ? photos.filter((p) => p !== lastPhotoRef.current)
          : photos;
      const photo =
        candidates[Math.floor(Math.random() * candidates.length)];
      lastPhotoRef.current = photo;

      // Square cells derived from the viewport so the grid is always 1:1.
      const cellSize =
        CELL_SIZES[Math.floor(Math.random() * CELL_SIZES.length)];
      const cols = Math.max(1, Math.ceil(window.innerWidth / cellSize));
      const rows = Math.max(1, Math.ceil(window.innerHeight / cellSize));
      const total = cols * rows;

      const coverOrder = shuffle(
        Array.from({ length: total }, (_, i) => i),
      );
      const order = shuffle(Array.from({ length: total }, (_, i) => i));
      const coverEach = COVER_BUDGET / total;
      const revealBudget =
        REVEAL_BUDGET_MIN +
        Math.random() * (REVEAL_BUDGET_MAX - REVEAL_BUDGET_MIN);
      const staggerEach = Math.min(
        0.05,
        Math.max(0.002, revealBudget / total),
      );

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
    if (href) router.push(href);
    setStatus("revealing");
  }, [router]);

  const handleRevealed = useCallback(() => {
    pendingHrefRef.current = null;
    busyRef.current = false;
    setStatus("idle");
    setActivePhoto(null);
    setGridConfig(null);
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
      {children}
    </TransitionContext.Provider>
  );
}
