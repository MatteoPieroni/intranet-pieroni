import { Timestamp } from 'firebase/firestore';

export interface IDbUser {
  nome: string;
  cognome: string;
  email: string;
  isAdmin: boolean;
  scopes?: {
    gmb?: boolean;
    config?: {
      transport?: boolean;
    };
  };
  theme?: 'light' | 'dark' | null;
  teams?: string[];
}

export interface IUser {
  id: string;
  name: string;
  surname: string;
  email: string;
  isAdmin: boolean;
  scopes?: {
    gmb?: boolean;
    config?: {
      transport?: boolean;
    };
  };
  theme?: 'light' | 'dark' | null;
  teams?: string[];
}

export interface IDbTeam {
  name: string;
}

export interface ITeam {
  name: string;
  id: string;
}

export interface IDbLink {
  description: string;
  id: string;
  link: string;
  teams: string[];
  icon?: string;
}
export interface ILink {
  description: string;
  id: string;
  link: string;
  teams: string[];
  icon?: string;
}

export interface IQuote {
  text: string;
  url: string;
}

export interface ITv {
  text: string;
}

export interface IGoogleAuth {
  refresh_token: string;
}

export interface IImage {
  url: string;
}

export interface IDbImage {
  [id: string]: {
    url: string;
  };
}

export interface IDbTv {
  text: string;
}

export interface IStorageFile {
  path: string;
}

export interface IDbConfig {
  mail_url: string;
  transport_cost_per_minute: number;
  transport_cost_minimum: number;
  transport_hour_base: number;
}

export type IConfig = {
  mailUrl: string;
  transportCostPerMinute: number;
  transportCostMinimum: number;
  transportHourBase: number;
};

export type IFileCategories = 'link-icons' | 'quote';

export type IDbRiscossoDoc = {
  number: string;
  type: 'fattura' | 'DDT' | 'impegno';
  total: number;
};

export type IDbRiscosso = {
  id: string;
  date: Timestamp;
  total: number;
  client: string;
  company: 'pieroni' | 'pieroni-mostra' | 'pellet';
  paymentMethod: 'assegno' | 'contanti' | 'bancomat';
  paymentChequeValue?: number;
  paymentChequeNumber?: string;
  docs: IDbRiscossoDoc[];
  meta: {
    createdAt: Timestamp;
    author: string;
  };
  verification:
    | {
        isVerified: true;
        verifiedAt: Timestamp;
        verifyAuthor: string;
      }
    | {
        isVerified: false;
        verifiedAt?: Timestamp;
        verifyAuthor?: string;
      };
};

export type IRiscosso = Omit<IDbRiscosso, 'date' | 'meta' | 'verification'> & {
  date: Date;
  meta: {
    createdAt: Date;
    author: string;
  };
  verification:
    | {
        isVerified: true;
        verifiedAt: Date;
        verifyAuthor: string;
      }
    | {
        isVerified: false;
        verifiedAt?: Date;
        verifyAuthor?: string;
      };
};
