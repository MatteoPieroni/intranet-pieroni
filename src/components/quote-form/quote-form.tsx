'use client';

import { useActionState } from 'react';

import { quoteAction, StateValidation } from './quote-action';
import { IImage } from '@/services/firebase/db-types';
import styles from './quote-form.module.css';

const initialState: StateValidation = {};

type QuoteFormProps = {
  text: string;
  images: IImage[];
  currentImage: string;
};

export const QuoteForm = ({ text, images, currentImage }: QuoteFormProps) => {
  const [state, formAction, pending] = useActionState(
    quoteAction,
    initialState
  );

  return (
    <form action={formAction} className={styles.form}>
      <label>
        Citazione (ricordati di disattivare il maiuscolo)
        <textarea name="message" defaultValue={text} />
        {state.error}
      </label>
      <fieldset>
        <legend>Immagine</legend>
        <div className={styles.imagesContainer}>
          {images.map((image, index) => (
            <label key={image.url} className={styles.imageInput}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt={`Immagine ${index}`} />
              <input
                type="radio"
                name="image"
                value={image.url}
                defaultChecked={image.url === currentImage}
              />
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <button type="submit" disabled={pending}>
          Aggiorna il messaggio
        </button>
      </div>
      <p aria-live="polite">{state.success}</p>
    </form>
  );
};
