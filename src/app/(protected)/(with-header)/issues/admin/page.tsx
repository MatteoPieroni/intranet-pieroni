import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import styles from '../page.module.css';
import template from '../../header-template.module.css';
import { cachedGetUser, getUserUpdates } from '@/services/firebase/server';
import { headers } from 'next/headers';
import { checkCanEditIssues } from '@/services/firebase/server/permissions';
import { DateComponent } from '@/components/date/date';
import { UnreadBadge } from '@/components/unread-badge/unread-badge';
import {
  cachedGetUsers,
  cachedGetIssues,
  cachedGetIssuesFromArchive,
  cachedGetIssueAnalytics,
} from '@/services/cache/firestore';

export const metadata: Metadata = {
  title: 'Gestisci moduli qualità - Intranet Pieroni srl',
  description: 'Intranet - vedi i moduli qualità',
};

export default async function IssuesAdmin() {
  const authHeader = (await headers()).get('Authorization');
  const { currentUser } = await cachedGetUser(authHeader);

  if (!checkCanEditIssues(currentUser?.permissions)) {
    return redirect('/');
  }

  const [issues, users, updates, analytics, issuesArchive] = await Promise.all([
    cachedGetIssues(authHeader),
    // check user view scope
    cachedGetUsers(authHeader),
    getUserUpdates(authHeader, currentUser?.id || '', 'issues'),
    cachedGetIssueAnalytics(authHeader),
    cachedGetIssuesFromArchive(authHeader),
  ]);

  const issuesWithAdditionalData = issues.map((issue) => {
    const user = users.find((user) => user.id === issue.meta.author);
    const hasUpdate = updates.some((update) => update.entityId === issue.id);

    return {
      ...issue,
      hasUpdate,
      user: user?.email,
    };
  });
  const issuesArchiveWithUsers = issuesArchive.map((issue) => {
    const user = users.find((user) => user.id === issue.meta.author);

    return {
      ...issue,
      user: user?.email,
    };
  });

  return (
    <main className={template.page}>
      <div className={template.header}>
        <h1>Gestisci i moduli qualità</h1>
      </div>

      <div className={styles.container}>
        <div className={styles.section}>
          <h2>Analisi</h2>

          <table className={styles.analytics}>
            <thead>
              <tr>
                <th scope="col">Totale</th>
                <th scope="col">Non risolti</th>
                <th scope="col">Da verificare</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{analytics.total}</td>
                <td>{analytics.nonResolved}</td>
                <td>{analytics.nonVerified}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.section}>
          <h2>Moduli</h2>

          <table>
            <thead>
              <tr>
                <th scope="col">Aggiornato</th>
                <th scope="col">Numero</th>
                <th scope="col">Data</th>
                <th scope="col">Cliente</th>
                <th scope="col">Creato da</th>
                <th scope="col">Risolto</th>
                <th scope="col">Confermato</th>
                <th scope="col">Link</th>
              </tr>
            </thead>
            <tbody>
              {issuesWithAdditionalData.map((issue) => (
                <tr key={issue.id}>
                  <td>
                    <DateComponent date={issue.updatedAt} />
                    {issue.hasUpdate && <UnreadBadge align="super" />}
                  </td>
                  <th scope="row">{issue.id}</th>
                  <td>
                    <DateComponent date={issue.date} />
                  </td>
                  <td>{issue.client}</td>
                  <td>{issue.user}</td>
                  <td>
                    <input
                      readOnly
                      disabled
                      aria-label="Risolto"
                      name="resolved"
                      type="checkbox"
                      checked={!!issue.result?.date}
                    />
                  </td>
                  <td>
                    <input
                      readOnly
                      disabled
                      aria-label="Verificato"
                      name="verified"
                      type="checkbox"
                      checked={issue.verification?.isVerified}
                    />
                  </td>
                  <td>
                    <a href={`/issues/${issue.id}`}>Vedi</a>
                    {issue.hasUpdate && <UnreadBadge />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.section}>
          <h2>Archivio moduli</h2>

          <table>
            <thead>
              <tr>
                <th scope="col">Aggiornato</th>
                <th scope="col">Numero</th>
                <th scope="col">Data</th>
                <th scope="col">Cliente</th>
                <th scope="col">Creato da</th>
                <th scope="col">Risolto</th>
                <th scope="col">Confermato</th>
                <th scope="col">Link</th>
              </tr>
            </thead>
            <tbody>
              {issuesArchiveWithUsers.map((issue) => (
                <tr key={issue.id}>
                  <td>
                    <DateComponent date={issue.updatedAt} />
                  </td>
                  <th scope="row">{issue.id}</th>
                  <td>
                    <DateComponent date={issue.date} />
                  </td>
                  <td>{issue.client}</td>
                  <td>{issue.user}</td>
                  <td>
                    <input
                      readOnly
                      disabled
                      aria-label="Risolto"
                      name="resolved"
                      type="checkbox"
                      checked={!!issue.result?.date}
                    />
                  </td>
                  <td>
                    <input
                      readOnly
                      disabled
                      aria-label="Verificato"
                      name="verified"
                      type="checkbox"
                      checked={issue.verification?.isVerified}
                    />
                  </td>
                  <td>
                    <a href={`/issues/${issue.id}`}>Vedi</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
