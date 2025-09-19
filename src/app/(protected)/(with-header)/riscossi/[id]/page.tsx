import type { Metadata } from 'next';

import styles from './page.module.css';
import template from '../../header-template.module.css';
import { getRiscosso, getUser } from '@/services/firebase/server';
import { headers } from 'next/headers';
import { RiscossiForm } from '@/components/riscosso-form/riscosso-form';

export const metadata: Metadata = {
  title: 'Riscosso - Intranet Pieroni srl',
  description: 'Intranet - riscosso',
};

const companies = {
  pieroni: 'Pieroni srl',
  'pieroni-mostra': 'Pieroni in mostra',
  pellet: 'Pellet',
};

export default async function Riscossi({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const currentHeaders = await headers();
  const { currentUser } = await getUser(currentHeaders);

  if (!currentUser) {
    throw new Error('User not found');
  }

  const riscosso = await getRiscosso(currentHeaders, id);

  return (
    <main className={template.page}>
      <div className={template.header}>
        <h1 className={styles.noPrint}>Riscosso {id}</h1>
      </div>

      <div className={styles.container}>
        <div className={styles.section}>
          <h2 className={styles.noPrint}>Documento</h2>
          <div className={styles.document}>
            <div className={styles.documentRow}>
              <h3>{companies[riscosso.company]}</h3>
              <img src="logo.jpg" alt="" />
            </div>
            <div className={styles.documentRow}>
              <p>
                Loc. Pastino, 67 – Diecimo
                <br />
                55020 Borgo a Mozzano (LU)
                <br />
                P. IVA 01798100465
              </p>

              <table>
                <thead>
                  <tr>
                    <th scope="col">Data</th>
                    <th scope="col">Cliente</th>
                    <th scope="col">Numero</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{riscosso.date.toDateString()}</td>
                    <td>{riscosso.client}</td>
                    <th scope="row">{riscosso.id}</th>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={styles.documentRow}>
              <h3>Riscosso</h3>
            </div>

            <div className={styles.documentRow}>
              <h4>Riferimento</h4>
            </div>
            <div className={`${styles.documentRow} ${styles.docsContainer}`}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Numero</th>
                    <th scope="col">Data</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Importo</th>
                  </tr>
                </thead>
                <tbody>
                  {riscosso.docs.map((doc) => (
                    <tr key={doc.number}>
                      <th scope="row">{doc.number}</th>
                      <td>{/*doc.date.toDateString()*/}</td>
                      <td>{doc.type}</td>
                      <td className="number">{doc.total} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.documentRow}>
              Totale pagato {riscosso.total}
            </div>
            <div className={styles.documentRow}>
              <h4>Modalità pagamento</h4>
            </div>
            <div className={styles.documentRow}>
              {riscosso.paymentMethod}
              {riscosso.paymentMethod === 'assegno' && (
                <>
                  N° assegno: {riscosso.paymentChequeNumber} - Importo{' '}
                  {riscosso.paymentChequeValue}
                </>
              )}
            </div>
          </div>
        </div>
        <div className={`${styles.noPrint} ${styles.section}`}>
          <RiscossiForm riscosso={riscosso} />
        </div>
      </div>
    </main>
  );
}
