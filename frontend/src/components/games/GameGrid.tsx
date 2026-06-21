import type { Game } from '../../api/games';
import { GameCard } from './GameCard';

interface GameGridProps {
  games: Game[];
  onGameClick: (game: Game) => void;
  showFavorite?: boolean;
}

export function GameGrid({ games, onGameClick, showFavorite = false }: GameGridProps) {
  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No games found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          onClick={() => onGameClick(game)}
          showFavorite={showFavorite}
        />
      ))}
    </div>
  );
}
