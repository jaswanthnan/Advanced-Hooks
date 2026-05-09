import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface FilterContextType {
  filters: Record<string, string[]>;
  toggleFilter: (group: string, value: string) => void;
  clearGroup: (group: string) => void;
  clearAll: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

function useFilters() {
  const context = useContext(FilterContext);
  if (!context) throw new Error('FilterPanel components must be used within <FilterPanel>');
  return context;
}

interface FilterPanelProps {
  children: ReactNode;
  onChange?: (filters: Record<string, string[]>) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> & {
  Group: React.FC<{ name: string; title: string; children: ReactNode }>;
  Item: React.FC<{ group: string; value: string; children: ReactNode }>;
  ClearButton: React.FC<{ group?: string; children: ReactNode }>;
} = ({ children, onChange }) => {
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  useEffect(() => {
    console.log('%c[FilterPanel]%c Active Filters:', 'color: #10b981; font-weight: bold', 'color: inherit', filters);
    if (onChange) onChange(filters);
  }, [filters, onChange]);

  const toggleFilter = (group: string, value: string) => {
    setFilters(prev => {
      const currentGroup = prev[group] || [];
      const newGroup = currentGroup.includes(value)
        ? currentGroup.filter(v => v !== value)
        : [...currentGroup, value];
      return { ...prev, [group]: newGroup };
    });
  };

  const clearGroup = (group: string) => {
    setFilters(prev => {
      const { [group]: _, ...rest } = prev;
      return rest;
    });
  };

  const clearAll = () => setFilters({});

  return (
    <FilterContext.Provider value={{ filters, toggleFilter, clearGroup, clearAll }}>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-800">Filters</h3>
          <button 
            onClick={clearAll}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Clear All
          </button>
        </div>
        {children}
      </div>
    </FilterContext.Provider>
  );
};

const Group: React.FC<{ name: string; title: string; children: ReactNode }> = ({ name, title, children }) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  );
};

const Item: React.FC<{ group: string; value: string; children: ReactNode }> = ({ group, value, children }) => {
  const { filters, toggleFilter } = useFilters();
  const isActive = filters[group]?.includes(value);

  return (
    <button
      onClick={() => toggleFilter(group, value)}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
        isActive
          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
          : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600'
      }`}
    >
      {children}
    </button>
  );
};

const ClearButton: React.FC<{ group?: string; children: ReactNode }> = ({ group, children }) => {
  const { clearGroup, clearAll } = useFilters();
  return (
    <button 
      onClick={() => group ? clearGroup(group) : clearAll()}
      className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
    >
      {children}
    </button>
  );
};

FilterPanel.Group = Group;
FilterPanel.Item = Item;
FilterPanel.ClearButton = ClearButton;
