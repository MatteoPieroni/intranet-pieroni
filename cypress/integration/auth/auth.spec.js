import { clearAuth, login } from "../../utils/login";
import { submitForm, formCheckError, inputCheckError, formCheckSuccess } from "../../utils/forms";
import { users } from "../../fixtures/users";

describe('Login Page', () => {

  beforeEach(() => {
    clearAuth();
  })

  it('shows form errors for empty fields', () => {
    cy.visit('login');

    inputCheckError('input[name="email"]');
      
    inputCheckError('input[name="password"]');

  })

  it('shows an error message if the user does not exist', () => {
    login('fake');

    formCheckError();
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

    formCheckError();
  });

  it('allows users to reset their password and go back to login', () => {
    cy.server();
    cy.route('POST', 'https://www.googleapis.com/identitytoolkit/**', JSON.stringify({
      kind: "identitytoolkit#GetOobConfirmationCodeResponse",
      email: users.notAdmin.email,
    }));
    
    cy.visit('/login');

    cy
      .get('[data-testid="password-reset-link"]')
      .click();
      
    cy
      .get('input[name="email"]')
      .type(users.notAdmin.email);

    submitForm();

    formCheckSuccess();
  });

});