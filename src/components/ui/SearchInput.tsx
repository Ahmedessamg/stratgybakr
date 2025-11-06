import React from 'react';
import { Search } from 'lucide-react';

interface UiSearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

const UiSearchInput: React.FC<UiSearchInputProps> = ({
  placeholder = 'بحث...',
  onSearch,
  className = '',
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
      <input
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
        className="w-full pr-10 pl-3 py-2 bg-[var(--input-bg)] border border-[var(--border)] rounded-md text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
        {...props}
      />
    </div>
  );
};

export default UiSearchInput;
