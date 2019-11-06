import { normaliseObjectKeysToArray } from './normaliseObjectKeysToArray';

describe('normaliseObjectKeysToArray', () => {
  it('returns null if not passed an object', () => {
    expect(normaliseObjectKeysToArray(null)).toEqual(null);
  });
});
