import type { Game } from '../../api/games';

interface GameCardProps {
  game: Game;
  onClick: () => void;
}

export function GameCard({ game, onClick }: GameCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Play ${game.title} by ${game.providerName}`}
      className="w-full text-left bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
    >
      <div className="aspect-video w-full bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
        {game.thumbnailUrl ? (
          <img
            src={game.thumbnailUrl}
            alt={game.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
            {game.title}
          </h3>
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 whitespace-nowrap">
            {game.gameType.name}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
          {game.providerName}
        </p>
      </div>
    </button>
  );
}
