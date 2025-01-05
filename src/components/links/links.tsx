import { ILink } from '@/services/firebase/db-types';
import styles from './links.module.css';

interface ILinkProps {
  links: ILink[];
}

export const Links: React.FC<ILinkProps> = ({ links }) => {
  return (
    <div>
      <div className={styles.header}>
        <h2 data-testid="links-title">Link utili</h2>
      </div>
      <ul className={styles.list}>
        {links &&
          links.map(({ link, description, color }) => (
            <li
              style={{ borderInlineStartColor: color }}
              data-testid={color === 'test' ? 'test-link' : ''}
              key={link}
            >
              <a
                href={link}
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {description}
                {/* <Icon.ArrowRight className="arrow" /> */}
              </a>
            </li>
          ))}
      </ul>
    </div>
  );
};
