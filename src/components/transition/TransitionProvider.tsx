"use client";

import {
  createContext,
  useCallback,
  useContext,
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
const LOAD_TIMEOUT = 30000;
const PAINT_BUFFER = 120;

// Max time to wait for the cover photo to decode before falling back to solid.
const PHOTO_GATE_TIMEOUT = 800;

// Delay before showing the progress number — if the page loads within
// this window, the user never sees the progress indicator at all.
const PROGRESS_DELAY = 1000;

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

  const [showProgress, setShowProgress] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [photoReady, setPhotoReady] = useState(false);
  const [photoDims, setPhotoDims] = useState<{ w: number; h: number } | null>(null);

  const progressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRafRef = useRef<number>(0);

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
        let ready = false;
        let dims: { w: number; h: number } | null = null;

        const img = new Image();
        img.src = photo;

        if (img.complete && img.naturalWidth > 0) {
          ready = true;
          dims = { w: img.naturalWidth, h: img.naturalHeight };
        } else {
          ready = await new Promise<boolean>((resolve) => {
            const timeout = setTimeout(
              () => resolve(false),
              PHOTO_GATE_TIMEOUT,
            );
            img
              .decode()
              .then(
                () =>
                  new Promise<void>((r) => {
                    requestAnimationFrame(() =>
                      requestAnimationFrame(() => r()),
                    );
                  }),
              )
              .then(() => {
                clearTimeout(timeout);
                if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                  dims = { w: img.naturalWidth, h: img.naturalHeight };
                }
                resolve(true);
              })
              .catch(() => {
                clearTimeout(timeout);
                resolve(false);
              });
          });
        }

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
    [photos, canAnimate, router],
  );

  const handleCovered = useCallback(() => {
    // Clear progress IMMEDIATELY — text must not be visible when reveal starts.
    if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
    if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current);
    setShowProgress(false);
    setProgressValue(0);

    const href = pendingHrefRef.current;
    const gen = transitionGenRef.current;
    if (href) router.push(href);

    const pageLoaded = waitForPageLoaded(href);

    progressTimerRef.current = setTimeout(() => {
      if (transitionGenRef.current !== gen || !pendingHrefRef.current) return;
      setShowProgress(true);

      // Counting loop: fast ramp to 99%, then micro-increment.
      const start = Date.now();
      const RAMP_DURATION = 1500; // ms to reach 99%
      const MICRO_INTERVAL = 3000; // ms between +1 increments after 99%

      const tick = () => {
        if (transitionGenRef.current !== gen || !pendingHrefRef.current) return;
        const elapsed = Date.now() - start;
        if (elapsed < RAMP_DURATION) {
          // Fast ramp: linear from 0 to 99
          setProgressValue(Math.min(99, Math.floor((elapsed / RAMP_DURATION) * 99)));
        } else {
          // Micro-increment: slowly creep toward 99
          setProgressValue((prev) => Math.min(99, prev + 1));
        }
        progressRafRef.current = requestAnimationFrame(tick);
      };
      progressRafRef.current = requestAnimationFrame(tick);
    }, PROGRESS_DELAY);

    void pageLoaded.then(() => {
      // Clear progress timers
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
      if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current);

      if (transitionGenRef.current !== gen || !pendingHrefRef.current) return;

      // Hide progress text BEFORE triggering reveal
      setShowProgress(false);
      setProgressValue(0);
      setStatus("revealing");
    });
  }, [router]);

  const handleRevealed = useCallback(() => {
    if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
    if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current);
    pendingHrefRef.current = null;
    busyRef.current = false;
    setStatus("idle");
    setShowProgress(false);
    setProgressValue(0);
    setPhotoReady(false);
    setPhotoDims(null);
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
          showProgress={showProgress}
          progressValue={progressValue}
          photoReady={photoReady}
          photoDims={photoDims}
        />
      )}
      {status === "idle" ? children : (frozenChildren ?? children)}
    </TransitionContext.Provider>
  );
}
