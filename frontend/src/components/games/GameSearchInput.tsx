import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface GameSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function GameSearchInput({ value, onChange }: GameSearchInputProps) {
  return (
    <div className="relative w-full max-w-2xl">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        id="game-search"
        type="text"
        placeholder="Search games by title or provider..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 h-10 sm:h-11"
        aria-label="Search games"
      />
    </div>
  );
}
