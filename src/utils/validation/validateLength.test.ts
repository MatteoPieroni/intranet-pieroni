import { validateLength } from './validateLength';
import { ERROR_FIELD_TOO_LONG } from '../../common/consts';

describe('validateMandatoryInput', () => {

  describe('it should return null', () => {
    it('should return null if the field is a non-empty string', () => {
      expect(validateLength('test', 100)).toBeNull();
      expect(validateLength(' testing ', 100)).toBeNull();
    });
  });

  describe('it should return an error', () => {
    it('should return an error if the input is longer than permitted', () => {
      expect(validateLength('testing tests', 10)).toBe(ERROR_FIELD_TOO_LONG);
      expect(validateLength('     testing tests', 10)).toBe(ERROR_FIELD_TOO_LONG);
    });
  });
});