import React, { useState, useEffect, Context } from 'react';
import { Loader } from '../../components';
import { getConfig } from '../../services/firebase/dbf';
import { IConfig } from '../../services/firebase/types';

export const ConfigContext: Context<IConfig> = React.createContext(null);

interface IConfigProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const ConfigProvider: (props: IConfigProviderProps) => JSX.Element = ({ children }) => {
  // initial check for user
  const [hasLoaded, setHasLoaded] = useState(false);
  const [config, setConfig] = useState<IConfig>();

  useEffect(() => {
    const fetchConfig = async (): Promise<void> => {
        try {
          const fetchedConfig = await getConfig() as IConfig;

					setConfig(fetchedConfig);
					setHasLoaded(true);
        } catch (error) {
					console.log(error);
					setHasLoaded(true);
        }
		};
		
		fetchConfig();
	}, []);
	
  return (
    <ConfigContext.Provider value={config}>
			{hasLoaded ? (
				children
			) : (
				<Loader />
			)}
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;