import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Formik, FormikHelpers, Form } from 'formik';
import styled from '@emotion/styled';

import { CataloguesService, IFile } from '../../../services/firebase/db';
import { Button } from '../../button';
import { useCatalogueUtilities } from '../../file-system';
import { Select, SelectOption } from '../../form-fields/select';
import { IEnrichedFile } from '../../../utils/file-system';

interface IMultiCataloguesFormProps {
	files: (IFile | IEnrichedFile)[];
	onSave: () => void;
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

export const MultiCataloguesForm: React.FC<IMultiCataloguesFormProps> = ({ files, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);
	const isMounted = useRef<boolean>();
  const { categoriesLookup } = useCatalogueUtilities();
  const initialState = useMemo(() => {
    return {
      categoriesId: []
    }
  }, []);

	useEffect(() => {
		isMounted.current = true;

		return (): void => {
			isMounted.current = false;
		}
	}, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitCatalogue: (values: { categoriesId: string[] }, formikHelpers: FormikHelpers<any>) => void = async (values, { resetForm }) => {
    setIsSaving(true);

    try {
      const filesPromises = files.map(file => CataloguesService.editCatalogue(
        { label: file.label, categoriesId: values.categoriesId },
        {
          ...file,
          categoriesId: []
        }
      ));

      await Promise.all(filesPromises);
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

  const categoriesOptions: SelectOption[] = useMemo(() => 
    Object.values(categoriesLookup).map(({ id, label }) => ({
      label,
      value: id,
    })), [categoriesLookup]);

  return (
    <StyledLinksForm>
      <Formik initialValues={initialState} onSubmit={submitCatalogue}>
        <Form>
          <Select name="categoriesId" options={categoriesOptions} isMulti />
          <div className="buttons-container">
            {isSaving ?
              <p>Sto salvando...</p> :
              <Button type="submit">Salva questi cataloghi</Button>
            }
          </div>
        </Form>
      </Formik>
    </StyledLinksForm>
  )
}
