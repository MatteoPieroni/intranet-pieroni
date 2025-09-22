import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import styles from '../page.module.css';
import template from '../../header-template.module.css';
import { getRiscossi, getUser, getUsers } from '@/services/firebase/server';
import { headers } from 'next/headers';
import { formatDate } from '@/utils/formatDate';

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

  if (
    !currentUser?.isAdmin
    // && !currentUser?.scopes?.gmb
  ) {
    return redirect('/');
  }

  const [riscossi, users] = await Promise.all([
    getRiscossi(currentHeaders),
    // check user view scope
    getUsers(currentHeaders),
  ]);

  const riscossiWithUser = riscossi.map((riscosso) => {
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
          <h2>Riscossi</h2>
          <table>
            <thead>
              <tr>
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
              {riscossiWithUser.map((riscosso) => (
                <tr key={riscosso.id}>
                  <th scope="row">{riscosso.id}</th>
                  <td>{formatDate(riscosso.date)}</td>
                  <td>{riscosso.client}</td>
                  <td className="number">{riscosso.total} €</td>
                  <td>{companies[riscosso.company]}</td>
                  <td>{riscosso.user}</td>
                  <td>
                    <input
                      aria-label="Verificato"
                      type="checkbox"
                      checked={riscosso.verification?.isVerified}
                    />
                  </td>
                  <td>
                    <a href={`riscossi/${riscosso.id}`}>Vedi</a>
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
