import * as Types from './types';

export const sendSms: (
  apiUrl: string,
  values: Types.ISms
) => Promise<Types.ISms> = (apiUrl, values) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`Sms Api responded with ${response.status}`);
      }

      const finalResponse = await response.json();
      resolve(finalResponse);
    } catch (e) {
      reject(e);
    }
  });
};
