interface SpinButtonProps {
  onSpin: () => void;
  disabled?: boolean;
  isSpinning?: boolean;
}

export function SpinButton({ onSpin, disabled = false, isSpinning = false }: SpinButtonProps) {
  return (
    <button
      type="button"
      onClick={onSpin}
      disabled={disabled || isSpinning}
      className="w-full max-w-xs mx-auto block px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isSpinning ? 'Spinning...' : 'SPIN'}
    </button>
  );
}
