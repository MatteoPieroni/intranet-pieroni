'use server';

import { revalidatePath } from 'next/cache';
import { eachDayOfInterval } from 'date-fns/fp';

import { ERROR_EMPTY_FIELD, FORM_FAIL_TV, FORM_SUCCESS_TV } from '@/consts';
import { DbSpecialHourPeriod, googleClient } from '@/services/google-apis';

export type StateValidation = {
  success?: string;
  error?: string;
};

export const holidaysAction = async (
  previousDates: DbSpecialHourPeriod[],
  _: StateValidation,
  values: FormData
) => {
  try {
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

    await googleClient.patchLocation(String(formName), [
      ...previousDates,
      ...formattedDates,
    ]);

    revalidatePath('/admin-google');

    return {
      success: FORM_SUCCESS_TV,
    };
  } catch (e) {
    console.error(e);
    return {
      errors: {
        general: FORM_FAIL_TV,
      },
    };
  }
};
