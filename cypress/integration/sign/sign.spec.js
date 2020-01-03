import { login, clearAuth } from "../../utils/login";
import { inputCheckError, setInput, submitForm, formCheckSuccess } from '../../utils/forms';
import { goTo } from "../../utils/navigation";

const veryLongInput = 'abcdefghijklmnopqrstsuvxyz abcdefghijklmnopqrstsuvxyz abcdefghijklmnopqrstsuvxyz abcdefghijklmnopqrstsuvxyz abcdefghijklmnopqrstsuvxyz abcdefghijklmnopqrstsuvxyz';

describe('Sign Page', () => {
  before(() => {
    login();
  });

  after(() => {
    clearAuth();
  });
  
  beforeEach(() => {
    goTo('/cartello');
  });

  it('shows a form', () => {
    cy
      .get('form').should('have.length', 1);
  });

  it('shows errors in the form when there is no data', () => {
    inputCheckError('textarea[name="text"]');
  });

  it('shows errors in the form when the text is too long', () => {
    inputCheckError('textarea[name="text"]', veryLongInput);
  });

  it('downloads the file', () => {
    setInput('textarea[name="text"]', 'test');

    submitForm();

    formCheckSuccess();
  });
})