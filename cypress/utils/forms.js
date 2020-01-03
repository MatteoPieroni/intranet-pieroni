// FORM
export const submitForm = () => {
  cy
    .get('button[type="submit"]')
    .click();
}

export const formCheckError = (text = 'Ricontrolla per favore') => {
  cy
  .get('[data-testid="notification-fail"]')
  .contains(text);
}

export const formCheckSuccess = () => {
  cy
  .get('[data-testid="notification-success"]')
  .should('have.length', 1);
}

// INPUTS
export const setInput = (selector, value) => {
  cy
  .get(selector)
  .focus()
  .type(value);
}

export const inputCheckError = (selector, value) => {
  if (!value) {
    return cy
      .get(selector)
      .focus()
      .blur()
      .parent()
      .find('.error')
      .should('have.length', 1);
    }
    
    cy
    .get(selector)
    .focus()
    .type(value)
    .blur()
    .parent()
    .find('.error')
    .should('have.length', 1);
} 