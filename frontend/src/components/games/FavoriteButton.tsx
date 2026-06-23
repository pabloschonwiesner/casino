import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { favoritesApi } from '@/api/favorites';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    <Button
      type="button"
      variant="secondary"
      size="icon"
      onClick={handleClick}
      disabled={toggleFavoriteMutation.isPending}
      aria-label={isFavorite ? `Remove ${gameTitle} from favorites` : `Add ${gameTitle} to favorites`}
      aria-pressed={isFavorite}
      className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-colors',
          isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
        )}
      />
    </Button>
  );
}
