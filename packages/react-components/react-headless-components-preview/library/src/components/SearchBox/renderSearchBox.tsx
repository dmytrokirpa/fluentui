/** @jsxRuntime automatic */
/** @jsxImportSource @fluentui/react-jsx-runtime */

import { assertSlots } from '@fluentui/react-utilities';
import type { JSXElement } from '@fluentui/react-utilities';
import type { SearchBoxSlots, SearchBoxState } from './Search.types';

export const renderSearchBox = (state: SearchBoxState): JSXElement => {
  assertSlots<SearchBoxSlots>(state);

  return (
    <state.root>
      {state.contentBefore && <state.contentBefore />}
      <state.input />
      {state.contentAfter && (
        <state.contentAfter>
          {state.contentAfter.children}
          {state.dismiss && <state.dismiss />}
        </state.contentAfter>
      )}
    </state.root>
  );
};
