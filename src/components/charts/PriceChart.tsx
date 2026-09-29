import React, { useState, useRef } from 'react';
import { HistoricalBar, TimeFrame } from '../../types';
import { formatINR, formatVolume } from '../../utils/formatters';

interface PriceChartProps {
  bars: HistoricalBar[];
  timeframe: TimeFrame;
  onTimeframeChange: (tf: TimeFrame) => void;
  height?: number;
}

export const PriceChart: React.FC<PriceChartProps> = ({
  bars,
  timeframe,
  onTimeframeChange,
  height = 420,
}) => {
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');
  const [showSMA20, setShowSMA20] = useState(true);
  const [showSMA50, setShowSMA50] = useState(false);
  const [showSMA200, setShowSMA200] = useState(false);
  const [showBollinger, setShowBollinger] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  if (!bars || bars.length === 0) {
    return (
      <div className="surface-panel rounded-xl p-8 text-center text-[#7c7c7c]">
        No historical price data available.
      </div>
    );
  }

  const activeBar = hoverIndex !== null && bars[hoverIndex] ? bars[hoverIndex] : bars[bars.length - 1];

  // SVG Geometry Calculations
  const svgWidth = 900;
  const priceHeight = height * 0.76;
  const volumeHeight = height * 0.20;
  const paddingLeft = 12;
  const paddingRight = 60;
  const paddingTop = 20;
  const plotWidth = svgWidth - paddingLeft - paddingRight;

  const minPrice = Math.min(...bars.map(b => (showBollinger && b.bbLower ? Math.min(b.low, b.bbLower) : b.low)));
  const maxPrice = Math.max(...bars.map(b => (showBollinger && b.bbUpper ? Math.max(b.high, b.bbUpper) : b.high)));
  const priceRange = maxPrice - minPrice || 1;

  const maxVolume = Math.max(...bars.map(b => b.volume)) || 1;

  const getX = (idx: number) => paddingLeft + (idx / (bars.length - 1 || 1)) * plotWidth;
  const getY = (price: number) => paddingTop + (1 - (price - minPrice) / priceRange) * (priceHeight - paddingTop);
  const getVolY = (vol: number) => height - (vol / maxVolume) * volumeHeight;

  // Paths for line chart and indicators
  const closePoints = bars.map((b, i) => `${getX(i).toFixed(1)},${getY(b.close).toFixed(1)}`).join(' L ');
  const linePath = `M ${closePoints}`;
  const areaPath = `M ${closePoints} L ${getX(bars.length - 1)},${priceHeight} L ${getX(0)},${priceHeight} Z`;

  const sma20Path = bars.filter(b => b.sma20).map((b, i) => `${getX(i).toFixed(1)},${getY(b.sma20!).toFixed(1)}`).join(' L ');
  const sma50Path = bars.filter(b => b.sma50).map((b, i) => `${getX(i).toFixed(1)},${getY(b.sma50!).toFixed(1)}`).join(' L ');
  const sma200Path = bars.filter(b => b.sma200).map((b, i) => `${getX(i).toFixed(1)},${getY(b.sma200!).toFixed(1)}`).join(' L ');

  // Bollinger Bands path
  const bbUpperPoints = bars.filter(b => b.bbUpper).map((b, i) => `${getX(i).toFixed(1)},${getY(b.bbUpper!).toFixed(1)}`);
  const bbLowerPoints = bars.filter(b => b.bbLower).map((b, i) => `${getX(i).toFixed(1)},${getY(b.bbLower!).toFixed(1)}`).reverse();
  const bbAreaPath = bbUpperPoints.length > 0 && bbLowerPoints.length > 0
    ? `M ${bbUpperPoints.join(' L ')} L ${bbLowerPoints.join(' L ')} Z`
    : '';

  // Horizontal Grid Lines
  const gridLevels = 5;
  const priceGrid = Array.from({ length: gridLevels }).map((_, i) => {
    const val = minPrice + (priceRange / (gridLevels - 1)) * i;
    return {
      price: val,
      y: getY(val),
    };
  });

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left) / rect.width) * svgWidth;
    const boundedX = Math.max(paddingLeft, Math.min(paddingLeft + plotWidth, relativeX));
    const idx = Math.round(((boundedX - paddingLeft) / plotWidth) * (bars.length - 1));
    setHoverIndex(idx >= 0 && idx < bars.length ? idx : null);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const timeframes: TimeFrame[] = ['1D', '1W', '1M', '6M', '1Y', '3Y', '5Y'];

  return (
    <div className="surface-panel rounded-xl p-4 flex flex-col gap-3" ref={containerRef}>
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#313131] pb-3">
        {/* Active OHLCV Readout */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono">
          <div className="text-white font-medium">
            <span className="text-[#a7a7a7] mr-1">Date:</span>
            {activeBar.date}
          </div>
          <div>
            <span className="text-[#7c7c7c] mr-1">O:</span>
            <span className="text-white">{formatINR(activeBar.open)}</span>
          </div>
          <div>
            <span className="text-[#7c7c7c] mr-1">H:</span>
            <span className="text-[#10b981]">{formatINR(activeBar.high)}</span>
          </div>
          <div>
            <span className="text-[#7c7c7c] mr-1">L:</span>
            <span className="text-[#f43f5e]">{formatINR(activeBar.low)}</span>
          </div>
          <div>
            <span className="text-[#7c7c7c] mr-1">C:</span>
            <span className={activeBar.close >= activeBar.open ? 'text-[#10b981]' : 'text-[#f43f5e]'}>
              {formatINR(activeBar.close)}
            </span>
          </div>
          <div>
            <span className="text-[#7c7c7c] mr-1">Vol:</span>
            <span className="text-[#a7a7a7]">{formatVolume(activeBar.volume)}</span>
          </div>
        </div>

        {/* Indicators and Chart Type toggles */}
        <div className="flex items-center gap-2">
          {/* Chart Type Toggle */}
          <div className="flex items-center bg-[#141414] border border-[#313131] rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setChartType('candlestick')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                chartType === 'candlestick' ? 'bg-[#1e1e1e] text-white border border-[#454545]' : 'text-[#a7a7a7]'
              }`}
            >
              Candles
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                chartType === 'line' ? 'bg-[#1e1e1e] text-white border border-[#454545]' : 'text-[#a7a7a7]'
              }`}
            >
              Line
            </button>
          </div>

          {/* Indicator toggles */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setShowSMA20(!showSMA20)}
              className={`px-2 py-1 rounded border transition-colors cursor-pointer font-mono text-[11px] ${
                showSMA20 ? 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/40' : 'bg-[#141414] text-[#7c7c7c] border-[#313131]'
              }`}
            >
              SMA 20
            </button>
            <button
              onClick={() => setShowSMA50(!showSMA50)}
              className={`px-2 py-1 rounded border transition-colors cursor-pointer font-mono text-[11px] ${
                showSMA50 ? 'bg-[#6798ff]/15 text-[#6798ff] border-[#6798ff]/40' : 'bg-[#141414] text-[#7c7c7c] border-[#313131]'
              }`}
            >
              SMA 50
            </button>
            <button
              onClick={() => setShowSMA200(!showSMA200)}
              className={`px-2 py-1 rounded border transition-colors cursor-pointer font-mono text-[11px] ${
                showSMA200 ? 'bg-[#a855f7]/15 text-[#a855f7] border-[#a855f7]/40' : 'bg-[#141414] text-[#7c7c7c] border-[#313131]'
              }`}
            >
              SMA 200
            </button>
            <button
              onClick={() => setShowBollinger(!showBollinger)}
              className={`px-2 py-1 rounded border transition-colors cursor-pointer font-mono text-[11px] ${
                showBollinger ? 'bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/40' : 'bg-[#141414] text-[#7c7c7c] border-[#313131]'
              }`}
            >
              Bollinger
            </button>
          </div>
        </div>
      </div>

      {/* Timeframe Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-[#141414] border border-[#313131] rounded-lg p-0.5">
          {timeframes.map(tf => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded transition-colors cursor-pointer ${
                timeframe === tf ? 'bg-[#1e1e1e] text-[#6798ff] border border-[#454545]' : 'text-[#a7a7a7] hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="hidden md:flex items-center gap-3 text-[11px] font-mono text-[#a7a7a7]">
          {showSMA20 && <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-[#f59e0b] inline-block" /> SMA 20</span>}
          {showSMA50 && <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-[#6798ff] inline-block" /> SMA 50</span>}
          {showSMA200 && <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-[#a855f7] inline-block" /> SMA 200</span>}
          {showBollinger && <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-[#38bdf8] inline-block" /> BB (20,2)</span>}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${height}`}
          className="w-full h-auto block overflow-visible cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id="priceLineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6798ff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6798ff" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines and Price Axis */}
          {priceGrid.map((grid, idx) => (
            <g key={idx}>
              <line
                x1={paddingLeft}
                y1={grid.y}
                x2={paddingLeft + plotWidth}
                y2={grid.y}
                stroke="#252525"
                strokeWidth="1"
                strokeDasharray="2,3"
              />
              <text
                x={svgWidth - 5}
                y={grid.y + 3.5}
                fill="#7c7c7c"
                fontSize="10"
                textAnchor="end"
                className="font-mono tabular-nums"
              >
                ₹{grid.price.toFixed(1)}
              </text>
            </g>
          ))}

          {/* Volume separator line */}
          <line
            x1={paddingLeft}
            y1={priceHeight}
            x2={paddingLeft + plotWidth}
            y2={priceHeight}
            stroke="#313131"
            strokeWidth="1"
          />

          {/* Volume Bars */}
          {bars.map((bar, i) => {
            const x = getX(i);
            const y = getVolY(bar.volume);
            const isGreen = bar.close >= bar.open;
            const barWidth = Math.max(2, plotWidth / bars.length - 2);
            return (
              <rect
                key={`vol-${i}`}
                x={x - barWidth / 2}
                y={y}
                width={barWidth}
                height={height - y}
                fill={isGreen ? '#10b981' : '#f43f5e'}
                opacity={0.35}
              />
            );
          })}

          {/* Bollinger Bands Shaded Area */}
          {showBollinger && bbAreaPath && (
            <path d={bbAreaPath} fill="rgba(56, 189, 248, 0.08)" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1" strokeDasharray="3,3" />
          )}

          {/* SMA 200 */}
          {showSMA200 && sma200Path && (
            <path d={`M ${sma200Path}`} fill="none" stroke="#a855f7" strokeWidth="1.5" strokeOpacity="0.85" />
          )}

          {/* SMA 50 */}
          {showSMA50 && sma50Path && (
            <path d={`M ${sma50Path}`} fill="none" stroke="#6798ff" strokeWidth="1.5" strokeOpacity="0.85" />
          )}

          {/* SMA 20 */}
          {showSMA20 && sma20Path && (
            <path d={`M ${sma20Path}`} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.85" />
          )}

          {/* Price: Line or Candlesticks */}
          {chartType === 'line' ? (
            <>
              <path d={areaPath} fill="url(#priceLineGrad)" />
              <path d={linePath} fill="none" stroke="#6798ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </>
          ) : (
            // Candlesticks
            bars.map((bar, i) => {
              const x = getX(i);
              const isUp = bar.close >= bar.open;
              const color = isUp ? '#10b981' : '#f43f5e';
              const highY = getY(bar.high);
              const lowY = getY(bar.low);
              const openY = getY(bar.open);
              const closeY = getY(bar.close);
              const bodyTop = Math.min(openY, closeY);
              const bodyHeight = Math.max(1.5, Math.abs(closeY - openY));
              const candleWidth = Math.max(3, plotWidth / bars.length - 2.5);

              return (
                <g key={`candle-${i}`}>
                  {/* Wick */}
                  <line x1={x} y1={highY} x2={x} y2={lowY} stroke={color} strokeWidth="1" />
                  {/* Body */}
                  <rect
                    x={x - candleWidth / 2}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={color}
                    rx="0.5"
                  />
                </g>
              );
            })
          )}

          {/* Crosshair when hovering */}
          {hoverIndex !== null && (
            <g>
              {/* Vertical line */}
              <line
                x1={getX(hoverIndex)}
                y1={paddingTop}
                x2={getX(hoverIndex)}
                y2={height}
                stroke="#6798ff"
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.8"
              />
              {/* Horizontal line at hovered close */}
              <line
                x1={paddingLeft}
                y1={getY(activeBar.close)}
                x2={paddingLeft + plotWidth}
                y2={getY(activeBar.close)}
                stroke="#6798ff"
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.8"
              />
              {/* Dot on price */}
              <circle
                cx={getX(hoverIndex)}
                cy={getY(activeBar.close)}
                r="4"
                fill="#6798ff"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
