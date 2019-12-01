import { formatMobile } from './formatMobile';

describe('formatMobile', () => {

  describe('it should format a mobile number', () => {
    it('should return a number with a leading + to a double 0', () => {
      expect(formatMobile('+393412345678')).toEqual('00393412345678');
      expect(formatMobile('00393412345678')).toEqual('00393412345678');
      expect(formatMobile('3412345678')).toEqual('3412345678');
    });
  });
});