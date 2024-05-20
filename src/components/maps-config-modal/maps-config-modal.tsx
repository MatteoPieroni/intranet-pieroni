import React, { useState } from 'react';
import Modal from 'react-modal';
import styled from '@emotion/styled';
import { Button } from '../button';
import { Form, Formik } from 'formik';
import { useConfig } from '../../shared/hooks';
import { Field } from '../form-fields';
import { IConfig, updateConfig } from '../../services/firebase/db';

Modal.setAppElement('#app');

// type IConfigForm = Pick<IConfig, 'transportCostMinimum' | 'transportCostPerMinute' | 'transportHourBase'>

const StyledDiv = styled.div`
`;

export const MapsConfigModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { checkInternal: _, ...config } = useConfig();
  const [isSaving, setIsSaving] = useState(false);

  const saveConfig = async (values: IConfig) => {
    console.log({ values })
    try {
      await updateConfig(Object.keys(values) as (keyof IConfig)[], values);
    } catch (e) {
      console.error(e);
    }

    setIsSaving(false);
    // resetForm({});
  }

  const validateConfig = () => {
    console.log('test')
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Modifica costi</Button>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className="modal"
        contentLabel="Modifica config"
      >
        <StyledDiv>
          <Formik initialValues={config} onSubmit={saveConfig} validate={validateConfig}>
            <Form>
              <Field name="id" hidden />
              <Field name="transportCostMinimum" label="Costo minimo di trasporto" />
              <Field name="transportCostPerMinute" label="Costo di trasporto al minuto" />
              <Field name="transportHourBase" label="Base minima oraria" />
              <div className="buttons-container">
                {isSaving ?
                  <p>Sto salvando...</p> :
                  <Button type="submit">Salva questo link</Button>
                }
              </div>
            </Form>
          </Formik>
        </StyledDiv>
      </Modal>
    </>
  )
}
