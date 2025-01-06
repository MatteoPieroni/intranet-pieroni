'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { redirect, usePathname } from 'next/navigation';

import { signOut, onAuthStateChanged } from '@/services/firebase/client';
import { Logo } from '../logo/logo';
import styles from './header.module.css';

type HeaderProps = {
  mailUrl: string;
  isAdmin: boolean;
  scopes?: {
    gmb?: boolean;
    config?: {
      transport?: boolean;
    };
  };
};

export function Header({ mailUrl, isAdmin, scopes }: HeaderProps) {
  const currentPath = usePathname();

  const getLinkProps = (href: string) => {
    return {
      'data-active': currentPath === href,
      href,
    };
  };

  const handleSignOut = async () => {
    await signOut();
    redirect('/signin');
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
      <div className={styles.logoContainer}>
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <nav className={styles.nav}>
        <Link {...getLinkProps('/')}>Home</Link>
        <Link href={mailUrl} target="_blank" rel="noopener noreferrer">
          Mail
        </Link>
        <a {...getLinkProps('/maps')}>Costo trasporti</a>
        <Link {...getLinkProps('/cartello')}>Crea cartello</Link>
        {(isAdmin || scopes?.gmb) && (
          <a {...getLinkProps('/admin-google')}>Gestisci Google</a>
        )}
        {(isAdmin || scopes?.config?.transport) && (
          <a {...getLinkProps('/admin')}>Admin</a>
        )}

        <button className={styles.logOut} onClick={handleSignOut}>
          Esci
        </button>
      </nav>
    </header>
  );
}
