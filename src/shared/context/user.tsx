import React, { useState, useEffect, ProviderProps, Context } from 'react';
import { fireAuth, fireDb } from '../../services/firebase';
import { IUser } from '../../services/firebase/types';

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
  });

  const logOut: () => void = async () => {
    await fireAuth.logout();

    setUser({
      id: '',
      isAdmin: null,
      email: '',
      name: '',
    });
  };

  useEffect(() => {
    setHasLoaded(!!fireAuth.getCurrentUser());
  }, [user]);

  useEffect(() => {
    const fetchUserObject: (userId: string) => void = async userId => {
      try {
        const userObject = await fireDb.getUser(userId);
        setUser({
          id: userId,
          ...userObject,
        });
      } catch (error) {
        console.log(error);
      }
    };

    const unsubscribe = fireAuth.subscribeToAuthChanges(authUser => {
      if (authUser) {
        try {
          fetchUserObject(authUser.uid);
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
