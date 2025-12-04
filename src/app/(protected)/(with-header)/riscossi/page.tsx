import type { Metadata } from 'next';

import styles from './page.module.css';
import template from '../header-template.module.css';
import { getRiscossiForUser, cachedGetUser } from '@/services/firebase/server';
import { headers } from 'next/headers';
import { RiscossiForm } from '@/components/riscosso-form/riscosso-form';
import { formatDate } from '@/utils/formatDate';

export const metadata: Metadata = {
  title: 'Riscossi - Intranet Pieroni srl',
  description: 'Intranet - vedi i riscossi',
};

const companies = {
  pieroni: 'Pieroni srl',
  'pieroni-mostra': 'Pieroni in mostra',
  pellet: 'Pellet',
};

export default async function Riscossi() {
  const currentHeaders = await headers();
  const { currentUser } = await cachedGetUser(currentHeaders);

  if (!currentUser) {
    throw new Error('User not found');
  }

  const riscossi = await getRiscossiForUser(currentHeaders, currentUser.id);

  return (
    <main className={template.page}>
      <div className={template.header}>
        <h1>Riscossi</h1>
      </div>

      <div className={styles.container}>
        <div className={styles.section}>
          <h2>I tuoi riscossi</h2>
          <table>
            <thead>
              <tr>
                <th scope="col">Numero</th>
                <th scope="col">Data</th>
                <th scope="col">Cliente</th>
                <th scope="col">Totale</th>
                <th scope="col">Azienda</th>
                <th scope="col">Confermato</th>
                <th scope="col">Link</th>
              </tr>
            </thead>
            <tbody>
              {riscossi.map((riscosso) => (
                <tr key={riscosso.id}>
                  <th scope="row">{riscosso.id}</th>
                  <td>{formatDate(riscosso.date)}</td>
                  <td>{riscosso.client}</td>
                  <td className="number">{riscosso.total} €</td>
                  <td>{companies[riscosso.company]}</td>
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
                    <a href={`riscossi/${riscosso.id}`}>Vedi</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.section}>
          <h2>Crea nuovo riscosso</h2>
          <RiscossiForm isNew riscosso={undefined} />
        </div>
      </div>
    </main>
  );
}
