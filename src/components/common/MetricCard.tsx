import React from 'react';
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  subtext?: string;
  tooltip?: string;
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  isPositive,
  subtext,
  tooltip,
  icon,
}) => {
  return (
    <div className="surface-panel rounded-xl p-4 flex flex-col justify-between hover:border-[#454545] transition-colors relative group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-[#a7a7a7] uppercase tracking-wider">
            {label}
          </span>
          {tooltip && (
            <div className="relative cursor-help text-[#7c7c7c] hover:text-[#a7a7a7]">
              <Info className="w-3.5 h-3.5" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block w-48 p-2 text-[11px] bg-[#141414] border border-[#313131] rounded shadow-xl text-[#a7a7a7] z-30 pointer-events-none">
                {tooltip}
              </div>
            </div>
          )}
        </div>
        {icon && <div className="text-[#6798ff] opacity-80">{icon}</div>}
      </div>

      <div className="flex items-baseline justify-between gap-2 mt-1">
        <div className="text-2xl font-semibold tracking-tight text-white font-mono tabular-nums">
          {value}
        </div>
        {change && (
          <div
            className={`flex items-center text-xs font-mono font-medium ${
              isPositive === true
                ? 'text-[#10b981]'
                : isPositive === false
                ? 'text-[#f43f5e]'
                : 'text-[#a7a7a7]'
            }`}
          >
            {isPositive === true && <ArrowUpRight className="w-3.5 h-3.5 inline mr-0.5" />}
            {isPositive === false && <ArrowDownRight className="w-3.5 h-3.5 inline mr-0.5" />}
            <span>{change}</span>
          </div>
        )}
      </div>

      {subtext && (
        <div className="mt-2 text-[11px] text-[#7c7c7c] font-mono truncate">
          {subtext}
        </div>
      )}
    </div>
  );
};
