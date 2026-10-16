export type KeyboardNavigationSubscriber = {
  /**
   * Returns the element that owns `aria-activedescendant`. Keys pressed on it count as keyboard navigation even
   * when it is a text input (e.g. arrow keys in a combobox).
   */
  getActiveParent: () => HTMLElement | null;
  onChange: (isNavigatingWithKeyboard: boolean) => void;
};

type DocumentTracker = {
  isNavigatingWithKeyboard: boolean;
  subscribers: Set<KeyboardNavigationSubscriber>;
  dispose: () => void;
};

const NON_TEXT_INPUT_TYPES = new Set([
  'button',
  'checkbox',
  'color',
  'file',
  'image',
  'radio',
  'range',
  'reset',
  'submit',
]);

const trackers = new WeakMap<Document, DocumentTracker>();

/**
 * Returns the element that originally received the event. Unlike `event.target`, it is not retargeted to the
 * shadow host when the event crosses a shadow root boundary.
 */
const getComposedTarget = (event: Event): EventTarget | null => event.composedPath?.()[0] ?? event.target;

const isTextEditable = (target: EventTarget | null): boolean => {
  const element = target as HTMLElement | null;

  if (!element || typeof element.tagName !== 'string') {
    return false;
  }

  if (element.isContentEditable || element.tagName === 'TEXTAREA') {
    return true;
  }

  return element.tagName === 'INPUT' && !NON_TEXT_INPUT_TYPES.has((element as HTMLInputElement).type);
};

/**
 * Screen readers dispatch synthetic mouse events without buttons or coordinates, those keep the keyboard mode.
 */
const isVirtualMouseEvent = (event: MouseEvent): boolean =>
  event.buttons === 0 || (event.clientX === 0 && event.clientY === 0 && event.screenX === 0 && event.screenY === 0);

const createTracker = (targetDocument: Document): DocumentTracker => {
  const tracker: DocumentTracker = {
    isNavigatingWithKeyboard: false,
    subscribers: new Set(),
    dispose: () => {
      targetDocument.removeEventListener('keydown', onKeyDown, true);
      targetDocument.removeEventListener('mousedown', onPointerDown, true);
      targetDocument.removeEventListener('touchstart', onPointerDown, true);
    },
  };

  const setNavigatingWithKeyboard = (isNavigatingWithKeyboard: boolean) => {
    if (tracker.isNavigatingWithKeyboard === isNavigatingWithKeyboard) {
      return;
    }

    tracker.isNavigatingWithKeyboard = isNavigatingWithKeyboard;
    tracker.subscribers.forEach(subscriber => subscriber.onChange(isNavigatingWithKeyboard));
  };

  function onKeyDown(event: KeyboardEvent) {
    const target = getComposedTarget(event);

    // Same heuristic as keyborg: keys typed into text fields are not navigation, unless the text field is an
    // active descendant parent (e.g. a combobox input) where keys move the active option.
    if (
      event.key === 'Tab' ||
      !isTextEditable(target) ||
      Array.from(tracker.subscribers).some(subscriber => subscriber.getActiveParent() === target)
    ) {
      setNavigatingWithKeyboard(true);
    }
  }

  function onPointerDown(event: MouseEvent | TouchEvent) {
    if (event.type === 'mousedown' && isVirtualMouseEvent(event as MouseEvent)) {
      return;
    }

    setNavigatingWithKeyboard(false);
  }

  targetDocument.addEventListener('keydown', onKeyDown, true);
  targetDocument.addEventListener('mousedown', onPointerDown, true);
  targetDocument.addEventListener('touchstart', onPointerDown, true);

  return tracker;
};

/**
 * Tracks whether the user navigates with the keyboard or a pointer. A single set of listeners is shared by all
 * subscribers of a document, so that controllers mounted later (e.g. a listbox in a popup opened with the keyboard)
 * start with the current modality instead of assuming pointer navigation.
 *
 * Intentionally does not use keyborg, so that consumers without tabster don't pay for it.
 *
 * @returns the current modality and a function to unsubscribe
 */
export const subscribeToKeyboardNavigation = (
  targetDocument: Document,
  subscriber: KeyboardNavigationSubscriber,
): { isNavigatingWithKeyboard: boolean; unsubscribe: () => void } => {
  let tracker = trackers.get(targetDocument);
  if (!tracker) {
    tracker = createTracker(targetDocument);
    trackers.set(targetDocument, tracker);
  }

  tracker.subscribers.add(subscriber);

  const currentTracker = tracker;
  return {
    isNavigatingWithKeyboard: currentTracker.isNavigatingWithKeyboard,
    unsubscribe: () => {
      currentTracker.subscribers.delete(subscriber);

      if (currentTracker.subscribers.size === 0) {
        currentTracker.dispose();
        trackers.delete(targetDocument);
      }
    },
  };
};
