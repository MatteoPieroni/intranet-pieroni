import React, { useState, useEffect, Context } from 'react';
import { fireAuth, fireDb } from '../../services/firebase';
import { normaliseUserForState } from '../../utils/normaliseUserForState';

export const UserContext: Context<any> = React.createContext(null);

interface IUserProviderProps {
  children: JSX.Element;
}

export const UserProvider: (props: IUserProviderProps) => JSX.Element = ({ children }) => {
  // initial check for user
  const [hasLoaded, setHasLoaded] = useState(false);
  // contains the actual user object
  const [user, setUser] = useState({
    id: '',
    isAdmin: false,
    email: '',
    name: '',
    surname: '',
  });

  const logOut: () => void = async () => {
    await fireAuth.logout();

    setUser({
      id: '',
      isAdmin: null,
      email: '',
      name: '',
      surname: '',
    });
  };

  useEffect(() => {
    setHasLoaded(!!fireAuth.getCurrentUser());
  }, [user]);

  useEffect(() => {
    const fetchUserObject: (userId: string) => Promise<IDbUser | null> = async userId => {
      try {
        const userObject = await fireDb.getUser(userId);

        return userObject;
      } catch (error) {
        console.log(error);
      }
    };

    const unsubscribe = fireAuth.subscribeToAuthChanges(async authUser => {
      if (authUser) {
        try {
          let userObject = await fetchUserObject(authUser.uid);
          // if it's the first login
          if (!userObject) {
            const userData = authUser.providerData?.[0];
            const [name, surname] = userData.displayName.split(' ');

            const newData = await fireDb.createUser(authUser.uid, {
              nome: name,
              cognome: surname,
              email: userData.email,
              isAdmin: false,
            });

            if (!(newData instanceof Error)) {
              userObject = newData;
            }
          }

          setUser(normaliseUserForState(authUser.uid, userObject));
        } catch (error) {
          console.log(error);
        }
      } else {
        setHasLoaded(true);
      }
    });

    return unsubscribe;
  }, [hasLoaded]);

  return (
    <UserContext.Provider value={[user, hasLoaded, logOut]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;