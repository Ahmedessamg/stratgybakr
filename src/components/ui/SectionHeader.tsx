import React from 'react';

interface UiSectionHeaderProps {
  title: string;
  caption?: string;
  action?: React.ReactNode;
}

const UiSectionHeader: React.FC<UiSectionHeaderProps> = ({
  title,
  caption,
  action
}) => {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
        {caption && (
          <p className="text-sm text-[var(--muted)] mt-1">{caption}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default UiSectionHeader;
