import React, { useState } from 'react';
import styled from '@emotion/styled';
import { ISms } from '../../../services/sms/types';
import { validateMandatoryInput } from '../../../utils/validateMandatoryInput';
import { Formik, Form } from 'formik';
import { Field } from '../../formFields';
import { Button } from '../../button';
import { useUser } from '../../../shared/hooks/useUser';
import { IDbSms } from '../../../services/firebase/types';
import { sendSms } from '../../../services/sms';
import { addSms } from '../../../services/firebase/db';
import { validateMobile } from '../../../utils/validation/validateMobile';

interface ISmsFormProps {
  onSave?: () => void;
}

interface ISmsError {
  number?: string;
  message?: string;
}

const StyledSmsForm = styled.div`
  form {
    padding: .5rem;
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
  const [user] = useUser();

  const { name, surname, id } = user;

  const onSubmitSms: (values: ISms) => void = async (values) => {
    setIsSaving(true);

    try {
      console.log(await sendSms(values));

      const historyData: IDbSms = {
        sender: `${name} ${surname}`,
        senderUID: id,
        time: Date.now(),
        ...values,
      }
      console.log(historyData)

      // await addSms(historyData);

    } catch (e) {
      console.log(e);
    }
    setIsSaving(false);
  }

  const validateSms: (values: ISms) => ISmsError = (values) => {
    const { number, message } = values;
    const numError = validateMobile(number);
    const messageError = validateMandatoryInput(message);

    return {
      ...(numError && { number: numError }),
      ...(messageError && { message: messageError }),
    }
  }

  return (
    <StyledSmsForm>
      <Formik initialValues={newSms} onSubmit={onSubmitSms} validate={validateSms}>
        <Form>
          <Field name="number" label="Numero" type="number" />
          <Field name="message" label="Messaggio" as="textarea" />
          <div className="buttons-container">
            {isSaving ?
              <p>Sto salvando...</p> :
              <Button type="submit">Salva questo link</Button>
            }
          </div>
        </Form>
      </Formik>
    </StyledSmsForm>
  )
}
