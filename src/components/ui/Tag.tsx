import React from 'react';
import { X } from 'lucide-react';

interface UiTagProps {
  children: React.ReactNode;
  onRemove?: () => void;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

const UiTag: React.FC<UiTagProps> = ({
  children,
  onRemove,
  variant = 'default'
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700'
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm ${variantClasses[variant]}`}>
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:opacity-70 transition-opacity"
          aria-label="Remove"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

export default UiTag;
