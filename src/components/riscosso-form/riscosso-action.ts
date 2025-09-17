'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import {
  FORM_FAIL_LINK,
  FORM_FAIL_RISCOSSO,
  FORM_SUCCESS_LINK,
} from '@/consts';
import { createRiscosso } from '@/services/firebase/server';

export type StateValidation = {
  error?: string;
  success?: string;
};

const companies = ['pieroni', 'pieroni-mostra', 'pellet'] as const;
const paymentMethods = ['assegno', 'contanti', 'bancomat'] as const;

const checkCompanyType = (
  company: string
): company is (typeof companies)[number] =>
  companies.includes(<(typeof companies)[number]>company);
const checkPaymentMethodType = (
  paymentMethod: string
): paymentMethod is (typeof paymentMethods)[number] =>
  paymentMethods.includes(<(typeof paymentMethods)[number]>paymentMethod);

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

    console.log({
      formClient,
      formCompany,
      formTotal,
      formPaymentMethod,
      formPaymentChequeNumber,
      formPaymentChequeValue,
      formId,
      formIsNew,
    });

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

    console.log({
      isNew,
      id,
      client,
      company,
      total,
      paymentMethod,
      paymentChequeNumber,
      paymentChequeValue,
    });

    if (!checkCompanyType(company) || !checkPaymentMethodType(paymentMethod)) {
      throw new Error('data invalid');
    }

    if (isNew && !id) {
      await createRiscosso(currentHeaders, {
        client,
        company,
        total,
        paymentMethod,
        paymentChequeNumber,
        paymentChequeValue,
        docs: [],
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

    revalidatePath('/admin');

    return {
      success: FORM_SUCCESS_LINK,
    };
  } catch (e) {
    console.error(e);
    return {
      errors: {
        general: FORM_FAIL_LINK,
      },
    };
  }
};
