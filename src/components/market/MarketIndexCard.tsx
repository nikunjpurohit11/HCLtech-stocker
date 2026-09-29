import React from 'react';
import { MarketIndex } from '../../types';
import { Sparkline } from '../charts/Sparkline';
import { formatNumber, formatPercent } from '../../utils/formatters';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MarketIndexCardProps {
  index: MarketIndex;
  onClick?: () => void;
}

export const MarketIndexCard: React.FC<MarketIndexCardProps> = ({ index, onClick }) => {
  const isPositive = index.change >= 0;

  return (
    <div
      onClick={onClick}
      className="surface-panel rounded-xl p-4 flex flex-col justify-between hover:border-[#454545] transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-white tracking-wide group-hover:text-[#6798ff] transition-colors">
          {index.symbol}
        </span>
        <div
          className={`flex items-center text-xs font-mono font-medium ${
            isPositive ? 'text-[#10b981]' : 'text-[#f43f5e]'
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
          )}
          <span>{formatPercent(index.changePercent, true)}</span>
        </div>
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <div className="text-xl font-bold font-mono text-white tracking-tight">
          {formatNumber(index.value, { decimals: 2 })}
        </div>
        <div className="shrink-0 ml-2">
          <Sparkline data={index.sparkline} isPositive={isPositive} width={76} height={24} />
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-[#7c7c7c] mt-2 pt-2 border-t border-[#252525]">
        <span>H: {formatNumber(index.high, { decimals: 1 })}</span>
        <span>L: {formatNumber(index.low, { decimals: 1 })}</span>
      </div>
    </div>
  );
};
