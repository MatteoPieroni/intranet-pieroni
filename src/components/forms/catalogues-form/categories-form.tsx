import React, { useEffect, useRef, useState } from 'react';
import { Formik, FormikHelpers, Form } from 'formik';
import styled from '@emotion/styled';

import { CataloguesService, ICategory } from '../../../services/firebase/db';
import { Field } from '../../form-fields';
import { Button } from '../../button';
import { ICategoryWithSubfolders } from '../../../utils/file-system';

interface ICategoriesFormProps {
	folder: ICategoryWithSubfolders;
	onSave: () => void;
}

interface ICategoryError {
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

export const CategoriesForm: React.FC<ICategoriesFormProps> = ({ folder, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);
	const isMounted = useRef<boolean>();

	useEffect(() => {
		isMounted.current = true;

		return (): void => {
			isMounted.current = false;
		}
	}, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitCategory: (values: ICategory, formikHelpers: FormikHelpers<any>) => void = async (values, { resetForm }) => {
    setIsSaving(true);

    try {
      if (!values.id) {
				await CataloguesService.addCategory({ parent: '', ...values });
      }

      if (values.id) {
				await CataloguesService.renameCategory(values);
      }
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

  const validateCategory: (values: ICategory) => ICategoryError = (values) => {
    const { label } = values;
		
		if (label) {
			return {};
		}

    return {
      description: 'Scrivi il nome della categoria',
    }
  }

  return (
    <StyledLinksForm>
      <Formik initialValues={folder} onSubmit={submitCategory} validate={validateCategory}>
        <Form>
          <Field name="id" hidden />
          <Field name="label" label="Nome" />
          <div className="buttons-container">
            {isSaving ?
              <p>Sto salvando...</p> :
              <Button type="submit">Aggiungi questa categoria</Button>
            }
          </div>
        </Form>
      </Formik>
    </StyledLinksForm>
  )
}
