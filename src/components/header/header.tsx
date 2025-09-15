'use client';
import { useEffect, useRef } from 'react';
import { redirect, usePathname } from 'next/navigation';

import { signOut, onAuthStateChanged } from '@/services/firebase/client';
import { Logo } from '../logo/logo';
import styles from './header.module.css';
import { ThemeToggle } from '../theme-toggle/theme-toggle';
import { MenuIcon } from '../icons/menu';
import { CloseIcon } from '../icons/close';

type HeaderProps = {
  mailUrl: string;
  isAdmin: boolean;
  scopes?: {
    gmb?: boolean;
    config?: {
      transport?: boolean;
    };
  };
  theme?: 'light' | 'dark';
};

export function Header({ mailUrl, isAdmin, scopes, theme }: HeaderProps) {
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
          {(isAdmin || scopes?.gmb) && (
            <a {...getLinkProps('/admin-google')}>Gestisci Google</a>
          )}
          {(isAdmin || scopes?.config?.transport) && (
            <a {...getLinkProps('/admin')}>Admin</a>
          )}
          {isAdmin && <a {...getLinkProps('/admin/users')}>Utenti e team</a>}

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
