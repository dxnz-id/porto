"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TRANSITION_TILE_GAP } from "@/lib/transition-grid";
import type { GridConfig, TransitionStatus } from "./TransitionProvider";

interface TransitionOverlayProps {
  photo: string;
  config: GridConfig;
  status: TransitionStatus;
  coverDuration: number;
  revealTileDuration: number;
  onCovered: () => void;
  onRevealed: () => void;
  showProgress: boolean;
  progressValue: number;
  photoReady: boolean;
  photoDims: { w: number; h: number } | null;
}

export default function TransitionOverlay({
  photo,
  config,
  status,
  coverDuration,
  revealTileDuration,
  onCovered,
  onRevealed,
  showProgress,
  progressValue,
  photoReady,
  photoDims,
}: TransitionOverlayProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<Array<gsap.core.Tween | gsap.core.Timeline>>([]);
  const { cols, rows, cellSize, coverEach, staggerEach, coverOrder, order } =
    config;

  const onCoveredRef = useRef(onCovered);
  const onRevealedRef = useRef(onRevealed);
  onCoveredRef.current = onCovered;
  onRevealedRef.current = onRevealed;

  useGSAP(
    () => {
      if (!gridRef.current) return;
      const tiles = Array.from(gridRef.current.children) as HTMLElement[];
      if (!tiles.length) return;

      timersRef.current.forEach((t) => t.kill());
      timersRef.current = [];

      if (status === "covering") {
        // Tiles pop in one by one in random order — square by square,
        // mirroring the character of the reveal phase.
        coverOrder.forEach((tileIndex, position) => {
          const tile = tiles[tileIndex];
          if (!tile) return;
          const tween = gsap.fromTo(
            tile,
            { opacity: 0 },
            {
              opacity: 1,
              duration: coverDuration,
              ease: "power1.out",
              delay: position * coverEach,
              overwrite: true,
            },
          );
          timersRef.current.push(tween);
        });

        const done = gsap.delayedCall(
          coverOrder.length * coverEach + coverDuration,
          () => onCoveredRef.current(),
        );
        timersRef.current.push(done);
      }

      if (status === "revealing") {
        // Per-tile individual delays from the pre-shuffled order.
        // No GSAP stagger object — the randomness lives in `order`.
        order.forEach((tileIndex, position) => {
          const tile = tiles[tileIndex];
          if (!tile) return;
          const tween = gsap.to(tile, {
            opacity: 0,
            duration: revealTileDuration,
            ease: "power1.inOut",
            delay: position * staggerEach,
            overwrite: true,
          });
          timersRef.current.push(tween);
        });

        const done = gsap.delayedCall(
          order.length * staggerEach + revealTileDuration,
          () => onRevealedRef.current(),
        );
        timersRef.current.push(done);
      }
    },
    { dependencies: [status, photo, config], scope: gridRef },
  );

  const photoW = photoDims?.w ?? null;
  const photoH = photoDims?.h ?? null;

  // Cover-fit: scale the photo to cover the whole grid box (centered),
  // so tiles show a proportional photo instead of a stretched one.
  // Falls back to stretch math when natural dimensions are unknown.
  const gridW = cols * cellSize + (cols - 1) * TRANSITION_TILE_GAP;
  const gridH = rows * cellSize + (rows - 1) * TRANSITION_TILE_GAP;
  const hasDims =
    photoW !== null &&
    photoH !== null &&
    photoW > 0 &&
    photoH > 0;
  const coverScale = hasDims
    ? Math.max(gridW / (photoW as number), gridH / (photoH as number))
    : 0;
  const bgW = hasDims ? (photoW as number) * coverScale : 0;
  const bgH = hasDims ? (photoH as number) * coverScale : 0;
  const bgOffX = hasDims ? (gridW - bgW) / 2 : 0;
  const bgOffY = hasDims ? (gridH - bgH) / 2 : 0;

  const totalCells = cols * rows;
  const cells = Array.from({ length: totalCells }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return { col, row };
  });

  return (
    <>
      <div
        ref={gridRef}
        aria-hidden
        className="fixed inset-0 z-[100] overflow-hidden"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          gap: `${TRANSITION_TILE_GAP}px`,
          alignContent: "start",
          justifyContent: "start",
        }}
      >
        {cells.map(({ col, row }) => (
          <div
            key={`${col}-${row}`}
            className="w-full h-full"
            style={
              photoReady
                ? {
                    opacity: 0,
                    backgroundImage: `url("${photo}")`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: hasDims
                      ? `${bgW}px ${bgH}px`
                      : `${cols * 100}% ${rows * 100}%`,
                    backgroundPosition: hasDims
                      ? `${bgOffX - col * (cellSize + TRANSITION_TILE_GAP)}px ${
                          bgOffY - row * (cellSize + TRANSITION_TILE_GAP)
                        }px`
                      : `${cols === 1 ? 50 : (col / (cols - 1)) * 100}% ${
                          rows === 1 ? 50 : (row / (rows - 1)) * 100
                        }%`,
                  }
                : { opacity: 0, backgroundColor: "#000" }
            }
          />
        ))}
      </div>
      {showProgress && (
        <div
          className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none"
          aria-hidden
        >
          <span
            className="text-headline-lg-mobile md:text-headline-xl"
            style={{
              fontFamily: "var(--font-family-headline)",
              color: "#ffffff",
              mixBlendMode: "difference",
            }}
          >
            {progressValue}
          </span>
        </div>
      )}
    </>
  );
}
