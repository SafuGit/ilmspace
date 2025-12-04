'use client';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search books..." }: SearchBarProps) {
  return (
    <div className="relative flex-1">
      <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
        search
      </span>
      <input
        className="form-input w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-border bg-card-bg py-2 pl-10 pr-4 text-white placeholder:text-text-muted focus:border-accent-gold focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
        id="search"
        placeholder={placeholder}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
