"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { GridConfig, TransitionStatus } from "./TransitionProvider";

interface TransitionOverlayProps {
  photo: string;
  config: GridConfig;
  status: TransitionStatus;
  coverDuration: number;
  revealTileDuration: number;
  onCovered: () => void;
  onRevealed: () => void;
}

export default function TransitionOverlay({
  photo,
  config,
  status,
  coverDuration,
  revealTileDuration,
  onCovered,
  onRevealed,
}: TransitionOverlayProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<Array<gsap.core.Tween | gsap.core.Timeline>>([]);
  const { cols, rows, staggerEach, order } = config;

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
        const tween = gsap.to(tiles, {
          opacity: 1,
          duration: coverDuration,
          ease: "power1.out",
          overwrite: true,
          onComplete: () => onCoveredRef.current(),
        });
        timersRef.current.push(tween);
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

  const totalCells = cols * rows;
  const cells = Array.from({ length: totalCells }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return { col, row };
  });

  return (
    <div
      ref={gridRef}
      aria-hidden
      className="fixed inset-0 z-[100]"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {cells.map(({ col, row }) => (
        <div
          key={`${col}-${row}`}
          className="w-full h-full"
          style={{
            opacity: 0,
            backgroundImage: `url("${photo}")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${cols * 100}% ${rows * 100}%`,
            backgroundPosition: `${cols === 1 ? 50 : (col / (cols - 1)) * 100}% ${
              rows === 1 ? 50 : (row / (rows - 1)) * 100
            }%`,
          }}
        />
      ))}
    </div>
  );
}
