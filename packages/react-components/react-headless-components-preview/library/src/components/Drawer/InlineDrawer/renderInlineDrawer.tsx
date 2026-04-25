/** @jsxRuntime automatic */
/** @jsxImportSource @fluentui/react-jsx-runtime */

import { DrawerProvider, type DrawerContextValue } from '@fluentui/react-drawer';
import { assertSlots } from '@fluentui/react-utilities';
import type { JSXElement } from '@fluentui/react-utilities';
import type { InlineDrawerSlots, InlineDrawerState } from './InlineDrawer.types';

/**
 * Renders the final JSX of the InlineDrawer component, given the state.
 */
export const renderInlineDrawer = (state: InlineDrawerState, contextValue: DrawerContextValue): JSXElement | null => {
  if (!state.open && state.unmountOnClose) {
    return null;
  }

  assertSlots<InlineDrawerSlots>(state);

  return (
    <DrawerProvider value={contextValue}>
      <state.root />
    </DrawerProvider>
  );
};
