'use client';

import { useActionState } from 'react';
import * as z from 'zod';

import type { IRiscosso } from '@/services/firebase/db-types';
import { riscossoAction, StateValidation } from './riscosso-action';
import styles from './riscosso-form.module.css';
import { FormStatus } from '../form-status/form-status';
import { SaveIcon } from '../icons/save';

export const IconSchema = z.file();
IconSchema.max(1_000_000, 'Too big');

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

export const RiscossiForm = ({
  riscosso,
  isNew = false,
}: RiscossiFormProps) => {
  const {
    client,
    company,
    id,
    docs,
    paymentMethod,
    total,
    paymentChequeNumber,
    paymentChequeValue,
  } = riscosso || newRiscossoForForm;

  const [state, formAction, pending] = useActionState(
    riscossoAction,
    initialState
  );

  return (
    <form action={formAction}>
      <div className={styles.container}>
        <label>
          Cliente
          <input name="client" defaultValue={client} required />
        </label>

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

        <label>
          Metodo di pagamento
          <select
            name="payment-method"
            required
            {...(!company && { defaultValue: '' })}
          >
            {!paymentMethod && (
              <option hidden value="">
                Seleziona metodo di pagamento
              </option>
            )}
            {paymentMethods.map((method) => (
              <option
                value={method.id}
                defaultChecked={paymentMethod === method.id}
                key={method.id}
              >
                {method.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Numero assegno
          <input
            name="payment-cheque-number"
            defaultValue={paymentChequeNumber}
          />
        </label>
        <label>
          Importo assegno
          <input
            name="payment-cheque-value"
            type="number"
            defaultValue={paymentChequeValue}
          />
        </label>

        <label>
          Totale
          <input
            name="total"
            type="number"
            defaultValue={total}
            required
            min="1"
          />
        </label>

        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="isNew" value={isNew ? 'NEW' : ''} />
        <div className={styles.buttonsContainer}>
          <button type="submit" title={!isNew ? 'Salva' : 'Aggiungi'}>
            {!isNew ? <SaveIcon role="presentation" /> : 'Aggiungi'}
          </button>
        </div>
      </div>
      {!pending && <FormStatus text={state.success} type="success" />}
      {!pending && <FormStatus text={state.error} type="error" />}
    </form>
  );
};
