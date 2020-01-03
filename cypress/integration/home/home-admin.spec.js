import { login, clearAuth } from "../../utils/login";
import { inputCheckError, setInput, submitForm, formCheckError, formCheckSuccess } from '../../utils/forms';
import { goTo } from "../../utils/navigation";

const numberOfLinkForms = 4;

describe('Home Page for admins | Links', () => {
  before(() => {
    login('admin');
  });

  after(() => {
    clearAuth();
  });
  
  beforeEach(() => {
    goTo('/home');

    cy
      .get('.links-container .form-button')
      .click();
  });

  // it('shows the links forms', () => {
  //   cy
  //     .get('.links-container .form-button')
  //     .click();

  //   cy
  //     .get('form').should('have.length', numberOfLinkForms);
  // });

  // it('shows errors in the form when there is no data', () => {
  //   inputCheckError(
  //     cy
  //     .get('.links-container li')
  //     .last()
  //     .find('input[name="link"]')
  //   );

  //   inputCheckError(
  //     cy
  //     .get('.links-container li')
  //     .last()
  //     .find('input[name="description"]')
  //   );

  //   inputCheckError(
  //     cy
  //     .get('.links-container li')
  //     .last()
  //     .find('input[name="color"]')
  //   );
  // });

  // it('shows an error in the form when a wrong url is entered', () => {
  //   inputCheckError(
  //     cy
  //       .get('.links-container li')
  //       .last()
  //       .find('input[name="link"]'),
  //     'test value'
  //   );
  // });

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

  it('removes a link', () => {
    cy
      .get('.links-container [data-testid="test-link"]')
      .find('[data-testid="link-delete-button"]')
      .click();

      cy
      .get('.links-container li')
      .should('have.length', numberOfLinkForms);
  });

  // it('sends an sms', () => {
  //   // stub
  //   cy.server();
  //   cy.route('OPTIONS', apis.smsApi, '');
  //   cy.route('POST', apis.smsApi, JSON.stringify({
  //     result: 'OK'
  //   }));

  //   setInput('input[name="number"]', '123456789101');
  //   setInput('textarea[name="message"]', 'test');

  //   submitForm();

  //   formCheckSuccess();
  // });
})

// describe('Home Page for admins | Links', () => {

// });