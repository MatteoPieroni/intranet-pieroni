import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { getUser, getConfig } from '@/services/firebase/server';
import { Header, HeaderModal } from '@/components/header/header';
import styles from './layout.module.css';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentHeaders = await headers();
  const { currentUser } = await getUser(currentHeaders);

  const config = await getConfig(currentHeaders);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        {currentUser && (
          <Header
            mailUrl={config.mailUrl}
            isAdmin={currentUser.isAdmin}
            scopes={currentUser.scopes}
            theme={currentUser.theme}
          />
        )}
      </div>
      <div className={styles.content}>{children}</div>
      <div className={styles.mobileSidebar}>
        {currentUser && (
          <HeaderModal
            mailUrl={config.mailUrl}
            isAdmin={currentUser.isAdmin}
            scopes={currentUser.scopes}
            theme={currentUser.theme}
          />
        )}
      </div>
    </div>
  );
}
