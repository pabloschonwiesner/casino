import type { Game } from '../../api/games';
import { GameCard } from './GameCard';

interface GameGridProps {
  games: Game[];
  onGameClick: (game: Game) => void;
}

export function GameGrid({ games, onGameClick }: GameGridProps) {
  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No games found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {games.map((game) => (
        <GameCard key={game.id} game={game} onClick={() => onGameClick(game)} />
      ))}
    </div>
  );
}
