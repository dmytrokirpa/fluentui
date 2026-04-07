import { isHTMLElement } from '@fluentui/react-utilities';
import type { OnPositioningEndEventDetail, PositionManager, PositioningOptions, TargetElement } from './types';
import {
  DATA_POSITIONING_HIDDEN,
  DATA_POSITIONING_PLACEMENT,
  DATA_FUI_ANCHOR,
  POSITIONING_END_EVENT,
} from './constants';
import { buildAnchorCSS } from './utils/buildAnchorCSS';
import { getStyleSheetManager } from './utils/cssAnchorStyleSheet';
import { detectCSSAnchorPlacement } from './utils/detectCSSAnchorPlacement';
import { createVirtualElementProxy } from './utils/virtualElementProxy';
import { loadCSSAnchorPolyfill } from './utils/loadCSSAnchorPolyfill';
import { createResizeObserver } from './utils/createResizeObserver';

let anchorIdCounter = 0;

interface CSSAnchorPositionManagerOptions
  extends Pick<
    PositioningOptions,
    | 'position'
    | 'align'
    | 'strategy'
    | 'offset'
    | 'pinned'
    | 'fallbackPositions'
    | 'autoSize'
    | 'matchTargetSize'
    | 'coverTarget'
    | 'disableUpdateOnResize'
    // Unsupported options (ignored with a dev warning):
    // overflowBoundary, flipBoundary, shiftToCoverTarget, unstable_disableTether
  > {
  container: HTMLElement;
  target: TargetElement;
  arrow: HTMLElement | null;
}

/**
 * @internal
 * Position manager that uses CSS Anchor Positioning instead of @floating-ui/dom.
 * Returned interface is identical to the one from `createPositionManager` so it is
 * a drop-in replacement inside `usePositioning`.
 */
export function createCSSAnchorPositionManager(options: CSSAnchorPositionManagerOptions): PositionManager {
  const {
    container,
    target,
    arrow,
    position,
    align,
    strategy = 'fixed',
    offset,
    pinned,
    fallbackPositions,
    autoSize,
    matchTargetSize,
    coverTarget,
    disableUpdateOnResize = false,
  } = options;

  const targetWindow = container.ownerDocument.defaultView;

  if (!target || !container || !targetWindow) {
    return { updatePosition: () => undefined, dispose: () => undefined };
  }

  if (process.env.NODE_ENV !== 'production') {
    // Warn about unsupported options
    const unsupported: string[] = [];
    if ((options as PositioningOptions).overflowBoundary) unsupported.push('overflowBoundary');
    if ((options as PositioningOptions).flipBoundary) unsupported.push('flipBoundary');
    if ((options as PositioningOptions).shiftToCoverTarget) unsupported.push('shiftToCoverTarget');
    if ((options as PositioningOptions).unstable_disableTether) unsupported.push('unstable_disableTether');
    if (unsupported.length > 0) {
      // eslint-disable-next-line no-console
      console.warn(
        `[usePositioning]: The following options are not supported when useNativeAnchoring is enabled and will be ignored: ${unsupported.join(
          ', ',
        )}. ` + 'Use useNativeAnchoring: false to restore full support for these options.',
      );
    }
  }

  let isDestroyed = false;
  const anchorName = `--fui-anchor-${++anchorIdCounter}`;
  const doc = container.ownerDocument;
  const styleManager = getStyleSheetManager(doc);

  // --- Virtual element proxy ---
  // For virtual targets (mouse position), we create a hidden proxy DOM element
  // to serve as the CSS anchor, since anchor-name can only be set on real elements.
  let virtualProxy: ReturnType<typeof createVirtualElementProxy> | null = null;
  if (!isHTMLElement(target)) {
    virtualProxy = createVirtualElementProxy(doc, anchorName);
    virtualProxy.update(target);
  }

  // Set anchor-name on the real target element (or the proxy for virtual targets)
  const anchorElement = virtualProxy?.element ?? (target as HTMLElement);
  anchorElement.style.setProperty('anchor-name', anchorName);

  // Mark the container so the CSS rule selector can target it
  container.setAttribute(DATA_FUI_ANCHOR, anchorName);

  // Write CSS rules — buildAnchorCSS returns an array; join them so StyleSheetManager
  // can split and insert each one individually via its composite-text logic.
  const cssRules = buildAnchorCSS({
    anchorName,
    position,
    align,
    strategy,
    offset,
    pinned,
    fallbackPositions,
    autoSize,
    matchTargetSize,
    coverTarget,
  });
  styleManager.insert(anchorName, cssRules.join('\n'));

  // ResizeObserver triggers placement detection after layout changes
  let rafId: number | null = null;

  const detectAndWritePlacement = () => {
    if (isDestroyed) return;

    const activeTarget = virtualProxy?.element ?? target;
    const placement = detectCSSAnchorPlacement(container, isHTMLElement(activeTarget) ? activeTarget : target);

    container.setAttribute(DATA_POSITIONING_PLACEMENT, placement);

    // reference-hidden: check whether target is in the viewport
    const tRect = (isHTMLElement(target) ? target : virtualProxy?.element)?.getBoundingClientRect();
    if (tRect) {
      const win = targetWindow;
      const isHidden =
        tRect.bottom < 0 || tRect.top > win.innerHeight || tRect.right < 0 || tRect.left > win.innerWidth;
      if (isHidden) {
        container.setAttribute(DATA_POSITIONING_HIDDEN, '');
      } else {
        container.removeAttribute(DATA_POSITIONING_HIDDEN);
      }
    }

    container.dispatchEvent(
      new CustomEvent<OnPositioningEndEventDetail>(POSITIONING_END_EVENT, {
        detail: { placement },
      }),
    );
  };

  const scheduleDetection = () => {
    if (rafId !== null) return;
    rafId = targetWindow.requestAnimationFrame(() => {
      rafId = null;
      detectAndWritePlacement();
    });
  };

  const resizeObserver = disableUpdateOnResize
    ? null
    : createResizeObserver(targetWindow, entries => {
        const shouldUpdate = entries.every(e => e.contentRect.width > 0 && e.contentRect.height > 0);
        if (shouldUpdate) {
          scheduleDetection();
        }
      });

  resizeObserver?.observe(container);
  if (isHTMLElement(target)) {
    resizeObserver?.observe(target as HTMLElement);
  }

  // Set initial `position` style so the container participates in CSS Anchor layout.
  // The CSS rule also sets this but we need it before the first paint to avoid flicker.
  Object.assign(container.style, { position: strategy, left: '', top: '', transform: '' });

  // Await polyfill before first detection (no-op if natively supported)
  loadCSSAnchorPolyfill().then(() => {
    if (!isDestroyed) {
      scheduleDetection();
    }
  });

  const updatePosition = () => {
    if (isDestroyed) return;

    // For virtual elements, re-sync the proxy position when updatePosition is called
    if (virtualProxy && !isHTMLElement(target)) {
      virtualProxy.update(target);
    }

    scheduleDetection();
  };

  const dispose = () => {
    isDestroyed = true;

    if (rafId !== null) {
      targetWindow.cancelAnimationFrame(rafId);
      rafId = null;
    }

    resizeObserver?.disconnect();

    // Clean up CSS anchor name from real target
    if (isHTMLElement(target)) {
      (target as HTMLElement).style.removeProperty('anchor-name');
    }

    // Clean up virtual proxy
    virtualProxy?.dispose();
    virtualProxy = null;

    // Remove container attribute
    container.removeAttribute(DATA_FUI_ANCHOR);

    // Remove injected CSS rules
    styleManager.remove(anchorName);
  };

  return { updatePosition, dispose };
}
