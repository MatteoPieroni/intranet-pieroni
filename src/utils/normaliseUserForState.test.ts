import { normaliseUserForState } from './normaliseUserForState';

const mockDbUser = {
  nome: 'test nome',
  cognome: 'test cognome',
  email: 'test@email.com',
  isAdmin: false,
};

const expectedStateUser = {
  id: 'test-id',
  name: 'test nome',
  surname: 'test cognome',
  email: 'test@email.com',
  isAdmin: false,
};

describe('Util | normaliseUserForState', () => {
  it('normalises a user coming from the db into a user for state', () => {
    expect(normaliseUserForState('test-id', mockDbUser)).toEqual(expectedStateUser);
  });
});
