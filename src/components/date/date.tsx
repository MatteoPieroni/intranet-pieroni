import { formatDate } from '@/utils/formatDate';
import { DateIcon } from '../icons/date';
import styles from './date.module.css';

type DateComponentProps = {
  date: Date;
  className?: string;
};

export const DateComponent = ({ date, className }: DateComponentProps) => {
  return (
    <span className={`${styles.date} ${className || ''}`}>
      <DateIcon aria-hidden /> {formatDate(date)}
    </span>
  );
};
