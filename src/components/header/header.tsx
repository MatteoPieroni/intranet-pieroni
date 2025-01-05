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
};

export function Header({ mailUrl, isAdmin }: HeaderProps) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <Link {...getLinkProps('/sms')}>Sms</Link>
        <a {...getLinkProps('/maps')}>Costo trasporti</a>
        <Link {...getLinkProps('/cartello')}>Crea cartello</Link>
        <a {...getLinkProps('/admin-google')}>Gestisci Google</a>
        {isAdmin && <a {...getLinkProps('/admin')}>Admin</a>}

        <button className={styles.logOut} onClick={handleSignOut}>
          Esci
        </button>
      </nav>
    </header>
  );
}
