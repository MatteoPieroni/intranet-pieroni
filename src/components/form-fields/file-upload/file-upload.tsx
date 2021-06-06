import React from 'react';
import { ErrorMessage, useField } from 'formik';
import styled from '@emotion/styled';

import { Icon } from '../../icons';

export interface IFieldProps {
  name: string;
  label?: string;
  hint?: string;
  small?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const StyledField = styled.div<{ small?: boolean }>`
  margin-bottom: .5rem;
  font-size: ${(props): string => props.small ? '1.5rem' : '1rem'};

  label {
    display: block;
    margin-bottom: .35em;
    font-size: 1.2em;
  }

  .hint {
    display: block;
    margin-bottom: .35em;
  }

  .field {
    margin-bottom: .5em;
    padding: .25em;
    width: 100%;
    font-size: 1em;
    color: #000;
    box-sizing: border-box;
  }

  .error {
    font-size: 1em;
    color: #9e1500;
  }
`;

export const UploadField: React.FC<IFieldProps> = ({ name, label, hint, small, ...rest }) => {
	const [{ value }, meta, { setValue }] = useField(name);

	const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		const newFiles = Array.from(e.currentTarget.files);

		setValue(newFiles)
	}

  return (
    <StyledField className="field-container" small={small}>
			<label htmlFor={name}>{label}</label>
			{hint && <span className="hint"><Icon.InfoCircle /> {hint}</span>}
			<input type="file" name={name} {...rest} onChange={handleChange} />
			<span className="error"><ErrorMessage name={name} /></span>
    </StyledField>
  )
}
