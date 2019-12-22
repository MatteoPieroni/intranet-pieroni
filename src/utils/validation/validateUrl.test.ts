
import { validateUrl } from './validateUrl';
import { ERROR_INVALID_URL } from '../../common/consts';

describe('validateUrl', () => {

  describe('it should return null', () => {
    it('should return null if the field is a valid url', () => {
      expect(validateUrl('http://www.test.com')).toBeNull();
      expect(validateUrl('https://test.it')).toBeNull();
      expect(validateUrl('www.ciao.it')).toBeNull();
    });
  });

  describe('it should return an error', () => {
    it('should return an error if the input is not a valid url', () => {
      expect(validateUrl('')).toBe(ERROR_INVALID_URL);
      expect(validateUrl('test')).toBe(ERROR_INVALID_URL);
    });
  });
});