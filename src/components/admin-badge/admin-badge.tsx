import styles from './admin-badge.module.css';

export const AdminBadge = () => {
  return (
    <span className={styles.badge} title="Sezione dedicata agli amministratori">
      Admin
    </span>
  );
};
