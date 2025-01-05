export const formatMobile: (input: string) => string = (input) => {
  const hasLeadingPlus = input[0] === '+';
  const hasLeadingZeroes = input[0] === '0' && input[1] === '0';

  if (hasLeadingPlus) {
    return `${input.substring(1)}`;
  }

  if (hasLeadingZeroes) {
    return `${input.substring(2)}`;
  }

  return input;
};
