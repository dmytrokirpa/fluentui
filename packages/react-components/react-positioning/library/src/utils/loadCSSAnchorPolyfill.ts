import { cssAnchorPositioningSupported } from './cssAnchorPositioningSupport';

let loading: Promise<void> | null = null;

/**
 * Dynamically imports the `@oddbird/css-anchor-positioning` polyfill when CSS
 * Anchor Positioning is not natively supported.  The polyfill is an optional peer
 * dependency — if it is not installed this function resolves without error and the
 * browser falls back to its native capabilities (which may be absent on older
 * browsers).
 *
 * The import is a singleton: subsequent calls return the same promise, so the
 * polyfill is fetched and initialised only once per page.
 *
 * Usage in app entry points:
 * ```ts
 * import { loadCSSAnchorPolyfill } from '@fluentui/react-positioning';
 * await loadCSSAnchorPolyfill();
 * ```
 */
export function loadCSSAnchorPolyfill(): Promise<void> {
  if (cssAnchorPositioningSupported()) {
    return Promise.resolve();
  }

  if (!loading) {
    loading = import('@oddbird/css-anchor-positioning')
      .then(m => {
        // The polyfill's default export is the initialisation function.
        if (typeof m.default === 'function') {
          m.default();
        }
      })
      .catch(() => {
        // Polyfill not installed — CSS Anchor Positioning may not work in
        // browsers that lack native support.  Silently continue so that
        // consumers on modern browsers are unaffected.
      });
  }

  return loading;
}
