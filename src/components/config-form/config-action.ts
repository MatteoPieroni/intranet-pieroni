'use server';

import { headers } from 'next/headers';
import { revalidatePath, revalidateTag } from 'next/cache';

import {
  FORM_FAIL_CONFIG,
  FORM_FAIL_EMPTY,
  FORM_SUCCESS_CONFIG,
} from '@/consts';
import { pushConfig } from '@/services/firebase/server';

export type StateValidation = {
  error?: string;
  success?: string;
};

export const configAction = async (_: StateValidation, values: FormData) => {
  const currentHeaders = await headers();

  try {
    const formMailUrl = values.get('mailUrl');
    const formTransportCostMinimum = values.get('transportCostMinimum');
    const formTransportCostPerMinute = values.get('transportCostPerMinute');
    const formTransportHourBase = values.get('transportHourBase');

    const data = {
      ...(formMailUrl && { mail_url: String(formMailUrl) }),
      ...(formTransportCostMinimum &&
        !isNaN(Number(formTransportCostMinimum)) && {
          transport_cost_minimum: Number(formTransportCostMinimum),
        }),
      ...(formTransportCostPerMinute &&
        !isNaN(Number(formTransportCostPerMinute)) && {
          transport_cost_per_minute: Number(formTransportCostPerMinute),
        }),
      ...(formTransportHourBase &&
        !isNaN(Number(formTransportHourBase)) && {
          transport_hour_base: Number(formTransportHourBase),
        }),
    };

    if (!Object.values(data).length) {
      return {
        error: FORM_FAIL_EMPTY,
      };
    }

    await pushConfig(currentHeaders, data);

    revalidatePath('/admin');
    revalidateTag('config');

    return {
      success: FORM_SUCCESS_CONFIG,
    };
  } catch (e) {
    console.error(e);
    return {
      error: FORM_FAIL_CONFIG,
    };
  }
};
