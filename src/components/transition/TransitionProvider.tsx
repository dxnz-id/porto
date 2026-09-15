"use client";

import { createContext, useContext, useCallback } from "react";
import { useTransition } from "@/hooks/useTransition";
import TransitionOverlay from "./TransitionOverlay";
import { COVER_TILE_DURATION, REVEAL_TILE_DURATION } from "@/lib/transition-constants";

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

interface TransitionContextValue {
  go: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextValue>({
  go: () => {},
});

export function useTransitionContext() {
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
  const {
    status,
    activePhoto,
    gridConfig,
    frozenChildren,
    photoReady,
    photoDims,
    showProgress,
    progressValue,
    go,
    handleCovered,
    handleRevealed,
    contextValue,
    updateChildren,
  } = useTransition(photos);

  // Update children ref on every render
  updateChildren(children);

  return (
    <TransitionContext.Provider value={contextValue}>
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
