import styles from './admin-badge.module.css';

type AdminBadgeProps =
  | {
      position?: never;
    }
  | {
      position: 'absolute';
      top: string;
      left: string;
      right?: never;
    }
  | {
      position: 'absolute';
      top: string;
      left?: never;
      right: string;
    };

export const AdminBadge = (props: AdminBadgeProps) => {
  const stylesToPass =
    props.position === 'absolute'
      ? {
          position: props.position,
          right: props.left ? undefined : props.right || '1rem',
          left: props.right ? undefined : props.left,
          top: props.top,
        }
      : {};

  return (
    <span
      className={styles.badge}
      style={stylesToPass}
      title="Sezione dedicata agli amministratori"
    >
      Admin
    </span>
  );
};
