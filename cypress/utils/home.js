import { clearAndSetInput, submitForm } from './forms';

export const toggleLinkForms = () => {
  cy
    .get('.links-container .form-button')
    .click()
    .end();
};

export const deleteAllTestLinks = () => {
  cy.get('.links-container').then(container => {
    if (container.find('[data-testid="test-link"]').length > 0) {
      cy.end();

      toggleLinkForms();
      
      cy
        .get('.links-container [data-testid="test-link"]', { multiple: true })
        .find('[data-testid="link-delete-button"]')
        .click();
    }
  });
};

export const toggleQuoteForm = () => {
  cy
    .get('.quote-container .form-button')
    .click()
    .end();
};

export const resetQuote = () => {
  toggleQuoteForm();

  clearAndSetInput(
    cy
      .get('.quote-container')
      .find('textarea[name="text"]'),
    'Test'
  );

  cy
    .get('button.edit-image')
    .click();

  cy
    .get('.images-modal')
    .find('input[name="url"]')

  cy
    .get('.images-modal')
    .find('button.image')
    .first()
    .click();

  submitForm(
    cy
      .get('.quote-container')
      .find('button[type="submit"]')
  );

  toggleQuoteForm();
}