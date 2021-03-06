// FORM
export const submitForm = (selector = 'button[type="submit"]') => {
  if (typeof selector !== 'string') {
    return selector
      .click();
  }

  cy
    .get(selector)
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
  if (typeof selector !== 'string') {
    return selector
      .type(value);
  }

  cy
  .get(selector)
  .type(value);
}

export const clearAndSetInput = (selector, value) => {
  if (typeof selector !== 'string') {
    return selector
      .clear()
      .type(value);
  }

  cy
    .get(selector)
    .clear()
    .type(value);
}

export const inputCheckError = (selector, value) => {
  if (typeof selector !== 'string') {
    return selector
      .focus()
      .blur()
      .parent()
      .find('.error')
      .should('have.length', 1);
  }

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
    .type(value)
    .blur()
    .parent()
    .find('.error')
    .should('have.length', 1);
}
