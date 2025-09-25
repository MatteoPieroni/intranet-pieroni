'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { FORM_FAIL_RISCOSSO, FORM_SUCCESS_RISCOSSO } from '@/consts';
import { createEmptyIssue, updateIssue } from '@/services/firebase/server';
import { IssueActionSchema, IssueSchema } from '@/services/firebase/validator';
import { uploadIssueAttachment } from '@/services/firebase/server/storage';
import z from 'zod';

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
});

const FormActionSchema = IssueActionSchema.omit({
  attachments: true,
}).extend({
  attachments: z.optional(z.array(z.file())),
});

const handleTimeline = async (
  dates: FormDataEntryValue[],
  contents: FormDataEntryValue[],
  results: FormDataEntryValue[],
  attachments: FormDataEntryValue[]
) => {
  if (
    dates.length === 0 ||
    dates.length !== contents.length ||
    dates.length !== results.length ||
    dates.length !== attachments.length
  ) {
    throw new Error('DOCS_ERROR');
  }

  const actions = dates
    .map((date, index) => {
      console.log({ attachments, i: attachments[index] });
      return FormActionSchema.parse({
        date: new Date(String(date)),
        content: String(contents[index]),
        results: Number(results[index]),
        attachments: attachments[index],
      });
    })
    // remove empty
    .filter((doc) => !!doc.date);

  return actions;
};

export const issueAction = async (_: StateValidation, values: FormData) => {
  const currentHeaders = await headers();

  try {
    const formId = values.get('id');
    const formIsNew = values.get('isNew');

    if (!formId && !formIsNew) {
      return {
        error: FORM_FAIL_RISCOSSO,
      };
    }

    const formActionDate = values.getAll('action-date');
    const formActionNumber = values.getAll('action-number');
    const formActionAttachment = values.getAll('action-attachment');
    const formActionResult = values.getAll('action-result');

    const timeline = await handleTimeline(
      formActionDate,
      formActionNumber,
      formActionResult,
      formActionAttachment
    );

    const { commission, client, issueType, summary, supplierInfo, result } =
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

    if (isNew && !id) {
      id = await createEmptyIssue(currentHeaders);
    }

    const timelineWithFiles = await Promise.all(
      timeline.map(async (action) => {
        const actionAttachmentsUpload: string[] = [];

        for (const attachment of action.attachments || []) {
          if (attachment && attachment.size > 0) {
            const uploadFileUrl = await uploadIssueAttachment(
              currentHeaders,
              id,
              attachment
            );
            actionAttachmentsUpload.push(uploadFileUrl);
          }
        }

        return {
          ...action,
          attachments: actionAttachmentsUpload,
        };
      })
    );

    await updateIssue(currentHeaders, {
      id,
      commission,
      client,
      issueType,
      summary,
      supplierInfo,
      timeline: timelineWithFiles,
      result,
    });

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
