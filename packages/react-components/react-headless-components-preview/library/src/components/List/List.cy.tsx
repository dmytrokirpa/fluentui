import * as React from 'react';
import { mount as mountBase } from '@fluentui/scripts-cypress';
import { polyfillBodyAndObserve, supportsFocusGroup } from '@microsoft/focusgroup-polyfill';
import type { JSXElement } from '@fluentui/react-utilities';

import { Provider } from '../Provider';
import { List } from './List';
import { ListItem } from './ListItem/ListItem';

polyfillBodyAndObserve();

const mount = (element: JSXElement) => mountBase(<Provider>{element}</Provider>);

describe('List', () => {
  before(() => {
    if (Cypress.env('nativeFocusgroup')) {
      expect(supportsFocusGroup(), 'native focusgroup support with no polyfill').to.be.true;
    }
  });

  it('moves between composite rows with arrow keys and leaves opted-out controls to the focusgroup', () => {
    mount(
      <List aria-label="People actions" navigationMode="composite">
        {['Alex', 'Mona', 'Allan'].map(person => (
          <ListItem key={person} value={person}>
            <span role="gridcell">{person}</span>
            <span role="gridcell">
              <button aria-label={`Edit ${person}`} focusgroup="none">
                Edit
              </button>
            </span>
          </ListItem>
        ))}
      </List>,
    );

    cy.get('[role="grid"]').should('have.attr', 'focusgroup', 'toolbar block itemcontrols');
    cy.get('[role="row"]').first().focus().realPress('ArrowDown');
    cy.get('[role="row"]').eq(1).should('be.focused').realPress('End');
    cy.get('[role="row"]').last().should('be.focused').realPress('Home');
    cy.get('[role="row"]').first().should('be.focused').realPress('ArrowRight');
    cy.get('[role="row"]').first().should('be.focused');
  });

  it('uses a single composite tab stop and remembers the current row on re-entry', () => {
    mount(
      <>
        <button>Before</button>
        <List aria-label="People" navigationMode="composite">
          {['Alex', 'Mona'].map(person => (
            <ListItem key={person} value={person}>
              <span role="gridcell">{person}</span>
            </ListItem>
          ))}
        </List>
        <button>After</button>
      </>,
    );

    cy.contains('button', 'Before').focus().realPress('Tab');
    cy.get('[role="row"]').first().should('be.focused').realPress('ArrowDown');
    cy.get('[role="row"]').eq(1).should('be.focused').realPress('Tab');
    cy.contains('button', 'After').should('be.focused').realPress(['Shift', 'Tab']);
    cy.get('[role="row"]').eq(1).should('be.focused');
  });

  it('selects a composite row with Space when the checkmark is opted out of row navigation', () => {
    const onSelectionChange = cy.stub().as('selectionChange');
    mount(
      <List
        aria-label="Actions"
        navigationMode="composite"
        selectionMode="multiselect"
        onSelectionChange={onSelectionChange}
      >
        <ListItem value="one" checkmark={{ 'aria-label': 'Select first item' }}>
          <span role="gridcell">First item</span>
        </ListItem>
      </List>,
    );

    cy.get('[aria-label="Select first item"]').parent().should('have.attr', 'focusgroup', 'none');
    cy.get('[role="row"]').focus().realPress('Space');
    cy.get('[role="row"]').should('have.attr', 'data-selected', '');
    cy.get('@selectionChange').should('have.been.calledOnce');
  });

  it('moves vertically between items and remembers focus when re-entering the list', () => {
    mount(
      <>
        <button>Before</button>
        <List aria-label="Items" navigationMode="items">
          <ListItem value="one">First item</ListItem>
          <ListItem value="two">Second item</ListItem>
          <ListItem value="three">Third item</ListItem>
        </List>
        <button>After</button>
      </>,
    );

    cy.get('[role="list"]').should('not.have.attr', 'data-tabster');
    cy.contains('button', 'Before').focus().realPress('Tab');
    cy.contains('[role="listitem"]', 'First item').should('be.focused').realPress('ArrowDown');
    cy.contains('[role="listitem"]', 'Second item').should('be.focused').realPress('Tab');
    cy.contains('button', 'After').should('be.focused').realPress(['Shift', 'Tab']);
    cy.contains('[role="listitem"]', 'Second item').should('be.focused').realPress('ArrowUp');
    cy.contains('[role="listitem"]', 'First item').should('be.focused');
  });

  it('selects once with Space, Enter, and the native checkmark', () => {
    const onSelectionChange = cy.stub().as('selectionChange');
    mount(
      <List aria-label="Items" selectionMode="multiselect" onSelectionChange={onSelectionChange}>
        <ListItem value="one">First item</ListItem>
        <ListItem value="two">Second item</ListItem>
      </List>,
    );

    cy.contains('[role="option"]', 'First item').focus().realPress('Space');
    cy.contains('[role="option"]', 'First item')
      .should('have.attr', 'data-selected', '')
      .find('input[type="checkbox"]')
      .should('be.checked');
    cy.get('@selectionChange').should('have.been.calledOnce');

    cy.contains('[role="option"]', 'First item').realPress('ArrowDown');
    cy.contains('[role="option"]', 'Second item').should('be.focused').realPress('Enter');
    cy.contains('[role="option"]', 'Second item').should('have.attr', 'data-selected', '');
    cy.get('@selectionChange').should('have.been.calledTwice');

    cy.contains('[role="option"]', 'Second item').find('input[type="checkbox"]').click();
    cy.contains('[role="option"]', 'Second item').should('not.have.attr', 'data-selected');
    cy.get('@selectionChange').should('have.been.calledThrice');
  });

  it('keeps disabled selection inert for pointer, keyboard, and checkmark interaction', () => {
    const onSelectionChange = cy.stub().as('selectionChange');
    mount(
      <List aria-label="Items" selectionMode="multiselect" onSelectionChange={onSelectionChange}>
        <ListItem value="one" disabledSelection>
          First item
        </ListItem>
      </List>,
    );

    cy.contains('[role="option"]', 'First item').click().focus().realPress('Space').realPress('Enter');
    cy.contains('[role="option"]', 'First item')
      .should('have.attr', 'data-disabled', '')
      .should('not.have.attr', 'data-selected');
    cy.contains('[role="option"]', 'First item').find('input[type="checkbox"]').should('be.disabled');
    cy.get('@selectionChange').should('not.have.been.called');
  });
});
