export const mToKm: (meters: number) => number = (meters) => meters / 1000;

export const sToMin: (seconds: number) => number = (seconds) => seconds / 60;

export const min: (input: number[]) => number = (input) => {
  if (input.length === 0)
    throw new Error('Expect an array');

  return Math.min.apply(null, input);
}