import { useCallback, useRef, useState } from "react";
import { PROGRESS_DELAY } from "@/lib/transition-constants";

interface ProgressCounterState {
  showProgress: boolean;
  progressValue: number;
}

/**
 * Self-contained progress counter.
 * `startCounting(gen)` kicks off a 1s delay then RAF counting loop.
 * `stopCounting()` cancels all timers and resets to zero.
 */
export function useProgressCounter() {
  const [state, setState] = useState<ProgressCounterState>({
    showProgress: false,
    progressValue: 0,
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number>(0);

  const stopCounting = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    setState({ showProgress: false, progressValue: 0 });
  }, []);

  const startCounting = useCallback(
    (gen: number, getGen: () => number, hasPendingHref: () => boolean) => {
      // Always clean up first
      if (timerRef.current) clearTimeout(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      timerRef.current = setTimeout(() => {
        if (getGen() !== gen || !hasPendingHref()) return;
        setState((prev) => ({ ...prev, showProgress: true }));

        // Counting loop: fast ramp to 99%, then micro-increment.
        const start = Date.now();
        const RAMP_DURATION = 1500; // ms to reach 99%
        const MICRO_INTERVAL = 3000; // ms between +1 increments after 99%

        const tick = () => {
          if (getGen() !== gen || !hasPendingHref()) return;
          const elapsed = Date.now() - start;
          if (elapsed < RAMP_DURATION) {
            setState((prev) => ({
              ...prev,
              progressValue: Math.min(99, Math.floor((elapsed / RAMP_DURATION) * 99)),
            }));
          } else {
            setState((prev) => ({
              ...prev,
              progressValue: Math.min(99, prev.progressValue + 1),
            }));
          }
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      }, PROGRESS_DELAY);
    },
    [],
  );

  return {
    showProgress: state.showProgress,
    progressValue: state.progressValue,
    startCounting,
    stopCounting,
  };
}
