export interface FinancialItem {
  amount: number;
  source_text: string;
  source_value: string;
}

export interface CurrentAssets {
  cash_and_equivalents?: FinancialItem;
  accounts_receivable?: FinancialItem;
  inventory?: FinancialItem;
  other_current_assets?: FinancialItem;
  total_current_assets?: FinancialItem;
}

export interface NonCurrentAssets {
  pp_and_e?: FinancialItem;
  total_non_current_assets?: FinancialItem;
  [key: string]: FinancialItem | undefined;
}

export interface Assets {
  total_assets: FinancialItem;
  current: CurrentAssets;
  non_current: NonCurrentAssets;
}

export interface CurrentLiabilities {
  accounts_payable?: FinancialItem;
  short_term_debt?: FinancialItem;
  total_current_liabilities?: FinancialItem;
  [key: string]: FinancialItem | undefined;
}

export interface NonCurrentLiabilities {
  long_term_debt?: FinancialItem;
  total_non_current_liabilities?: FinancialItem;
  [key: string]: FinancialItem | undefined;
}

export interface Liabilities {
  total_liabilities: FinancialItem;
  current: CurrentLiabilities;
  non_current: NonCurrentLiabilities;
}

export interface Equity {
  total_equity: FinancialItem;
  [key: string]: FinancialItem | undefined;
}

export interface Financials {
  assets: Assets;
  liabilities: Liabilities;
  equity: Equity;
}

export interface Metadata {
  company_name: string;
  currency: string;
  date: string;
}

export interface ValidationReport {
  is_balanced: boolean;
  accounting_equation: {
    assets: number;
    'L+E': number;
    difference: number;
  };
  status: 'PASS' | 'REVIEW_REQUIRED' | string;
}

export interface YearData {
  standardized_metadata: Metadata;
  financials: Financials;
  validation_report?: ValidationReport;
}

export interface FinancialData {
  [year: string]: YearData;
}

export type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
