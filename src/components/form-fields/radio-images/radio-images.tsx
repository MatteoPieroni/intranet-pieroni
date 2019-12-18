import React, { Fragment } from 'react'
import styled from '@emotion/styled';
import { Field as FormikField, ErrorMessage, getIn, connect } from 'formik';
import { IImage } from '../../../services/firebase/types'

interface IRadioImagesProps {
  images: IImage[];
  name: string;
  label: string;
  onSelect?: (selectedImage?: string) => void;
}

interface IRadioImageProps {
  url: string;
  name: string;
  onSelect?: (selectedImage?: string) => void;
}

const StyledDiv = styled.div`
  margin-bottom: .5rem;

  label {
    display: block;
    margin-bottom: .25rem;
  }

  .field {
    padding: .25rem;
    box-sizing: border-box;

    border: 0 !important;
    clip: rect(1px, 1px, 1px, 1px) !important;
    -webkit-clip-path: inset(50%) !important;
    clip-path: inset(50%) !important;
    height: 1px !important;
    margin: -1px !important;
    overflow: hidden !important;
    padding: 0 !important;
    position: absolute !important;
    width: 1px !important;
    white-space: nowrap !important;

  }

  .image {
    border: none;
    background: none;
    padding: 0;
  }

  .field:checked + .image {
    outline: 1px solid blue;
  }
`;

const RadioImage: React.ComponentType<IRadioImageProps> = connect(({ url, name, onSelect, formik }) => {
  const value = getIn(formik.values, name);
  const selectRadio = (): void => {
    formik.setFieldValue(name as never, url);
    formik.setFieldTouched(name as never, true);

    typeof onSelect === 'function' && onSelect();
  }

  return (
    <>
      <input
        name={name}
        className="field"
        type="radio"
        checked={value === url}
        onChange={selectRadio}
      />
      <button type="button" className="image" onClick={selectRadio}><img src={url} /></button>
    </>
  )
});

export const RadioImages: React.FC<IRadioImagesProps> = ({ images, name, label, onSelect }) => {
  return (
    <StyledDiv className="radio-images__container">
      <label htmlFor={name} className="radio-images__label">{label}</label>
      {images && images.map(({ url }) => (
        <RadioImage key={url} url={url} name={name} onSelect={onSelect} />
      ))}
      <ErrorMessage name={'ciao'} className="error" />
    </StyledDiv>
  )
}
