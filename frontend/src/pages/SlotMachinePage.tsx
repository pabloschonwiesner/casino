import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamesApi } from '../api/games';
import { slotsApi } from '../api/slots';
import type { SpinResponse } from '../api/slots';
import { useAuth } from '../contexts/AuthContext';
import { ReelDisplay } from '../components/slots/ReelDisplay';
import { BetSelector } from '../components/slots/BetSelector';
import { SpinButton } from '../components/slots/SpinButton';
import { SpinResult } from '../components/slots/SpinResult';
import { SpinHistoryList } from '../components/slots/SpinHistoryList';

export default function SlotMachinePage() {
  const { gameSlug } = useParams<{ gameSlug: string }>();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [betAmount, setBetAmount] = useState(1);
  const [lastSpin, setLastSpin] = useState<SpinResponse | null>(null);
  const [reels, setReels] = useState({
    reel1: 'lemon',
    reel2: 'lemon',
    reel3: 'lemon',
  });

  const { data: game, isLoading: gameLoading, error: gameError } = useQuery({
    queryKey: ['game', gameSlug],
    queryFn: () => gamesApi.getGame(gameSlug!),
    enabled: !!gameSlug,
  });

  const { data: history = [] } = useQuery({
    queryKey: ['slots-history'],
    queryFn: () => slotsApi.getHistory(10),
  });

  const spinMutation = useMutation({
    mutationFn: (request: { gameId: string; betAmount: number }) =>
      slotsApi.spin(request),
    onSuccess: (data) => {
      setLastSpin(data);
      setReels(data.reels);
      refreshUser();
      queryClient.invalidateQueries({ queryKey: ['slots-history'] });
    },
  });

  useEffect(() => {
    if (gameError) {
      navigate('/games');
    }
  }, [gameError, navigate]);

  const handleSpin = () => {
    if (!game) return;
    spinMutation.mutate({ gameId: game.id, betAmount });
  };

  if (gameLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600 dark:text-gray-400">Loading game...</p>
      </div>
    );
  }

  if (!game) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {game.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Provider: {game.providerName}
        </p>
        {user && (
          <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mt-2">
            Balance: ${user.balance}
          </p>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
        <ReelDisplay reels={reels} />

        <BetSelector
          betAmount={betAmount}
          onBetChange={setBetAmount}
          disabled={spinMutation.isPending}
        />

        <SpinButton
          onSpin={handleSpin}
          disabled={spinMutation.isPending}
          isSpinning={spinMutation.isPending}
        />

        {spinMutation.isError && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
            <p className="text-sm text-red-800 dark:text-red-200">
              {(spinMutation.error as any)?.response?.data?.message || 'Spin failed. Please try again.'}
            </p>
          </div>
        )}

        {lastSpin && (
          <SpinResult
            amount={lastSpin.amount}
            balanceAfter={lastSpin.balanceAfter}
          />
        )}
      </div>

      <SpinHistoryList history={history} />
    </div>
  );
}
