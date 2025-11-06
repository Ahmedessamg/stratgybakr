import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import './CardContent.scss';

interface CardContentProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  alwaysOpen?: boolean;
  hideToggle?: boolean;
}

const CardContent = ({
  title,
  subtitle,
  icon,
  children,
  defaultOpen = true,
  className = '',
  alwaysOpen = false,
  hideToggle = false
}: CardContentProps) => {
  const [isOpen, setIsOpen] = useState(alwaysOpen || defaultOpen);

  return (
    <div className={`card-content ${className}`}>
      {/* Header */}
      <div 
        className="card-content__header"
        onClick={alwaysOpen ? undefined : () => setIsOpen(!isOpen)}
        style={{ cursor: alwaysOpen ? 'default' : 'pointer' }}
      >
       
        
        <div className="card-content__header-right">
          {icon && <div className="card-content__icon">{icon}</div>}
          <div className="card-content__text">
            <h3 className="card-content__title">{title}</h3>
            {subtitle && <p className="card-content__subtitle">{subtitle}</p>}
          </div>
              </div>
              {!hideToggle && (
                <div className="card-content__header-left">
                    <button className="card-content__toggle">
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                </div>
              )}
      </div>

      {/* Content */}
      {isOpen && (
        <div className="card-content__body">
          {children}
        </div>
      )}
    </div>
  );
};

export default CardContent;
