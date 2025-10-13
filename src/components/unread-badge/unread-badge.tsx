import styles from './unread-badge.module.css';

type UnreadBadgeProps = {
  align?: 'super';
};

export const UnreadBadge = ({ align }: UnreadBadgeProps) => {
  return (
    <span
      className={styles.badge}
      style={
        align
          ? {
              verticalAlign: 'super',
            }
          : {}
      }
      title="Aggiornamenti da controllare"
    ></span>
  );
};
