/** @jsxRuntime automatic */
/** @jsxImportSource @fluentui/react-jsx-runtime */

import { assertSlots } from '@fluentui/react-utilities';
import type { JSXElement } from '@fluentui/react-utilities';
import type { NavSubItemGroupState, NavSubItemGroupSlots } from './NavSubItemGroup.types';

/**
 * Render the final JSX of NavSubItemGroup
 *
 * Headless version — keeps collapsed children hidden and unfocusable, without motion.
 */
export const renderNavSubItemGroup = (state: NavSubItemGroupState): JSXElement | null => {
  assertSlots<NavSubItemGroupSlots>(state);

  return <state.root />;
};
