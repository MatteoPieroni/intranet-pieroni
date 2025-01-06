import styles from './form-status.module.css';

type FormStatusProps = { text?: string; type: 'error' | 'success' };

export const FormStatus = ({ text, type }: FormStatusProps) => {
  return (
    <p aria-live="polite" className={`${styles.status} ${styles[type]}`}>
      {text}
    </p>
  );
};
