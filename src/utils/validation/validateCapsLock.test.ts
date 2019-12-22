import { validateCapsLock } from './validateCapsLock';
import { ERROR_INVALID_MESSAGE } from '../../common/consts';

describe('validateCapsLock', () => {

  describe('it should return null', () => {
    it('should return null if the input has a max of 3 uppercase letters next to each other', () => {
      expect(validateCapsLock('Hello, how are you Matt?')).toBeNull();
      expect(validateCapsLock('What\'s up buddy?')).toBeNull();
      expect(validateCapsLock('are you alright?')).toBeNull();
    });
  });

  describe('it should return an error', () => {
    it('should return an error if the input has more than 3 uppercase letters next to each other', () => {
      expect(validateCapsLock('FFFFFFFF')).toBe(ERROR_INVALID_MESSAGE);
      expect(validateCapsLock('aCFE cGTERasa')).toBe(ERROR_INVALID_MESSAGE);
    });
  });
});