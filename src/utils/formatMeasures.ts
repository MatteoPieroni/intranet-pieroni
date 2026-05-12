export const mToKm: (meters: number) => number = (meters) => meters / 1000;

export const msToMin: (milliseconds: number) => number = (milliseconds) =>
	milliseconds / 60 / 1000;

export const min: (input: number[]) => number = (input) => {
	if (input.length === 0) throw new Error("Expect an array");

	return Math.min.apply(null, input);
};
