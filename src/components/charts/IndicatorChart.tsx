import React from 'react';
import { HistoricalBar } from '../../types';

interface IndicatorChartProps {
  bars: HistoricalBar[];
  type: 'RSI' | 'MACD';
  height?: number;
}

export const IndicatorChart: React.FC<IndicatorChartProps> = ({
  bars,
  type,
  height = 130,
}) => {
  if (!bars || bars.length === 0) return null;

  const svgWidth = 900;
  const paddingLeft = 12;
  const paddingRight = 60;
  const paddingTop = 15;
  const paddingBottom = 15;
  const plotWidth = svgWidth - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const getX = (idx: number) => paddingLeft + (idx / (bars.length - 1 || 1)) * plotWidth;

  if (type === 'RSI') {
    const currentRSI = bars[bars.length - 1]?.rsi || 50;
    const getY = (rsi: number) => paddingTop + (1 - rsi / 100) * plotHeight;

    const rsiPoints = bars
      .filter(b => b.rsi !== undefined)
      .map((b, i) => `${getX(i).toFixed(1)},${getY(b.rsi!).toFixed(1)}`)
      .join(' L ');

    return (
      <div className="surface-panel rounded-xl p-3 flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs font-mono text-[#a7a7a7]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">RSI (14)</span>
            <span className="text-[11px] text-[#7c7c7c]">Overbought 70 / Oversold 30</span>
          </div>
          <div className="font-semibold">
            <span className={currentRSI >= 70 ? 'text-[#f43f5e]' : currentRSI <= 30 ? 'text-[#10b981]' : 'text-[#6798ff]'}>
              {currentRSI.toFixed(1)}
            </span>
          </div>
        </div>

        <svg viewBox={`0 0 ${svgWidth} ${height}`} className="w-full h-auto block overflow-visible">
          {/* Overbought 70 line */}
          <line
            x1={paddingLeft}
            y1={getY(70)}
            x2={paddingLeft + plotWidth}
            y2={getY(70)}
            stroke="#f43f5e"
            strokeWidth="1"
            strokeDasharray="3,3"
            opacity="0.4"
          />
          <text x={svgWidth - 5} y={getY(70) + 3} fill="#f43f5e" fontSize="9" textAnchor="end" className="font-mono">70</text>

          {/* Neutral 50 line */}
          <line
            x1={paddingLeft}
            y1={getY(50)}
            x2={paddingLeft + plotWidth}
            y2={getY(50)}
            stroke="#313131"
            strokeWidth="1"
            strokeDasharray="2,3"
          />
          <text x={svgWidth - 5} y={getY(50) + 3} fill="#7c7c7c" fontSize="9" textAnchor="end" className="font-mono">50</text>

          {/* Oversold 30 line */}
          <line
            x1={paddingLeft}
            y1={getY(30)}
            x2={paddingLeft + plotWidth}
            y2={getY(30)}
            stroke="#10b981"
            strokeWidth="1"
            strokeDasharray="3,3"
            opacity="0.4"
          />
          <text x={svgWidth - 5} y={getY(30) + 3} fill="#10b981" fontSize="9" textAnchor="end" className="font-mono">30</text>

          {/* RSI Curve */}
          <path
            d={`M ${rsiPoints}`}
            fill="none"
            stroke="#6798ff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  // MACD Mode
  const macdValues = bars.map(b => b.macd || 0);
  const signalValues = bars.map(b => b.macdSignal || 0);
  const histValues = bars.map(b => b.macdHist || 0);

  const maxVal = Math.max(...macdValues, ...signalValues, ...histValues, 5);
  const minVal = Math.min(...macdValues, ...signalValues, ...histValues, -5);
  const range = Math.max(Math.abs(maxVal), Math.abs(minVal)) * 2 || 10;

  const getY = (val: number) => paddingTop + (plotHeight / 2) - (val / (range / 2)) * (plotHeight / 2);
  const zeroY = paddingTop + plotHeight / 2;

  const macdPath = bars.map((b, i) => `${getX(i).toFixed(1)},${getY(b.macd || 0).toFixed(1)}`).join(' L ');
  const signalPath = bars.map((b, i) => `${getX(i).toFixed(1)},${getY(b.macdSignal || 0).toFixed(1)}`).join(' L ');

  const currentHist = bars[bars.length - 1]?.macdHist || 0;

  return (
    <div className="surface-panel rounded-xl p-3 flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs font-mono text-[#a7a7a7]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">MACD (12, 26, 9)</span>
          <span className="flex items-center gap-1 text-[11px]">
            <span className="w-2 h-0.5 bg-[#6798ff] inline-block" /> MACD
            <span className="w-2 h-0.5 bg-[#f59e0b] inline-block ml-2" /> Signal
          </span>
        </div>
        <div className="font-semibold font-mono">
          <span className={currentHist >= 0 ? 'text-[#10b981]' : 'text-[#f43f5e]'}>
            Hist: {currentHist > 0 ? '+' : ''}{currentHist.toFixed(2)}
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${svgWidth} ${height}`} className="w-full h-auto block overflow-visible">
        {/* Zero Axis */}
        <line
          x1={paddingLeft}
          y1={zeroY}
          x2={paddingLeft + plotWidth}
          y2={zeroY}
          stroke="#313131"
          strokeWidth="1"
        />
        <text x={svgWidth - 5} y={zeroY + 3} fill="#7c7c7c" fontSize="9" textAnchor="end" className="font-mono">0.0</text>

        {/* Histogram Bars */}
        {bars.map((b, i) => {
          const x = getX(i);
          const hist = b.macdHist || 0;
          const barY = getY(hist);
          const isPos = hist >= 0;
          const barHeight = Math.max(1, Math.abs(zeroY - barY));
          const top = isPos ? barY : zeroY;
          const barWidth = Math.max(2, plotWidth / bars.length - 2);

          return (
            <rect
              key={`hist-${i}`}
              x={x - barWidth / 2}
              y={top}
              width={barWidth}
              height={barHeight}
              fill={isPos ? '#10b981' : '#f43f5e'}
              opacity={0.45}
            />
          );
        })}

        {/* MACD Line */}
        <path d={`M ${macdPath}`} fill="none" stroke="#6798ff" strokeWidth="1.5" strokeLinecap="round" />

        {/* Signal Line */}
        <path d={`M ${signalPath}`} fill="none" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
};
