import React from 'react';

interface UiCardProps {
  children: React.ReactNode;
  className?: string;
}

const UiCard: React.FC<UiCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export default UiCard;
