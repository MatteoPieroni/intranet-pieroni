'use client';

import { themeToggleAction } from './theme-toggle-action';
import styles from './theme-toggle.module.css';

type ThemeToggleProps = {
  currentTheme?: 'light' | 'dark' | null;
};

const options = [
  { value: 'light', label: 'Chiaro' },
  { value: 'dark', label: 'Scuro' },
  { value: 'system', label: 'Sistema' },
] as const;

export const ThemeToggle = ({ currentTheme }: ThemeToggleProps) => {
  const themeWithDefault = currentTheme || 'system';

  return (
    <form action={themeToggleAction}>
      <fieldset className={styles.fieldset}>
        <legend>Tema</legend>
        {options.map((option) => (
          <label key={option.value} title={option.label}>
            <div
              className={styles.square}
              data-theme-toggle={option.value}
            ></div>
            <p className="visually-hidden">{option.label}</p>
            <input
              type="radio"
              value={option.value}
              name="theme"
              onChange={(event) => event.target.form?.requestSubmit()}
              defaultChecked={option.value === themeWithDefault}
              className="visually-hidden"
            />
          </label>
        ))}
      </fieldset>
    </form>
  );
};
