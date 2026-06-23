export interface GameType {
  code: string;
  name: string;
}

export interface Game {
  id: string;
  slug: string;
  title: string;
  providerName: string;
  thumbnailUrl: string | null;
  gameType: GameType;
  isFavorite: boolean;
}

export interface GameDetail extends Game {
  startUrl: string | null;
}

export interface PaginatedGamesResponse {
  data: Game[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}