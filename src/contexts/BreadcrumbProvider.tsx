import React, { useState, useCallback, ReactNode } from 'react';
import { BreadcrumbContext } from './BreadcrumbContext';
import type { IBreadcrumbItem } from '../components/ui/Breadcrumb';

export const BreadcrumbProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<IBreadcrumbItem[]>([]);
  const [currentPage, setCurrentPage] = useState<string>('');
  const [headerAction, setHeaderAction] = useState<ReactNode>(null);

  const setBreadcrumb = useCallback((newItems: IBreadcrumbItem[], newCurrentPage: string, newHeaderAction?: ReactNode) => {
    setItems(newItems);
    setCurrentPage(newCurrentPage);
    setHeaderAction(newHeaderAction || null);
  }, []);

  return (
    <BreadcrumbContext.Provider value={{ items, currentPage, headerAction, setBreadcrumb }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

