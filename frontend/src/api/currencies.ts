import apiClient from './client';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  decimalPlaces: number;
}

export interface ConvertBalanceRequest {
  targetCurrency: string;
}

export interface ConvertBalanceResponse {
  originalBalance: string;
  originalCurrency: string;
  convertedBalance: string;
  targetCurrency: string;
  exchangeRate: string;
  timestamp: string;
}

export const currenciesApi = {
  getCurrencies: async (): Promise<Currency[]> => {
    const response = await apiClient.get('/currencies');
    return response.data;
  },

  convertBalance: async (request: ConvertBalanceRequest): Promise<ConvertBalanceResponse> => {
    const response = await apiClient.post('/currencies/convert', request);
    return response.data;
  },
};
