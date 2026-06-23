import type { SpinHistoryItem } from '../../api/slots';
import { SYMBOL_EMOJI } from '@/types/constants';

interface SpinHistoryListProps {
  history: SpinHistoryItem[];
}

export function SpinHistoryList({ history }: SpinHistoryListProps) {
  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">No spin history yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Recent Spins
      </h3>
      <div className="space-y-3">
        {history.map((spin) => {
          const net = parseFloat(spin.netAmount);
          return (
            <div
              key={spin.id}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{SYMBOL_EMOJI[spin.reels.reel1]}</span>
                  <span className="text-2xl">{SYMBOL_EMOJI[spin.reels.reel2]}</span>
                  <span className="text-2xl">{SYMBOL_EMOJI[spin.reels.reel3]}</span>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${net >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {net >= 0 ? '+' : ''}${spin.netAmount}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Balance: ${spin.balanceAfter}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
