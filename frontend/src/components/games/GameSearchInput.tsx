interface GameSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function GameSearchInput({ value, onChange }: GameSearchInputProps) {
  return (
    <div className="w-full max-w-md">
      <label htmlFor="game-search" className="sr-only">
        Search games
      </label>
      <input
        id="game-search"
        type="text"
        placeholder="Search games by title or provider..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
}
