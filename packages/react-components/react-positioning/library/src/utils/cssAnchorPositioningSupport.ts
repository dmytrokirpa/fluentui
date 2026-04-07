/**
 * Returns true if the current environment natively supports CSS Anchor Positioning.
 * Guarded for SSR environments where `CSS` is not available.
 */
export function cssAnchorPositioningSupported(): boolean {
  return typeof CSS !== 'undefined' && CSS.supports('position-area', 'center');
}
