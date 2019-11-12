import { limitCharacters } from './limitCharacters';

describe('limitCharacters', () => {
  it('should limit strings to a number of characters', () => {
    expect(limitCharacters('test', 10)).toBe('test');
    expect(limitCharacters('test and test', 5)).toBe('test ');
  });
});