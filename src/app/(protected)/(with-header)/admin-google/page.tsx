import { headers } from 'next/headers';

import '@/react-aria/react-aria.css';
import { getGoogleAuth } from '@/services/firebase/server';
import { googleClient } from '@/services/google-apis';
import { Business } from '@/components/business/business';
import { IGoogleAuth } from '@/services/firebase/db-types';
import styles from './page.module.css';
import template from '../header-template.module.css';

const manageGoogleAuth = async (googleAuth: IGoogleAuth | undefined) => {
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

export default async function Admin() {
  const currentHeaders = await headers();
  const googleAuth = await getGoogleAuth(currentHeaders);

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
            <h2>Autorizza Google My Business</h2>
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
