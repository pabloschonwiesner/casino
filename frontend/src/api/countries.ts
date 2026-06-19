import apiClient from './client';
import type { Country } from '../types/auth';

export const countriesApi = {
  getCountries: async (): Promise<Country[]> => {
    const response = await apiClient.get<{ data: Country[] }>('/countries');
    return response.data.data;
  },
};
