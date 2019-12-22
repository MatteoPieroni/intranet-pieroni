import { ERROR_INVALID_MOBILE } from "../../common/consts";

export const validateMobile: (number: string) => null | string = (number) => {
  if (number.match(/^[+]?(00)?([0-9]{2})?3[0-9]{9}$/)) {
    return null;
  }

  return ERROR_INVALID_MOBILE;
};