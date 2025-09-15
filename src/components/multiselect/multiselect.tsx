import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

import styles from './multiselect.module.css';

type MultiSelectProps = {
  options: {
    value: string;
    label: string;
    isDefaultChecked: boolean;
  }[];
  name: string;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const MultiSelect = ({ options, name }: MultiSelectProps) => {
  return (
    <fieldset className={styles.fieldset}>
      {options.map((option) => (
        <label key={option.value} className={styles.label}>
          <input
            type="checkbox"
            defaultChecked={option.isDefaultChecked}
            value={option.value}
            name={name}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
};
