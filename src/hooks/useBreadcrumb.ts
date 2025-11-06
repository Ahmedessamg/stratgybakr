import { useContext } from 'react';
import { BreadcrumbContext } from '../contexts/BreadcrumbContext';

export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);
  if (context === undefined) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }
  return context;
};

