import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { Nav } from '../Nav';
import { NavCategory } from '../NavCategory';
import { NavCategoryItem } from './NavCategoryItem';
import { NavSubItemGroup } from '../NavSubItemGroup';
import { NavSubItem } from '../NavSubItem';

describe('NavCategoryItem', () => {
  it('does not set data-expanded, data-selected, or data-disabled by default', () => {
    const result = render(
      <Nav>
        <NavCategory value="cat1">
          <NavCategoryItem>Category 1</NavCategoryItem>
          <NavSubItemGroup>
            <NavSubItem value="sub1">Sub Item 1</NavSubItem>
          </NavSubItemGroup>
        </NavCategory>
      </Nav>,
    );

    const categoryItem = result.getByText('Category 1');
    expect(categoryItem).not.toHaveAttribute('data-expanded');
    expect(categoryItem).not.toHaveAttribute('data-selected');
    expect(categoryItem).not.toHaveAttribute('data-disabled');
  });

  it('sets data-expanded when the category is open', () => {
    const result = render(
      <Nav defaultOpenCategories={['cat1']}>
        <NavCategory value="cat1">
          <NavCategoryItem>Category 1</NavCategoryItem>
          <NavSubItemGroup>
            <NavSubItem value="sub1">Sub Item 1</NavSubItem>
          </NavSubItemGroup>
        </NavCategory>
      </Nav>,
    );

    expect(result.getByText('Category 1')).toHaveAttribute('data-expanded');
  });

  it('removes data-expanded when the category is toggled closed', () => {
    const result = render(
      <Nav defaultOpenCategories={['cat1']}>
        <NavCategory value="cat1">
          <NavCategoryItem>Category 1</NavCategoryItem>
          <NavSubItemGroup>
            <NavSubItem value="sub1">Sub Item 1</NavSubItem>
          </NavSubItemGroup>
        </NavCategory>
      </Nav>,
    );

    fireEvent.click(result.getByText('Category 1'));
    expect(result.getByText('Category 1')).not.toHaveAttribute('data-expanded');
  });

  it('sets data-selected when the category is the selected category and closed', () => {
    const result = render(
      <Nav defaultSelectedCategoryValue="cat1">
        <NavCategory value="cat1">
          <NavCategoryItem>Category 1</NavCategoryItem>
          <NavSubItemGroup>
            <NavSubItem value="sub1">Sub Item 1</NavSubItem>
          </NavSubItemGroup>
        </NavCategory>
      </Nav>,
    );

    expect(result.getByText('Category 1')).toHaveAttribute('data-selected');
  });

  it('sets data-disabled when the category item is disabled', () => {
    const result = render(
      <Nav>
        <NavCategory value="cat1">
          <NavCategoryItem disabled>Category 1</NavCategoryItem>
          <NavSubItemGroup>
            <NavSubItem value="sub1">Sub Item 1</NavSubItem>
          </NavSubItemGroup>
        </NavCategory>
      </Nav>,
    );

    expect(result.getByText('Category 1')).toHaveAttribute('data-disabled');
  });

  it('describes the hidden current destination without making the category current', () => {
    const onSubmit = jest.fn(event => event.preventDefault());
    const onNavItemSelect = jest.fn();
    const { getByRole, getByText, container } = render(
      <form onSubmit={onSubmit}>
        <Nav defaultSelectedValue="settings" onNavItemSelect={onNavItemSelect}>
          <NavCategory value="account">
            <NavCategoryItem aria-describedby="hint" currentPageDescription="Contains current page: Settings">
              Account
            </NavCategoryItem>
            <NavSubItemGroup id="account-group">
              <NavSubItem id="settings-item" value="settings">
                Settings
              </NavSubItem>
            </NavSubItemGroup>
          </NavCategory>
        </Nav>
        <span id="hint">Account destinations</span>
      </form>,
    );
    const category = getByRole('button', { name: 'Account' });
    const group = container.querySelector('#account-group');
    const item = getByText('Settings');
    const describedBy = category.getAttribute('aria-describedby')?.split(' ') ?? [];

    expect(category).toHaveAttribute('type', 'button');
    expect(category).toHaveAttribute('data-selected');
    expect(category).not.toHaveAttribute('aria-current');
    expect(category).toHaveAttribute('aria-controls', 'account-group');
    expect(describedBy[0]).toBe('hint');
    expect(container.querySelector(`[id="${describedBy[1]}"]`)).toHaveTextContent('Contains current page: Settings');
    expect(
      getByRole('button', { name: 'Account', description: 'Account destinations Contains current page: Settings' }),
    ).toBe(category);
    expect(group).toHaveAttribute('hidden');
    expect(group).toHaveAttribute('inert');
    expect(item).toHaveAttribute('aria-current', 'page');
    expect(item).not.toBeVisible();

    fireEvent.click(category);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onNavItemSelect).not.toHaveBeenCalled();
    expect(category).toHaveAttribute('aria-expanded', 'true');
    expect(category).toHaveAttribute('aria-describedby', 'hint');
    expect(category).not.toHaveAttribute('data-selected');
    expect(group).not.toHaveAttribute('hidden');
    expect(group).not.toHaveAttribute('inert');
    expect(item).toBeVisible();

    fireEvent.click(category);
    expect(category).toHaveAttribute('aria-controls', 'account-group');
    expect(category).toHaveAttribute('data-selected');
    expect(item).not.toBeVisible();
  });

  it('moves carried selection with a controlled route even if the category value is stale', () => {
    const renderNav = (selectedValue: string) => (
      <Nav selectedValue={selectedValue} selectedCategoryValue="account">
        <NavCategory value="account">
          <NavCategoryItem currentPageDescription="Aktuelle Seite: Einstellungen">Account</NavCategoryItem>
          <NavSubItemGroup>
            <NavSubItem value="settings">Settings</NavSubItem>
          </NavSubItemGroup>
        </NavCategory>
        <NavCategory value="projects">
          <NavCategoryItem currentPageDescription="Aktuelle Seite: Projekte">Projects</NavCategoryItem>
          <NavSubItemGroup>
            <NavSubItem value="project">Project</NavSubItem>
          </NavSubItemGroup>
        </NavCategory>
      </Nav>
    );
    const { getByRole, getByText, rerender } = render(renderNav('settings'));
    const account = getByRole('button', { name: 'Account' });
    const projects = getByRole('button', { name: 'Projects' });

    expect(account).toHaveAttribute('data-selected');
    expect(projects).not.toHaveAttribute('data-selected');
    rerender(renderNav('project'));
    expect(account).not.toHaveAttribute('data-selected');
    expect(account).not.toHaveAttribute('aria-describedby');
    expect(projects).toHaveAttribute('data-selected');
    expect(getByText('Project')).toHaveAttribute('aria-current', 'page');
    expect(getByText('Aktuelle Seite: Projekte')).toBeInTheDocument();
  });

  it('uses the current item as a fallback description and keeps a generated group ID stable', () => {
    const { getByRole, getByText, container } = render(
      <Nav defaultSelectedValue="settings">
        <NavCategory value="account">
          <NavCategoryItem>Account</NavCategoryItem>
          <NavSubItemGroup>
            <NavSubItem id="settings-item" value="settings" aria-label="Account settings">
              Settings
            </NavSubItem>
          </NavSubItemGroup>
        </NavCategory>
      </Nav>,
    );
    const category = getByRole('button', { name: 'Account' });
    const groupId = category.getAttribute('aria-controls');

    expect(category).toHaveAttribute('aria-describedby', 'settings-item');
    expect(getByRole('button', { name: 'Account', description: 'Settings' })).toBe(category);
    expect(container.querySelector(`[id="${groupId}"]`)).toContainElement(getByText('Settings'));
    fireEvent.click(category);
    expect(category).toHaveAttribute('aria-controls', groupId);
    fireEvent.click(category);
    expect(category).toHaveAttribute('aria-controls', groupId);
    expect(category).toHaveAttribute('aria-describedby', 'settings-item');
  });

  it('renders a coordinated custom group ID and description on the server', () => {
    const markup = renderToString(
      <Nav selectedValue="settings" selectedCategoryValue="account">
        <NavCategory value="account" groupId="account-group">
          <NavCategoryItem currentPageDescription="Contains current page: Settings">Account</NavCategoryItem>
          <NavSubItemGroup>
            <NavSubItem value="settings">Settings</NavSubItem>
          </NavSubItemGroup>
        </NavCategory>
      </Nav>,
    );

    expect(markup).toContain('aria-controls="account-group"');
    expect(markup).toContain('id="account-group"');
    expect(markup).toContain('Contains current page: Settings');
    expect(markup).toContain('aria-current="page"');
    expect(markup).toContain('hidden=""');
  });
});
