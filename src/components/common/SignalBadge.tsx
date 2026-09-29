import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { SignalType } from '../../types';

interface SignalBadgeProps {
  signal: SignalType;
  confidence?: number;
  compact?: boolean;
}

export const SignalBadge: React.FC<SignalBadgeProps> = ({
  signal,
  confidence,
  compact = false,
}) => {
  if (signal === 'BULLISH') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20">
        <ArrowUpRight className="w-3.5 h-3.5" />
        <span>Bullish</span>
        {confidence !== undefined && !compact && (
          <span className="text-[10px] opacity-75 font-mono">({confidence}%)</span>
        )}
      </span>
    );
  }

  if (signal === 'BEARISH') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/20">
        <ArrowDownRight className="w-3.5 h-3.5" />
        <span>Bearish</span>
        {confidence !== undefined && !compact && (
          <span className="text-[10px] opacity-75 font-mono">({confidence}%)</span>
        )}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-[#7c7c7c]/10 text-[#a7a7a7] border border-[#313131]">
      <Minus className="w-3.5 h-3.5" />
      <span>Neutral</span>
      {confidence !== undefined && !compact && (
        <span className="text-[10px] opacity-75 font-mono">({confidence}%)</span>
      )}
    </span>
  );
};
