import { login, clearAuth } from "../../utils/login";
import { goTo } from "../../utils/navigation";

describe('Maps Page', () => {
  before(() => {
    login();
  });

  after(() => {
    clearAuth();
  });
  
  beforeEach(() => {
    goTo('/maps');
  });

  it('shows google maps autocomplete and the map', () => {
    cy
      .get('input#autocomplete').should('have.length', 1);

    cy
      .get('#map > div').should('have.length', 1);
  });
  
  it('allows picking an address from the autocomplete', () => {
    cy
      .get('input#autocomplete')
      .type('lucca', {
        delay: 500,
      });

    cy
      .get('.pac-container')
      .find('.pac-item')
      .first()
      .click();

    // check destination
    cy
      .get('.destination')
      .should('include.text', '55100 Lucca, Province of Lucca, Italy');

    // check all results
    cy
      .get('[data-testid^="route-result"]', { multiple: true })
      .should('include.text', ' di trasporto')
      .should('include.text', 'di viaggio')
      .should('include.text', '16 km di distanza');

    // check quickest
    cy
      .get('[data-testid="route-result-quickest"]')
      .should('include.text', 'Pieroni srl, via della Canovetta, Lucca');

    // check markers
    // we check for double the items as google maps doubles them
    cy
      .get('img[src="assets/origIcon.png"]', { timeout: 2000 }).should('have.length', 6);
    cy
      .get('img[src="assets/fastestIconWhite.png"]', { timeout: 2000 }).should('have.length', 2);
    cy
      .get('img[src="assets/destIcon.png"]', { timeout: 2000 }).should('have.length', 2);
  });
})