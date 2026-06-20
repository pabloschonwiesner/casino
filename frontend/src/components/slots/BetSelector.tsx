interface BetSelectorProps {
  betAmount: number;
  onBetChange: (amount: number) => void;
  disabled?: boolean;
}

const BET_OPTIONS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

export function BetSelector({ betAmount, onBetChange, disabled = false }: BetSelectorProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Select Bet Amount
      </label>
      <div className="flex flex-wrap gap-2">
        {BET_OPTIONS.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => onBetChange(amount)}
            disabled={disabled}
            className={`px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${
              betAmount === amount
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            ${amount.toFixed(2)}
          </button>
        ))}
      </div>
    </div>
  );
}
