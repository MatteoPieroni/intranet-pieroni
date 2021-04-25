import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Formik, FormikHelpers, Form } from 'formik';
import styled from '@emotion/styled';

import { CataloguesService, IFile } from '../../../services/firebase/db';
import { Field } from '../../form-fields';
import { Button } from '../../button';
import { useCatalogueUtilities } from '../../file-system';
import { Select, SelectOption } from '../../form-fields/select';
import { ICategoryWithFileCount, IEnrichedFile } from '../../../utils/file-system';

interface ICataloguesFormProps {
	file: IFile | IEnrichedFile;
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

const isFullCategory = (array: string[] | ICategoryWithFileCount[]): array is ICategoryWithFileCount[] => {
  return !!(array as ICategoryWithFileCount[])?.[0]?.label;
}

export const CataloguesForm: React.FC<ICataloguesFormProps> = ({ file, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);
	const isMounted = useRef<boolean>();
  const { categoriesLookup } = useCatalogueUtilities();

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
      const cleanedCategories = !isFullCategory(file.categoriesId) ?
        file.categoriesId :
        file.categoriesId.map((cat): string => {
          return cat.id;
        }) as string[];

      const fileToPass = {
        ...file,
        categoriesId: cleanedCategories,
      };

      await CataloguesService.editCatalogue({ label: values.label, categoriesId: values.categoriesId }, fileToPass);
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

  const categoriesOptions: SelectOption[] = useMemo(() => 
    Object.values(categoriesLookup).map(({ id, label }) => ({
      label,
      value: id,
    })), [categoriesLookup, file]);

  return (
    <StyledLinksForm>
      <Formik initialValues={file} onSubmit={submitCatalogue} validate={validateCatalogue}>
        <Form>
          <Field name="id" hidden />
          <Field name="label" label="Nome" />
          <Select name="categoriesId" options={categoriesOptions} isMulti />
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
