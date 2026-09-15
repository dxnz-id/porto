import { useCallback } from "react";
import { PHOTO_GATE_TIMEOUT } from "@/lib/transition-constants";

interface PhotoGateResult {
  ready: boolean;
  dims: { w: number; h: number } | null;
}

/**
 * Wait for an image to decode + upload to GPU, with a hard timeout.
 * Returns a stable `waitForPhoto` function — call it inside `go()`.
 *
 * Decision is made BEFORE the overlay mounts — no mid-transition switching.
 */
export function usePhotoGate() {
  const waitForPhoto = useCallback(
    async (src: string): Promise<PhotoGateResult> => {
      const img = new Image();
      img.src = src;

      // Cached image: skip gate, use immediately
      if (img.complete && img.naturalWidth > 0) {
        return {
          ready: true,
          dims: { w: img.naturalWidth, h: img.naturalHeight },
        };
      }

      // Not cached: race decode + GPU buffer vs hard timeout
      return new Promise<PhotoGateResult>((resolve) => {
        const timeout = setTimeout(() => {
          resolve({ ready: false, dims: null });
        }, PHOTO_GATE_TIMEOUT);

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
              resolve({
                ready: true,
                dims: { w: img.naturalWidth, h: img.naturalHeight },
              });
            } else {
              resolve({ ready: true, dims: null });
            }
          })
          .catch(() => {
            clearTimeout(timeout);
            resolve({ ready: false, dims: null });
          });
      });
    },
    [],
  );

  return waitForPhoto;
}
