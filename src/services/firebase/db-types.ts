import { Timestamp } from 'firebase/firestore';

type UserScopes =
  | 'read/riscossi'
  | 'write/riscossi'
  | 'write/issues'
  | 'write/gmb'
  | 'write/config'
  | 'admin';

export type DbUserUpdate = {
  timestamp: Timestamp;
  actionType: 'created' | 'updated';
  entityId: string;
  entityType: 'issues' | 'riscossi';
};

export type UserUpdate = {
  timestamp: Date;
  actionType: 'created' | 'updated';
  entityId: string;
  entityType: 'issues' | 'riscossi';
};

export interface DbUser {
  id: string;
  name: string;
  surname: string;
  email: string;
  permissions?: UserScopes[];
  theme?: 'light' | 'dark' | null;
  teams?: string[];
  updates?: UserUpdate[];
}

export type User = DbUser;

export interface DbTeam {
  name: string;
}

export interface Team {
  name: string;
  id: string;
}

export interface DbLink {
  description: string;
  id: string;
  link: string;
  teams: string[];
  icon?: string;
}
export interface Link {
  description: string;
  id: string;
  link: string;
  teams: string[];
  icon?: string;
}

export interface Quote {
  text: string;
  url: string;
}

export interface GoogleAuth {
  refresh_token: string;
}

export interface DbImage {
  [id: string]: {
    url: string;
  };
}

export interface Image {
  url: string;
}

export interface DbTv {
  text: string;
}

export interface Tv {
  text: string;
}

export interface DbConfig {
  mail_url: string;
  transport_cost_per_minute: number;
  transport_cost_minimum: number;
  transport_hour_base: number;
  emailRiscossi: string;
}

export type Config = {
  mailUrl: string;
  transportCostPerMinute: number;
  transportCostMinimum: number;
  transportHourBase: number;
  emailRiscossi: string;
};

export type FileCategories = 'link-icons' | 'quote' | `issues/${string}`;

export type DbRiscossoDoc = {
  number: string;
  type: 'fattura' | 'DDT' | 'impegno';
  total: number;
  date: Timestamp;
};

export type RiscossoDoc = {
  number: string;
  type: 'fattura' | 'DDT' | 'impegno';
  total: number;
  date: Date;
};

export type DbRiscosso = {
  id: string;
  date: Timestamp;
  total: number;
  client: string;
  company: 'pieroni' | 'pieroni-mostra' | 'pellet';
  paymentMethod: 'assegno' | 'contanti' | 'bancomat';
  paymentChequeValue?: number;
  paymentChequeNumber?: string;
  docs: DbRiscossoDoc[];
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

export type Riscosso = Omit<
  DbRiscosso,
  'date' | 'meta' | 'verification' | 'docs'
> & {
  date: Date;
  docs: RiscossoDoc[];
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

type DbSupplierInfo = {
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

type SupplierInfo = {
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

export type DbIssueAction = {
  id: string;
  date: Timestamp;
  content: string;
  attachments?: string[];
  result?: string;
};

export type IssueAction = {
  id: string;
  date: Date;
  content: string;
  attachments?: string[];
  result?: string;
};

export type DbIssue = {
  id: string;
  date: Timestamp;
  commission: string;
  client: string;
  issueType: IssueType;
  summary: string;
  supplierInfo?: DbSupplierInfo;
  timeline: DbIssueAction[];
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

export type Issue = Omit<
  DbIssue,
  'date' | 'meta' | 'verification' | 'result' | 'timeline' | 'supplierInfo'
> & {
  date: Date;
  timeline: IssueAction[];
  supplierInfo?: SupplierInfo;
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
