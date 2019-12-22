import { ERROR_FIELD_TOO_LONG } from "../../common/consts";

export const validateLength: (input: string, length: number) => string | null = (input, length) => (input.length > length ? ERROR_FIELD_TOO_LONG : null);