import apiClient from './client';
import type { PaginatedGamesResponse, GameDetail } from '@/types/games';

export const gamesApi = {
  getGames: async (params?: {
    q?: string; 
    page?: number;
    limit?: number;
  }): Promise<PaginatedGamesResponse> => {
    const response = await apiClient.get('/games', { params });
    return response.data;
  },

  getGame: async (slug: string): Promise<GameDetail> => {
    const response = await apiClient.get(`/games/${slug}`);
    return response.data;
  },
};
