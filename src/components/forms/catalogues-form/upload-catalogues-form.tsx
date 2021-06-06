import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Formik, FormikHelpers, Form } from 'formik';
import styled from '@emotion/styled';

import { Field } from '../../form-fields';
import { Button } from '../../button';
import { useCatalogueUtilities } from '../../file-system';
import { Select, SelectOption } from '../../form-fields/select';
import { UploadField } from '../../form-fields/file-upload';
import { INewFile } from '../../../services/firebase/db';
import { CataloguesApiService } from '../../../services/catalogues-api';
import { Queue } from '../../../utils/queue';

interface IUploadCataloguesFormProps {
	selectedCategory?: string;
	onSave: () => void;
  queue: Queue<'sync' | 'upload'>;
}

type ICatalogueError = {
	[key in keyof INewFile]?: string;
};

const StyledLinksForm = styled.div`
  form {
    padding: .5rem;
  }

  .buttons-container {
    display: flex;
    justify-content: space-between;
  }
`;

export const UploadCataloguesForm: React.FC<IUploadCataloguesFormProps> = ({ selectedCategory, onSave, queue }) => {
  const [isSaving, setIsSaving] = useState(false);
	const isMounted = useRef<boolean>();
  const { categoriesLookup } = useCatalogueUtilities();
  const initialState = useMemo(() => {
    return {
			files: [],
			label: '',
      categoriesId: [selectedCategory]
    }
  }, []);

	useEffect(() => {
		isMounted.current = true;

		return (): void => {
			isMounted.current = false;
		}
	}, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitCatalogue: (values: INewFile, formikHelpers: FormikHelpers<any>) => void = async (values, { resetForm }) => {
    setIsSaving(true);

    try {
      const callIds = await CataloguesApiService.uploadCatalogues(values);

      callIds.forEach((callId, fileIndex) => {
        queue.push({ id: callId, label: values?.label || values.files[fileIndex].name, type: 'upload' });
        
        CataloguesApiService.pollSyncStatus(callId, (status) => queue.update?.(callId, status));
      });

      if (typeof onSave === 'function') {
        onSave();
      }
  
      if (isMounted.current === true) {
        setIsSaving(false);
        resetForm({});
      }
    } catch (e) {
      console.error(e);
    }
  }

  const validateCatalogue: (values: INewFile) => ICatalogueError = (values) => {
    const { label, files } = values;

		if (files.length === 0) {
			return {
				files: 'Seleziona almeno un file',
			}
		}

		if (label && files.length > 1) {
			return {
				label: 'Se carichi molteplici file non puoi specificare il nome',
			}
		}

		if (!label && files.length === 1) {
			return {
				label: 'Scrivi il nome del catalogo',
			}
		}

		return {};
  }

  const categoriesOptions: SelectOption[] = useMemo(() => 
    Object.values(categoriesLookup).map(({ id, label }) => ({
      label,
      value: id,
    })), [categoriesLookup]);

  return (
    <StyledLinksForm>
      <Formik initialValues={initialState} onSubmit={submitCatalogue} validate={validateCatalogue}>
        <Form>
					<UploadField name="files" multiple={true} accept=".pdf,.xls,.xlsx" />
          <Field name="label" label="Nome" />
          <Select name="categoriesId" options={categoriesOptions} isMulti />
          <div className="buttons-container">
            {isSaving ?
              <p>Sto salvando...</p> :
              <Button type="submit">Carica questi cataloghi</Button>
            }
          </div>
        </Form>
      </Formik>
    </StyledLinksForm>
  )
}
