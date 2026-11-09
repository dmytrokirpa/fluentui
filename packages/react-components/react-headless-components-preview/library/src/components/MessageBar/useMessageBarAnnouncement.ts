'use client';

import * as React from 'react';
import { useAnnounce, useFluent_unstable, useHasAnnounceProvider_unstable } from '@fluentui/react-shared-contexts';
import { useDangerousNeverHidden_unstable } from '@fluentui/react-tabster';
import type { MessageBarState } from './MessageBar.types';

const MESSAGE_DURATION = 500;

export function useMessageBarAnnouncement(
  state: MessageBarState,
  rootRef: React.RefObject<HTMLDivElement | null>,
  politeness: 'polite' | 'assertive',
  hasOwnLiveRegion: boolean,
): void {
  const { targetDocument } = useFluent_unstable();
  const { announce } = useAnnounce();
  const hasAnnounceProvider = useHasAnnounceProvider_unstable();
  const hostAnnounce = hasAnnounceProvider ? announce : undefined;
  const neverHiddenAttributes = useDangerousNeverHidden_unstable();
  const { bodyRef, actionsRef } = state;

  React.useEffect(() => {
    const root = rootRef.current;
    const win = targetDocument?.defaultView;
    if (!root || !targetDocument || !win || (!hostAnnounce && hasOwnLiveRegion)) {
      return;
    }

    const getMessage = () => {
      const body = bodyRef.current?.textContent ?? root.textContent;
      const actions = bodyRef.current ? actionsRef.current?.textContent : undefined;
      return [body, actions].filter(Boolean).join(',');
    };
    let previousMessage = getMessage();
    let timeout: number | undefined;
    let region: HTMLDivElement | undefined;

    if (!hostAnnounce) {
      region = targetDocument.createElement('div');
      region.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status');
      Object.entries(neverHiddenAttributes).forEach(([key, value]) => region?.setAttribute(key, value));
      Object.assign(region.style, {
        position: 'absolute',
        width: '1px',
        height: '1px',
        clipPath: 'inset(50%)',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      });
      (root.closest('dialog, [aria-modal="true"]') ?? targetDocument.body).append(region);
    }

    const deliver = (message: string) => {
      if (!message) {
        win.clearTimeout(timeout);
        if (region) {
          region.textContent = '';
        }
        return;
      }
      if (hostAnnounce) {
        hostAnnounce(message, { polite: politeness === 'polite', alert: politeness === 'assertive' });
      } else if (region) {
        win.clearTimeout(timeout);
        const liveRegion = region;
        timeout = win.setTimeout(() => {
          // A child element is needed for reliable Narrator/Edge announcements.
          const text = targetDocument.createElement('span');
          text.textContent = message;
          liveRegion.textContent = '';
          liveRegion.append(text);
          timeout = win.setTimeout(() => {
            liveRegion.textContent = '';
          }, MESSAGE_DURATION);
        }, 0);
      }
    };

    if (!hostAnnounce) {
      deliver(previousMessage);
    }

    const observer = new win.MutationObserver(() => {
      const message = getMessage();
      if (message !== previousMessage) {
        deliver(message);
      }
      previousMessage = message;
    });
    observer.observe(root, { subtree: true, childList: true, characterData: true });

    return () => {
      observer.disconnect();
      win.clearTimeout(timeout);
      region?.remove();
    };
  }, [actionsRef, bodyRef, hasOwnLiveRegion, hostAnnounce, neverHiddenAttributes, politeness, rootRef, targetDocument]);
}
