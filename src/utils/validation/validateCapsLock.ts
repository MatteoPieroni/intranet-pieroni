import { ERROR_INVALID_MESSAGE } from '../../common/consts';

export const validateCapsLock: (input: string) => string | null = (input) => input.match(/[A-Z]{4,}/) ? ERROR_INVALID_MESSAGE : null;