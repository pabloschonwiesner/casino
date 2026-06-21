import { useState } from 'react';
import type { Game } from '../../api/games';
import { FavoriteButton } from './FavoriteButton';
import { Card } from '../ui/card';

interface GameCardProps {
  game: Game;
  onClick: () => void;
  showFavorite?: boolean;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=280&h=280&fit=crop&q=80';

export function GameCard({ game, onClick, showFavorite = false }: GameCardProps) {
  const [imageError, setImageError] = useState(false);
  const imageSrc = imageError || !game.thumbnailUrl ? FALLBACK_IMAGE : game.thumbnailUrl;

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Play ${game.title} by ${game.providerName}`}
      className="group overflow-hidden transition-all hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
    >
      <div className="relative aspect-square w-full bg-muted overflow-hidden">
        <img
          src={imageSrc}
          alt={game.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        {showFavorite && (
          <div className="absolute top-2 right-2 z-10">
            <FavoriteButton
              gameId={game.id}
              gameTitle={game.title}
              isFavorite={game.isFavorite}
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-sm sm:text-base leading-tight line-clamp-1">
            {game.title}
          </h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground whitespace-nowrap shrink-0">
            {game.gameType.name}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 font-normal">
          {game.providerName}
        </p>
      </div>
    </Card>
  );
}
