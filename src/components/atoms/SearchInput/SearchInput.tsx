interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onEnter?: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export default function SearchInput({
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  onEnter,
  isLoading,
  disabled
}: SearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnter) {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
        disabled={disabled}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
        ) : (
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        )}
      </div>
    </div>
  );
}