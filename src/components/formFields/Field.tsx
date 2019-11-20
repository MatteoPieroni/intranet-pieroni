import React, { Fragment } from 'react';
import { Field as FormikField, ErrorMessage } from 'formik';
import styled from '@emotion/styled';

interface IFieldProps {
  name: string;
  label?: string;
  hidden?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const StyledField = styled.div`
  margin-bottom: .5rem;

  label {
    display: block;
    margin-bottom: .25rem;
  }

  .field {
    padding: .25rem;
    width: 100%;
    box-sizing: border-box;
  }
`;

export const Field: React.FC<IFieldProps> = ({ name, label, hidden, ...rest }) => {
  return (
    <StyledField>
      {hidden ?
        <FormikField name={name} type="hidden" /> :
        <Fragment>
          <label htmlFor={name}>{label}</label>
          <FormikField name={name} {...rest} className="field" />
          <ErrorMessage name={name} className="error" />
        </Fragment>
      }
    </StyledField>
  )
}
