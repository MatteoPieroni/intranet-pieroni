import type { Metadata } from 'next';

import styles from './page.module.css';
import template from '../../header-template.module.css';
import { getRiscosso, getUser, getUsers } from '@/services/firebase/server';
import { headers } from 'next/headers';
import { RiscossiForm } from '@/components/riscosso-form/riscosso-form';
import { PrintButton } from '@/components/print-button/print-button';
import { formatDate } from '@/utils/formatDate';
import { RiscossoCheck } from '@/components/riscosso-form/riscosso-check';
import { checkCanEditRiscossi } from '@/services/firebase/server/permissions';

export const metadata: Metadata = {
  title: 'Modulo qualità - Intranet Pieroni srl',
  description: 'Intranet - modulo qualità',
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

export default async function Issue({
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

  const canEditRiscossi = checkCanEditRiscossi(currentUser.permissions);

  const [riscosso, users] = await Promise.all([
    getRiscosso(currentHeaders, id),
    canEditRiscossi ? getUsers(currentHeaders) : undefined,
  ]);
  const {
    company,
    date,
    client,
    docs,
    total,
    paymentMethod,
    paymentChequeNumber,
    paymentChequeValue,
    verification,
  } = riscosso;
  const isAlreadyChecked = verification.isVerified;

  const userVerification = users?.find(
    (user) => user.id === verification.verifyAuthor
  );

  return (
    <main className={template.page}>
      <div className={template.header}>
        <h1 className={styles.noPrint}>Riscosso {id}</h1>
      </div>

      <div className={styles.container}>
        {canEditRiscossi && (
          <div className={`${styles.section} ${styles.noPrint}`}>
            <h2>Gestisci modulo</h2>
            {isAlreadyChecked && (
              <p className={styles.confirmation}>
                Confermato da {userVerification?.email} il{' '}
                {formatDate(verification.verifiedAt)}
              </p>
            )}
            <div>
              <RiscossoCheck id={id} isVerified={verification.isVerified} />
            </div>
          </div>
        )}

        <div className={styles.section}>
          <h2 className={styles.noPrint}>Modulo</h2>
          {isAlreadyChecked && (
            <p className={styles.confirmation}>
              Confermato il {formatDate(verification.verifiedAt)}
            </p>
          )}
          <div className={`${styles.actionBar} ${styles.noPrint}`}>
            <PrintButton />
            {!isAlreadyChecked && (
              <a href="#edit" className="button">
                Modifica
              </a>
            )}
          </div>
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
                      <td>{formatDate(date)}</td>
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
                        <td>{formatDate(doc.date)}</td>
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
                    <br />
                    N° assegno: {paymentChequeNumber} - Importo{' '}
                    {paymentChequeValue}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {!isAlreadyChecked && (
          <div id="edit" className={`${styles.noPrint} ${styles.section}`}>
            <h2>Aggiungi azione</h2>
            {/* <RiscossiForm riscosso={riscosso} /> */}
          </div>
        )}

        {!isAlreadyChecked && (
          <div id="edit" className={`${styles.noPrint} ${styles.section}`}>
            <h2>Aggiungi conclusione</h2>
            {/* <RiscossiForm riscosso={riscosso} /> */}
          </div>
        )}

        {!isAlreadyChecked && (
          <div id="edit" className={`${styles.noPrint} ${styles.section}`}>
            <h2>Modifica</h2>
            <RiscossiForm riscosso={riscosso} />
          </div>
        )}
      </div>
    </main>
  );
}
