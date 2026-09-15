import { LOAD_TIMEOUT, PAINT_BUFFER } from "./transition-constants";

export function sameUrl(href: string | null): boolean {
  if (!href || typeof window === "undefined") return true;
  const hashIndex = href.indexOf("#");
  const target =
    hashIndex >= 0 ? href : href || window.location.pathname;
  return window.location.pathname + window.location.hash === target;
}

/** Resolve once the pushed route has applied, fonts are ready, and a beat has passed. */
export function waitForPageLoaded(href: string | null): Promise<void> {
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
