import { SYMBOL_EMOJI, SYMBOL_NAMES } from "@/types/constants";

interface ReelDisplayProps {
  reels: {  
    reel1: string;
    reel2: string;
    reel3: string;
  };
}

export function ReelDisplay({ reels }: ReelDisplayProps) {
  const symbols = [reels.reel1, reels.reel2, reels.reel3];

  return (
    <div className="flex justify-center gap-4 my-8">
      {symbols.map((symbol, index) => (
        <div
          key={index}
          className="w-24 h-24 bg-white dark:bg-gray-800 border-4 border-indigo-600 dark:border-indigo-400 rounded-lg flex items-center justify-center text-6xl"
          role="img"
          aria-label={SYMBOL_NAMES[symbol] || symbol}
        >
          {SYMBOL_EMOJI[symbol] || symbol}
        </div>
      ))}
    </div>
  );
}
