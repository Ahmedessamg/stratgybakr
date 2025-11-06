import React from 'react';

interface TableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps {
  columns: TableColumn[];
  children: React.ReactNode;
}

export const Table = ({ columns, children }: TableProps) => {
  const gridCols = `grid-cols-${columns.length}`;
  
  return (
    <div>
      {/* Table Header */}
      <div className={`grid ${gridCols} gap-4 p-3 bg-gray-50 border border-[var(--border)] rounded-t-lg`}>
        {columns.map((column) => (
          <div 
            key={column.key}
            className={`text-sm font-medium text-[var(--text)] ${
              column.align === 'left' ? 'text-left' :
              column.align === 'center' ? 'text-center' :
              column.align === 'right' ? 'text-right' : ''
            }`}
          >
            {column.label}
          </div>
        ))}
      </div>
      
      {/* Table Body */}
      <div className="border border-t-0 border-[var(--border)] rounded-b-lg">
        {children}
      </div>
    </div>
  );
};

interface TableRowProps {
  children: React.ReactNode;
  isLast?: boolean;
}

export const TableRow = ({ children, isLast = false }: TableRowProps) => {
  return (
    <div 
      className={`grid grid-cols-2 gap-4 p-3 bg-[var(--card)] hover:bg-[var(--hover)] transition-colors ${
        !isLast ? 'border-b border-[var(--border)]' : ''
      }`}
    >
      {children}
    </div>
  );
};

interface TableCellProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export const TableCell = ({ children, align = 'left' }: TableCellProps) => {
  return (
    <div className={`flex items-center ${
      align === 'left' ? 'justify-start' :
      align === 'center' ? 'justify-center' :
      align === 'right' ? 'justify-end' : ''
    }`}>
      {children}
    </div>
  );
};
