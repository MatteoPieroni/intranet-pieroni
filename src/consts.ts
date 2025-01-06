export const GREETINGS = {
  morning: 'Buongiorno',
  afternoon: 'Buon pomeriggio',
  evening: 'Buonasera',
  night: 'Buonanotte',
} as const;

export const ERROR_CAPS_LOCK =
  '❌ Non sono consentiti messaggi tutti in maiuscolo. Ricontrolla per favore';
export const ERROR_EMPTY_FIELD = '❌ Questo campo è obbligatorio';
export const ERROR_FIELD_TOO_LONG = '❌ Questo testo è troppo lungo';

// form states
export const FORM_SUCCESS_PDF = '✔️ Stiamo scaricando il Pdf';
export const FORM_FAIL_PDF =
  '❌ Non siamo riusciti a creare il pdf. Ricontrolla per favore';
export const FORM_SUCCESS_LOGIN = '✔️ Ti sto reindirizzando';
export const FORM_FAIL_LOGIN =
  '❌ Non siamo riusciti ad accedere. Ricontrolla per favore';
export const FORM_FAIL_LOGIN_POPUP_CLOSED =
  '❌ La finestra di login è stata chiusa, riprova usando il tuo account Pieroni';
export const FORM_FAIL_LOGIN_NO_USER =
  '❌ Non siamo riusciti a trovare questa email. Ricontrolla per favore';
export const FORM_SUCCESS_TV = '✔️ Messaggio aggiornato';
export const FORM_FAIL_TV =
  '❌ Non siamo riusciti ad aggiornare. Ricontrolla per favore';
export const FORM_SUCCESS_LINK = '✔️ Link aggiornato';
export const FORM_FAIL_LINK =
  '❌ Non siamo riusciti ad aggiornare il link. Ricontrolla per favore';
export const FORM_SUCCESS_HOLIDAYS = '✔️ Date aggiornate';
export const FORM_FAIL_HOLIDAYS =
  '❌ Non siamo riusciti ad aggiornare. Ricontrolla per favore';
