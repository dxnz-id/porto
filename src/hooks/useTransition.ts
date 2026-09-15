import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import { shuffle } from "@/lib/shuffle";
import { computeGrid, TRANSITION_TILE_GAP } from "@/lib/transition-grid";
import {
  CELL_SIZES,
  COVER_TOTAL,
  COVER_TILE_DURATION,
  REVEAL_TOTAL,
  REVEAL_TILE_DURATION,
} from "@/lib/transition-constants";
import { waitForPageLoaded } from "@/lib/wait-for-page";
import { usePhotoGate } from "@/hooks/usePhotoGate";
import { useProgressCounter } from "@/hooks/useProgressCounter";
import type { GridConfig, TransitionStatus } from "@/components/transition/TransitionProvider";

export function useTransition(photos: string[]) {
  const router = useRouter();
  const pathname = usePathname();

  const [status, setStatus] = useState<TransitionStatus>("idle");
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [gridConfig, setGridConfig] = useState<GridConfig | null>(null);
  const [frozenChildren, setFrozenChildren] = useState<React.ReactNode>(null);
  const [photoReady, setPhotoReady] = useState(false);
  const [photoDims, setPhotoDims] = useState<{ w: number; h: number } | null>(null);

  const busyRef = useRef(false);
  const pendingHrefRef = useRef<string | null>(null);
  const lastPhotoRef = useRef<string | null>(null);
  const transitionGenRef = useRef(0);
  const childrenRef = useRef<React.ReactNode>(null);

  const waitForPhoto = usePhotoGate();
  const {
    showProgress,
    progressValue,
    startCounting,
    stopCounting,
  } = useProgressCounter();

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

  const handleCovered = useCallback(() => {
    // Clear progress IMMEDIATELY — text must not be visible when reveal starts.
    stopCounting();

    const href = pendingHrefRef.current;
    const gen = transitionGenRef.current;
    if (href) router.push(href);

    const pageLoaded = waitForPageLoaded(href);

    startCounting(
      gen,
      () => transitionGenRef.current,
      () => !!pendingHrefRef.current,
    );

    void pageLoaded.then(() => {
      stopCounting();

      if (transitionGenRef.current !== gen || !pendingHrefRef.current) return;

      // Hide progress text BEFORE triggering reveal
      setStatus("revealing");
    });
  }, [router, stopCounting, startCounting]);

  const handleRevealed = useCallback(() => {
    stopCounting();
    pendingHrefRef.current = null;
    busyRef.current = false;
    setStatus("idle");
    setPhotoReady(false);
    setPhotoDims(null);
    setActivePhoto(null);
    setGridConfig(null);
    setFrozenChildren(null);
  }, [stopCounting]);

  const go = useCallback(
    async (href: string) => {
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
      const gen = transitionGenRef.current;

      try {
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

        // PHOTO GATE: wait for decode + GPU buffer, max 800ms.
        // Decision is made BEFORE overlay mounts — no mid-transition switching.
        const { ready, dims } = await waitForPhoto(photo);

        if (transitionGenRef.current !== gen) return;

        setPhotoReady(ready);
        setPhotoDims(dims);
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
      } catch {
        busyRef.current = false;
        pendingHrefRef.current = null;
        setFrozenChildren(null);
      }
    },
    [photos, canAnimate, router, waitForPhoto],
  );

  const value = useMemo(() => ({ go }), [go]);

  return {
    // State
    status,
    activePhoto,
    gridConfig,
    frozenChildren,
    photoReady,
    photoDims,
    showProgress,
    progressValue,
    // Callbacks
    go,
    handleCovered,
    handleRevealed,
    // Context value
    contextValue: value,
    // For updating children ref
    updateChildren: (children: React.ReactNode) => {
      childrenRef.current = children;
    },
  };
}
