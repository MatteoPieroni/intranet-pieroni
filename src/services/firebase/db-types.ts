import { Timestamp } from 'firebase/firestore';

type UserScopes =
  | 'read/riscossi'
  | 'write/riscossi'
  | 'write/issues'
  | 'write/gmb'
  | 'write/config'
  | 'admin';

export interface IDbUser {
  id: string;
  name: string;
  surname: string;
  email: string;
  permissions?: UserScopes[];
  theme?: 'light' | 'dark' | null;
  teams?: string[];
}

export type IUser = IDbUser;

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

export type IFileCategories = 'link-icons' | 'quote' | `issues/${string}`;

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
  | 'supplier-mistake'
  | 'client-return'
  | 'insufficient-order'
  | 'supplier-defect'
  | 'breakage'
  | 'not-conforming'
  | 'client-mistake'
  | 'plumber-mistake'
  | 'builder-mistake'
  | 'project-mistake';

type IDbSupplierInfo = {
  supplier?: string;
  documentType?: string;
  documentDate?: Timestamp;
  deliveryContext?: string;
  product?: {
    number?: string;
    quantity?: number;
    description?: string;
  };
};

type ISupplierInfo = {
  supplier?: string;
  documentType?: string;
  documentDate?: Date;
  deliveryContext?: string;
  product?: {
    number?: string;
    quantity?: number;
    description?: string;
  };
};

export type IDbIssueAction = {
  id: string;
  date: Timestamp;
  content: string;
  attachments?: string[];
  result?: string;
};

export type IIssueAction = {
  id: string;
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
  supplierInfo?: IDbSupplierInfo;
  timeline: IDbIssueAction[];
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
  'date' | 'meta' | 'verification' | 'result' | 'timeline' | 'supplierInfo'
> & {
  date: Date;
  timeline: IIssueAction[];
  supplierInfo?: ISupplierInfo;
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
