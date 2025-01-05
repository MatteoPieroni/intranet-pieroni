import { SmsForm } from '@/components/sms-form/sms-form';
import template from '../header-template.module.css';
import styles from './page.module.css';

export default async function Home() {
  return (
    <main className={template.page}>
      <div className={template.header}>
        <h1>Invia un sms</h1>
      </div>
      <div>
        <div className={styles.container}>
          <SmsForm />
        </div>
      </div>
    </main>
  );
}
