import React from 'react';

interface UiIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'danger';
}

const UiIconButton: React.FC<UiIconButtonProps> = ({
  icon,
  size = 'md',
  variant = 'default',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const variantClasses = {
    default: 'hover:bg-[var(--hover)] text-[var(--text)]',
    ghost: 'hover:bg-[var(--hover)] text-[var(--muted)]',
    danger: 'hover:bg-red-50 text-[var(--danger)]'
  };

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
};

export default UiIconButton;
