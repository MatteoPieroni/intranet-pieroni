export const goTo = (url, options = {}) => {
  cy.visit('/home', options);
  cy.get(`a[href="${url}"]`).click();
}