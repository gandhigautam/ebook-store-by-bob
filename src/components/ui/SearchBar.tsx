import { type InputHTMLAttributes } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';

interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  className?: string;
}

export default function SearchBar({ value, onChange, onClear, className = '', ...props }: SearchBarProps) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <SearchIcon size={15} className="absolute left-3 text-neutral-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-neutral-800 border border-neutral-600 rounded text-sm text-white placeholder-neutral-400 pl-9 pr-8 py-2 focus:outline-none focus:border-blue-500 transition-colors"
        {...props}
      />
      {value && (
        <button
          onClick={() => { onChange(''); onClear?.(); }}
          className="absolute right-3 text-neutral-400 hover:text-white transition-colors"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
