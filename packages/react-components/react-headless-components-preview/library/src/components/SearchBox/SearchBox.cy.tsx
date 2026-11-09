import * as React from 'react';
import { mount } from '@fluentui/scripts-cypress';
import { SearchBox } from './SearchBox';

describe('SearchBox', () => {
  (['Enter', 'Space'] as const).forEach(key => {
    it(`clears with ${key} after tabbing to the clear button`, () => {
      const onChange = cy.stub().as('onChange');
      mount(<SearchBox aria-label="Search" defaultValue="query" onChange={onChange} />);

      cy.get('input').focus().realPress('Tab');
      cy.get('button[aria-label="clear"]').should('be.focused').realPress(key);
      cy.get('input').should('be.focused').and('have.value', '');
      cy.get('button[aria-label="clear"]').should('not.exist');
      cy.get('@onChange').should('have.been.calledOnce');
    });
  });

  it('clears with Escape only once and keeps focus in the search input', () => {
    const onChange = cy.stub().as('onChange');
    const onParentKeyDown = cy.stub().as('onParentKeyDown');
    mount(
      <div onKeyDown={onParentKeyDown}>
        <SearchBox aria-label="Search" defaultValue="query" onChange={onChange} />
      </div>,
    );

    cy.get('input').focus().realPress('Escape');
    cy.get('input').should('be.focused').and('have.value', '');
    cy.get('@onChange').should('have.been.calledOnce');
    cy.get('@onParentKeyDown').should('not.have.been.called');
  });

  it('does not submit a form when the clear button is activated', () => {
    const onSubmit = cy.stub().as('onSubmit');
    mount(
      <form onSubmit={onSubmit}>
        <SearchBox aria-label="Search" defaultValue="query" />
      </form>,
    );

    cy.get('button[aria-label="clear"]').click();
    cy.get('input').should('have.value', '');
    cy.get('@onSubmit').should('not.have.been.called');
  });
});
