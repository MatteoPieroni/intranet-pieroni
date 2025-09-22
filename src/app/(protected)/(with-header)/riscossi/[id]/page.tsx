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
  pieroni: {
    label: 'Pieroni srl',
    img: 'pieroni-logo.jpg',
  },
  'pieroni-mostra': {
    label: 'Pieroni in mostra',
    img: 'pieroni-mostra-logo.jpg',
  },
  pellet: { label: 'Pellet', img: 'pieroni-pellet-logo.jpg' },
};

const paymentMethods = {
  assegno: 'Assegno',

  contanti: 'Contanti',

  bancomat: 'Bancomat',
};
const documentTypes = { fattura: 'Fattura', DDT: 'DDT', impegno: 'Impegno' };

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
  const {
    company,
    date,
    client,
    docs,
    total,
    paymentMethod,
    paymentChequeNumber,
    paymentChequeValue,
  } = riscosso;

  return (
    <main className={template.page}>
      <div className={template.header}>
        <h1 className={styles.noPrint}>Riscosso {id}</h1>
      </div>

      <div className={styles.container}>
        <div className={styles.section}>
          <h2 className={styles.noPrint}>Documento</h2>
          <div className={styles.documentContainer}>
            <div className={styles.document}>
              <div className={styles.documentRow}>
                <p className={styles.documentTitle}>
                  {companies[company].label}
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/assets/${companies[company].img}`} alt="" />
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
                      <td>{date.toDateString()}</td>
                      <td>{client}</td>
                      <th scope="row">{id}</th>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={`${styles.documentRow} ${styles.alignCenter}`}>
                <p className={styles.documentSubtitle}>Riscosso</p>
              </div>

              <div className={styles.documentRow}>
                <p className={styles.documentSectionTitle}>Riferimento</p>
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
                    {docs.map((doc) => (
                      <tr key={doc.number}>
                        <th scope="row">{doc.number}</th>
                        <td>{/*doc.date.toDateString()*/}</td>
                        <td>{documentTypes[doc.type]}</td>
                        <td className="number">{doc.total} €</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={`${styles.documentRow} ${styles.alignRight}`}>
                Totale pagato {total} €
              </div>
              <div className={styles.documentRow}>
                <p className={styles.documentSectionTitle}>
                  Modalità pagamento
                </p>
              </div>
              <div className={styles.documentRow}>
                {paymentMethods[paymentMethod]}
                {paymentMethod === 'assegno' && (
                  <>
                    N° assegno: {paymentChequeNumber} - Importo{' '}
                    {paymentChequeValue}
                  </>
                )}
              </div>
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
