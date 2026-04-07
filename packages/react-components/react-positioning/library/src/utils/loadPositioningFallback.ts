import type { createPositionManager } from '../createPositionManager';
import { cssAnchorPositioningSupported } from './cssAnchorPositioningSupport';

type CreatePositionManagerFn = typeof createPositionManager;

let createPositionManagerFn: CreatePositionManagerFn | null = null;
let loadingPromise: Promise<void> | null = null;

/**
 * Dynamically imports `createPositionManager` (and transitively `@floating-ui/dom`)
 * only when CSS Anchor Positioning is not natively supported.
 *
 * Bundlers (webpack, rollup, esbuild) split dynamic imports into separate chunks, so
 * `@floating-ui/dom` is excluded from the main bundle on browsers where CSS Anchor
 * Positioning is available.
 *
 * The load is kicked off eagerly at module-evaluation time (called from `usePositioning.ts`)
 * so the module is ready before the first React layout effect fires.
 */
export function preloadPositioningFallback(): Promise<void> {
  if (cssAnchorPositioningSupported() || loadingPromise) {
    return loadingPromise ?? Promise.resolve();
  }

  loadingPromise = import('../createPositionManager').then(m => {
    createPositionManagerFn = m.createPositionManager;
  });

  return loadingPromise;
}

/**
 * Returns the resolved `createPositionManager` function, or `null` if it has not
 * yet been loaded (or is not needed because CSS Anchor Positioning is supported).
 */
export function getCreatePositionManager(): CreatePositionManagerFn | null {
  return createPositionManagerFn;
}
