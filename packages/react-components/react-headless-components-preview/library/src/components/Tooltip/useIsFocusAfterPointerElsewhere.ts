'use client';

import * as React from 'react';
import { useFluent_unstable as useFluent } from '@fluentui/react-shared-contexts';

type PointerTracker = {
  /** Composed path of the last pointer press, cleared by any key press. */
  lastPointerDownPath: EventTarget[] | null;
  subscribers: number;
  dispose: () => void;
};

const trackers = new WeakMap<Document, PointerTracker>();

/**
 * Screen readers dispatch synthetic mouse events without buttons or coordinates, those are not pointer interactions.
 */
const isVirtualMouseEvent = (event: MouseEvent): boolean =>
  event.buttons === 0 || (event.clientX === 0 && event.clientY === 0 && event.screenX === 0 && event.screenY === 0);

const subscribe = (targetDocument: Document): PointerTracker => {
  let tracker = trackers.get(targetDocument);

  if (!tracker) {
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (event.type === 'mousedown' && isVirtualMouseEvent(event as MouseEvent)) {
        return;
      }

      // composedPath() keeps the original target when the event crosses shadow root boundaries
      currentTracker.lastPointerDownPath = event.composedPath?.() ?? (event.target ? [event.target] : []);
    };
    const onKeyDown = () => {
      currentTracker.lastPointerDownPath = null;
    };

    const currentTracker: PointerTracker = {
      lastPointerDownPath: null,
      subscribers: 0,
      dispose: () => {
        targetDocument.removeEventListener('mousedown', onPointerDown, true);
        targetDocument.removeEventListener('touchstart', onPointerDown, true);
        targetDocument.removeEventListener('keydown', onKeyDown, true);
      },
    };

    targetDocument.addEventListener('mousedown', onPointerDown, true);
    targetDocument.addEventListener('touchstart', onPointerDown, true);
    targetDocument.addEventListener('keydown', onKeyDown, true);

    tracker = currentTracker;
    trackers.set(targetDocument, tracker);
  }

  tracker.subscribers++;
  return tracker;
};

const unsubscribe = (targetDocument: Document, tracker: PointerTracker) => {
  tracker.subscribers--;

  if (tracker.subscribers === 0) {
    tracker.dispose();
    trackers.delete(targetDocument);
  }
};

/**
 * Returns a function that tells whether the most recent user interaction was a pointer press outside of the given
 * element, i.e. focus on that element was moved there programmatically after a mouse/touch interaction (for example,
 * a dialog closed with the mouse restoring focus to its trigger).
 *
 * Native `:focus-visible` can't tell this apart for text inputs, which always match it. A single set of document
 * listeners is shared by all subscribers, and keyborg is intentionally not used, so that consumers without tabster
 * don't pay for it.
 */
export const useIsFocusAfterPointerElsewhere = (): ((element: Element) => boolean) => {
  const { targetDocument } = useFluent();
  const trackerRef = React.useRef<PointerTracker | null>(null);

  React.useEffect(() => {
    if (!targetDocument) {
      return;
    }

    const tracker = subscribe(targetDocument);
    trackerRef.current = tracker;

    return () => {
      trackerRef.current = null;
      unsubscribe(targetDocument, tracker);
    };
  }, [targetDocument]);

  return React.useCallback((element: Element) => {
    const path = trackerRef.current?.lastPointerDownPath;
    return !!path && !path.includes(element);
  }, []);
};
