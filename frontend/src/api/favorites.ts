import apiClient from './client';

export interface FavoriteResponse {
  gameId: string;
  isFavorite: boolean;
}

export const favoritesApi = {
  addFavorite: async (gameId: string): Promise<FavoriteResponse> => {
    const response = await apiClient.post(`/favorites/${gameId}`);
    return response.data;
  },

  removeFavorite: async (gameId: string): Promise<FavoriteResponse> => {
    const response = await apiClient.delete(`/favorites/${gameId}`);
    return response.data;
  },
};
