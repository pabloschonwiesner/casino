interface BetSelectorProps {
  betAmount: number;
  onBetChange: (amount: number) => void;
  disabled?: boolean;
}

const BET_OPTIONS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
const BET_SELECTOR_ID = 'bet-amount';

export function BetSelector({ betAmount, onBetChange, disabled = false }: BetSelectorProps) {
  return (
    <div className="w-full">
      <label
        htmlFor={BET_SELECTOR_ID}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        Select Bet Amount
      </label>
      <select
        id={BET_SELECTOR_ID}
        value={betAmount}
        onChange={(event) => onBetChange(Number(event.target.value))}
        disabled={disabled}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      >
        {BET_OPTIONS.map((amount) => (
          <option key={amount} value={amount}>
            ${amount.toFixed(2)}
          </option>
        ))}
      </select>
    </div>
  );
}
