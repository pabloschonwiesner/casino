interface SpinResultProps {
  amount: string;
  balanceAfter: string;
}

export function SpinResult({ amount, balanceAfter }: SpinResultProps) {
  const netAmount = parseFloat(amount);
  const isWin = netAmount > 0;

  return (
    <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="text-center mb-4">
        {isWin ? (
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            🎉 You Won ${amount}!
          </p>
        ) : (
          <p className="text-xl font-medium text-gray-600 dark:text-gray-400">
            Better luck next time!
          </p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600 dark:text-gray-400">Net Amount:</p>
          <p className={`font-bold ${netAmount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {netAmount >= 0 ? '+' : ''}${amount}
          </p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">New Balance:</p>
          <p className="font-bold text-gray-900 dark:text-white">${balanceAfter}</p>
        </div>
      </div>
    </div>
  );
}
