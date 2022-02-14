import React, { useState, useEffect, Context } from 'react';
import { Loader } from '../../components';
import { CataloguesApiService } from '../../services/catalogues-api';
import { getConfig, IConfig } from '../../services/firebase/db';

export interface IExtendedConfig extends IConfig {
  isInternal?: boolean;
}

export const ConfigContext: Context<IExtendedConfig & { checkInternal: () => Promise<void> }> = React.createContext(null);

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

        setConfig({
          ...fetchedConfig,
        });
        setHasLoaded(true);
      } catch (error) {
        console.error(error);
        setHasLoaded(true);
      }
    };

    fetchConfig();
  }, []);

  const checkInternal = async (): Promise<void> => {
    if (!config) {
      return;
    }

    CataloguesApiService.apiUrl = config.apiUrl;

    const isInternal = await CataloguesApiService.exists();


    setConfig(oldConfig => ({
      ...oldConfig,
      isInternal,
    }));
  }

  return (
    <ConfigContext.Provider value={{ ...config, checkInternal }}>
      {hasLoaded ? (
        children
      ) : (
        <Loader />
      )}
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;