import type { PositioningVirtualElement } from '../types';

export interface VirtualElementProxy {
  element: HTMLElement;
  update(virtualEl: PositioningVirtualElement): void;
  dispose(): void;
}

/**
 * Creates a hidden 1×1 fixed DOM element that acts as a CSS anchor for virtual
 * elements (e.g. mouse-positioned context menus).  The proxy is appended to
 * `document.body` and its `left`/`top` are kept in sync with the virtual
 * element's bounding rect.
 */
export function createVirtualElementProxy(doc: Document, anchorName: string): VirtualElementProxy {
  const el = doc.createElement('div');
  el.style.cssText = 'position:fixed;width:1px;height:1px;pointer-events:none;visibility:hidden;clip:rect(0,0,0,0);';
  el.style.setProperty('anchor-name', anchorName);
  doc.body.appendChild(el);

  return {
    element: el,

    update(virtualEl: PositioningVirtualElement): void {
      const rect = virtualEl.getBoundingClientRect();
      el.style.setProperty('left', `${rect.left}px`);
      el.style.setProperty('top', `${rect.top}px`);
    },

    dispose(): void {
      el.remove();
    },
  };
}
