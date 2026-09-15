import { TRANSITION_TILE_GAP } from "./transition-grid";

export interface CoverFitResult {
  bgW: number;
  bgH: number;
  bgOffX: number;
  bgOffY: number;
  hasDims: boolean;
}

/**
 * Compute cover-fit offsets so the photo covers the whole grid box (centered),
 * producing proportional tiles instead of stretched ones.
 * Falls back to stretch math when natural dimensions are unknown.
 */
export function computeCoverFit(
  cols: number,
  rows: number,
  cellSize: number,
  photoW: number | null,
  photoH: number | null,
): CoverFitResult {
  const gridW = cols * cellSize + (cols - 1) * TRANSITION_TILE_GAP;
  const gridH = rows * cellSize + (rows - 1) * TRANSITION_TILE_GAP;

  const hasDims =
    photoW !== null && photoH !== null && photoW > 0 && photoH > 0;

  const coverScale = hasDims
    ? Math.max(gridW / (photoW as number), gridH / (photoH as number))
    : 0;

  return {
    bgW: hasDims ? (photoW as number) * coverScale : 0,
    bgH: hasDims ? (photoH as number) * coverScale : 0,
    bgOffX: hasDims ? (gridW - (photoW as number) * coverScale) / 2 : 0,
    bgOffY: hasDims ? (gridH - (photoH as number) * coverScale) / 2 : 0,
    hasDims,
  };
}
