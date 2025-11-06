import { createContext, ReactNode } from 'react';
import type { IBreadcrumbItem } from '../components/ui/Breadcrumb';

export interface BreadcrumbContextType {
  items: IBreadcrumbItem[];
  currentPage: string;
  headerAction?: ReactNode;
  setBreadcrumb: (items: IBreadcrumbItem[], currentPage: string, headerAction?: ReactNode) => void;
}

export const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

