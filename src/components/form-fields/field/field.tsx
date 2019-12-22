import React, { Fragment } from 'react';
import { Field as FormikField, ErrorMessage } from 'formik';
import styled from '@emotion/styled';

import { Icon } from '../../icons';

interface IFieldProps {
  name: string;
  label?: string;
  hidden?: boolean;
  hint?: string;
  small?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const StyledField = styled.div<{ small: boolean }>`
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

export const Field: React.FC<IFieldProps> = ({ name, label, hidden, hint, className, small, ...rest }) => {

  return (
    <StyledField className="field-container" small={small}>
      {hidden ?
        <FormikField name={name} type="hidden" /> :
        <Fragment>
          <label htmlFor={name}>{label}</label>
          {hint && <span className="hint"><Icon.InfoCircle /> {hint}</span>}
          <FormikField name={name} {...rest} className={className ? `field ${className}` : 'field'} />
          <span className="error"><ErrorMessage name={name} /></span>
        </Fragment>
      }
    </StyledField>
  )
}
