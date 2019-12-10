export const mToKm: (meters: number) => number = (meters) => meters / 1000;

export const sToMin: (seconds: number) => number = (seconds) => seconds / 60;

// cost per minimum is defined at 1.4 and cost per hour is defined at 25
export const costFinder: (tempo: number) => string = (tempo) => (tempo * 2.14 + 24.6).toFixed(2);

export const min: (input: number[]) => number = (input) => {
  if (input.length === 0)
    throw new Error('Expect an array');

  return Math.min.apply(null, input);
}