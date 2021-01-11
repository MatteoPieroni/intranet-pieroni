import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Formik, Form, FormikHelpers } from 'formik';

import { sendSms, ISms } from '../../../services/sms';
import { addSms, IDbSms } from '../../../services/firebase/db';
import { validateMandatoryInput } from '../../../utils/validateMandatoryInput';
import { validateMobile } from '../../../utils/validation/validateMobile';
import { validateCapsLock } from '../../../utils/validation/validateCapsLock';
import { formatMobile } from '../../../utils/formatMobile';
import { FORM_SUCCESS_MESSAGE, FORM_FAIL_MESSAGE } from '../../../common/consts';
import { useUser, useConfig } from '../../../shared/hooks';

import { Field } from '../../form-fields';
import { Button } from '../../button';
import { Notification } from '../../notification';

interface ISmsFormProps {
  onSave?: () => void;
}

interface ISmsError {
  number?: string;
  message?: string;
}

const StyledSmsForm = styled.div`
  margin: 2rem auto;
  padding: 1rem;
  max-width: 500px;
  background: #fff;

  h1 {
    margin-top: 0;
    color: #000;
  }

  .field-container {
    margin-bottom: .75rem;
  }

  textarea {
    height: 8rem;
  }

  .buttons-container {
    display: flex;
    justify-content: space-between;
  }
`;

const newSms: ISms = {
  number: '',
  message: '',
}

export const SmsForm: React.FC<ISmsFormProps> = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [fail, setFail] = useState('');
  const [user] = useUser();
  const config = useConfig();

  const { name, surname, id } = user;

  const onSubmitSms: (values: ISms, formikHelpers: FormikHelpers<any>) => void = async (values, { resetForm }) => {
    setIsSaving(true);
    setSuccess('');
    setFail('');

    try {
      const { number, message } = values;

      const finalNumber = formatMobile(number);

      await sendSms(config.smsApi, { number: finalNumber, message });

      const historyData: IDbSms = {
        sender: `${name} ${surname}`,
        senderUID: id,
        time: Date.now(),
        ...values,
      }
      console.log(historyData);

      await addSms(historyData);

      setSuccess(FORM_SUCCESS_MESSAGE);
      resetForm({});
    } catch (e) {
      console.log(e);
      setFail(FORM_FAIL_MESSAGE);
    }

    setIsSaving(false);
  }

  const validateSms: (values: ISms) => ISmsError = (values) => {
    const { number, message } = values;
    const numError = validateMobile(number);
    const messageError = validateMandatoryInput(message) || validateCapsLock(message);

    return {
      ...(numError && { number: numError }),
      ...(messageError && { message: messageError }),
    }
  }

  return (
    <StyledSmsForm>
      <h1>Invia un sms</h1>
      <Formik initialValues={newSms} onSubmit={onSubmitSms} validate={validateSms}>
        <Form>
          <Field name="number" label="Numero" />
          <Field name="message" label="Messaggio" as="textarea" hint="Ricordati di disattivare il maiuscolo" />
          <div className="buttons-container">
            {isSaving ?
              <p>Sto salvando...</p> :
              <Button type="submit">Invia il messaggio</Button>
            }
          </div>
        </Form>
      </Formik>
      {success && <Notification variant="success" message={success} />}
      {fail && <Notification variant="fail" message={fail} />}
    </StyledSmsForm>
  )
}
