import { login, clearAuth } from "../../utils/login";
import { users } from "../../fixtures/users";

describe('Home Page', () => {
  before(() => {
    login();
  });

  after(() => {
    clearAuth();
  });

  beforeEach(() => {
    cy.visit('/home');
  });

  it('shows the user name', () => {
    cy
      .get('h1')
      .should('contains.text', users.notAdmin.name);
  });

  it('shows the quote data', () => {
    cy
      .get('[data-testid="quote-title"')
      .should('contains.text', 'Citazione');

    cy
      .get('.quote-container')
      .find('img').should('have.length', 1);
  });


  it('shows the links data', () => {
    cy
      .get('[data-testid="links-title"')
      .should('contains.text', 'Link');

    cy
      .get('.links-container')
      .find('li').length > 1;
  });
})