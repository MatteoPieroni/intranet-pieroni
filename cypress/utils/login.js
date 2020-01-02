import { users } from '../fixtures/users';

export const login = (type = 'notAdmin') => {
  cy.visit('/login');

  cy
    .get('input[name="email"]')
    .type(users[type].email);

  cy
    .get('input[name="password"]')
    .type(users[type].password);
    
  cy
    .get('button[type="submit"]')
    .click();

  cy.wait(3000)
}

export const clearAuth = () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  indexedDB.deleteDatabase('firebaseLocalStorageDb');
}