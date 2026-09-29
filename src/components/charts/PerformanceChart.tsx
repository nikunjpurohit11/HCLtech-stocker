import React, { useState } from 'react';
import { TimeFrame } from '../../types';
import { formatINR, formatPercent } from '../../utils/formatters';

interface PerformanceChartProps {
  timeframe?: TimeFrame;
  onTimeframeChange?: (tf: TimeFrame) => void;
  height?: number;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  timeframe = '1Y',
  onTimeframeChange,
  height = 280,
}) => {
  const [internalTf, setInternalTf] = useState<TimeFrame>(timeframe);
  const activeTf = onTimeframeChange ? timeframe : internalTf;
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleTfClick = (tf: TimeFrame) => {
    if (onTimeframeChange) onTimeframeChange(tf);
    else setInternalTf(tf);
  };

  // Generate realistic equity data points based on timeframe
  const getPoints = (tf: TimeFrame) => {
    let count = 40;
    let baseVal = 711610; // 1Y start
    let returnPct = 18.42;

    if (tf === '1D') {
      count = 25;
      baseVal = 830130;
      returnPct = 1.50;
    } else if (tf === '1W') {
      count = 30;
      baseVal = 822400;
      returnPct = 2.45;
    } else if (tf === '1M') {
      count = 30;
      baseVal = 808900;
      returnPct = 4.16;
    } else if (tf === '6M') {
      count = 45;
      baseVal = 758000;
      returnPct = 11.15;
    } else if (tf === '5Y') {
      count = 60;
      baseVal = 380000;
      returnPct = 121.72;
    }

    const points: { label: string; portfolio: number; benchmark: number }[] = [];
    const now = Date.now();
    const intervalMs = (tf === '1D' ? 15 * 60 * 1000 : 24 * 60 * 60 * 1000 * 5);

    for (let i = 0; i < count; i++) {
      const t = now - (count - 1 - i) * intervalMs;
      const d = new Date(t);
      const label = tf === '1D' 
        ? d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        : d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

      const progress = i / (count - 1);
      const curve = Math.sin(progress * Math.PI * 1.5) * 0.4 + progress * 0.6;
      const noise = Math.sin(i * 1.2) * (baseVal * 0.012);

      const portVal = Math.round(baseVal + (842560 - baseVal) * curve + noise);
      const benchVal = Math.round(baseVal * (1 + (returnPct * 0.75 * progress) / 100) + noise * 0.8);

      points.push({
        label,
        portfolio: i === count - 1 ? 842560 : portVal,
        benchmark: benchVal,
      });
    }

    return points;
  };

  const data = getPoints(activeTf);
  const activePoint = hoverIndex !== null && data[hoverIndex] ? data[hoverIndex] : data[data.length - 1];

  const svgWidth = 800;
  const paddingLeft = 10;
  const paddingRight = 75;
  const paddingTop = 20;
  const paddingBottom = 25;
  const plotWidth = svgWidth - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const minVal = Math.min(...data.map(d => Math.min(d.portfolio, d.benchmark))) * 0.98;
  const maxVal = Math.max(...data.map(d => Math.max(d.portfolio, d.benchmark))) * 1.02;
  const range = maxVal - minVal || 1;

  const getX = (idx: number) => paddingLeft + (idx / (data.length - 1 || 1)) * plotWidth;
  const getY = (val: number) => paddingTop + (1 - (val - minVal) / range) * plotHeight;

  const portPoints = data.map((d, i) => `${getX(i).toFixed(1)},${getY(d.portfolio).toFixed(1)}`).join(' L ');
  const benchPoints = data.map((d, i) => `${getX(i).toFixed(1)},${getY(d.benchmark).toFixed(1)}`).join(' L ');
  const areaPath = `M ${portPoints} L ${getX(data.length - 1)},${paddingTop + plotHeight} L ${getX(0)},${paddingTop + plotHeight} Z`;

  const timeframes: TimeFrame[] = ['1D', '1W', '1M', '6M', '1Y', '5Y'];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left) / rect.width) * svgWidth;
    const boundedX = Math.max(paddingLeft, Math.min(paddingLeft + plotWidth, relativeX));
    const idx = Math.round(((boundedX - paddingLeft) / plotWidth) * (data.length - 1));
    setHoverIndex(idx >= 0 && idx < data.length ? idx : null);
  };

  return (
    <div className="surface-panel rounded-xl p-5 flex flex-col gap-3">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#313131] pb-3">
        <div>
          <div className="text-xs font-medium text-[#a7a7a7] uppercase tracking-wider">
            Portfolio Performance
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-bold font-mono text-white">
              {formatINR(activePoint.portfolio)}
            </span>
            <span className="text-xs font-mono text-[#10b981] font-medium">
              +{formatPercent(((activePoint.portfolio - 711610) / 711610) * 100, false)}
            </span>
            <span className="text-[11px] text-[#7c7c7c] font-mono ml-2">
              {activePoint.label}
            </span>
          </div>
        </div>

        {/* Timeframe pill tabs */}
        <div className="flex items-center gap-1 bg-[#141414] border border-[#313131] rounded-lg p-0.5">
          {timeframes.map(tf => (
            <button
              key={tf}
              onClick={() => handleTfClick(tf)}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded transition-colors cursor-pointer ${
                activeTf === tf
                  ? 'bg-[#1e1e1e] text-[#6798ff] border border-[#454545]'
                  : 'text-[#a7a7a7] hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Performance Chart */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${height}`}
          className="w-full h-auto block overflow-visible cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6798ff" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#6798ff" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.33, 0.66, 1].map((ratio, idx) => {
            const val = minVal + range * ratio;
            const y = getY(val);
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={paddingLeft + plotWidth}
                  y2={y}
                  stroke="#252525"
                  strokeWidth="1"
                  strokeDasharray="2,3"
                />
                <text
                  x={svgWidth - 5}
                  y={y + 3.5}
                  fill="#7c7c7c"
                  fontSize="10"
                  textAnchor="end"
                  className="font-mono tabular-nums"
                >
                  ₹{(val / 1000).toFixed(0)}k
                </text>
              </g>
            );
          })}

          {/* Benchmark line (NIFTY 50) */}
          <path
            d={`M ${benchPoints}`}
            fill="none"
            stroke="#7c7c7c"
            strokeWidth="1.2"
            strokeDasharray="4,4"
            opacity="0.7"
          />

          {/* Portfolio Area & Line */}
          <path d={areaPath} fill="url(#perfGrad)" />
          <path
            d={`M ${portPoints}`}
            fill="none"
            stroke="#6798ff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Crosshair */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={paddingTop}
                x2={getX(hoverIndex)}
                y2={paddingTop + plotHeight}
                stroke="#6798ff"
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.8"
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getY(activePoint.portfolio)}
                r="4.5"
                fill="#6798ff"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Legend footer */}
      <div className="flex items-center justify-between text-xs font-mono text-[#a7a7a7] pt-2 border-t border-[#313131]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#6798ff] inline-block" />
            <span>Portfolio</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#7c7c7c] inline-block border-b border-dashed border-[#7c7c7c]" />
            <span>Benchmark (Nifty 50)</span>
          </span>
        </div>
        <span className="text-[11px] text-[#7c7c7c]">Outperforming benchmark by +4.8%</span>
      </div>
    </div>
  );
};
