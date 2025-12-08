import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import '@/react-aria/react-aria.css';
import { getGoogleAuth, cachedGetUser } from '@/services/firebase/server';
import { googleClient } from '@/services/google-apis';
import { Business } from '@/components/google/business/business';
import { GoogleAuth } from '@/services/firebase/db-types';
import styles from './page.module.css';
import template from '../header-template.module.css';
import { checkCanEditGMB } from '@/services/firebase/server/permissions';

const manageGoogleAuth = async (googleAuth: GoogleAuth | undefined) => {
  if (!googleAuth?.refresh_token) {
    return false;
  }

  try {
    await googleClient.setTokens(googleAuth.refresh_token);
  } catch (e) {
    if (e instanceof Error && e.message === 'REVOKED') {
      return false;
    }
    throw e;
  }

  return true;
};

export const metadata: Metadata = {
  title: 'Google My Business - Intranet Pieroni srl',
  description: 'Intranet - gestisci le schede su Google',
};

export default async function AdminGoogle() {
  const authHeader = (await headers()).get('Authorization');
  const { currentUser } = await cachedGetUser(authHeader);

  if (!checkCanEditGMB(currentUser?.permissions)) {
    return redirect('/');
  }

  const googleAuth = await getGoogleAuth(authHeader);

  const isTokenSet = await manageGoogleAuth(googleAuth);

  const authUrl = !isTokenSet && googleClient.getAuthorizeUrl();

  return (
    <main className={template.page}>
      <div className={template.header}>
        <h1>Google business</h1>
      </div>
      <div className={styles.container}>
        {authUrl ? (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Autorizza Google My Business
            </h2>
            <a href={authUrl} className="button">
              Autorizza
            </a>
          </div>
        ) : (
          <Business />
        )}
      </div>
    </main>
  );
}
