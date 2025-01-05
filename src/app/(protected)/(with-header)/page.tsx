import { headers } from 'next/headers';

import { Quote } from '@/components/quote/quote';
import { WelcomeMessage } from '@/components/welcome-message/welcome-message';
import { Links } from '@/components/links/links';
import { getUser, getLinks, getQuote } from '@/services/firebase/server';
import template from './header-template.module.css';
import styles from './page.module.css';

export default async function Home() {
  const currentHeaders = await headers();
  const { currentUser } = await getUser(currentHeaders);

  if (!currentUser) {
    throw new Error('User not found');
  }

  const [links, quote] = await Promise.all([
    getLinks(currentHeaders),
    getQuote(currentHeaders),
  ]);

  const name = currentUser.name;

  return (
    <main className={template.page}>
      <div className={template.header}>
        <WelcomeMessage name={name} />
      </div>
      <div className={styles.infoContainer}>
        <div>
          <Quote quote={quote} />
        </div>
        <div className={styles.linksContainer}>
          <Links links={links} />
        </div>
      </div>
    </main>
  );
}
