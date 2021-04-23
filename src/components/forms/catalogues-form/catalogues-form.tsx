import React, { useEffect, useRef, useState } from 'react';
import { Formik, FormikHelpers, Form } from 'formik';
import styled from '@emotion/styled';

import { CataloguesService, IFile } from '../../../services/firebase/db';
import { Field } from '../../form-fields';
import { Button } from '../../button';

interface ICataloguesFormProps {
	file: IFile;
	onSave: () => void;
}

interface ICatalogueError {
  description?: string;
}

const StyledLinksForm = styled.div`
  form {
    padding: .5rem;
  }

  .buttons-container {
    display: flex;
    justify-content: space-between;
  }
`;

export const CataloguesForm: React.FC<ICataloguesFormProps> = ({ file, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);
	const isMounted = useRef<boolean>();

	useEffect(() => {
		isMounted.current = true;

		return (): void => {
			isMounted.current = false;
		}
	}, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitCatalogue: (values: IFile, formikHelpers: FormikHelpers<any>) => void = async (values, { resetForm }) => {
    setIsSaving(true);

    try {
				await CataloguesService.renameCatalogue(values.label, file);
    } catch (e) {
      console.error(e);
    }

		if (typeof onSave === 'function') {
			onSave();
		}

		if (isMounted.current === true) {
			setIsSaving(false);
			resetForm({});
		}
  }

  const validateCatalogue: (values: IFile) => ICatalogueError = (values) => {
    const { label } = values;
		
		if (label) {
			return {};
		}

    return {
      description: 'Scrivi il nome del catalogo',
    }
  }

  return (
    <StyledLinksForm>
      <Formik initialValues={file} onSubmit={submitCatalogue} validate={validateCatalogue}>
        <Form>
          <Field name="id" hidden />
          <Field name="label" label="Nome" />
          <div className="buttons-container">
            {isSaving ?
              <p>Sto salvando...</p> :
              <Button type="submit">Salva questo catalogo</Button>
            }
          </div>
        </Form>
      </Formik>
    </StyledLinksForm>
  )
}
