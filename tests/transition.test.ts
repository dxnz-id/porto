import { test } from "node:test";
import assert from "node:assert/strict";
import { computeGrid } from "../src/lib/transition-grid";
import { computeCoverFit } from "../src/lib/cover-fit";
import { shuffle } from "../src/lib/shuffle";

test("computeGrid fills the width with square cells", () => {
  assert.deepEqual(computeGrid(1440, 900, 120), {
    cols: 12,
    rows: 8,
    cell: 120,
  });
});

test("computeGrid handles a zero-size viewport", () => {
  assert.deepEqual(computeGrid(0, 0, 120), { cols: 1, rows: 1, cell: 1 });
});

test("computeGrid accounts for the gap between cells", () => {
  const { cols, cell } = computeGrid(1000, 500, 300, 10);
  assert.equal(cols, 3);
  assert.equal(cell, (1000 - 2 * 10) / 3);
});

test("computeCoverFit centers a landscape photo", () => {
  assert.deepEqual(computeCoverFit(2, 2, 100, 400, 200), {
    bgW: 400,
    bgH: 200,
    bgOffX: -100,
    bgOffY: 0,
    hasDims: true,
  });
});

test("computeCoverFit falls back to zero when dimensions are unknown", () => {
  assert.deepEqual(computeCoverFit(2, 2, 100, null, null), {
    bgW: 0,
    bgH: 0,
    bgOffX: 0,
    bgOffY: 0,
    hasDims: false,
  });
});

test("shuffle keeps every item and leaves the input untouched", () => {
  const input = [1, 2, 3, 4, 5];
  const result = shuffle(input);
  assert.deepEqual(input, [1, 2, 3, 4, 5]);
  assert.deepEqual([...result].sort(), [1, 2, 3, 4, 5]);
});
