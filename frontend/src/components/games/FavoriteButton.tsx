import { useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesApi } from '../../api/favorites';

interface FavoriteButtonProps {
  gameId: string;
  gameTitle: string;
  isFavorite: boolean;
}

export function FavoriteButton({ gameId, gameTitle, isFavorite }: FavoriteButtonProps) {
  const queryClient = useQueryClient();

  const toggleFavoriteMutation = useMutation({
    mutationFn: (isFav: boolean) =>
      isFav ? favoritesApi.removeFavorite(gameId) : favoritesApi.addFavorite(gameId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteMutation.mutate(isFavorite);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={toggleFavoriteMutation.isPending}
      aria-label={isFavorite ? `Remove ${gameTitle} from favorites` : `Add ${gameTitle} to favorites`}
      aria-pressed={isFavorite}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        className={`w-5 h-5 ${
          isFavorite
            ? 'text-red-500 dark:text-red-400'
            : 'text-gray-400 dark:text-gray-500'
        }`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
}
