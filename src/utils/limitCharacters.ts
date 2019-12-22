export const limitCharacters: (input: string, numberOfChars: number) => string =
  (input, numberOfChars) => input.substring(0, numberOfChars);