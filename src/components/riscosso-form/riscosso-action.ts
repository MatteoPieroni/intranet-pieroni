'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { FORM_FAIL_RISCOSSO, FORM_SUCCESS_RISCOSSO } from '@/consts';
import { createRiscosso } from '@/services/firebase/server';

export type StateValidation = {
  error?: string;
  success?: string;
};

const companies = ['pieroni', 'pieroni-mostra', 'pellet'] as const;
const paymentMethods = ['assegno', 'contanti', 'bancomat'] as const;
const documentType = ['DDT', 'fattura', 'impegno'] as const;

const checkCompanyType = (
  company: string
): company is (typeof companies)[number] =>
  companies.includes(<(typeof companies)[number]>company);
const checkPaymentMethodType = (
  paymentMethod: string
): paymentMethod is (typeof paymentMethods)[number] =>
  paymentMethods.includes(<(typeof paymentMethods)[number]>paymentMethod);
const checkDocumentType = (
  type: string
): type is (typeof documentType)[number] =>
  documentType.includes(<(typeof documentType)[number]>type);
const checkDocumentDate = (date: FormDataEntryValue): date is string =>
  typeof date === 'string' && !isNaN(Date.parse(date));

const handleDocs = async (
  types: FormDataEntryValue[],
  dates: FormDataEntryValue[],
  numbers: FormDataEntryValue[],
  totals: FormDataEntryValue[]
) => {
  if (
    types.length !== numbers.length ||
    types.length !== totals.length ||
    types.length !== dates.length
  ) {
    throw new Error('Something wrong with docs');
  }

  const documents = types
    .map((type, index) => {
      const typeString = String(type);
      if (!checkDocumentType(typeString) || !checkDocumentDate(dates[index])) {
        throw new Error();
      }

      return {
        type: typeString,
        date: new Date(dates[index]),
        number: String(numbers[index]),
        total: Number(totals[index]),
      };
    })
    // remove empty
    .filter((doc) => !!doc.type);

  return documents;
};

export const riscossoAction = async (_: StateValidation, values: FormData) => {
  const currentHeaders = await headers();

  try {
    const formClient = values.get('client');
    const formCompany = values.get('company');
    const formTotal = values.get('total');
    const formPaymentMethod = values.get('payment-method');
    const formPaymentChequeNumber = values.get('payment-cheque-number');
    const formPaymentChequeValue = values.get('payment-cheque-value');
    const formId = values.get('id');
    const formIsNew = values.get('isNew');
    const formDocsNumbers = values.getAll('doc-number');
    const formDocsDates = values.getAll('doc-date');
    const formDocsTypes = values.getAll('doc-type');
    const formDocsTotals = values.getAll('doc-total');

    if (
      formDocsNumbers.length === 0 ||
      formDocsTypes.length === 0 ||
      formDocsTotals.length === 0 ||
      formDocsDates.length === 0
    ) {
      return {
        error: FORM_FAIL_RISCOSSO,
      };
    }

    if (!formClient || !formCompany || !formTotal || !formPaymentMethod) {
      return {
        error: FORM_FAIL_RISCOSSO,
      };
    }

    if (!formId && !formIsNew) {
      return {
        errors: {
          general: FORM_FAIL_RISCOSSO,
        },
      };
    }

    const client = String(formClient);
    const company = String(formCompany);
    const total = Number(formTotal);
    const paymentMethod = String(formPaymentMethod);
    const paymentChequeNumber = String(formPaymentChequeNumber);
    const paymentChequeValue = Number(formPaymentChequeValue);
    const id = String(formId);
    const isNew = String(formIsNew) === 'NEW';

    if (!checkCompanyType(company) || !checkPaymentMethodType(paymentMethod)) {
      throw new Error('data invalid');
    }

    const docs = await handleDocs(
      formDocsTypes,
      formDocsDates,
      formDocsNumbers,
      formDocsTotals
    );

    if (isNew && !id) {
      await createRiscosso(currentHeaders, {
        client,
        company,
        total,
        paymentMethod,
        paymentChequeNumber,
        paymentChequeValue,
        docs,
      });
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
    return {
      errors: {
        general: FORM_FAIL_RISCOSSO,
      },
    };
  }
};
