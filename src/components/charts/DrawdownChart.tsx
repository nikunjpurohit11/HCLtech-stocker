import React from 'react';

interface DrawdownChartProps {
  data: { date: string; drawdown: number }[];
  height?: number;
  maxDrawdownLabel?: string;
  showLabels?: boolean;
}

export const DrawdownChart: React.FC<DrawdownChartProps> = ({
  data,
  height = 160,
  maxDrawdownLabel,
  showLabels = true,
}) => {
  if (!data || data.length === 0) return null;

  const width = 800;
  const paddingLeft = 20;
  const paddingRight = 40;
  const paddingTop = 20;
  const plotWidth = width - paddingLeft - paddingRight;

  const minDD = Math.min(...data.map(d => d.drawdown), -15);
  const maxDD = 0;
  const range = Math.abs(minDD) || 15;

  const getY = (dd: number) => paddingTop + (Math.abs(dd) / range) * (height - paddingTop - 35);
  const getX = (idx: number) => paddingLeft + (idx / (data.length - 1 || 1)) * plotWidth;

  const points = data.map((d, i) => `${getX(i).toFixed(1)},${getY(d.drawdown).toFixed(1)}`);
  const pathD = `M ${points.join(' L ')}`;
  const areaD = `M ${paddingLeft},${paddingTop} L ${points.join(' L ')} L ${paddingLeft + plotWidth},${paddingTop} Z`;

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto block overflow-visible">
        <defs>
          <linearGradient id="underwaterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.30" />
          </linearGradient>
        </defs>

        {/* 0.0% Axis */}
        <line
          x1={paddingLeft}
          y1={paddingTop}
          x2={paddingLeft + plotWidth}
          y2={paddingTop}
          stroke="#454545"
          strokeWidth="1"
        />
        <text
          x={width - 5}
          y={paddingTop + 3}
          fill="#7c7c7c"
          fontSize="10"
          textAnchor="end"
          className="font-mono"
        >
          0.0%
        </text>

        {/* -10% Mid Guide */}
        <line
          x1={paddingLeft}
          y1={getY(-10)}
          x2={paddingLeft + plotWidth}
          y2={getY(-10)}
          stroke="#252525"
          strokeWidth="1"
          strokeDasharray="2,3"
        />
        <text
          x={width - 5}
          y={getY(-10) + 3}
          fill="#7c7c7c"
          fontSize="10"
          textAnchor="end"
          className="font-mono"
        >
          -10%
        </text>

        {/* Area fill & Path */}
        <path d={areaD} fill="url(#underwaterGrad)" />
        <path d={pathD} fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points & X axis date labels */}
        {data.map((d, i) => {
          const x = getX(i);
          const y = getY(d.drawdown);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="3" fill="#f43f5e" />
              {showLabels && (
                <text
                  x={x}
                  y={height - 10}
                  fill="#7c7c7c"
                  fontSize="9"
                  textAnchor="middle"
                  className="font-mono"
                >
                  {d.date.split(' ')[0]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
