import React from 'react';

interface RiskContributionItem {
  symbol: string;
  riskPct: number;
  allocationPct: number;
}

interface RiskContributionListProps {
  contributions: RiskContributionItem[];
}

export const RiskContributionList: React.FC<RiskContributionListProps> = ({ contributions }) => {
  return (
    <div className="surface-panel rounded-xl p-5 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between border-b border-[#313131] pb-2 mb-4">
          <div>
            <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Risk Contribution vs Allocation
            </span>
            <p className="text-[11px] text-[#7c7c7c] mt-0.5">
              Percentage of total portfolio volatility driven by each constituent.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {contributions.map(rc => (
            <div key={rc.symbol} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-white">{rc.symbol}</span>
                <span className="text-[#a7a7a7]">
                  Risk: <strong className="text-[#f59e0b]">{rc.riskPct}%</strong> / Alloc: {rc.allocationPct}%
                </span>
              </div>
              <div className="w-full bg-[#141414] h-2 rounded-full overflow-hidden flex">
                <div
                  className="bg-[#6798ff] h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, rc.riskPct * 2.5)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#313131] text-[11px] text-[#7c7c7c] leading-relaxed font-mono">
        * Assets with marginal risk contributions exceeding their portfolio allocation weights drive systematic portfolio variance.
      </div>
    </div>
  );
};
