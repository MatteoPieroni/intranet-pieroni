'use client';
import { useEffect, useRef } from 'react';
import { redirect, usePathname } from 'next/navigation';

import { signOut, onAuthStateChanged } from '@/services/firebase/client';
import { Logo } from '../logo/logo';
import styles from './header.module.css';
import { ThemeToggle } from '../theme-toggle/theme-toggle';
import { MenuIcon } from '../icons/menu';
import { CloseIcon } from '../icons/close';
import { IUser } from '@/services/firebase/db-types';
import {
  checkCanEditConfig,
  checkCanEditGMB,
  checkCanEditIssues,
  checkCanEditRiscossi,
  checkIsAdmin,
} from '@/services/firebase/server/permissions';
import { AdminBadge } from '../admin-badge/admin-badge';

type HeaderProps = {
  mailUrl: string;
  permissions: IUser['permissions'];
  theme?: 'light' | 'dark' | null;
};

export function Header({ mailUrl, theme, permissions }: HeaderProps) {
  const currentPath = usePathname();

  const getLinkProps = (href: string) => {
    return {
      'data-active': currentPath === href,
      href,
    };
  };

  const handleSignOut = async () => {
    await signOut();
    return redirect('/signin');
  };

  useEffect(() => {
    onAuthStateChanged((authUser) => {
      if (!authUser) {
        location.reload();
      }
    });
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.menuContainer}>
        <div className={styles.logoContainer}>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/">
            <Logo />
          </a>
        </div>
        <nav className={styles.nav}>
          <a {...getLinkProps('/')}>Home</a>
          <a href={mailUrl} target="_blank" rel="noopener noreferrer">
            Mail
          </a>
          <a {...getLinkProps('/maps')}>Costo trasporti</a>
          <a {...getLinkProps('/cartello')}>Crea cartello</a>
          <a {...getLinkProps('/riscossi')}>Riscossi</a>
          {checkCanEditRiscossi(permissions) && (
            <a {...getLinkProps('/riscossi/admin')}>
              Gestione riscossi <AdminBadge />
            </a>
          )}
          <a {...getLinkProps('/issues')}>Moduli qualità</a>
          {checkCanEditIssues(permissions) && (
            <a {...getLinkProps('/issues/admin')}>
              Gestione moduli qualità <AdminBadge />
            </a>
          )}
          {checkCanEditGMB(permissions) && (
            <a {...getLinkProps('/admin-google')}>
              Gestisci Google <AdminBadge />
            </a>
          )}
          {checkCanEditConfig(permissions) && (
            <a {...getLinkProps('/admin')}>
              Admin <AdminBadge />
            </a>
          )}
          {checkIsAdmin(permissions) && (
            <a {...getLinkProps('/admin/users')}>
              Utenti e team <AdminBadge />
            </a>
          )}

          <button className={styles.logOut} onClick={handleSignOut}>
            Esci
          </button>
        </nav>
      </div>

      <div className={styles.themeContainer}>
        <ThemeToggle currentTheme={theme} key={theme} />
      </div>
    </header>
  );
}

export const HeaderModal = (props: HeaderProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = () => {
    dialogRef.current?.show();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  return (
    <>
      <button onClick={openDialog} className={styles.menuButton}>
        <MenuIcon aria-label="open menu" />
      </button>
      <dialog ref={dialogRef} className={styles.menuDialog}>
        <button onClick={closeDialog} className={styles.closeButton}>
          <CloseIcon aria-label="close" />
        </button>
        <Header {...props} />
      </dialog>
    </>
  );
};
