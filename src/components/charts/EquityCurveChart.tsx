import React from 'react';

interface EquityPoint {
  date: string;
  strategy: number;
  benchmark: number;
}

interface EquityCurveChartProps {
  data: EquityPoint[];
  height?: number;
  strategyLabel?: string;
  benchmarkLabel?: string;
}

export const EquityCurveChart: React.FC<EquityCurveChartProps> = ({
  data,
  height = 220,
  strategyLabel = 'Strategy',
  benchmarkLabel = 'Benchmark',
}) => {
  if (!data || data.length === 0) return null;

  const width = 800;
  const paddingLeft = 20;
  const paddingRight = 40;
  const paddingTop = 20;
  const paddingBottom = 35;
  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const min = Math.min(...data.map(d => Math.min(d.strategy, d.benchmark))) * 0.98;
  const max = Math.max(...data.map(d => Math.max(d.strategy, d.benchmark))) * 1.02;
  const range = max - min || 1;

  const getX = (i: number) => paddingLeft + (i / (data.length - 1 || 1)) * plotWidth;
  const getY = (v: number) => paddingTop + (1 - (v - min) / range) * plotHeight;

  const stratPoints = data.map((d, i) => `${getX(i).toFixed(1)},${getY(d.strategy).toFixed(1)}`).join(' L ');
  const benchPoints = data.map((d, i) => `${getX(i).toFixed(1)},${getY(d.benchmark).toFixed(1)}`).join(' L ');
  const areaPath = `M ${stratPoints} L ${getX(data.length - 1)},${paddingTop + plotHeight} L ${getX(0)},${paddingTop + plotHeight} Z`;

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto block overflow-visible">
        <defs>
          <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6798ff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#6798ff" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Benchmark Dashed Curve */}
        <path d={`M ${benchPoints}`} fill="none" stroke="#7c7c7c" strokeWidth="1.5" strokeDasharray="3,3" />

        {/* Strategy Shaded Area & Solid Curve */}
        <path d={areaPath} fill="url(#equityGrad)" />
        <path d={`M ${stratPoints}`} fill="none" stroke="#6798ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* X labels */}
        {data.filter((_, idx) => idx % Math.ceil(data.length / 6) === 0).map((d, i) => (
          <text
            key={i}
            x={getX(data.indexOf(d))}
            y={height - 10}
            fill="#7c7c7c"
            fontSize="9"
            textAnchor="middle"
            className="font-mono"
          >
            {d.date}
          </text>
        ))}
      </svg>
    </div>
  );
};
