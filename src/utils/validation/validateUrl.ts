import { ERROR_INVALID_URL } from "../../common/consts";

export const validateUrl: (input: string) => string | null =
  input => input.match(/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/) ?
    null :
    ERROR_INVALID_URL;