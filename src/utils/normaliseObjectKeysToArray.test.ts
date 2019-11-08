import { normaliseObjectKeysToArray } from './normaliseObjectKeysToArray';

const mockObject = {
  test1: 'test 1',
  test2: 'test 2',
  test3: 'test 3',
};

const resultingArray = ['test 1', 'test 2', 'test 3'];

describe('normaliseObjectKeysToArray', () => {
  it('returns null if not passed an object', () => {
    expect(normaliseObjectKeysToArray(null)).toEqual(null);
  });

  it('returns an array with the values of an object keys (like Object.values)', () => {
    expect(normaliseObjectKeysToArray(mockObject)).toEqual(resultingArray);
  });
});
