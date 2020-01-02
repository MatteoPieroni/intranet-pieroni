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