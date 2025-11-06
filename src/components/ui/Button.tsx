import React from 'react';
import { Loader2 } from 'lucide-react';

interface UiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const UiButton: React.FC<UiButtonProps> = ({
  variant = 'primary',
  size = 'sm',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantClasses = {
    primary: 'bg-[#1e6f5c] text-white hover:bg-[#1a5f4e] focus:ring-[#1e6f5c]',
    secondary: 'bg-[var(--muted)] text-white hover:opacity-90 focus:ring-[var(--muted)]',
    ghost: 'hover:bg-[var(--hover)] text-[var(--text)] focus:ring-[var(--border)]',
    link: 'text-[var(--primary)] underline-offset-4 hover:underline focus:ring-[var(--primary)]'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-[5px]',
    md: 'px-6 py-3 text-base rounded-[5px]',
    lg: 'px-8 py-4 text-lg rounded-[5px]'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && icon}
      {children}
    </button>
  );
};

export default UiButton;
