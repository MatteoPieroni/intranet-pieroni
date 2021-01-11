import { useContext } from 'react';

import { ConfigContext } from '../context/config';
import { IConfig } from '../../services/firebase/db';

export const useConfig: () => IConfig = () => useContext(ConfigContext);
