import * as React from 'react';
import { mount } from '@fluentui/scripts-cypress';
import { Nav } from './Nav';
import { NavCategory } from './NavCategory';
import { NavCategoryItem } from './NavCategoryItem';
import { NavSubItemGroup } from './NavSubItemGroup';
import { NavSubItem } from './NavSubItem';

describe('Nav category', () => {
  it('keeps collapsed destinations out of the tab order without submitting a form', () => {
    const onSubmit = cy.stub().as('onSubmit');
    mount(
      <form onSubmit={onSubmit}>
        <Nav defaultSelectedValue="settings">
          <NavCategory value="account" groupId="account-group">
            <NavCategoryItem id="account" currentPageDescription="Contains current page: Settings">
              Account
            </NavCategoryItem>
            <NavSubItemGroup>
              <NavSubItem id="settings" value="settings">
                Settings
              </NavSubItem>
            </NavSubItemGroup>
          </NavCategory>
        </Nav>
        <button id="after" type="button">
          After
        </button>
      </form>,
    );

    cy.get('#account').should(account => {
      expect(account).to.have.attr('type', 'button');
      expect(account).to.have.attr('aria-controls', 'account-group');
      expect(account).to.have.attr('data-selected');
      expect(account).not.to.have.attr('aria-current');
    });
    cy.get('#account-group').should(group => {
      expect(group).to.have.attr('hidden');
      expect(group).to.have.attr('inert');
    });
    cy.get('#settings').should(item => {
      expect(item).to.have.attr('aria-current', 'page');
      expect(item).not.to.be.visible;
    });
    cy.get('#account').focus().realPress('Tab');
    cy.get('#after').should('have.focus');

    cy.get('#account').focus().realPress('Enter');
    cy.get('#account').should(account => {
      expect(account).to.have.attr('aria-expanded', 'true');
      expect(account).not.to.have.attr('data-selected');
    });
    cy.get('#account-group').should(group => {
      expect(group).not.to.have.attr('hidden');
      expect(group).not.to.have.attr('inert');
    });
    cy.get('#account').realPress('Tab');
    cy.get('#settings').should('have.focus');

    cy.get('#account').focus().realPress('Space');
    cy.get('#account').should(account => {
      expect(account).to.have.attr('aria-expanded', 'false');
      expect(account).to.have.attr('data-selected');
    });
    cy.get('#account-group').should(group => {
      expect(group).to.have.attr('hidden');
      expect(group).to.have.attr('inert');
    });
    cy.get('@onSubmit').should('not.have.been.called');
  });
});
