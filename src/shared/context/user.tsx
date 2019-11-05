import React, { useState, useEffect } from 'react';
import { fireAuth, fireDb } from '../../services/firebase';

export const UserContext: React.Context<any> = React.createContext({
  id: null,
  isAdmin: null,
  email: null,
  name: null,
});

interface IUserProviderProps {
  children: JSX.Element;
}

export const UserProvider: (props: IUserProviderProps) => JSX.Element = ({ children }) => {
  // initial check for user
  const [hasLoaded, setHasLoaded] = useState(false);
  // contains the actual user object
  const [user, setUser] = useState({
    id: null,
    isAdmin: null,
    email: null,
    name: null,
  });

  const logOut: () => void = async () => {
    await fireAuth.logout();

    setUser({
      id: null,
      isAdmin: null,
      email: null,
      name: null,
    });
  };

  useEffect(() => {
    console.log('hasLoaded', fireAuth.getCurrentUser());
    setHasLoaded(!!fireAuth.getCurrentUser());
  }, [user]);

  useEffect(() => {
    const fetchUserObject: (userId: string) => void = async userId => {
      const userObject = await fireDb.getUser(userId);
      setUser({
        id: userId,
        ...userObject,
      });
    };

    const unsubscribe = fireAuth.subscribeToAuthChanges(authUser => {
      if (authUser) {
        console.log('loggedin');
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
