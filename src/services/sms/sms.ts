import * as Types from "./types";

export const sendSms: (apiUrl: string, values: Types.ISms) => Promise<Types.ISms> = (apiUrl, values) => {
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