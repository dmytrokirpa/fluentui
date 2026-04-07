import type { PositioningPlacement, PositioningVirtualElement } from '../types';

/**
 * Detects the actual placement of `container` relative to `target` by comparing
 * bounding rects.  Used after CSS Anchor Positioning has resolved layout to write
 * `data-popper-placement` and fire the `fui-positioningend` event.
 *
 * A 1px tolerance is applied to handle sub-pixel / adjacent-boundary cases.
 */
export function detectCSSAnchorPlacement(
  container: HTMLElement,
  target: HTMLElement | PositioningVirtualElement,
): PositioningPlacement {
  const cRect = container.getBoundingClientRect();
  const tRect = target.getBoundingClientRect();

  const TOLERANCE = 1;

  // --- Determine primary side ---
  let side: 'top' | 'bottom' | 'left' | 'right';

  if (cRect.bottom <= tRect.top + TOLERANCE) {
    side = 'top';
  } else if (cRect.top >= tRect.bottom - TOLERANCE) {
    side = 'bottom';
  } else if (cRect.right <= tRect.left + TOLERANCE) {
    side = 'left';
  } else if (cRect.left >= tRect.right - TOLERANCE) {
    side = 'right';
  } else {
    // Overlapping (e.g. coverTarget) — use center of container vs center of target
    const cCenterX = (cRect.left + cRect.right) / 2;
    const cCenterY = (cRect.top + cRect.bottom) / 2;
    const tCenterX = (tRect.left + tRect.right) / 2;
    const tCenterY = (tRect.top + tRect.bottom) / 2;
    const dx = cCenterX - tCenterX;
    const dy = cCenterY - tCenterY;
    if (Math.abs(dy) >= Math.abs(dx)) {
      side = dy < 0 ? 'top' : 'bottom';
    } else {
      side = dx < 0 ? 'left' : 'right';
    }
  }

  // --- Determine alignment along the cross axis ---
  const isVertical = side === 'top' || side === 'bottom';

  let alignment: 'start' | 'end' | '' = '';
  if (isVertical) {
    const cCenter = (cRect.left + cRect.right) / 2;
    const tCenter = (tRect.left + tRect.right) / 2;
    if (Math.abs(cCenter - tCenter) > TOLERANCE) {
      // Container shifted toward start (left) or end (right) of target
      alignment = cCenter < tCenter ? 'start' : 'end';
    }
  } else {
    const cCenter = (cRect.top + cRect.bottom) / 2;
    const tCenter = (tRect.top + tRect.bottom) / 2;
    if (Math.abs(cCenter - tCenter) > TOLERANCE) {
      alignment = cCenter < tCenter ? 'start' : 'end';
    }
  }

  const placement: PositioningPlacement = alignment ? `${side}-${alignment}` : side;
  return placement;
}
