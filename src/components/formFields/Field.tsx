import React, { Fragment } from 'react'
import { Field as FormikField, ErrorMessage } from 'formik';

interface IFieldProps {
  name: string;
  label?: string;
  hidden?: boolean;
}

export const Field: React.FC<IFieldProps> = ({ name, label, hidden, ...rest }) => {
  return (
    <>
      {hidden ?
        <FormikField name={name} type="hidden" /> :
        <>
          <label htmlFor={name}>{label}</label>
          <FormikField name={name} {...rest} />
          <ErrorMessage name={name} />
        </>
      }
    </>
  )
}
