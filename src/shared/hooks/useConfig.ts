import { useContext } from 'react';

import { ConfigContext, IExtendedConfig } from '../context/config';

export const useConfig: () => IExtendedConfig = () => useContext(ConfigContext);
