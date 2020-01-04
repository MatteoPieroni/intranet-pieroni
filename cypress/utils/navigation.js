export const goTo = (url, options = {}) => {
  cy.visit('/', options);
  cy.get(`a[href="${url}"]`).click();
}