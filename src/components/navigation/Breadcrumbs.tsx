import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate?: (path: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs font-mono text-[#7c7c7c] select-none">
      <button
        onClick={() => onNavigate && onNavigate('/dashboard')}
        className="hover:text-white transition-colors cursor-pointer flex items-center"
      >
        <Home className="w-3.5 h-3.5" />
      </button>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 text-[#454545] shrink-0" />
          {item.path && onNavigate ? (
            <button
              onClick={() => onNavigate(item.path!)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-white font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
