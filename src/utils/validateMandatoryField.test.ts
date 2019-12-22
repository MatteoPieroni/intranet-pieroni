
import { validateMandatoryInput } from './validateMandatoryInput';
import { ERROR_EMPTY_FIELD } from '../common/consts';

describe('validateMandatoryInput', () => {

  describe('it should return null', () => {
    it('should return null if the field is a non-empty string', () => {
      expect(validateMandatoryInput('test')).toBeNull();
      expect(validateMandatoryInput(' testing ')).toBeNull();
    });
  });

  describe('it should return an error', () => {
    it('should return an error if the input is empty', () => {
      expect(validateMandatoryInput('')).toBe(ERROR_EMPTY_FIELD);
      expect(validateMandatoryInput('     ')).toBe(ERROR_EMPTY_FIELD);
    });

    it('should return an error if the input is null or undefined', () => {
      expect(validateMandatoryInput(null)).toBe(ERROR_EMPTY_FIELD);
      expect(validateMandatoryInput(undefined)).toBe(ERROR_EMPTY_FIELD);
    });
  });
});