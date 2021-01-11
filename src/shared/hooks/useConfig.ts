import { useContext } from 'react';

import { ConfigContext } from '../context/config';
import { IConfig } from '../../services/firebase/types';

export const useConfig: () => IConfig = () => useContext(ConfigContext);
