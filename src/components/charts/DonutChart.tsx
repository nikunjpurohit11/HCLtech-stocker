import React, { useState } from 'react';
import { formatINR } from '../../utils/formatters';

interface DonutSlice {
  sector: string;
  value: number;
  percentage: number;
  color: string;
}

interface DonutChartProps {
  slices: DonutSlice[];
  totalValue: number;
  height?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  slices,
  totalValue,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  const activeSlice = hoveredIdx !== null ? slices[hoveredIdx] : null;

  return (
    <div className="surface-panel rounded-xl p-5 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between border-b border-[#313131] pb-3 mb-4">
        <span className="text-xs font-medium text-[#a7a7a7] uppercase tracking-wider">
          Portfolio Allocation
        </span>
        <span className="text-xs text-[#7c7c7c] font-mono">{slices.length} Sectors</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 justify-around my-auto">
        {/* SVG Donut */}
        <div className="relative shrink-0 w-[180px] h-[180px] flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background ring */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#141414"
              strokeWidth={strokeWidth}
            />

            {/* Slices */}
            {slices.map((slice, i) => {
              const strokeDasharray = `${(slice.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((cumulativePercent / 100) * circumference);
              cumulativePercent += slice.percentage;

              const isHovered = hoveredIdx === i;

              return (
                <circle
                  key={slice.sector}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-150 cursor-pointer"
                  onMouseEnter={() => setHoverIdxSafe(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-2">
            {activeSlice ? (
              <>
                <span className="text-[11px] text-[#a7a7a7] truncate max-w-[110px]">
                  {activeSlice.sector}
                </span>
                <span className="text-base font-bold font-mono text-white">
                  {activeSlice.percentage}%
                </span>
                <span className="text-[10px] text-[#7c7c7c] font-mono">
                  {formatINR(activeSlice.value, { compact: true })}
                </span>
              </>
            ) : (
              <>
                <span className="text-[10px] text-[#7c7c7c] uppercase font-mono">Invested</span>
                <span className="text-sm font-bold font-mono text-white">
                  {formatINR(totalValue, { compact: true })}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Legend List */}
        <div className="flex flex-col gap-2 w-full sm:max-w-[190px]">
          {slices.map((slice, idx) => (
            <div
              key={slice.sector}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`flex items-center justify-between p-1.5 rounded transition-colors cursor-pointer text-xs ${
                hoveredIdx === idx ? 'bg-[#252525]' : 'hover:bg-[#141414]'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-xs shrink-0"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-[#a7a7a7] truncate text-[11px]">{slice.sector}</span>
              </div>
              <span className="font-mono text-white text-[11px] font-medium ml-2">
                {slice.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  function setHoverIdxSafe(idx: number) {
    setHoveredIdx(idx);
  }
};
