import { useContext } from 'react';

import { UserContext } from '../context/user';
import { IUser } from '../../services/firebase/db';

export const useUser: () => [IUser, boolean, () => void] = () => useContext(UserContext);
