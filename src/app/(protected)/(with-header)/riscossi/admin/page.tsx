import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import styles from '../page.module.css';
import template from '../../header-template.module.css';
import {
  getRiscossi,
  getRiscossiAnalytics,
  getRiscossiFromArchive,
  getUser,
  getUsers,
  getUserUpdates,
} from '@/services/firebase/server';
import { headers } from 'next/headers';
import { formatDate } from '@/utils/formatDate';
import { checkCanEditRiscossi } from '@/services/firebase/server/permissions';
import { DateComponent } from '@/components/date/date';
import { UnreadBadge } from '@/components/unread-badge/unread-badge';

export const metadata: Metadata = {
  title: 'Gestisci riscossi - Intranet Pieroni srl',
  description: 'Intranet - vedi i riscossi',
};

const companies = {
  pieroni: 'Pieroni srl',
  'pieroni-mostra': 'Pieroni in mostra',
  pellet: 'Pellet',
};

export default async function Riscossi() {
  const currentHeaders = await headers();
  const { currentUser } = await getUser(currentHeaders);

  if (!checkCanEditRiscossi(currentUser?.permissions)) {
    return redirect('/');
  }

  const [riscossi, users, updates, analytics, riscossiArchive] =
    await Promise.all([
      getRiscossi(currentHeaders),
      getUsers(currentHeaders),
      getUserUpdates(currentHeaders, currentUser?.id || '', 'riscossi'),
      getRiscossiAnalytics(currentHeaders),
      getRiscossiFromArchive(currentHeaders),
    ]);

  const riscossiWithAdditionalData = riscossi.map((riscosso) => {
    const user = users.find((user) => user.id === riscosso.meta.author);
    const hasUpdate = updates.some((update) => update.entityId === riscosso.id);

    return {
      ...riscosso,
      hasUpdate,
      user: user?.email,
    };
  });
  const riscossiArchiveWithUser = riscossiArchive.map((riscosso) => {
    const user = users.find((user) => user.id === riscosso.meta.author);

    return {
      ...riscosso,
      user: user?.email,
    };
  });

  return (
    <main className={template.page}>
      <div className={template.header}>
        <h1>Gestisci i riscossi</h1>
      </div>

      <div className={styles.container}>
        <div className={styles.section}>
          <h2>Analisi</h2>

          <table className={styles.analytics}>
            <thead>
              <tr>
                <th scope="col">Totale</th>
                <th scope="col">Da verificare</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{analytics.total}</td>
                <td>{analytics.nonVerified}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.section}>
          <h2>Riscossi</h2>
          <table>
            <thead>
              <tr>
                <th scope="col">Aggiornato</th>
                <th scope="col">Numero</th>
                <th scope="col">Data</th>
                <th scope="col">Cliente</th>
                <th scope="col">Totale</th>
                <th scope="col">Azienda</th>
                <th scope="col">Creato da</th>
                <th scope="col">Confermato</th>
                <th scope="col">Link</th>
              </tr>
            </thead>
            <tbody>
              {riscossiWithAdditionalData.map((riscosso) => (
                <tr key={riscosso.id}>
                  <td>
                    <DateComponent date={riscosso.updatedAt} />
                    {riscosso.hasUpdate && <UnreadBadge align="super" />}
                  </td>

                  <th scope="row">{riscosso.id}</th>
                  <td>{formatDate(riscosso.date)}</td>
                  <td>{riscosso.client}</td>
                  <td className="number">{riscosso.total} €</td>
                  <td>{companies[riscosso.company]}</td>
                  <td>{riscosso.user}</td>
                  <td>
                    <input
                      readOnly
                      disabled
                      aria-label="Verificato"
                      type="checkbox"
                      checked={riscosso.verification?.isVerified}
                    />
                  </td>
                  <td>
                    <a href={`/riscossi/${riscosso.id}`}>Vedi</a>
                    {riscosso.hasUpdate && <UnreadBadge />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.section}>
          <h2>Archivio riscossi</h2>
          <table>
            <thead>
              <tr>
                <th scope="col">Aggiornato</th>
                <th scope="col">Numero</th>
                <th scope="col">Data</th>
                <th scope="col">Cliente</th>
                <th scope="col">Totale</th>
                <th scope="col">Azienda</th>
                <th scope="col">Creato da</th>
                <th scope="col">Confermato</th>
                <th scope="col">Link</th>
              </tr>
            </thead>
            <tbody>
              {riscossiArchiveWithUser.map((riscosso) => (
                <tr key={riscosso.id}>
                  <td>
                    <DateComponent date={riscosso.updatedAt} />
                  </td>

                  <th scope="row">{riscosso.id}</th>
                  <td>{formatDate(riscosso.date)}</td>
                  <td>{riscosso.client}</td>
                  <td className="number">{riscosso.total} €</td>
                  <td>{companies[riscosso.company]}</td>
                  <td>{riscosso.user}</td>
                  <td>
                    <input
                      readOnly
                      disabled
                      aria-label="Verificato"
                      type="checkbox"
                      checked={riscosso.verification?.isVerified}
                    />
                  </td>
                  <td>
                    <a href={`/riscossi/${riscosso.id}`}>Vedi</a>
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
