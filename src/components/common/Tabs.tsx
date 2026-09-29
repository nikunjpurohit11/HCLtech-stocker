import React from 'react';

interface TabItem<T extends string> {
  id: T;
  label: string;
  badge?: string | number;
}

interface TabsProps<T extends string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (id: T) => void;
  size?: 'sm' | 'md';
}

export function Tabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  size = 'sm',
}: TabsProps<T>) {
  return (
    <div className="inline-flex items-center p-0.5 bg-[#141414] border border-[#313131] rounded-lg">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            type="button"
            className={`cursor-pointer transition-all duration-150 font-medium whitespace-nowrap rounded-md flex items-center gap-1.5 ${
              size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'
            } ${
              isActive
                ? 'bg-[#1e1e1e] text-[#6798ff] border border-[#454545] shadow-xs'
                : 'text-[#a7a7a7] hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="text-[10px] px-1.5 py-0.2 bg-[#313131] rounded-full text-[#a7a7a7]">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
