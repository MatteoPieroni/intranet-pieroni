import React, { useState, useEffect, Context } from 'react';
import { Loader } from '../../components';
import { CataloguesApiService } from '../../services/catalogues-api';
import { getConfig, IConfig } from '../../services/firebase/db';

export interface IExtendedConfig extends IConfig {
  isInternal: boolean;
} 

export const ConfigContext: Context<IExtendedConfig> = React.createContext(null);

interface IConfigProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const ConfigProvider: (props: IConfigProviderProps) => JSX.Element = ({ children }) => {
  // initial check for user
  const [hasLoaded, setHasLoaded] = useState(false);
  const [config, setConfig] = useState<IExtendedConfig>();

  useEffect(() => {
    const fetchConfig = async (): Promise<void> => {
        try {
          const fetchedConfig = await getConfig() as IConfig;
          CataloguesApiService.apiUrl = fetchedConfig.apiUrl;

          const isInternal = await CataloguesApiService.exists();

					setConfig({
            ...fetchedConfig,
            isInternal,
          });
					setHasLoaded(true);
        } catch (error) {
					console.error(error);
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