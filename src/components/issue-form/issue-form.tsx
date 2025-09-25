'use client';

import { useActionState, useState } from 'react';
import * as z from 'zod';

import { IIssueAction, type IIssue } from '@/services/firebase/db-types';
import { issueAction, StateValidation } from './issue-action';
import styles from './issue-form.module.css';
import { FormStatus } from '../form-status/form-status';
import { DeleteIcon } from '../icons/delete';

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
  timeline: [],
  commission: '',
  summary: '',
} satisfies Partial<IIssue>;
const newIssueForForm = {
  ...newIssue,
  issueType: '',
  supplier: '',
  id: '',
  documentType: '',
  documentDate: '',
  deliveryContext: '',
  productNumber: '',
  productQuantity: '',
  productDescription: '',
  resultDate: '',
  resultSummary: '',
};

const emptyAction = {
  date: new Date(),
  content: '',
  result: '',
} satisfies IIssueAction;

type LocalAction = (IIssueAction | typeof emptyAction) & {
  id?: string;
};

const addActionWithId = (actionsArray: LocalAction[]) =>
  actionsArray.map((action) => ({
    ...action,
    id: action.id || crypto.randomUUID(),
  }));

export const IssueForm = ({ issue, isNew = false }: IssueFormProps) => {
  const {
    client,
    id,
    commission,
    issueType,
    summary,
    timeline,
    supplier,
    documentType,
    documentDate,
    deliveryContext,
    productNumber,
    productQuantity,
    productDescription,
    resultDate,
    resultSummary,
  } = { ...newIssueForForm, ...issue };

  const [actionsWithAdded, setActionsWithAdded] = useState<LocalAction[]>(
    addActionWithId(timeline)
  );

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
            <input
              name="client"
              defaultValue={client} // required
            />
          </label>
          <label>
            Nr commissione
            <input
              name="commission"
              defaultValue={commission} // required
            />
          </label>
        </div>
        <div className={styles.row}>
          <label>
            Tipo di problema
            <select
              name="issueType"
              // required
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
            <textarea
              name="summary"
              defaultValue={summary} // required
            />
          </label>
        </div>
        <div className={styles.row}>
          <label>
            Ditta fornitrice
            <input name="supplier" defaultValue={supplier} />
          </label>
          <label>
            Tipo di documento
            <input name="documentType" defaultValue={documentType} />
          </label>
          <label>
            Data documento
            <input
              type="date"
              name="documentDate"
              defaultValue={documentDate}
            />
          </label>
          <label>
            Consegnata con
            <input name="deliveryContext" defaultValue={deliveryContext} />
          </label>
        </div>
        <div className={styles.row}>
          <label>
            Articolo
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

        <div className={styles.row}>
          <fieldset>
            <legend>Azioni</legend>
            {actionsWithAdded.map((action) => {
              return (
                <div key={action.id}>
                  <label>
                    Data
                    <input
                      name="action-date"
                      type="date"
                      defaultValue={action.date.toISOString().split('T')[0]}
                      // required
                    />
                  </label>
                  <label>
                    Azione
                    <textarea
                      name="action-number"
                      defaultValue={action.content}
                      // required
                    />
                  </label>
                  <label>
                    Allegati
                    <input
                      type="file"
                      name="action-attachment"
                      multiple
                      accept=".jpg,.png"
                      onChange={(e) => {
                        const files = e.target.files || [];
                        const filesWithoutBig = new DataTransfer();
                        let hasError = false;

                        for (const file of files) {
                          try {
                            AttachmentSchema.parse(file);

                            filesWithoutBig.items.add(file);
                          } catch (error) {
                            console.error(error);
                            hasError = true;
                          }
                        }

                        if (hasError) {
                          alert(
                            'Uno dei file era troppo grande, lo abbiamo rimosso'
                          );
                        }

                        let total = 0;
                        for (const finalFile of filesWithoutBig.files) {
                          total += finalFile.size;
                        }

                        if (total > 1_000_000) {
                          alert(
                            'Il totale di allegati e troppo grande, riducili o rimuovine alcuni'
                          );
                          e.target.value = '';
                          return;
                        }

                        e.target.files = filesWithoutBig.files;
                      }}
                    />
                  </label>
                  <label>
                    Risultato
                    <textarea
                      name="action-result"
                      defaultValue={action.result}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const hasConfirmed = confirm(
                        'Confermi la cancellazione?'
                      );

                      if (!hasConfirmed) return;

                      setActionsWithAdded(
                        actionsWithAdded.filter(
                          (stateAction) => stateAction.id !== action.id
                        )
                      );
                    }}
                    title="Rimuovi azione"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setActionsWithAdded(
                  addActionWithId([...actionsWithAdded, emptyAction])
                );
              }}
            >
              Aggiungi azione
            </button>
          </fieldset>
        </div>

        <div className={styles.row}>
          <fieldset>
            <legend>Conclusione</legend>
            <label>
              Data
              <input type="date" name="resultDate" defaultValue={resultDate} />
            </label>
            <label>
              Commento
              <textarea name="resultSummary" defaultValue={resultSummary} />
            </label>
          </fieldset>
        </div>

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
