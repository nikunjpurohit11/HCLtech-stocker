import React from 'react';
import { CorrelationRow } from '../../types';
import { Activity } from 'lucide-react';

interface CorrelationHeatmapProps {
  correlations: CorrelationRow[];
}

export const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({ correlations }) => {
  if (!correlations || correlations.length === 0) return null;

  return (
    <div className="surface-panel rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-[#313131] pb-2">
        <div>
          <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
            Asset Correlation Matrix
          </span>
          <p className="text-[11px] text-[#7c7c7c] mt-0.5">
            Covariance relationship between major portfolio equities.
          </p>
        </div>
        <Activity className="w-4 h-4 text-[#6798ff]" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center text-xs font-mono">
          <thead>
            <tr className="text-[#7c7c7c]">
              <th className="py-2 text-left">Asset</th>
              {correlations.map(c => (
                <th key={c.symbol} className="py-2 px-1 text-[11px]">
                  {c.symbol.slice(0, 4)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {correlations.map(row => (
              <tr key={row.symbol} className="border-t border-[#252525]">
                <td className="py-2 text-left font-semibold text-white">{row.symbol}</td>
                {correlations.map(col => {
                  const val = row.correlations[col.symbol] || 0;
                  let bg = 'bg-[#141414] text-[#7c7c7c]';
                  if (val === 1.0) bg = 'bg-[#6798ff]/30 text-white font-bold';
                  else if (val >= 0.7) bg = 'bg-[#f43f5e]/20 text-[#f43f5e] font-semibold';
                  else if (val >= 0.4) bg = 'bg-[#f59e0b]/15 text-[#f59e0b]';
                  else bg = 'bg-[#10b981]/15 text-[#10b981]';

                  return (
                    <td key={col.symbol} className="p-1">
                      <div className={`py-1 rounded text-[11px] ${bg}`}>
                        {val.toFixed(2)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
