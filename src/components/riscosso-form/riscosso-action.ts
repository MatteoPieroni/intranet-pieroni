'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import {
  FORM_FAIL_RISCOSSO,
  FORM_PARTIAL_RISCOSSO,
  FORM_SUCCESS_RISCOSSO,
} from '@/consts';
import {
  createRiscosso,
  getConfigWithoutCache,
} from '@/services/firebase/server';
import { sendRiscossoCreation } from '@/services/email';
import {
  RiscossoDocSchema,
  RiscossoSchema,
} from '@/services/firebase/validator';

export type StateValidation = {
  error?: string;
  success?: string;
  partialSuccess?: string;
};

const FormFieldsSchema = RiscossoSchema.omit({
  id: true,
  date: true,
  meta: true,
  verification: true,
});

const handleDocs = async (
  types: FormDataEntryValue[],
  dates: FormDataEntryValue[],
  numbers: FormDataEntryValue[],
  totals: FormDataEntryValue[]
) => {
  if (
    types.length === 0 ||
    types.length !== numbers.length ||
    types.length !== totals.length ||
    types.length !== dates.length
  ) {
    throw new Error('DOCS_ERROR');
  }

  const documents = types
    .map((type, index) => {
      return RiscossoDocSchema.parse({
        type: String(type),
        date: new Date(String(dates[index])),
        number: String(numbers[index]),
        total: Number(totals[index]),
      });
    })
    // remove empty
    .filter((doc) => !!doc.type);

  return documents;
};

export const riscossoAction = async (_: StateValidation, values: FormData) => {
  const currentHeaders = await headers();

  try {
    const config = await getConfigWithoutCache(currentHeaders);

    const formId = values.get('id');
    const formIsNew = values.get('isNew');
    const formDocsNumbers = values.getAll('doc-number');
    const formDocsDates = values.getAll('doc-date');
    const formDocsTypes = values.getAll('doc-type');
    const formDocsTotals = values.getAll('doc-total');

    if (!formId && !formIsNew) {
      return {
        errors: {
          general: FORM_FAIL_RISCOSSO,
        },
      };
    }

    const docs = await handleDocs(
      formDocsTypes,
      formDocsDates,
      formDocsNumbers,
      formDocsTotals
    );

    const addedTotal = docs.reduce((total, doc) => total + doc.total, 0);

    const {
      client,
      company,
      total,
      paymentMethod,
      paymentChequeNumber,
      paymentChequeValue,
    } = FormFieldsSchema.parse({
      total: addedTotal,
      client: values.get('client'),
      company: values.get('company'),
      paymentMethod: values.get('payment-method'),
      paymentChequeValue: Number(values.get('payment-cheque-number')),
      paymentChequeNumber: values.get('payment-cheque-value'),
      docs,
    });

    const id = String(formId);
    const isNew = String(formIsNew) === 'NEW';

    if (isNew && !id) {
      const createdRiscosso = await createRiscosso(currentHeaders, {
        client,
        company,
        total,
        paymentMethod,
        paymentChequeNumber,
        paymentChequeValue,
        docs,
      });

      try {
        await sendRiscossoCreation({
          id: createdRiscosso.id,
          client,
          link: `https://interno.pieroni.it/riscossi/${createdRiscosso.id}`,
          total,
          emailTo: config.emailRiscossi,
        });
      } catch {
        throw new Error('EMAIL_FAILED');
      }
    } else {
      // await pushLink(currentHeaders, {
      //   description,
      //   link,
      //   id,
      //   teams,
      //   ...(iconUpload ? { icon: iconUpload } : {}),
      // });
    }

    revalidatePath('/riscossi');

    return {
      success: FORM_SUCCESS_RISCOSSO,
    };
  } catch (e) {
    console.error(e);

    if (e instanceof Error) {
      if (e.message === 'EMAIL_FAILED') {
        return {
          partialSuccess: FORM_PARTIAL_RISCOSSO,
        };
      }
    }

    return {
      error: FORM_FAIL_RISCOSSO,
    };
  }
};
