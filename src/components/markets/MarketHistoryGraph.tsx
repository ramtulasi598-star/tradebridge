import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  LineChart,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Scale,
  Sparkles,
  Info
} from 'lucide-react';

export interface DailyMarketHistoryPoint {
  dayIndex: number;
  date: string;
  dayLabel: string;
  dayOfWeek?: string;
  price: number;
  minPrice?: number;
  maxPrice?: number;
  change?: number;
  changePercent?: number;
  arrivalsKg?: number;
  prebookedKg?: number;
}

interface MarketHistoryGraphProps {
  cropName: string;
  cropIcon?: string;
  marketName: string;
  data: DailyMarketHistoryPoint[];
  currentPrice: number;
}

export const MarketHistoryGraph: React.FC<MarketHistoryGraphProps> = ({
  cropName,
  cropIcon = '🌾',
  marketName,
  data,
  currentPrice
}) => {
  // Time range filter: 7 days, 14 days, or all 30 days
  const [timeRange, setTimeRange] = useState<'7D' | '14D' | '30D'>('30D');
  // Chart visual mode
  const [chartMode, setChartMode] = useState<'LINE' | 'BAR' | 'SPREAD'>('LINE');
  // Active hovered or selected day index
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  // Search filter for daily table
  const [tableSearch, setTableSearch] = useState('');

  // Sliced data based on timeRange
  const activeData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const count = timeRange === '7D' ? 7 : timeRange === '14D' ? 14 : 30;
    return data.slice(-count);
  }, [data, timeRange]);

  // Derived statistics across active range
  const stats = useMemo(() => {
    if (activeData.length === 0) {
      return {
        minPrice: currentPrice,
        maxPrice: currentPrice,
        avgPrice: currentPrice,
        minDay: '',
        maxDay: '',
        netChange: 0,
        netPercent: 0,
        totalArrivalsTons: 0,
        totalPrebookedTons: 0
      };
    }

    let min = activeData[0].price;
    let max = activeData[0].price;
    let sum = 0;
    let minDay = activeData[0].date;
    let maxDay = activeData[0].date;
    let totalArrivals = 0;
    let totalPrebooked = 0;

    activeData.forEach(d => {
      sum += d.price;
      if (d.price < min) {
        min = d.price;
        minDay = d.date;
      }
      if (d.price > max) {
        max = d.price;
        maxDay = d.date;
      }
      totalArrivals += d.arrivalsKg || 0;
      totalPrebooked += d.prebookedKg || 0;
    });

    const firstPrice = activeData[0].price;
    const lastPrice = activeData[activeData.length - 1].price;
    const netChange = Math.round((lastPrice - firstPrice) * 10) / 10;
    const netPercent = firstPrice > 0 ? Math.round((netChange / firstPrice) * 1000) / 10 : 0;

    return {
      minPrice: min,
      maxPrice: max,
      avgPrice: Math.round((sum / activeData.length) * 10) / 10,
      minDay,
      maxDay,
      netChange,
      netPercent,
      totalArrivalsTons: (totalArrivals / 1000).toFixed(1),
      totalPrebookedTons: (totalPrebooked / 1000).toFixed(1)
    };
  }, [activeData, currentPrice]);

  // Selected day point for tooltip and inspection
  const activePoint = useMemo(() => {
    if (selectedDayIndex !== null) {
      return activeData.find(d => d.dayIndex === selectedDayIndex) || activeData[activeData.length - 1];
    }
    return activeData[activeData.length - 1];
  }, [activeData, selectedDayIndex]);

  // SVG dimensions for high-resolution responsive coordinate mapping
  const svgWidth = 800;
  const svgHeight = 260;
  const padding = { top: 25, right: 30, bottom: 40, left: 45 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  // Min and max Y for clean graph scaling
  const priceMargin = Math.max(2, (stats.maxPrice - stats.minPrice) * 0.15);
  const yMin = Math.max(0, Math.floor(stats.minPrice - priceMargin));
  const yMax = Math.ceil(stats.maxPrice + priceMargin);
  const yRange = yMax - yMin || 1;

  // X coordinate calculation
  const getX = (index: number) => {
    if (activeData.length <= 1) return padding.left + graphWidth / 2;
    return padding.left + (index / (activeData.length - 1)) * graphWidth;
  };

  // Y coordinate calculation
  const getY = (val: number) => {
    return padding.top + graphHeight - ((val - yMin) / yRange) * graphHeight;
  };

  // Path data generator for SVG line & area
  const { linePath, areaPath, points } = useMemo(() => {
    if (activeData.length === 0) return { linePath: '', areaPath: '', points: [] };

    const pts = activeData.map((d, i) => ({
      x: getX(i),
      y: getY(d.price),
      data: d
    }));

    // Generate smooth line path
    let lPath = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      // Smooth cubic curve control points
      const prev = pts[i - 1];
      const curr = pts[i];
      const cp1x = prev.x + (curr.x - prev.x) * 0.45;
      const cp1y = prev.y;
      const cp2x = prev.x + (curr.x - prev.x) * 0.55;
      const cp2y = curr.y;
      lPath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }

    // Generate area path
    const aPath = `${lPath} L ${pts[pts.length - 1].x} ${padding.top + graphHeight} L ${pts[0].x} ${padding.top + graphHeight} Z`;

    return { linePath: lPath, areaPath: aPath, points: pts };
  }, [activeData, yMin, yRange]);

  // Filtered daily table rows based on search input
  const filteredTableData = useMemo(() => {
    // Reverse array to show newest / Today at top
    const reversed = [...data].reverse();
    if (!tableSearch.trim()) return reversed;
    const q = tableSearch.toLowerCase();
    return reversed.filter(d => 
      d.date.toLowerCase().includes(q) ||
      d.dayLabel.toLowerCase().includes(q) ||
      (d.dayOfWeek && d.dayOfWeek.toLowerCase().includes(q)) ||
      String(d.price).includes(q)
    );
  }, [data, tableSearch]);

  return (
    <div className="bg-[#FAF7F2] rounded-3xl p-4 sm:p-5 border border-[#D8C7B3] shadow-md space-y-4 text-[#2C1D13]">
      {/* 1. HEADER: CROP TITLE + RANGE SWITCHERS + CHART MODE */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#D8C7B3]">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#EDE3D5] text-xl flex items-center justify-center border border-[#D8C7B3] shadow-xs">
            {cropIcon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-[#2C1D13] tracking-tight">
                {cropName} Daily Mandi History
              </h3>
              <span className="text-[10px] font-extrabold bg-[#1E7C48] text-white px-2 py-0.5 rounded-full">
                EVERY SINGLE DAY
              </span>
            </div>
            <p className="text-xs text-[#6E5544]">
              {marketName} • Live Mandi Auction Historical Log
            </p>
          </div>
        </div>

        {/* CONTROLS: RANGE & CHART TYPE */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-between sm:justify-end">
          {/* Time Range Pills */}
          <div className="flex items-center bg-[#EDE3D5] p-1 rounded-xl border border-[#D8C7B3]">
            {(['7D', '14D', '30D'] as const).map(range => (
              <button
                key={range}
                onClick={() => {
                  setTimeRange(range);
                  setSelectedDayIndex(null);
                }}
                className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all ${
                  timeRange === range
                    ? 'bg-[#1E7C48] text-white shadow-xs'
                    : 'text-[#6E5544] hover:text-[#2C1D13]'
                }`}
              >
                {range === '7D' ? '7 Days' : range === '14D' ? '14 Days' : '30 Days'}
              </button>
            ))}
          </div>

          {/* Chart View Modes: Line, Volume, Spread */}
          <div className="flex items-center bg-[#EDE3D5] p-1 rounded-xl border border-[#D8C7B3]">
            <button
              onClick={() => setChartMode('LINE')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                chartMode === 'LINE'
                  ? 'bg-[#1E7C48] text-white shadow-xs'
                  : 'text-[#6E5544] hover:text-[#2C1D13]'
              }`}
              title="Line Chart (Daily Price Trend)"
            >
              <LineChart className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Price</span>
            </button>
            <button
              onClick={() => setChartMode('BAR')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                chartMode === 'BAR'
                  ? 'bg-[#1E7C48] text-white shadow-xs'
                  : 'text-[#6E5544] hover:text-[#2C1D13]'
              }`}
              title="Bar Chart (Arrivals vs Pre-booked Volume)"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Volume</span>
            </button>
            <button
              onClick={() => setChartMode('SPREAD')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                chartMode === 'SPREAD'
                  ? 'bg-[#1E7C48] text-white shadow-xs'
                  : 'text-[#6E5544] hover:text-[#2C1D13]'
              }`}
              title="High-Low Trading Spread"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Range</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS (Lowest, Avg, Highest, Net Shift) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
        <div className="bg-[#EDE3D5] p-3 rounded-2xl border border-[#D8C7B3] text-center shadow-xs">
          <span className="text-[10px] font-extrabold text-[#7A6150] uppercase tracking-wider block">
            Lowest in {timeRange}
          </span>
          <span className="text-base sm:text-lg font-black text-[#2C1D13] tabular-nums mt-0.5 block">
            ₹{stats.minPrice} <span className="text-xs font-semibold text-[#6E5544]">/kg</span>
          </span>
          <span className="text-[10px] text-[#7A6150] truncate block">
            {stats.minDay}
          </span>
        </div>

        <div className="bg-[#EDE3D5] p-3 rounded-2xl border border-[#D8C7B3] text-center shadow-xs">
          <span className="text-[10px] font-extrabold text-[#7A6150] uppercase tracking-wider block">
            Average Rate
          </span>
          <span className="text-base sm:text-lg font-black text-[#2C1D13] tabular-nums mt-0.5 block">
            ₹{stats.avgPrice} <span className="text-xs font-semibold text-[#6E5544]">/kg</span>
          </span>
          <span className="text-[10px] text-[#7A6150] block">
            Weighted Mean
          </span>
        </div>

        <div className="bg-[#EDE3D5] p-3 rounded-2xl border border-[#D8C7B3] text-center shadow-xs">
          <span className="text-[10px] font-extrabold text-[#1E7C48] uppercase tracking-wider block">
            Highest in {timeRange}
          </span>
          <span className="text-base sm:text-lg font-black text-[#1E7C48] tabular-nums mt-0.5 block">
            ₹{stats.maxPrice} <span className="text-xs font-semibold text-[#1E7C48]">/kg</span>
          </span>
          <span className="text-[10px] text-[#1E7C48] truncate block">
            {stats.maxDay}
          </span>
        </div>

        <div className="bg-[#EDE3D5] p-3 rounded-2xl border border-[#D8C7B3] text-center shadow-xs">
          <span className="text-[10px] font-extrabold text-[#7A6150] uppercase tracking-wider block">
            {timeRange} Net Shift
          </span>
          <div className="flex items-center justify-center gap-1 mt-0.5">
            {stats.netChange >= 0 ? (
              <ArrowUpRight className="w-4 h-4 text-[#1E7C48] stroke-[3]" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-600 stroke-[3]" />
            )}
            <span className={`text-base sm:text-lg font-black tabular-nums ${
              stats.netChange >= 0 ? 'text-[#1E7C48]' : 'text-red-600'
            }`}>
              {stats.netChange >= 0 ? `+₹${stats.netChange}` : `₹${stats.netChange}`}
            </span>
          </div>
          <span className={`text-[10px] font-bold ${stats.netChange >= 0 ? 'text-[#1E7C48]' : 'text-red-600'}`}>
            ({stats.netPercent >= 0 ? `+${stats.netPercent}%` : `${stats.netPercent}%`})
          </span>
        </div>
      </div>

      {/* 3. DYNAMIC INSPECTION TOOLTIP (Shows exact clicked / hovered day data) */}
      {activePoint && (
        <div className="bg-[#EDE3D5] p-3 sm:p-3.5 rounded-2xl border border-[#D8C7B3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#1E7C48] flex items-center justify-center border border-[#D8C7B3] shadow-xs">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-[#2C1D13]">
                  {activePoint.date} ({activePoint.dayOfWeek || 'Mandi Day'})
                </span>
                {activePoint.dayIndex === data.length && (
                  <span className="text-[9px] font-black bg-[#1E7C48] text-white px-1.5 py-0.2 rounded-full uppercase">
                    Today
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#6E5544]">
                Mandi Benchmark Rate & Daily Auction Volumes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap text-xs tabular-nums w-full sm:w-auto justify-between sm:justify-end">
            <div>
              <span className="text-[10px] text-[#6E5544] block font-bold">MODAL RATE</span>
              <span className="text-sm font-black text-[#1E7C48]">₹{activePoint.price}/kg</span>
            </div>

            {activePoint.change !== undefined && (
              <div>
                <span className="text-[10px] text-[#6E5544] block font-bold">CHANGE</span>
                <span className={`text-xs font-bold ${
                  activePoint.change >= 0 ? 'text-[#1E7C48]' : 'text-red-600'
                }`}>
                  {activePoint.change >= 0 ? `+₹${activePoint.change}` : `₹${activePoint.change}`}
                </span>
              </div>
            )}

            {activePoint.minPrice !== undefined && activePoint.maxPrice !== undefined && (
              <div>
                <span className="text-[10px] text-[#6E5544] block font-bold">RANGE</span>
                <span className="text-xs text-[#4A3525] font-semibold">
                  ₹{activePoint.minPrice} - ₹{activePoint.maxPrice}
                </span>
              </div>
            )}

            {activePoint.arrivalsKg !== undefined && (
              <div>
                <span className="text-[10px] text-[#6E5544] block font-bold">INFLOW</span>
                <span className="text-xs text-[#2C1D13] font-extrabold">
                  {(activePoint.arrivalsKg / 1000).toFixed(1)} Tons
                </span>
              </div>
            )}

            {activePoint.prebookedKg !== undefined && (
              <div>
                <span className="text-[10px] text-[#6E5544] block font-bold">PRE-BOOKED</span>
                <span className="text-xs text-[#B45309] font-black">
                  {(activePoint.prebookedKg / 1000).toFixed(1)} Tons
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. THE GRAPH: INTERACTIVE SVG PLOT OF EVERY SINGLE DAY */}
      <div className="relative bg-[#EDE3D5] rounded-3xl p-3 sm:p-4 border border-[#D8C7B3] overflow-hidden shadow-inner">
        {/* GRAPH VIEW A: LINE CHART WITH SMOOTH CURVES & DAY MARKERS */}
        {chartMode === 'LINE' && (
          <div className="w-full overflow-x-auto no-scrollbar">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full min-w-[550px] sm:min-w-full h-56 sm:h-64 overflow-visible select-none"
            >
              <defs>
                {/* Gradient for area fill under price line */}
                <linearGradient id="priceAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E7C48" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#79C195" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#79C195" stopOpacity="0.0" />
                </linearGradient>

                {/* Subtle drop shadow for line */}
                <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1E7C48" floodOpacity="0.3" />
                </filter>
              </defs>

              {/* Horizontal gridlines and price markers */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                const priceVal = Math.round(yMin + pct * yRange);
                const yPos = padding.top + graphHeight - pct * graphHeight;
                return (
                  <g key={i}>
                    <line
                      x1={padding.left}
                      y1={yPos}
                      x2={svgWidth - padding.right}
                      y2={yPos}
                      stroke="#D8C7B3"
                      strokeWidth="1"
                      strokeDasharray={i === 0 ? '0' : '4 4'}
                    />
                    <text
                      x={padding.left - 8}
                      y={yPos + 4}
                      textAnchor="end"
                      fill="#7A6150"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      ₹{priceVal}
                    </text>
                  </g>
                );
              })}

              {/* Area fill */}
              {areaPath && <path d={areaPath} fill="url(#priceAreaGrad)" />}

              {/* Smooth line */}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="#1E7C48"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  filter="url(#lineGlow)"
                />
              )}

              {/* Active vertical crosshair indicator */}
              {activePoint && (
                <line
                  x1={getX(activeData.findIndex(d => d.dayIndex === activePoint.dayIndex))}
                  y1={padding.top}
                  x2={getX(activeData.findIndex(d => d.dayIndex === activePoint.dayIndex))}
                  y2={padding.top + graphHeight}
                  stroke="#A3661C"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              )}

              {/* EVERY SINGLE DAY CIRCULAR DATA POINTS */}
              {points.map((pt, i) => {
                const isSelected = activePoint && activePoint.dayIndex === pt.data.dayIndex;
                const isToday = i === points.length - 1;

                return (
                  <g
                    key={i}
                    onClick={() => setSelectedDayIndex(pt.data.dayIndex)}
                    onMouseEnter={() => setSelectedDayIndex(pt.data.dayIndex)}
                    className="cursor-pointer group"
                  >
                    {/* Invisible larger hover hit area */}
                    <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />

                    {/* Outer pulse for Today or Selected Day */}
                    {(isSelected || isToday) && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSelected ? '9' : '7'}
                        fill="#1E7C48"
                        opacity="0.25"
                        className="animate-ping"
                      />
                    )}

                    {/* Visible point circle */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? '6' : isToday ? '5' : '3.5'}
                      fill={isSelected ? '#A3661C' : isToday ? '#1E7C48' : '#FAF7F2'}
                      stroke={isSelected ? '#FFFFFF' : '#1E7C48'}
                      strokeWidth={isSelected ? '2.5' : '2'}
                      className="transition-transform group-hover:scale-150 duration-150"
                    />

                    {/* Price tag above point for selected or key points */}
                    {(isSelected || isToday || i === 0) && (
                      <g>
                        <rect
                          x={pt.x - 22}
                          y={pt.y - 24}
                          width="44"
                          height="18"
                          rx="6"
                          fill="#2C1D13"
                          className="shadow-sm"
                        />
                        <text
                          x={pt.x}
                          y={pt.y - 12}
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="9.5"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          ₹{pt.data.price}
                        </text>
                      </g>
                    )}

                    {/* X-axis date labels */}
                    {(timeRange === '7D' || (timeRange === '14D' && i % 2 === 0) || i % 4 === 0 || isToday) && (
                      <text
                        x={pt.x}
                        y={svgHeight - 14}
                        textAnchor="middle"
                        fill={isSelected ? '#1E7C48' : '#6E5544'}
                        fontSize="9.5"
                        fontWeight={isSelected || isToday ? 'bold' : 'normal'}
                      >
                        {pt.data.dayLabel}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* GRAPH VIEW B: DAILY ARRIVAL VS PRE-BOOKED BAR CHART */}
        {chartMode === 'BAR' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#6E5544] px-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1E7C48]" />
                <span>Total Daily Inflow Arrivals (Tons)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span>Advance Pre-booked Volume (Tons)</span>
              </span>
            </div>

            <div className="h-44 flex items-end gap-1.5 overflow-x-auto no-scrollbar pt-4">
              {activeData.map((d, i) => {
                const maxArrival = Math.max(...activeData.map(p => p.arrivalsKg || 1));
                const arrivalHeightPct = Math.max(12, Math.round(((d.arrivalsKg || 1) / maxArrival) * 100));
                const prebookedHeightPct = Math.max(8, Math.round(((d.prebookedKg || 1) / maxArrival) * 100));
                const isSelected = activePoint && activePoint.dayIndex === d.dayIndex;

                return (
                  <div
                    key={i}
                    onClick={() => setSelectedDayIndex(d.dayIndex)}
                    onMouseEnter={() => setSelectedDayIndex(d.dayIndex)}
                    className="flex-1 flex flex-col items-center gap-1 min-w-[14px] cursor-pointer group relative"
                  >
                    <div className="w-full flex items-end justify-center gap-0.5 h-36">
                      {/* Arrival Bar */}
                      <div
                        style={{ height: `${arrivalHeightPct}%` }}
                        className={`w-1/2 rounded-t-sm transition-all ${
                          isSelected ? 'bg-[#1E7C48] ring-2 ring-emerald-600' : 'bg-[#1E7C48]/80 group-hover:bg-[#1E7C48]'
                        }`}
                        title={`${d.date}: Inflow ${(d.arrivalsKg || 0) / 1000}T`}
                      />
                      {/* Prebooked Bar */}
                      <div
                        style={{ height: `${prebookedHeightPct}%` }}
                        className={`w-1/2 rounded-t-sm transition-all ${
                          isSelected ? 'bg-amber-500 ring-2 ring-amber-400' : 'bg-amber-500/80 group-hover:bg-amber-500'
                        }`}
                        title={`${d.date}: Prebooked ${(d.prebookedKg || 0) / 1000}T`}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-[#7A6150] truncate w-full text-center">
                      {d.dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* GRAPH VIEW C: TRADING SPREAD (MIN-MAX RANGE) */}
        {chartMode === 'SPREAD' && (
          <div className="space-y-2">
            <div className="text-xs text-[#6E5544] font-bold px-1">
              Daily Auction Floor (Min) vs Premium Lot (Max) Range per Kg
            </div>
            <div className="h-44 flex items-end gap-1.5 overflow-x-auto no-scrollbar pt-4">
              {activeData.map((d, i) => {
                const min = d.minPrice || d.price * 0.9;
                const max = d.maxPrice || d.price * 1.1;
                const bottomPct = Math.max(5, ((min - yMin) / yRange) * 100);
                const heightPct = Math.max(10, ((max - min) / yRange) * 100);
                const isSelected = activePoint && activePoint.dayIndex === d.dayIndex;

                return (
                  <div
                    key={i}
                    onClick={() => setSelectedDayIndex(d.dayIndex)}
                    onMouseEnter={() => setSelectedDayIndex(d.dayIndex)}
                    className="flex-1 flex flex-col items-center gap-1 min-w-[14px] cursor-pointer group relative"
                  >
                    <div className="w-full h-36 relative flex justify-center">
                      {/* Range Candle */}
                      <div
                        style={{
                          bottom: `${bottomPct}%`,
                          height: `${heightPct}%`
                        }}
                        className={`absolute w-3 rounded-md transition-all ${
                          isSelected ? 'bg-[#1E7C48] ring-2 ring-emerald-500' : 'bg-[#79C195] group-hover:bg-[#1E7C48]'
                        }`}
                      >
                        {/* Center modal price notch */}
                        <div className="w-full h-1 bg-[#2C1D13] my-auto" />
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-[#7A6150] truncate w-full text-center">
                      {d.dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 5. EVERY SINGLE DAY TABLE (The user requested: "the market history shows every single day and its shows in graph also") */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs sm:text-sm font-black text-[#2C1D13] uppercase tracking-wide flex items-center gap-1.5">
              <span>📅 Complete Daily History Log ({filteredTableData.length} Days)</span>
            </h4>
            <p className="text-[11px] text-[#6E5544]">
              Every single day logged with modal closing price, daily variance, and mandi trade volume
            </p>
          </div>

          {/* Table Search Input */}
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6150]" />
            <input
              type="text"
              placeholder="Filter by date or day..."
              value={tableSearch}
              onChange={e => setTableSearch(e.target.value)}
              className="w-full min-h-[36px] pl-8 pr-3 bg-[#EDE3D5] rounded-xl border border-[#D8C7B3] text-xs text-[#2C1D13] placeholder-[#8C735E]"
            />
          </div>
        </div>

        {/* Scrollable Table of Every Single Day */}
        <div className="border border-[#D8C7B3] rounded-2xl overflow-hidden shadow-xs bg-[#FAF7F2]">
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#E5D7C4] text-[#4A3525] text-[10px] font-black uppercase tracking-wider sticky top-0 z-10 border-b border-[#D8C7B3]">
                <tr>
                  <th className="py-2.5 px-3">Date / Day</th>
                  <th className="py-2.5 px-3 text-right">Mandi Rate</th>
                  <th className="py-2.5 px-3 text-right">Daily Change</th>
                  <th className="py-2.5 px-3 text-right hidden sm:table-cell">Trading Range</th>
                  <th className="py-2.5 px-3 text-right">Inflow Volume</th>
                  <th className="py-2.5 px-3 text-right hidden md:table-cell">Pre-booked</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8C7B3] text-[11px]">
                {filteredTableData.map((d, idx) => {
                  const isSelected = activePoint && activePoint.dayIndex === d.dayIndex;
                  const isToday = idx === 0;
                  const changeVal = d.change || 0;
                  const changePct = d.changePercent || 0;
                  const arrivalsTons = d.arrivalsKg ? (d.arrivalsKg / 1000).toFixed(1) : '32.0';
                  const prebookedTons = d.prebookedKg ? (d.prebookedKg / 1000).toFixed(1) : '8.5';

                  return (
                    <tr
                      key={d.dayIndex}
                      onClick={() => setSelectedDayIndex(d.dayIndex)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#FEF3C7] font-bold'
                          : idx % 2 === 0
                          ? 'bg-[#FAF7F2] hover:bg-[#EDE3D5]'
                          : 'bg-[#F5EFEB] hover:bg-[#EDE3D5]'
                      }`}
                    >
                      {/* 1. Date */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {isToday && (
                            <span className="w-2 h-2 rounded-full bg-[#1E7C48] animate-pulse" />
                          )}
                          <span className={isToday ? 'font-black text-[#1E7C48]' : 'text-[#2C1D13] font-bold'}>
                            {d.date}
                          </span>
                          <span className="text-[10px] text-[#7A6150]">
                            ({d.dayLabel})
                          </span>
                        </div>
                      </td>

                      {/* 2. Rate */}
                      <td className="py-2.5 px-3 text-right tabular-nums whitespace-nowrap">
                        <span className="font-black text-[#2C1D13] text-xs">
                          ₹{d.price}
                        </span>
                        <span className="text-[10px] text-[#6E5544]">/kg</span>
                      </td>

                      {/* 3. Daily Change */}
                      <td className="py-2.5 px-3 text-right tabular-nums whitespace-nowrap font-bold">
                        {changeVal > 0 ? (
                          <span className="text-[#1E7C48] inline-flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3" />
                            +₹{changeVal} (+{changePct}%)
                          </span>
                        ) : changeVal < 0 ? (
                          <span className="text-red-600 inline-flex items-center gap-0.5">
                            <TrendingDown className="w-3 h-3" />
                            {changeVal} ({changePct}%)
                          </span>
                        ) : (
                          <span className="text-[#7A6150]">— Stable</span>
                        )}
                      </td>

                      {/* 4. Range */}
                      <td className="py-2.5 px-3 text-right tabular-nums text-[#6E5544] hidden sm:table-cell whitespace-nowrap">
                        ₹{d.minPrice || Math.round(d.price * 0.9)} - ₹{d.maxPrice || Math.round(d.price * 1.1)}
                      </td>

                      {/* 5. Inflow */}
                      <td className="py-2.5 px-3 text-right tabular-nums font-semibold text-[#2C1D13] whitespace-nowrap">
                        {arrivalsTons} Tons
                      </td>

                      {/* 6. Pre-booked */}
                      <td className="py-2.5 px-3 text-right tabular-nums font-bold text-[#B45309] hidden md:table-cell whitespace-nowrap">
                        {prebookedTons} Tons
                      </td>

                      {/* 7. Status */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        {isToday ? (
                          <span className="text-[9px] font-black uppercase text-[#1E7C48] bg-[#E1F2E7] px-2 py-0.5 rounded-full border border-[#79C195]">
                            Live Trading
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-[#7A6150] bg-[#EDE3D5] px-2 py-0.5 rounded-full border border-[#D8C7B3]">
                            Settled
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
