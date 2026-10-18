import * as React from 'react';
import { render } from '@testing-library/react';
import { TreeItemLayout } from './TreeItemLayout';
import { isConformant } from '../../testing/isConformant';
import { TreeItemProvider } from '../../contexts';
import { Tree } from '../Tree';
import { TreeItem } from '../TreeItem';

const Wrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <TreeItemProvider
    value={{
      value: '',
      selectionRef: React.createRef(),
      layoutRef: React.createRef(),
      subtreeRef: React.createRef(),
      actionsRef: React.createRef(),
      expandIconRef: React.createRef(),
      treeItemRef: React.createRef(),
      isActionsVisible: true,
      isAsideVisible: true,
      itemType: 'leaf',
      open: false,
      checked: false,
    }}
  >
    {children}
  </TreeItemProvider>
);

describe('TreeItemLayout', () => {
  isConformant({
    Component: TreeItemLayout,
    renderOptions: { wrapper: Wrapper },
    displayName: 'TreeItemLayout',
    disabledTests: [
      // This is disabled as aside and actions cannot be visible at the same time
      'component-has-static-classnames',
      'component-has-static-classnames-object',
    ],
    requiredProps: {
      iconAfter: 'iconAfter',
      iconBefore: 'iconBefore',
      expandIcon: 'expandIcon',
      actions: 'actions',
      aside: 'aside',
      selector: {},
    },
  });

  it('renders a default state', () => {
    const result = render(<TreeItemLayout>Default TreeItemLayout</TreeItemLayout>);
    expect(result.container).toMatchSnapshot();
  });

  it('does not propagate actions visibility props to the DOM', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const onVisibilityChange = jest.fn();
    const { getByRole } = render(
      <Tree aria-label="Tree">
        <TreeItem itemType="leaf" value="item">
          <TreeItemLayout actions={{ visible: true, onVisibilityChange, children: 'a' }}>item</TreeItemLayout>
        </TreeItem>
      </Tree>,
    );
    const actions = getByRole('toolbar');
    expect(actions.textContent).toBe('a');
    expect(actions.hasAttribute('visible')).toBe(false);
    expect(actions.hasAttribute('onVisibilityChange')).toBe(false);
    // React drops `visible={true}` from the DOM but warns about the unknown attribute
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
