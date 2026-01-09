import * as React from 'react';
import { type TabBehaviorProps, useTabBehavior_unstable } from '../Tab/useTabBehavior';
import { type TabListBehaviorProps, useTabListBehavior_unstable } from './useTabListBehavior';
import { TabListProvider, TabListState, useTabListContextValues_unstable } from '@fluentui/react-tabs';
import { render } from '@testing-library/react';

describe('useTabListBehavior', () => {
  const CustomTab = React.forwardRef<HTMLButtonElement, TabBehaviorProps>((props, ref) => {
    const { tabProps, selected } = useTabBehavior_unstable(props, ref);

    const selectedProps = selected ? { style: { color: 'red' } } : {};

    return <button {...tabProps} {...selectedProps} />;
  });

  const CustomTabList = React.forwardRef<HTMLDivElement, TabListBehaviorProps>((props, ref) => {
    const { tabListProps, ...state } = useTabListBehavior_unstable(props, ref);

    return (
      <TabListProvider value={useTabListContextValues_unstable(state as TabListState).tabList}>
        <div {...tabListProps} />
      </TabListProvider>
    );
  });

  it('should render tabs', () => {
    const result = render(
      <CustomTabList selectedValue="1">
        <CustomTab value="1">First</CustomTab>
        <CustomTab value="2">Second</CustomTab>
        <CustomTab value="3">Third</CustomTab>
      </CustomTabList>,
    );

    expect(result.container).toMatchInlineSnapshot(`
      <div>
        <div
          aria-orientation="horizontal"
          data-tabster="{\\"mover\\":{\\"cyclic\\":true,\\"direction\\":2,\\"memorizeCurrent\\":false,\\"hasDefault\\":true}}"
          role="tablist"
        >
          <button
            aria-selected="true"
            data-tabster="{\\"focusable\\":{\\"isDefault\\":true}}"
            role="tab"
            style="color: red;"
            type="button"
            value="1"
          >
            First
          </button>
          <button
            aria-selected="false"
            data-tabster="{\\"focusable\\":{\\"isDefault\\":false}}"
            role="tab"
            type="button"
            value="2"
          >
            Second
          </button>
          <button
            aria-selected="false"
            data-tabster="{\\"focusable\\":{\\"isDefault\\":false}}"
            role="tab"
            type="button"
            value="3"
          >
            Third
          </button>
        </div>
      </div>
    `);
  });
});
