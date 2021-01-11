import React, { useState, useEffect, Context } from 'react';
import { fireAuth } from '../../services/firebase';
import { createUser, getUser, IDbUser, IUser } from '../../services/firebase/db';
import { normaliseUserForState } from '../../utils/normaliseUserForState';

export const UserContext: Context<[IUser, boolean, () => void]> = React.createContext(null);

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
        const userObject = await getUser(userId);

        return userObject;
      } catch (error) {
        console.log(error);
      }
    };

    const unsubscribe = fireAuth.subscribeToAuthChanges(async authUser => {
      if (authUser) {
        try {
          let userObject = await fetchUserObject(authUser.uid);

          // if user is already logged in using old mail/pass method
          if (authUser.providerData[0].providerId === 'password') {
            logOut();
          }

          // if it's the first login
          if (!userObject) {
            const userData = authUser.providerData?.[0];
            const [name, surname] = userData.displayName.split(' ');

            const newData = await createUser(authUser.uid, {
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