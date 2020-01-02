// FORM
export const submitForm = () => {
  cy
    .get('button[type="submit"]')
    .click();
}

export const checkError = (text = 'Ricontrolla per favore') => {
  cy
  .get('[data-testid="notification-fail"]')
  .contains(text);
}

// INPUTS
export const inputCheckError = (selector, value) => {
  if (!value) {
    return cy
      .get(selector)
      .focus()
      .blur()
      .parent()
      .find('.error').length === 1;
    }
    
    cy
    .get(selector)
    .focus()
    .type(value)
    .blur()
    .parent()
    .find('.error').length === 1;
} 