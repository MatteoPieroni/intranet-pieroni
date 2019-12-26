import * as Types from "./types";

const apiUrl = process.env.SMS_API;

export const sendSms: (values: Types.ISms) => Promise<Types.ISms> = (values) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      resolve(response.json());
    } catch (e) {
      reject(e);
    }
  })
}