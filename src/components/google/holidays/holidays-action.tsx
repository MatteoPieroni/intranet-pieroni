'use server';

import { revalidatePath } from 'next/cache';
import { eachDayOfInterval } from 'date-fns/fp';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  ERROR_EMPTY_FIELD,
  FORM_FAIL_HOLIDAYS,
  FORM_SUCCESS_HOLIDAYS,
} from '@/consts';
import { DbSpecialHourPeriod, googleClient } from '@/services/google-apis';
import { getGoogleAuth } from '@/services/firebase/server';
import { PassedHeaders } from '@/services/firebase/server/serverApp';

export type StateValidation = {
  success?: string;
  error?: string;
};

const getGoogleInstanceWithAuth = async (currentHeaders: PassedHeaders) => {
  const tokenData = await getGoogleAuth(currentHeaders);

  if (!tokenData?.refresh_token) {
    throw new Error('NO_TOKEN');
  }

  try {
    await googleClient.setTokens(tokenData.refresh_token);
  } catch (e) {
    if (e instanceof Error && e.message === 'REVOKED') {
      return redirect('/admin-google');
    }
    throw e;
  }

  return googleClient;
};

export const holidaysAction = async (
  previousDates: DbSpecialHourPeriod[],
  _: StateValidation,
  values: FormData
) => {
  try {
    const currentHeaders = await headers();
    const googleClientWithAuth = await getGoogleInstanceWithAuth(
      currentHeaders
    );

    const formStartDate = values.get('startDate');
    const formEndDate = values.get('endDate');
    const formName = values.get('name');

    if (!formStartDate || !formEndDate || !formName) {
      return {
        error: ERROR_EMPTY_FIELD,
      };
    }

    const start = new Date(String(formStartDate));
    const end = new Date(String(formEndDate));

    const daysDateArray = eachDayOfInterval({
      start,
      end,
    });

    const formattedDates = daysDateArray.map((currentDate) => {
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      return {
        startDate: {
          day,
          month,
          year,
        },
        closed: true,
      };
    });

    await googleClientWithAuth.patchLocation(String(formName), [
      ...previousDates,
      ...formattedDates,
    ]);

    revalidatePath('/admin-google');

    return {
      success: FORM_SUCCESS_HOLIDAYS,
    };
  } catch (e) {
    console.error(e);
    return {
      errors: {
        general: FORM_FAIL_HOLIDAYS,
      },
    };
  }
};
