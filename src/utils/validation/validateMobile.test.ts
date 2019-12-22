import { validateMobile } from './validateMobile';
import { ERROR_INVALID_MOBILE } from '../../common/consts';

describe('validateMobile', () => {

  describe('it should return null', () => {
    it('should return null if the field is a valid mobile number', () => {
      expect(validateMobile('+393412345678')).toBeNull();
      expect(validateMobile('00393412345678')).toBeNull();
      expect(validateMobile('3412345678')).toBeNull();
    });
  });

  describe('it should return an error', () => {
    it('should return an error if the input is not a valid mobile number', () => {
      expect(validateMobile('')).toBe(ERROR_INVALID_MOBILE);
      expect(validateMobile('aaa')).toBe(ERROR_INVALID_MOBILE);
      expect(validateMobile('0123456789')).toBe(ERROR_INVALID_MOBILE);
      expect(validateMobile('+0123456789')).toBe(ERROR_INVALID_MOBILE);
    });
  });
});