import * as Types from "./types";

export const sendSms: (values: Types.ISms) => Promise<Types.ISms> = (values) => {
  return new Promise((resolve, reject) => {
    resolve(values);
  })
}