import type { Metadata } from 'next';

import styles from './page.module.css';
import template from '../header-template.module.css';
import { getIssuesForUser, cachedGetUser } from '@/services/firebase/server';
import { headers } from 'next/headers';
import { formatDate } from '@/utils/formatDate';
import { IssueForm } from '@/components/issue-form/issue-form';

export const metadata: Metadata = {
  title: 'Moduli qualità - Intranet Pieroni srl',
  description: 'Intranet - vedi i moduli qualità',
};

export default async function Issues() {
  const currentHeaders = await headers();
  const { currentUser } = await cachedGetUser(currentHeaders);

  if (!currentUser) {
    throw new Error('User not found');
  }

  const issues = await getIssuesForUser(currentHeaders, currentUser.id);

  return (
    <main className={template.page}>
      <div className={template.header}>
        <h1>Moduli qualità</h1>
      </div>

      <div className={styles.container}>
        <div className={styles.section}>
          <h2>I tuoi moduli qualità</h2>
          <table>
            <thead>
              <tr>
                <th scope="col">Numero</th>
                <th scope="col">Data</th>
                <th scope="col">Cliente</th>
                <th scope="col">Risolto</th>
                <th scope="col">Confermato</th>
                <th scope="col">Link</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue.id}>
                  <th scope="row">{issue.id}</th>
                  <td>{formatDate(issue.date)}</td>
                  <td>{issue.client}</td>
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
                    <a href={`issues/${issue.id}`}>Vedi</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.section}>
          <h2>Crea nuovo modulo qualità</h2>

          <p>
            Preghiamo riempire in ogni parte, specificare ogni passaggio
            effettuato, inserire nome e numeri chiamati, stabilire con il
            venditore e il responsabile la linea da tenere, stabilire scadenze
            progressive per risoluzione, tenere informato il cliente se lo
            chiede specificatamente, richiedere la partecipazione di tutti per
            risolvere al più presto.
          </p>

          <IssueForm isNew issue={undefined} />
        </div>
      </div>
    </main>
  );
}
