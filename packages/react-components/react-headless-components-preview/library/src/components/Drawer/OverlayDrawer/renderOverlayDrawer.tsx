'use client';

import * as React from 'react';
import { DrawerProvider, type DrawerContextValue } from '@fluentui/react-drawer';
import type { JSXElement } from '@fluentui/react-utilities';
import { Dialog, DialogSurface } from '../../Dialog';
import type { OverlayDrawerState } from './OverlayDrawer.types';

/**
 * Renders the final JSX of the OverlayDrawer component, given the state.
 */
export const renderOverlayDrawer = (state: OverlayDrawerState, contextValue: DrawerContextValue): JSXElement => {
  return (
    <DrawerProvider value={contextValue}>
      <Dialog
        inertTrapFocus={state.inertTrapFocus}
        modalType={state.modalType}
        onOpenChange={state.onOpenChange}
        open={state.open}
        unmountOnClose={state.unmountOnClose}
      >
        <DialogSurface {...state.root} />
      </Dialog>
    </DrawerProvider>
  );
};
