import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import './Breadcrumb.scss';

export interface IBreadcrumbItem {
  label: string | React.ReactNode;
  url?: string;
}

interface BreadcrumbProps {
  items: IBreadcrumbItem[];
  currentPage: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, currentPage }) => {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb__list">
        {items.map((item, index) => (
          <li key={index} className="breadcrumb__item">
            {item.url ? (
              <Link to={item.url} className="breadcrumb__link">
                {item.label}
              </Link>
            ) : (
              <span className="breadcrumb__text">{item.label}</span>
            )}
            <ChevronLeft className="breadcrumb__separator" />
          </li>
        ))}
        <li className="breadcrumb__item breadcrumb__item--current">
          <span className="breadcrumb__current">{currentPage}</span>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;

