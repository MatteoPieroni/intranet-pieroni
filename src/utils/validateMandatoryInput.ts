import { ERROR_EMPTY_FIELD } from "../common/consts";

const isStringEmpty: (input: string | number) => boolean = input => (typeof input === 'string' ? input.trim() === '' : !input);

export const validateMandatoryInput: (input: string | number) => string | null = input => (isStringEmpty(input) ? ERROR_EMPTY_FIELD : null);