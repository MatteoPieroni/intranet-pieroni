'use client';

import { ChangeEvent, useActionState, useState } from 'react';

import { IRiscossoDoc, type IRiscosso } from '@/services/firebase/db-types';
import { riscossoAction, StateValidation } from './riscosso-action';
import styles from './riscosso-form.module.css';
import { FormStatus } from '../form-status/form-status';
import { DeleteIcon } from '../icons/delete';

type RiscossiFormProps =
  | {
      riscosso: IRiscosso;
      isNew?: false;
    }
  | {
      isNew: true;
      riscosso: undefined;
    };

const initialState: StateValidation = {};

const newRiscosso = {
  client: '',
  docs: [],
  total: 0,
  paymentChequeNumber: '',
  paymentChequeValue: 0,
} satisfies Partial<IRiscosso>;
const newRiscossoForForm = {
  ...newRiscosso,
  company: '',
  paymentMethod: '',
  id: '',
};

const companies = [
  {
    id: 'pieroni',
    label: 'Pieroni srl',
  },
  {
    id: 'pieroni-mostra',
    label: 'Pieroni in mostra',
  },
  {
    id: 'pellet',
    label: 'Pellet',
  },
];

const paymentMethods = [
  {
    id: 'assegno',
    label: 'Assegno',
  },
  {
    id: 'contanti',
    label: 'Contanti',
  },
  {
    id: 'bancomat',
    label: 'Bancomat',
  },
];

const documentTypes = [
  { id: 'fattura', label: 'Fattura' },
  { id: 'DDT', label: 'DDT' },
  { id: 'impegno', label: 'Impegno' },
];

const emptyDoc = {
  number: '',
  type: '',
  total: 0,
  date: new Date(),
};

type LocalDoc = (IRiscossoDoc | typeof emptyDoc) & {
  id?: string;
};

const addDocWithId = (docsArray: LocalDoc[]) =>
  docsArray.map((doc) => ({
    ...doc,
    id: doc.id || crypto.randomUUID(),
  }));

export const RiscossiForm = ({
  riscosso,
  isNew = false,
}: RiscossiFormProps) => {
  const {
    client,
    company,
    id,
    docs,
    paymentMethod: initialPaymentMethod,
    paymentChequeNumber,
    paymentChequeValue,
  } = riscosso || newRiscossoForForm;

  const [docsWithAdded, setDocsWithAdded] = useState<LocalDoc[]>(
    addDocWithId(docs)
  );

  const [state, formAction, pending] = useActionState(
    riscossoAction,
    initialState
  );
  const [paymentMethod, setPaymentMethod] = useState(
    initialPaymentMethod || ''
  );

  const handlePaymentMethod = (event: ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(event.target.value);
  };

  return (
    <form action={formAction}>
      <div className={styles.container}>
        <div className={styles.row}>
          <label>
            Azienda
            <select
              name="company"
              required
              {...(!company && { defaultValue: '' })}
            >
              {!company && (
                <option hidden value="">
                  Seleziona azienda
                </option>
              )}
              {companies.map((availableCompany) => (
                <option
                  value={availableCompany.id}
                  defaultChecked={company === availableCompany.id}
                  key={availableCompany.id}
                >
                  {availableCompany.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.row}>
          <label>
            Cliente
            <input name="client" defaultValue={client} required />
          </label>
        </div>

        <div className={styles.row}>
          <fieldset>
            <legend>Documenti</legend>
            {docsWithAdded.map((doc) => {
              return (
                <div key={doc.id}>
                  <label>
                    Numero
                    <input
                      name="doc-number"
                      defaultValue={doc.number}
                      required
                    />
                  </label>
                  <label>
                    Data
                    <input
                      name="doc-date"
                      type="date"
                      defaultValue={doc.date.toISOString().split('T')[0]}
                      required
                    />
                  </label>
                  <label>
                    Tipo di documento
                    <select
                      name="doc-type"
                      required
                      {...(!doc.type ? { defaultValue: '' } : {})}
                    >
                      {!doc.type && (
                        <option hidden value="">
                          Seleziona tipo documento
                        </option>
                      )}
                      {documentTypes.map((docType) => (
                        <option
                          value={docType.id}
                          defaultChecked={doc.type === docType.id}
                          key={docType.id}
                        >
                          {docType.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Totale documento
                    <input
                      name="doc-total"
                      type="number"
                      defaultValue={doc.total}
                      required
                      min="1"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const hasConfirmed = confirm(
                        'Confermi la cancellazione?'
                      );

                      if (!hasConfirmed) return;

                      setDocsWithAdded(
                        docsWithAdded.filter(
                          (stateDoc) => stateDoc.id !== doc.id
                        )
                      );
                    }}
                    title="Rimuovi documento"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setDocsWithAdded(addDocWithId([...docsWithAdded, emptyDoc]));
              }}
            >
              Aggiungi documento
            </button>
          </fieldset>
        </div>

        <div className={styles.row}>
          <label>
            Metodo di pagamento
            <select
              name="payment-method"
              required
              onChange={handlePaymentMethod}
              value={paymentMethod}
            >
              {!paymentMethod && (
                <option hidden value="">
                  Seleziona metodo di pagamento
                </option>
              )}
              {paymentMethods.map((method) => (
                <option value={method.id} key={method.id}>
                  {method.label}
                </option>
              ))}
            </select>
          </label>

          {paymentMethod === 'assegno' && (
            <>
              <label>
                Numero assegno
                <input
                  name="payment-cheque-number"
                  defaultValue={paymentChequeNumber}
                  required
                />
              </label>
              <label>
                Importo assegno
                <input
                  name="payment-cheque-value"
                  type="number"
                  defaultValue={paymentChequeValue}
                  required
                  min="1"
                />
              </label>
            </>
          )}
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
      {!pending && <FormStatus text={state.partialSuccess} type="warning" />}
      {!pending && <FormStatus text={state.error} type="error" />}
    </form>
  );
};
