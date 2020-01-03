import { login, clearAuth } from "../../utils/login";
import { inputCheckError, setInput, submitForm, formCheckError, formCheckSuccess } from '../../utils/forms';
import { goTo } from "../../utils/navigation";
import { apis } from "../../fixtures/apis";

describe('Sms Page', () => {
  before(() => {
    login();
  });

  after(() => {
    clearAuth();
  });
  
  beforeEach(() => {
    goTo('/sms', {
      onBeforeLoad: (win) => {
        win.fetch = null
      }
    });
  });

  it('shows a form', () => {
    cy
      .get('form').length === 1;
  });

  it('shows errors in the form when there is no data', () => {
    inputCheckError('input[name="number"]');
    inputCheckError('textarea[name="message"]');
  });

  it('shows an error in the form when a wrong number is entered', () => {
    inputCheckError('input[name="number"]', '123456789');
  });

  it('shows an error in the form when the message is all caps', () => {
    inputCheckError('textarea[name="message"]', 'TESTING MESSAGE');
  });

  it('shows an error if the form cannot send an sms', () => {
    setInput('input[name="number"]', '123456789101');
    setInput('textarea[name="message"]', 'test');

    submitForm();

    formCheckError();
  });

  it('sends an sms', () => {
    // stub
    cy.server();
    cy.route('OPTIONS', apis.smsApi, '');
    cy.route('POST', apis.smsApi, JSON.stringify({
      result: 'OK'
    }));

    setInput('input[name="number"]', '123456789101');
    setInput('textarea[name="message"]', 'test');

    submitForm();

    formCheckSuccess();
  });
})