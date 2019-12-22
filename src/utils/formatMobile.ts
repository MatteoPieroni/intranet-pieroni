export const formatMobile: (input: string) => string = (input) => {
  const hasLeadingPlus = input[0] === '+';

  if (hasLeadingPlus) {
    return `00${input.substring(1)}`;
  }

  return input
}