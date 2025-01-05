'use server';

import {
  ERROR_EMPTY_FIELD,
  ERROR_INVALID_MESSAGE,
  ERROR_INVALID_MOBILE,
  FORM_FAIL_MESSAGE,
  FORM_SUCCESS_MESSAGE,
} from '@/consts';
import {
  getUser,
  getConfigOnServer,
  pushSmsOnServer,
} from '@/services/firebase/server';
import { IDbSms } from '@/services/firebase/db';
import { sendSms } from '@/services/sms';
import { formatMobile } from '@/utils/formatMobile';
import { validateCapsLock } from '@/utils/validateCapsLock';
import { validateMobile } from '@/utils/validateMobile';
import { headers } from 'next/headers';

export type StateValidation = {
  errors?: {
    number?: string;
    message?: string;
    general?: string;
  };
  success?: string;
};

export const smsAction = async (_: StateValidation, values: FormData) => {
  const currentHeaders = await headers();

  const [config, { currentUser }] = await Promise.all([
    getConfigOnServer(currentHeaders),
    getUser(currentHeaders),
  ]);

  if (!config) {
    throw new Error('No connection');
  }

  if (!currentUser) {
    throw new Error('No connection');
  }

  try {
    const formNumber = values.get('number');
    const formMessage = values.get('message');

    if (!formNumber || !formMessage) {
      return {
        errors: {
          number: !formNumber ? ERROR_EMPTY_FIELD : undefined,
          message: !formNumber ? ERROR_EMPTY_FIELD : undefined,
        },
      };
    }

    const number = String(formNumber);
    const message = String(formMessage);

    const isValidMessage = validateCapsLock(message);

    if (!isValidMessage) {
      return {
        errors: {
          message: ERROR_INVALID_MESSAGE,
        },
      };
    }

    const isValidNumber = validateMobile(number);

    if (!isValidNumber) {
      return {
        errors: {
          number: ERROR_INVALID_MOBILE,
        },
      };
    }

    const finalNumber = formatMobile(number);

    const finalValues = {
      number: finalNumber,
      message,
    };

    await sendSms(config.smsApi, finalValues);

    const { id, surname, name } = currentUser;

    const historyData: IDbSms = {
      sender: `${name} ${surname}`,
      senderUID: id,
      time: Date.now(),
      ...finalValues,
    };

    await pushSmsOnServer(currentHeaders, historyData);

    return {
      success: FORM_SUCCESS_MESSAGE,
    };
  } catch (e) {
    console.error(e);
    return {
      errors: {
        general: FORM_FAIL_MESSAGE,
      },
    };
  }
};
