'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { FORM_FAIL_RISCOSSO, FORM_SUCCESS_RISCOSSO } from '@/consts';
import { createEmptyIssue, updateIssue } from '@/services/firebase/server';
import { IssueSchema } from '@/services/firebase/validator';
import { bustCache } from '@/services/cache';

export type StateValidation = {
  error?: string;
  success?: string;
};

const FormFieldsSchema = IssueSchema.omit({
  id: true,
  date: true,
  meta: true,
  verification: true,
  timeline: true,
  result: true,
  updatedAt: true,
});

export const issueAction = async (_: StateValidation, values: FormData) => {
  const authHeader = (await headers()).get('Authorization');

  try {
    const formId = values.get('id');
    const formIsNew = values.get('isNew');

    if (!formId && !formIsNew) {
      return {
        error: FORM_FAIL_RISCOSSO,
      };
    }

    const { commission, client, issueType, summary, supplierInfo } =
      FormFieldsSchema.parse({
        commission: values.get('commission'),
        client: values.get('client'),
        issueType: values.get('issueType'),
        summary: values.get('summary'),
        supplierInfo: {
          supplier: values.get('supplier'),
          documentType: values.get('documentType'),
          ...(values.get('documentDate') && {
            documentDate: new Date(String(values.get('documentDate'))),
          }),
          deliveryContext: values.get('deliveryContext'),
          product: {
            number: values.get('productNumber'),
            quantity: Number(values.get('productQuantity')),
            description: values.get('productDescription'),
          },
        },
        ...(String(values.get('resultDate')) && {
          result: {
            date: new Date(String(values.get('resultDate'))),
            summary: values.get('resultSummary'),
          },
        }),
      });

    let id = String(formId);
    const isNew = String(formIsNew) === 'NEW';
    let isCreation = false;

    if (isNew && !id) {
      id = await createEmptyIssue(authHeader, {
        client,
      });
      isCreation = true;
    }

    await updateIssue(authHeader, {
      id,
      commission,
      client,
      issueType,
      summary,
      supplierInfo,
    });

    if (isCreation) {
      bustCache('create', 'issue');
    } else {
      bustCache('patch', 'issue', id);
    }

    revalidatePath('/issues');

    return {
      success: FORM_SUCCESS_RISCOSSO,
    };
  } catch (e) {
    console.error(e);

    return {
      error: FORM_FAIL_RISCOSSO,
    };
  }
};
