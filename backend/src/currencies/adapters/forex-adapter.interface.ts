export interface CurrencyPair {
  symbol: string;
  providerSymbol: string;
  baseCurrency: string;
  quoteCurrency: string;
  exchange: string;
  name: string;
}

export interface HistoricalRate {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface ForexAdapter {
  
  getPreviousClose(providerSymbol: string): Promise<HistoricalRate[]>;
  
  getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number>;
}
