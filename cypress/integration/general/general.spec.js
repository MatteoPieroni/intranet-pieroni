describe('The website', () => {
  it('redirects to the login page', () => {
    cy.visit('/');
    cy.location("pathname").should('eq', '/login');
  });
});