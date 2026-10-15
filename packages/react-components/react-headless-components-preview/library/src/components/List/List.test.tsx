import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { isConformant } from '../../testing/isConformant';
import { List } from './List';
import { ListItem } from './ListItem/ListItem';

describe('List', () => {
  isConformant({
    Component: List,
    displayName: 'List',
  });

  it('renders a default state', () => {
    const { getByRole, getAllByRole } = render(
      <List>
        <ListItem value="one">First item</ListItem>
        <ListItem value="two">Second item</ListItem>
      </List>,
    );

    expect(getByRole('list').tagName).toBe('UL');
    expect(getAllByRole('listitem')).toHaveLength(2);
    expect(getAllByRole('listitem')[0].tagName).toBe('LI');
  });

  it('does not set navigation or selection data attributes by default', () => {
    const { getByRole } = render(
      <List>
        <ListItem value="one">First item</ListItem>
      </List>,
    );

    expect(getByRole('list')).not.toHaveAttribute('data-navigation-mode');
    expect(getByRole('list')).not.toHaveAttribute('data-selectable');
  });

  it.each(['items', 'composite'] as const)('sets data-navigation-mode to %s', navigationMode => {
    const { container } = render(
      <List navigationMode={navigationMode}>
        <ListItem value="one">
          {navigationMode === 'composite' ? (
            <span role="gridcell">
              <button>First item</button>
            </span>
          ) : (
            'First item'
          )}
        </ListItem>
      </List>,
    );

    expect(container.firstElementChild).toHaveAttribute('data-navigation-mode', navigationMode);
  });

  it('sets data-selectable and the listbox semantics when selection is enabled', () => {
    const { getByRole, getAllByRole } = render(
      <List selectionMode="multiselect">
        <ListItem value="one">First item</ListItem>
        <ListItem value="two">Second item</ListItem>
      </List>,
    );

    const list = getByRole('listbox');

    expect(list).toHaveAttribute('data-selectable', '');
    expect(list).toHaveAttribute('aria-multiselectable', 'true');
    expect(getAllByRole('option')).toHaveLength(2);
  });

  it('renders a native checkbox as the checkmark slot', () => {
    const { getAllByRole } = render(
      <List selectionMode="multiselect">
        <ListItem value="one">First item</ListItem>
      </List>,
    );

    const checkbox = getAllByRole('checkbox')[0];

    expect(checkbox.tagName).toBe('INPUT');
    expect(checkbox).toHaveAttribute('type', 'checkbox');
    expect(checkbox.closest('.fui-Checkbox')).toBeNull();
  });

  it('preserves an explicit ordered-list root and item semantics', () => {
    const { getByRole } = render(
      <List as="ol">
        <ListItem value="one">First item</ListItem>
      </List>,
    );

    expect(getByRole('list').tagName).toBe('OL');
    expect(getByRole('listitem').tagName).toBe('LI');
  });

  it('validates the resolved default composite root and item elements', () => {
    const { getByRole } = render(
      <List aria-label="Actions" navigationMode="composite">
        <ListItem value="one">
          <span role="gridcell">
            <button>Edit</button>
          </span>
        </ListItem>
      </List>,
    );

    expect(getByRole('grid').tagName).toBe('DIV');
    expect(getByRole('row').tagName).toBe('DIV');
  });

  it('does not include Tabster attributes or Fluent styling', () => {
    const { container, getByRole } = render(
      <List navigationMode="items">
        <ListItem value="one">First item</ListItem>
      </List>,
    );

    expect(getByRole('list')).toHaveAttribute('focusgroup', 'toolbar block');
    expect(container.querySelector('[data-tabster]')).toBeNull();
    expect(container.querySelector('[class]')).toBeNull();
  });

  it('selects and deselects an item in multiselect mode', () => {
    const onSelectionChange = jest.fn();

    const { getAllByRole } = render(
      <List selectionMode="multiselect" onSelectionChange={onSelectionChange}>
        <ListItem value="one">First item</ListItem>
        <ListItem value="two">Second item</ListItem>
      </List>,
    );

    const [first] = getAllByRole('option');

    expect(first).toHaveAttribute('aria-selected', 'false');
    expect(first).not.toHaveAttribute('data-selected');

    fireEvent.click(first);
    expect(first).toHaveAttribute('aria-selected', 'true');
    expect(first).toHaveAttribute('data-selected', '');
    expect(onSelectionChange).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({ selectedItems: ['one'] }),
    );

    fireEvent.click(first);
    expect(first).toHaveAttribute('aria-selected', 'false');
    expect(first).not.toHaveAttribute('data-selected');
    expect(onSelectionChange).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({ selectedItems: [] }),
    );
  });

  it('supports controlled selection', () => {
    const { getAllByRole, rerender } = render(
      <List selectionMode="single" selectedItems={['one']}>
        <ListItem value="one">First item</ListItem>
        <ListItem value="two">Second item</ListItem>
      </List>,
    );

    const [first, second] = getAllByRole('option');
    expect(first).toHaveAttribute('data-selected', '');
    expect(second).not.toHaveAttribute('data-selected');

    // Controlled state ignores the click until the consumer updates the prop.
    fireEvent.click(second);
    expect(first).toHaveAttribute('data-selected', '');

    rerender(
      <List selectionMode="single" selectedItems={['two']}>
        <ListItem value="one">First item</ListItem>
        <ListItem value="two">Second item</ListItem>
      </List>,
    );

    expect(getAllByRole('option')[0]).not.toHaveAttribute('data-selected');
    expect(getAllByRole('option')[1]).toHaveAttribute('data-selected', '');
  });

  it('does not let a consumer misrepresent the reserved selection attribute', () => {
    const { getByRole } = render(
      <List data-selectable="nope">
        <ListItem value="one">First item</ListItem>
      </List>,
    );

    expect(getByRole('list')).not.toHaveAttribute('data-selectable');
  });

  it.each(['single', 'multiselect'] as const)(
    'has no accessibility violations with populated %s selection',
    async selectionMode => {
      const { baseElement } = render(
        <List aria-label="Items" selectionMode={selectionMode}>
          <ListItem value="one" checkmark={null}>
            First item
          </ListItem>
          <ListItem value="two" checkmark={null}>
            Second item
          </ListItem>
        </List>,
      );

      expect(await axe(baseElement, { rules: { region: { enabled: false } } })).toHaveNoViolations();
    },
  );

  it('has no accessibility violations with populated composite actions', async () => {
    const { baseElement, getByRole } = render(
      <List aria-label="People actions" navigationMode="composite">
        <ListItem value="alex">
          <span role="gridcell">
            <span aria-hidden>Avatar</span>
          </span>
          <span role="gridcell">Alex</span>
          <span role="gridcell">
            <button aria-label="Edit Alex" focusgroup="none">
              Edit
            </button>
            <button aria-label="More options for Alex" focusgroup="none">
              More
            </button>
          </span>
        </ListItem>
      </List>,
    );

    expect(Array.from(getByRole('row').children, child => child.getAttribute('role'))).toEqual([
      'gridcell',
      'gridcell',
      'gridcell',
    ]);
    expect(await axe(baseElement, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });

  it('has no accessibility violations with named native checkmarks in a composite grid', async () => {
    const { baseElement } = render(
      <List aria-label="People actions" navigationMode="composite" selectionMode="multiselect">
        <ListItem value="alex" checkmark={{ 'aria-label': 'Select Alex', tabIndex: 0 }}>
          <span role="gridcell">Alex</span>
          <span role="gridcell">
            <button aria-label="Edit Alex" focusgroup="none">
              Edit
            </button>
          </span>
        </ListItem>
      </List>,
    );

    expect(await axe(baseElement, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });

  it('delegates composite row and control navigation to focusgroup itemcontrols', () => {
    const { getByRole, getAllByRole } = render(
      <List aria-label="Actions" navigationMode="composite">
        <ListItem value="one">
          <span role="gridcell">One</span>
          <span role="gridcell">
            <button focusgroup="none">Edit</button>
          </span>
        </ListItem>
        <ListItem value="two">
          <span role="gridcell">Two</span>
        </ListItem>
      </List>,
    );

    expect(getByRole('grid')).toHaveAttribute('focusgroup', 'toolbar block itemcontrols');
    for (const row of getAllByRole('row')) {
      expect(row).toHaveAttribute('tabindex', '0');
      expect(row).not.toHaveAttribute('focusgroup');
    }
    expect(getByRole('button')).not.toHaveAttribute('tabindex');
  });

  it('opts the composite checkmark cell out of row navigation', () => {
    const { getByRole } = render(
      <List aria-label="Actions" navigationMode="composite" selectionMode="multiselect">
        <ListItem value="one" checkmark={{ 'aria-label': 'Select one' }}>
          <span role="gridcell">One</span>
        </ListItem>
      </List>,
    );

    expect(getByRole('checkbox').parentElement).toHaveAttribute('role', 'gridcell');
    expect(getByRole('checkbox').parentElement).toHaveAttribute('focusgroup', 'none');
  });

  it('counts opted-out controls removed from the tab order by itemcontrols as row content', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    render(
      <List aria-label="Actions" navigationMode="composite">
        <ListItem value="one">
          <span role="gridcell">
            <button focusgroup="none" tabIndex={-1}>
              Edit
            </button>
          </span>
        </ListItem>
      </List>,
    );

    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});
