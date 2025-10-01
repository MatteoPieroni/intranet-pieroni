import type { Metadata } from 'next';
import { headers } from 'next/headers';

import styles from './page.module.css';
import template from '../../header-template.module.css';
import {
  getIssue,
  getIssueTimeline,
  getUser,
  getUsers,
} from '@/services/firebase/server';
import { formatDate } from '@/utils/formatDate';
import { checkCanEditIssues } from '@/services/firebase/server/permissions';
import { IssueFormWithButton } from '@/components/issue-form/issue-form';
import { IssueTimelineForm } from '@/components/issue-timeline/issue-timeline-form';
import { IssueAction } from '@/components/issue-timeline/issue-action';
import { IssueResultForm } from '@/components/issue-form/issue-result-form';
import { IssueCheck } from '@/components/issue-form/issue-check';
import { Instruction } from '@/components/instruction/instruction';

export const metadata: Metadata = {
  title: 'Modulo qualità - Intranet Pieroni srl',
  description: 'Intranet - modulo qualità',
};

const actionTypes = {
  'delay-preparation': 'Ritardo preparazione',
  'missing-article': 'Articolo mancante alla consegna',
  'delay-arrival': 'Ritardo arrivo',
  'supplier-mistake': 'Sbaglio fornitore',
  'client-return': 'Reso cliente',
  'insufficient-order': 'Riordino insufficiente',
  'supplier-defect': 'Difetto di fabbrica',
  breakage: 'Rottura',
  'not-conforming': 'Non conforme',
  'client-mistake': 'Errore cliente',
  'plumber-mistake': 'Errore idraulico',
  'builder-mistake': 'Errore muratore',
  'project-mistake': 'Errore progettista',
} as const;

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

  const canEditIssues = checkCanEditIssues(currentUser.permissions);

  const [issue, users] = await Promise.all([
    getIssue(currentHeaders, id),
    canEditIssues ? getUsers(currentHeaders) : undefined,
  ]);
  const {
    client,
    date,
    summary,
    supplierInfo,
    issueType,
    verification,
    result,
  } = issue;
  const isAlreadyChecked = verification.isVerified;
  const isResolved = !!result;
  const isFinished = isAlreadyChecked || isResolved;

  const userVerification = users?.find(
    (user) => user.id === verification.verifyAuthor
  );

  const timeline = await getIssueTimeline(currentHeaders, id);

  return (
    <main className={template.page}>
      <div className={template.header}>
        <h1 className={styles.noPrint}>Modulo qualità {id}</h1>
      </div>

      <div className={styles.container}>
        {canEditIssues && (
          <div className={`${styles.section} ${styles.noPrint}`}>
            <h2>Gestisci modulo</h2>
            {isAlreadyChecked && (
              <p className={styles.confirmation}>
                Confermato da {userVerification?.email} il{' '}
                {formatDate(verification.verifiedAt)}
              </p>
            )}
            <div>
              {isResolved ? (
                <IssueCheck id={id} isVerified={verification.isVerified} />
              ) : (
                <p>
                  <a href="#result">Aggiungi una conclusione</a> prima di
                  confermare il documento
                </p>
              )}
            </div>
          </div>
        )}

        <div className={styles.section}>
          <h2 className={styles.noPrint}>Modulo</h2>
          {isAlreadyChecked && (
            <p className={styles.confirmation}>
              Confermato il <DateComponent date={verification.verifiedAt} />
            </p>
          )}
          <div className={styles.dataContainer}>
            <p>
              <strong>Numero:</strong> {id} - <strong>Data:</strong>{' '}
              {formatDate(date)}
            </p>
            <p>
              <strong>Cliente:</strong> {client}
            </p>
            <p>
              <strong>Tipo di problema:</strong> {actionTypes[issueType]}
            </p>
            <div>
              <h3>Riassunto</h3>
              <p>{summary}</p>
            </div>
            {supplierInfo && (
              <div>
                <h3>Fornitore</h3>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Ditta</th>
                      <th scope="col">Documento</th>
                      <th scope="col">Data</th>
                      <th scope="col">Consegnato con</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{supplierInfo.supplier}</td>
                      <td>{supplierInfo.documentType}</td>
                      <td>
                        {supplierInfo.documentDate &&
                          formatDate(supplierInfo.documentDate)}
                      </td>
                      <td>{supplierInfo.deliveryContext}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            {supplierInfo?.product && (
              <div>
                <h3>Prodotto</h3>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Numero</th>
                      <th scope="col">Descrizione</th>
                      <th scope="col">Quantità</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{supplierInfo.product.number}</td>
                      <td>{supplierInfo.product.description}</td>
                      <td>{supplierInfo.product.quantity}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className={`${styles.actionBar} ${styles.noPrint}`}>
            {!isFinished && <IssueFormWithButton issue={issue} />}
          </div>
        </div>

        <div className={`${styles.section}`}>
          <h2>Timeline</h2>
          {timeline.map((action) => (
            <IssueAction
              action={action}
              issueId={id}
              key={action.id}
              readOnly={isFinished}
            />
          ))}
          {!isFinished && (
            <>
              <h3>Aggiungi azione</h3>
              <IssueTimelineForm isNew issueId={id} action={undefined} />
            </>
          )}
        </div>

        <div
          id="result"
          className={`${styles.section} ${styles.dataContainer}`}
        >
          <h2>Conclusione</h2>
          {!isFinished && (
            <>
              <div>
                <Instruction type="warning">
                  Attenzione: aggiungere la conclusione renderà il documento non
                  più modificabile
                </Instruction>
              </div>
              <IssueResultForm id={id} />
            </>
          )}
          {isResolved && (
            <>
              <p>{formatDate(result.date)}</p>
              <p>{result.summary}</p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
