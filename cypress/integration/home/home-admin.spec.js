import { login, clearAuth } from "../../utils/login";
import { inputCheckError, setInput, submitForm, formCheckError, formCheckSuccess, clearAndSetInput } from '../../utils/forms';
import { goTo } from "../../utils/navigation";
import { toggleLinkForms, deleteAllTestLinks, toggleQuoteForm, resetQuote } from '../../utils/home';

const numberOfLinkForms = 4;

describe('Home Page for admins | Links', () => {
  before(() => {
    login('admin');
  });

  after(() => {
    deleteAllTestLinks();
    clearAuth();
  });
  
  beforeEach(() => {
    goTo('/home');

    toggleLinkForms();
  });

  it('shows the links forms', () => {
    cy
      .get('.links-container')
      .find('form')
      .should('have.length', numberOfLinkForms);
  });

  it('shows errors in the form when there is no data', () => {
    inputCheckError(
      cy
      .get('.links-container li')
      .last()
      .find('input[name="link"]')
    );

    inputCheckError(
      cy
      .get('.links-container li')
      .last()
      .find('input[name="description"]')
    );

    inputCheckError(
      cy
      .get('.links-container li')
      .last()
      .find('input[name="color"]')
    );
  });

  it('shows an error in the form when a wrong url is entered', () => {
    inputCheckError(
      cy
        .get('.links-container li')
        .last()
        .find('input[name="link"]'),
      'test value'
    );
  });

  it('adds a link', () => {
    setInput(
      cy
        .get('.links-container li')
        .last()
        .find('input[name="link"]'),
      'https://test.com'
    );

    setInput(
      cy
        .get('.links-container li')
        .last()
        .find('input[name="description"]'),
      'Test'
    );

    setInput(
      cy
        .get('.links-container li')
        .last()
        .find('input[name="color"]'),
      'test'
    );

    submitForm(
      cy
        .get('.links-container li')
        .last()
        .find('button[type="submit"]')
    );

    cy
      .get('.links-container li')
      .should('have.length', numberOfLinkForms + 1);
  });

  it('changes a link', () => {
    clearAndSetInput(
      cy
        .get('.links-container [data-testid="test-link"]')
        .find('input[name="link"]'),
      'https://test2.com'
    );

    clearAndSetInput(
      cy
        .get('.links-container [data-testid="test-link"]')
        .find('input[name="description"]'),
      'Test 2'
    );

    submitForm(
      cy
        .get('.links-container [data-testid="test-link"]')
        .find('button[type="submit"]')
    );

    toggleLinkForms();

    cy
      .get('.links-container [data-testid="test-link"]')
      .should('contain.text', 'Test 2');

    cy
      .get('.links-container [href="https://test2.com"]')
      .should('have.length', 1);
  });

  it('removes a link', () => {
    cy
      .get('.links-container [data-testid="test-link"]')
      .find('[data-testid="link-delete-button"]')
      .click();

      cy
      .get('.links-container li')
      .should('have.length', numberOfLinkForms);
  });
})

describe('Home Page for admins | Quote', () => {
  before(() => {
    login('admin');
  });

  after(() => {
    resetQuote();
    clearAuth();
  });
  
  beforeEach(() => {
    goTo('/home');

    toggleQuoteForm();
  });

  it('shows the quote form', () => {
    cy
      .get('.quote-container')
      .find('form')
      .should('have.length', 1);
  });

  it('shows an error in the form when no quote is entered', () => {
    inputCheckError(
      cy
        .get('.quote-container')
        .find('textarea[name="text"]')
    );
  });

  it('changes the quote', () => {
    clearAndSetInput(
      cy
        .get('.quote-container')
        .find('textarea[name="text"]'),
      'Test 2'
    );

    submitForm(
      cy
        .get('.quote-container')
        .find('button[type="submit"]')
    );

    toggleQuoteForm();

    cy
      .get('.quote')
      .should('contain.text', 'Test 2');

  });

  it('changes the quote image', () => {
    cy
      .get('button.edit-image')
      .click();

    cy
      .get('.images-modal')
      .find('input[name="url"]')
      .should('have.length', 3);

    cy
      .get('.images-modal')
      .find('button.image')
      .last()
      .find('img')
      .invoke('attr', 'src')
      .then(src => {
        const imgUrl = src;

        cy
          .get('.images-modal')
          .find('button.image')
          .last()
          .click();
        
        submitForm(
          cy
          .get('.quote-container')
          .find('button[type="submit"]')
          );
          
        toggleQuoteForm();
          
        cy
          .get('.quote')
          .find(`[src="${imgUrl}"]`)
          .should('have.length', 1);
          
    });
  });

});