export const validateMobile = (number: string) =>
  number.match(/^[+]?(00)?([0-9]{2})?3[0-9]{9}$/);
