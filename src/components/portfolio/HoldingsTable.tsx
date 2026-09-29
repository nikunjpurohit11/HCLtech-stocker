import React from 'react';
import { Holding } from '../../types';
import { formatINR, formatPercent } from '../../utils/formatters';

interface HoldingsTableProps {
  holdings: Holding[];
  onSelectStock: (symbol: string) => void;
  onTradeStock?: (symbol: string) => void;
}

export const HoldingsTable: React.FC<HoldingsTableProps> = ({
  holdings,
  onSelectStock,
  onTradeStock,
}) => {
  return (
    <div className="surface-panel rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-[#141414] border-b border-[#313131] text-[#a7a7a7] uppercase tracking-wider text-[11px] font-medium">
            <tr>
              <th className="py-3 px-4">Asset / Sector</th>
              <th className="py-3 px-4 text-right">Quantity</th>
              <th className="py-3 px-4 text-right">Avg Buy Price</th>
              <th className="py-3 px-4 text-right">Current Price</th>
              <th className="py-3 px-4 text-right">Invested</th>
              <th className="py-3 px-4 text-right">Market Value</th>
              <th className="py-3 px-4 text-right">Unrealized P&L</th>
              <th className="py-3 px-4 text-right">Weight</th>
              {onTradeStock && <th className="py-3 px-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#252525]">
            {holdings.map(h => {
              const isPos = h.unrealizedPnL >= 0;

              return (
                <tr
                  key={h.symbol}
                  className="hover:bg-[#252525]/40 transition-colors cursor-pointer group"
                  onClick={() => onSelectStock(h.symbol)}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: h.allocationColor }}
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-white font-mono group-hover:text-[#6798ff] transition-colors">
                          {h.symbol}
                        </span>
                        <span className="text-[11px] text-[#7c7c7c] truncate max-w-[150px]">
                          {h.companyName}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-white">
                    {h.quantity}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-[#a7a7a7]">
                    {formatINR(h.averagePrice)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-white font-medium">
                    {formatINR(h.currentPrice)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-[#a7a7a7]">
                    {formatINR(h.investedValue)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-white font-medium">
                    {formatINR(h.currentValue)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                    <div
                      className={`font-semibold ${
                        isPos ? 'text-[#10b981]' : 'text-[#f43f5e]'
                      }`}
                    >
                      {isPos ? '+' : ''}
                      {formatINR(h.unrealizedPnL)}
                    </div>
                    <div className="text-[10px] text-[#7c7c7c]">
                      {formatPercent(h.unrealizedPnLPercent, true)}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-white">
                    {h.portfolioWeight}%
                  </td>
                  {onTradeStock && (
                    <td
                      className="py-3.5 px-4 text-right"
                      onClick={e => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onTradeStock(h.symbol)}
                        className="px-2.5 py-1 text-[11px] font-medium bg-[#141414] hover:bg-[#6798ff] hover:text-white text-[#a7a7a7] border border-[#313131] hover:border-[#6798ff] rounded transition-all cursor-pointer"
                      >
                        Trade
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
