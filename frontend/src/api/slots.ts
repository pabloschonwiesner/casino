import apiClient from './client';

export interface SpinRequest {
  gameId: string;
  betAmount: number;
}

export interface SpinResponse {
  id: string;
  reels: {
    reel1: string;
    reel2: string;
    reel3: string;
  };
  amount: string;
  balanceBefore: string;
  balanceAfter: string;
  timestamp: string;
}

export interface SpinHistoryItem {
  id: string;
  gameTitle: string;
  gameSlug: string;
  reels: {
    reel1: string;
    reel2: string;
    reel3: string;
  };
  netAmount: string;
  balanceAfter: string;
  timestamp: string;
}

export const slotsApi = {
  spin: async (request: SpinRequest): Promise<SpinResponse> => {
    const response = await apiClient.post('/slots/spin', request);
    return response.data;
  },

  getHistory: async (limit: number = 10): Promise<SpinHistoryItem[]> => {
    const response = await apiClient.get('/slots/history', {
      params: { limit },
    });
    return response.data;
  },
};
