/** Shared tile gap in px — single source of truth for grid math + style. */
export const TRANSITION_TILE_GAP = 0;

export interface TransitionGrid {
  cols: number;
  rows: number;
  /** Exact square cell edge in px. */
  cell: number;
}

/**
 * Compute a square-cell grid for a viewport.
 *
 * Left/right/top edges sit exactly flush with the viewport; any excess
 * rows overflow at the bottom (meant to be clipped by overflow-hidden).
 * Cells are always perfectly square, at any aspect ratio including 1:1.
 */
export function computeGrid(
  viewportWidth: number,
  viewportHeight: number,
  targetSize: number,
  gap: number = TRANSITION_TILE_GAP,
): TransitionGrid {
  const safeWidth = Math.max(1, viewportWidth);
  const safeHeight = Math.max(1, viewportHeight);
  const cols = Math.max(1, Math.round(safeWidth / targetSize));
  const cell = (safeWidth - (cols - 1) * gap) / cols;
  const rows = Math.max(1, Math.ceil((safeHeight + gap) / (cell + gap)));
  return { cols, rows, cell };
}
