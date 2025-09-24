import { Timestamp } from 'firebase/firestore';

type UserScopes =
  | 'read/riscossi'
  | 'write/riscossi'
  | 'write/gmb'
  | 'write/config'
  | 'admin';

export interface IDbUser {
  nome: string;
  cognome: string;
  email: string;
  isAdmin: boolean;
  permissions?: UserScopes[];
  theme?: 'light' | 'dark' | null;
  teams?: string[];
}

export interface IUser {
  id: string;
  name: string;
  surname: string;
  email: string;
  isAdmin: boolean;
  permissions?: UserScopes[];
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
  emailRiscossi: string;
}

export type IConfig = {
  mailUrl: string;
  transportCostPerMinute: number;
  transportCostMinimum: number;
  transportHourBase: number;
  emailRiscossi: string;
};

export type IFileCategories = 'link-icons' | 'quote';

export type IDbRiscossoDoc = {
  number: string;
  type: 'fattura' | 'DDT' | 'impegno';
  total: number;
  date: Timestamp;
};

export type IRiscossoDoc = {
  number: string;
  type: 'fattura' | 'DDT' | 'impegno';
  total: number;
  date: Date;
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

export type IRiscosso = Omit<
  IDbRiscosso,
  'date' | 'meta' | 'verification' | 'docs'
> & {
  date: Date;
  docs: IRiscossoDoc[];
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

type IssueType =
  | 'delay-preparation'
  | 'missing-article'
  | 'delay-arrival'
  | 'wrong-supplier'
  | 'client-return'
  | 'insufficient-order'
  | 'suppllier-defect'
  | 'breakage'
  | 'not-conforming'
  | 'client-mistake'
  | 'plumber-mistake'
  | 'builder-mistake'
  | 'project-mistake';

type SupplierInfo = {
  supplier: string;
  documentType: string;
  documentDate: string;
  deliveryContext: string;
  product: {
    number: string;
    quantity: number;
    description: string;
  };
};

type IDbAction = {
  date: Timestamp;
  content: string;
  attachments?: string[];
  result?: string;
};

type IAction = {
  date: Date;
  content: string;
  attachments?: string[];
  result?: string;
};

export type IDbIssue = {
  id: string;
  date: Timestamp;
  commission: string;
  client: string;
  issueType: IssueType;
  summary: string;
  supplierInfo?: SupplierInfo;
  timeline: IDbAction[];
  result?: {
    date: Timestamp;
    summary: string;
  };
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

export type IIssue = Omit<
  IDbIssue,
  'date' | 'meta' | 'verification' | 'result' | 'timeline'
> & {
  date: Date;
  timeline: IAction[];
  result?: {
    date: Date;
    summary: string;
  };
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
