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
  staggerEach: number;
  /** Tile indexes in the order they should disappear (pre-shuffled). */
  order: number[];
}

const GRID_PRESETS: Array<[number, number]> = [
  [3, 2],
  [4, 3],
  [5, 4],
  [6, 4],
];

const COVER_DURATION = 0.15;
const REVEAL_TILE_DURATION = 0.25;

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

      const photo = photos[Math.floor(Math.random() * photos.length)];
      const [cols, rows] =
        GRID_PRESETS[Math.floor(Math.random() * GRID_PRESETS.length)];
      const staggerEach = 0.02 + Math.random() * 0.03;
      const order = shuffle(
        Array.from({ length: cols * rows }, (_, i) => i),
      );

      setActivePhoto(photo);
      setGridConfig({ cols, rows, staggerEach, order });
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
          coverDuration={COVER_DURATION}
          revealTileDuration={REVEAL_TILE_DURATION}
          onCovered={handleCovered}
          onRevealed={handleRevealed}
        />
      )}
      {children}
    </TransitionContext.Provider>
  );
}
