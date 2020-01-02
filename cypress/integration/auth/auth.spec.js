import { clearAuth, login } from "../../utils/login";
import { submitForm, checkError } from "../../utils/forms";
import { users } from "../../fixtures/users";

describe('The website', () => {

  beforeEach(() => {
    clearAuth();
  })

  it('shows an error message if the user does not exist', () => {
    login('fake');

    checkError();
  });

  it('logs in and redirects to the home', () => {
    login('notAdmin');

    cy.location("pathname").should('eq', '/home');
  });

  it('allows users to reset their password and errors when there is no password', () => {
    cy.visit('/login');

    cy
      .get('[data-testid="password-reset-link"]')
      .click();
      
    cy
      .get('input[name="email"]')
      .type(users.fake.email);

    submitForm();

    checkError();
  });

  it('allows users to reset their password and go back to login', () => {
    cy.server()
    cy.route('POST', 'https://www.googleapis.com/identitytoolkit', '')
    
    cy.visit('/login');

    cy
      .get('[data-testid="password-reset-link"]')
      .click();
      
    cy
      .get('input[name="email"]')
      .type(users.notAdmin.email);

    submitForm();
  });

});