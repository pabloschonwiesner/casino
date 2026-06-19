import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { gamesApi } from '../api/games';
import type { Game } from '../api/games';
import { useAuth } from '../contexts/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import { GameGrid } from '../components/games/GameGrid';
import { GameSearchInput } from '../components/games/GameSearchInput';
import { GamePagination } from '../components/games/GamePagination';

export default function GamesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 500);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['games', debouncedSearch, currentPage],
    queryFn: () =>
      gamesApi.getGames({
        q: debouncedSearch || undefined,
        page: currentPage,
        limit: 20,
      }),
  });

  const handleGameClick = (game: Game) => {
    if (user) {
      navigate(`/slot-machine/${game.slug}`);
    } else {
      navigate(`/login?redirectTo=/slot-machine/${game.slug}`);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Games Catalog
        </h2>
        <GameSearchInput value={searchQuery} onChange={handleSearchChange} />
      </div>

      {isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Loading games...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">
            Failed to load games. Please try again later.
          </p>
        </div>
      )}

      {data && (
        <>
          <GameGrid
            games={data.data}
            onGameClick={handleGameClick}
            showFavorite={!!user}
          />
          <div className="mt-8">
            <GamePagination
              currentPage={currentPage}
              totalPages={data.meta.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
