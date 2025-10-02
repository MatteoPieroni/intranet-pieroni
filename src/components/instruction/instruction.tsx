import { PropsWithChildren } from 'react';
import styles from './instruction.module.css';

type InstructionProps = {
  type: 'error' | 'success' | 'warning';
};

export const Instruction = ({
  type,
  children,
}: PropsWithChildren<InstructionProps>) => {
  return <p className={`${styles.status} ${styles[type]}`}>{children}</p>;
};
