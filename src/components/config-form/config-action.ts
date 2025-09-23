'use server';

import { headers } from 'next/headers';
import { revalidatePath, revalidateTag } from 'next/cache';
import * as z from 'zod';

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

const FormSchema = z.object({
  mail_url: z.optional(z.url()),
  emailRiscossi: z.optional(z.email()),
  transport_cost_minimum: z.optional(z.number()),
  transport_cost_per_minute: z.optional(z.number()),
  transport_hour_base: z.optional(z.number()),
});

export const configAction = async (_: StateValidation, values: FormData) => {
  const currentHeaders = await headers();

  try {
    const data = FormSchema.parse({
      mail_url: values.get('mailUrl'),
      emailRiscossi: values.get('emailRiscossi'),
      transport_cost_minimum: Number(values.get('transportCostMinimum')),
      transport_cost_per_minute: Number(values.get('transportCostPerMinute')),
      transport_hour_base: Number(values.get('transportHourBase')),
    });

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
