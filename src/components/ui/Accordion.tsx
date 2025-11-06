import React, { createContext, useContext, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionContextType {
  openItems: string[];
  toggleItem: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

// Main Accordion Component
interface AccordionProps {
  children: React.ReactNode;
  type?: 'single' | 'multiple';
  defaultOpen?: string[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  children,
  type = 'multiple',
  defaultOpen = [],
  className = ''
}) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (id: string) => {
    if (type === 'single') {
      setOpenItems(openItems.includes(id) ? [] : [id]);
    } else {
      setOpenItems(
        openItems.includes(id)
          ? openItems.filter((item) => item !== id)
          : [...openItems, id]
      );
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={`space-y-2 ${className}`}>{children}</div>
    </AccordionContext.Provider>
  );
};

// Accordion Item
interface AccordionItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  // id,
  children,
  className = ''
}) => {
  return (
    <div className={`border border-[var(--border)] rounded-lg ${className}`}>
      {children}
    </div>
  );
};

// Accordion Header
interface AccordionHeaderProps {
  id: string;
  children: React.ReactNode;
}

export const AccordionHeader: React.FC<AccordionHeaderProps> = ({
  id,
  children
}) => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionHeader must be used within Accordion');

  const { openItems, toggleItem } = context;
  const isOpen = openItems.includes(id);

  return (
    <button
      type="button"
      onClick={() => toggleItem(id)}
      className="w-full flex items-center justify-between p-4 text-right hover:bg-[var(--hover)] transition-colors"
    >
      <span className="font-medium text-[var(--text)]">{children}</span>
      <ChevronDown
        className={`w-5 h-5 text-[var(--muted)] transition-transform ${
          isOpen ? 'rotate-180' : ''
        }`}
      />
    </button>
  );
};

// Accordion Content
interface AccordionContentProps {
  id: string;
  children: React.ReactNode;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({
  id,
  children
}) => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionContent must be used within Accordion');

  const { openItems } = context;
  const isOpen = openItems.includes(id);

  if (!isOpen) return null;

  return (
    <div className="p-4 pt-0 border-t border-[var(--border)]">
      {children}
    </div>
  );
};
