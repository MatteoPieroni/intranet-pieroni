export const MONTHS: string[] = [
  'gennaio',
  'febbraio',
  'marzo',
  'aprile',
  'maggio',
  'giugno',
  'luglio',
  'agosto',
  'settembre',
  'ottobre',
  'novembre',
  'dicembre',
];

export const GREETINGS: { morning: string; afternoon: string; evening: string; night: string } = {
  morning: 'Buongiorno',
  afternoon: 'Buon pomeriggio',
  evening: 'Buonasera',
  night: 'Buonanotte',
};

export const ERROR_INVALID_URL = '❌ Questo url non è valido. Ricontrolla per favore';
export const ERROR_INVALID_MOBILE = '❌ Questo numero non è valido. Ricontrolla per favore';
export const ERROR_INVALID_MESSAGE = '❌ Non sono consentiti messaggi tutti in maiuscolo. Ricontrolla per favore';
export const ERROR_EMPTY_FIELD = '❌ Questo campo è obbligatorio';
export const ERROR_FIELD_TOO_LONG = '❌ Questo testo è troppo lungo';

// form states
export const FORM_SUCCESS_MESSAGE = '✔️ Messaggio inviato';
export const FORM_FAIL_MESSAGE = '❌ Non siamo riusciti a inviare il messaggio. Ricontrolla per favore';
export const FORM_SUCCESS_PDF = '✔️ Stiamo scaricando il Pdf';
export const FORM_FAIL_PDF = '❌ Non siamo riusciti a creare il pdf. Ricontrolla per favore';