import type { Metadata } from 'next';

import styles from './page.module.css';
import template from '../../header-template.module.css';
import {
  getIssue,
  getIssueTimeline,
  getUser,
  getUsers,
} from '@/services/firebase/server';
import { headers } from 'next/headers';
import { formatDate } from '@/utils/formatDate';
import { checkCanEditIssues } from '@/services/firebase/server/permissions';
import { IssueForm } from '@/components/issue-form/issue-form';
import { IIssue } from '@/services/firebase/db-types';
import { IssueTimelineForm } from '@/components/issue-timeline/issue-timeline-form';
import { IssueAction } from '@/components/issue-timeline/issue-action';
import { IssueResultForm } from '@/components/issue-form/issue-result-form';

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

const getSupplierInfo = (supplierInfo: IIssue['supplierInfo']) => {
  const { deliveryContext, documentDate, documentType, supplier } =
    supplierInfo || {};
  return (
    <>
      {supplier && `Ditta: ${supplier}`}
      {documentType && ` - Documento: ${documentType}`}
      {documentDate && ` - Data: ${formatDate(documentDate)}`}
      {deliveryContext && ` - Consegnato con: ${deliveryContext}`}
    </>
  );
};
const getProductInfo = (supplierInfo: IIssue['supplierInfo']) => {
  const { product } = supplierInfo || {};
  const { description, number, quantity } = product || {};
  return (
    <>
      {number && `Numero: ${number}`}
      {description && ` - Descrizione: ${description}`}
      {quantity && ` - Quantità: ${quantity}`}
    </>
  );
};

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
              {/* <RiscossoCheck id={id} isVerified={verification.isVerified} /> */}
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
            {!isFinished && (
              <a href="#edit" className="button">
                Modifica
              </a>
            )}
          </div>
          <div>
            <p>
              Numero: {id} - Data: {formatDate(date)}
            </p>
            <p>Cliente: {client}</p>
            <p>Tipo di problema: {actionTypes[issueType]}</p>
            <div>
              <h3>Problema</h3>
              <p>{summary}</p>
            </div>
            {supplierInfo && (
              <div>
                <h3>Fornitore</h3>
                <p>{getSupplierInfo(supplierInfo)}</p>
              </div>
            )}
            {supplierInfo?.product && (
              <div>
                <h3>Prodotto</h3>
                <p>{getProductInfo(supplierInfo)}</p>
              </div>
            )}
          </div>
        </div>

        <div id="edit" className={`${styles.noPrint} ${styles.section}`}>
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

        <div id="edit" className={`${styles.noPrint} ${styles.section}`}>
          <h2>Conclusione</h2>
          {!isFinished && (
            <>
              <div>
                <p>
                  Attenzione: aggiungere la conclusione rendera il documento non
                  piu modificabile
                </p>
              </div>
              <IssueResultForm id={id} />
            </>
          )}
          {isResolved && (
            <div>
              <p>{formatDate(result.date)}</p>
              <p>{result.summary}</p>
            </div>
          )}
        </div>

        {!isFinished && (
          <div id="edit" className={`${styles.noPrint} ${styles.section}`}>
            <h2>Modifica</h2>
            <IssueForm issue={issue} />
          </div>
        )}
      </div>
    </main>
  );
}
