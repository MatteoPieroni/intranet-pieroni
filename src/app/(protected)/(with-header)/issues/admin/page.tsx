import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import styles from '../page.module.css';
import template from '../../header-template.module.css';
import {
  getIssueAnalytics,
  getIssues,
  getUser,
  getUsers,
} from '@/services/firebase/server';
import { headers } from 'next/headers';
import { formatDate } from '@/utils/formatDate';
import { checkCanEditIssues } from '@/services/firebase/server/permissions';

export const metadata: Metadata = {
  title: 'Gestisci moduli qualità - Intranet Pieroni srl',
  description: 'Intranet - vedi i moduli qualità',
};

export default async function IssuesAdmin() {
  const currentHeaders = await headers();
  const { currentUser } = await getUser(currentHeaders);

  if (!checkCanEditIssues(currentUser?.permissions)) {
    return redirect('/');
  }

  const [issues, users, analytics] = await Promise.all([
    getIssues(currentHeaders),
    // check user view scope
    getUsers(currentHeaders),
    getIssueAnalytics(currentHeaders),
  ]);

  const issuesWithUser = issues.map((issue) => {
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
              {issuesWithUser.map((issue) => (
                <tr key={issue.id}>
                  <th scope="row">{issue.id}</th>
                  <td>{formatDate(issue.date)}</td>
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
