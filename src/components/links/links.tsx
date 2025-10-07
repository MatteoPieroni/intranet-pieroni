import { Link } from '@/services/firebase/db-types';
import styles from './links.module.css';

interface LinkProps {
  links: Link[];
}

export const Links: React.FC<LinkProps> = ({ links }) => {
  return (
    <div>
      <div className={styles.header}>
        <h2 data-testid="links-title">Link utili</h2>
      </div>
      <ul className={styles.list}>
        {links &&
          links.map(({ link, description }) => (
            <li key={link}>
              <a
                href={link}
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {description}
              </a>
            </li>
          ))}
      </ul>
    </div>
  );
};
