'use client';

import { useActionState, useState } from 'react';
import * as z from 'zod';

import { type IIssue } from '@/services/firebase/db-types';
import { issueAction, StateValidation } from './issue-action';
import styles from './issue-form.module.css';
import { FormStatus } from '../form-status/form-status';
// import { DeleteIcon } from '../icons/delete';

type IssueFormProps =
  | {
      issue: IIssue;
      isNew?: false;
    }
  | {
      isNew: true;
      issue: undefined;
    };

const initialState: StateValidation = {};

const actionTypes = [
  { id: 'delay-preparation', label: 'Ritardo preparazione' },
  { id: 'missing-article', label: 'Articolo mancante alla consegna' },
  { id: 'delay-arrival', label: 'Ritardo arrivo' },
  { id: 'supplier-mistake', label: 'Sbaglio fornitore' },
  { id: 'client-return', label: 'Reso cliente' },
  { id: 'insufficient-order', label: 'Riordino insufficiente' },
  { id: 'supplier-defect', label: 'Difetto di fabbrica' },
  { id: 'breakage', label: 'Rottura' },
  { id: 'not-conforming', label: 'Non conforme' },
  { id: 'client-mistake', label: 'Errore cliente' },
  { id: 'plumber-mistake', label: 'Errore idraulico' },
  { id: 'builder-mistake', label: 'Errore muratore' },
  { id: 'project-mistake', label: 'Errore progettista' },
];

export const AttachmentSchema = z.file().max(1_000_000, 'Too big');

const newIssue = {
  client: '',
  commission: '',
  summary: '',
  supplierInfo: {
    supplier: '',
    documentType: '',
    deliveryContext: '',
    product: {
      number: '',
      description: '',
    },
  },
} satisfies Partial<IIssue>;
const newIssueForForm = {
  ...newIssue,
  supplierInfo: {
    ...newIssue.supplierInfo,
    documentDate: '',
    product: {
      ...newIssue.supplierInfo.product,
      quantity: '',
    },
  },
};

export const IssueForm = ({ issue, isNew = false }: IssueFormProps) => {
  const {
    client,
    id,
    commission,
    issueType,
    summary,
    supplierInfo: {
      supplier,
      documentType,
      documentDate,
      deliveryContext,
      product: {
        number: productNumber,
        quantity: productQuantity,
        description: productDescription,
      } = {},
    } = {},
  } = { ...newIssueForForm, ...issue };

  const [state, formAction, pending] = useActionState(
    issueAction,
    initialState
  );

  return (
    <form action={formAction}>
      <div className={styles.container}>
        <div className={styles.row}>
          <label>
            Cliente
            <input name="client" defaultValue={client} required />
          </label>
          <label>
            Nr commissione
            <input name="commission" defaultValue={commission} required />
          </label>
        </div>
        <div className={styles.row}>
          <label>
            Tipo di problema
            <select
              name="issueType"
              required
              {...(!issueType && { defaultValue: '' })}
            >
              {!issueType && (
                <option hidden value="">
                  Seleziona problema
                </option>
              )}
              {actionTypes.map((availableType) => (
                <option
                  value={availableType.id}
                  defaultChecked={issueType === availableType.id}
                  key={availableType.id}
                >
                  {availableType.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className={styles.row}>
          <label>
            Descrizione
            <textarea name="summary" defaultValue={summary} required />
          </label>
        </div>
        <fieldset>
          <legend>Fornitore</legend>
          <div className={styles.row}>
            <label>
              Ditta
              <input name="supplier" defaultValue={supplier} />
            </label>
            <label>
              Documento
              <input name="documentType" defaultValue={documentType} />
            </label>
            <label>
              Data documento
              <input
                type="date"
                name="documentDate"
                defaultValue={
                  documentDate instanceof Date
                    ? documentDate.toISOString().split('T')[0]
                    : ''
                }
              />
            </label>
            <label>
              Consegnata con
              <input name="deliveryContext" defaultValue={deliveryContext} />
            </label>
          </div>
        </fieldset>
        <fieldset>
          <legend>Articolo</legend>
          <div className={styles.row}>
            <label>
              Numero
              <input name="productNumber" defaultValue={productNumber} />
            </label>
            <label>
              Quantità
              <input
                type="number"
                name="productQuantity"
                defaultValue={productQuantity}
              />
            </label>
            <label>
              Descrizione prodotto
              <input
                name="productDescription"
                defaultValue={productDescription}
              />
            </label>
          </div>
        </fieldset>

        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="isNew" value={isNew ? 'NEW' : ''} />
        <div className={styles.buttonsContainer}>
          <button type="submit" title={!isNew ? 'Salva' : 'Aggiungi'}>
            {!isNew ? 'Salva' : 'Aggiungi'}
          </button>
        </div>
      </div>
      {!pending && <FormStatus text={state.success} type="success" />}
      {!pending && <FormStatus text={state.error} type="error" />}
    </form>
  );
};

export const IssueFormWithButton = (props: IssueFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Annulla modifiche' : 'Modifica'}
      </button>
      {isEditing && <IssueForm {...props} />}
    </div>
  );
};
