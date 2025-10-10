import styles from './notification-badge.module.css';

type NotificationBadgeProps = {
  newUpdates?: number;
};

export const NotificationBadge = ({ newUpdates }: NotificationBadgeProps) => {
  if (!newUpdates) {
    return <></>;
  }

  const updatesNumberWithLimit = newUpdates > 10 ? '10+' : newUpdates;

  return (
    <span
      className={styles.badge}
      title={`${updatesNumberWithLimit} aggiornati`}
    >
      {updatesNumberWithLimit}
    </span>
  );
};
