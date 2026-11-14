import React, { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { Thermometer, TrendingUp } from 'lucide-react';
import type { BatteryChemistry, WeatherCondition } from './EVCalculator';

export interface ChemistryBaselineInput {
  id: BatteryChemistry;
  label: string;
  baseRangeKm: number;
}

interface RangeTemperatureChartProps {
  activeChemistry: BatteryChemistry;
  activeWeather: WeatherCondition;
  chemistryBaselines: Record<BatteryChemistry, ChemistryBaselineInput>;
  onSelectChemistry?: (chemistry: BatteryChemistry) => void;
}

interface TempDataPoint {
  tempC: number;
  zoneLabel: string;
  lifepo4Km: number;
  liIonKm: number;
  grapheneKm: number;
  lifepo4Pct: number;
  liIonPct: number;
  graphenePct: number;
}

const TEMPERATURE_SAMPLES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45];

const CHEMISTRY_STYLES: Record<
  BatteryChemistry,
  { name: string; color: string; dotClass: string; badgeClass: string }
> = {
  lifepo4: {
    name: 'LiFePO4 (LFP)',
    color: '#10b981',
    dotClass: 'bg-emerald-500',
    badgeClass: 'text-emerald-600 dark:text-emerald-400',
  },
  'li-ion': {
    name: 'Lithium-Ion (NMC)',
    color: '#06b6d4',
    dotClass: 'bg-cyan-500',
    badgeClass: 'text-cyan-600 dark:text-cyan-400',
  },
  graphene: {
    name: 'Graphene / Gel',
    color: '#f59e0b',
    dotClass: 'bg-amber-500',
    badgeClass: 'text-amber-600 dark:text-amber-400',
  },
};

function getChemistryTempMultiplier(chemistry: BatteryChemistry, tempC: number): number {
  if (chemistry === 'lifepo4') {
    if (tempC <= 10) return 0.75 + (tempC / 10) * 0.14; // 0.75 @ 0C -> 0.89 @ 10C
    if (tempC <= 25) return 0.94 + ((tempC - 10) / 15) * 0.06; // 0.94 -> 1.00 @ 25C
    return Math.max(0.89, 1.0 - ((tempC - 25) / 20) * 0.09); // Gentle hot resistance: 0.91 @ 45C
  }
  if (chemistry === 'li-ion') {
    if (tempC <= 10) return 0.75 + (tempC / 10) * 0.13; // 0.75 @ 0C -> 0.88 @ 10C
    if (tempC <= 25) return 0.94 + ((tempC - 10) / 15) * 0.06; // 0.94 -> 1.00 @ 25C
    return Math.max(0.84, 1.0 - ((tempC - 25) / 20) * 0.14); // Thermal derating: 0.90 @ 39C -> 0.86 @ 45C
  }
  // graphene / lead-acid gel (steepest cold viscosity & summer sag)
  if (tempC <= 10) return 0.67 + (tempC / 10) * 0.16; // 0.67 @ 0C -> 0.83 @ 10C
  if (tempC <= 25) return 0.91 + ((tempC - 10) / 15) * 0.09; // 0.91 -> 1.00 @ 25C
  return Math.max(0.79, 1.0 - ((tempC - 25) / 20) * 0.18); // Hot voltage sag: 0.82 @ 45C
}

function getZoneLabel(tempC: number): string {
  if (tempC <= 10) return 'Freezing / Winter';
  if (tempC <= 25) return 'Moderate / Spring';
  return 'Hot Summer';
}

export const RangeTemperatureChart: React.FC<RangeTemperatureChartProps> = ({
  activeChemistry,
  activeWeather,
  chemistryBaselines,
  onSelectChemistry,
}) => {
  const defaultTempForWeather = activeWeather === 'cold' ? 5 : activeWeather === 'hot' ? 35 : 20;
  const [hoveredTemp, setHoveredTemp] = useState<number | null>(null);

  const data = useMemo<TempDataPoint[]>(() => {
    return TEMPERATURE_SAMPLES.map((tempC) => {
      const lfpMult = getChemistryTempMultiplier('lifepo4', tempC);
      const nmcMult = getChemistryTempMultiplier('li-ion', tempC);
      const grMult = getChemistryTempMultiplier('graphene', tempC);

      return {
        tempC,
        zoneLabel: getZoneLabel(tempC),
        lifepo4Km: Math.max(1, Math.round(chemistryBaselines.lifepo4.baseRangeKm * lfpMult)),
        liIonKm: Math.max(1, Math.round(chemistryBaselines['li-ion'].baseRangeKm * nmcMult)),
        grapheneKm: Math.max(1, Math.round(chemistryBaselines.graphene.baseRangeKm * grMult)),
        lifepo4Pct: Math.round(lfpMult * 100),
        liIonPct: Math.round(nmcMult * 100),
        graphenePct: Math.round(grMult * 100),
      };
    });
  }, [chemistryBaselines]);

  // SVG layout dimensions
  const width = 760;
  const height = 270;
  const margin = { top: 20, right: 24, bottom: 38, left: 48 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const { xScale, yScale, yTicks, paths, areaPath, weatherBand } = useMemo(() => {
    const x = d3.scaleLinear().domain([0, 45]).range([0, innerWidth]);

    const maxKm =
      d3.max(data, (d) => Math.max(d.lifepo4Km, d.liIonKm, d.grapheneKm)) ?? 100;
    const minKm =
      d3.min(data, (d) => Math.min(d.lifepo4Km, d.liIonKm, d.grapheneKm)) ?? 0;

    const yMin = Math.max(0, Math.floor((minKm * 0.8) / 5) * 5);
    const yMax = Math.max(yMin + 20, Math.ceil((maxKm * 1.1) / 5) * 5);
    const y = d3.scaleLinear().domain([yMin, yMax]).range([innerHeight, 0]);

    const buildLine = (accessor: (d: TempDataPoint) => number) =>
      d3
        .line<TempDataPoint>()
        .x((d) => x(d.tempC))
        .y((d) => y(accessor(d)))
        .curve(d3.curveMonotoneX)(data) || '';

    const activeAccessor = (d: TempDataPoint) =>
      activeChemistry === 'lifepo4'
        ? d.lifepo4Km
        : activeChemistry === 'graphene'
        ? d.grapheneKm
        : d.liIonKm;

    const area =
      d3
        .area<TempDataPoint>()
        .x((d) => x(d.tempC))
        .y0(innerHeight)
        .y1((d) => y(activeAccessor(d)))
        .curve(d3.curveMonotoneX)(data) || '';

    const bandStart = activeWeather === 'cold' ? 0 : activeWeather === 'mild' ? 11 : 26;
    const bandEnd = activeWeather === 'cold' ? 10 : activeWeather === 'mild' ? 25 : 45;

    return {
      xScale: x,
      yScale: y,
      yTicks: y.ticks(5),
      paths: {
        lifepo4: buildLine((d) => d.lifepo4Km),
        'li-ion': buildLine((d) => d.liIonKm),
        graphene: buildLine((d) => d.grapheneKm),
      },
      areaPath: area,
      weatherBand: {
        x: x(bandStart),
        width: Math.max(4, x(bandEnd) - x(bandStart)),
        fill:
          activeWeather === 'cold'
            ? 'rgba(56, 189, 248, 0.12)'
            : activeWeather === 'hot'
            ? 'rgba(245, 158, 11, 0.12)'
            : 'rgba(16, 185, 129, 0.12)',
        stroke:
          activeWeather === 'cold'
            ? 'rgba(56, 189, 248, 0.35)'
            : activeWeather === 'hot'
            ? 'rgba(245, 158, 11, 0.35)'
            : 'rgba(16, 185, 129, 0.35)',
      },
    };
  }, [data, innerWidth, innerHeight, activeChemistry, activeWeather]);

  const inspectedTemp = hoveredTemp ?? defaultTempForWeather;
  const inspectedPoint = useMemo(() => {
    return (
      data.find((d) => d.tempC === inspectedTemp) ||
      data.reduce((prev, curr) =>
        Math.abs(curr.tempC - inspectedTemp) < Math.abs(prev.tempC - inspectedTemp) ? curr : prev
      )
    );
  }, [data, inspectedTemp]);

  const handleSvgPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width) return;
    const svgX = ((e.clientX - rect.left) / rect.width) * width - margin.left;
    const clampedTemp = Math.max(0, Math.min(45, xScale.invert(svgX)));
    const snapped = Math.round(clampedTemp / 5) * 5;
    setHoveredTemp(snapped);
  };

  const activeColor = CHEMISTRY_STYLES[activeChemistry].color;

  return (
    <div className="backdrop-blur-xl bg-white/75 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-5">
      {/* Header + Interactive Chemistry Legend */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5 shrink-0" />
            <span>Temperature &amp; Chemistry Range Trend (D3 Analysis)</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            How Ambient Heat &amp; Cold Impact Single-Charge Range
          </h3>
        </div>

        {/* Clickable Legend Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {(['lifepo4', 'li-ion', 'graphene'] as BatteryChemistry[]).map((chem) => {
            const style = CHEMISTRY_STYLES[chem];
            const isActive = activeChemistry === chem;
            return (
              <button
                key={chem}
                type="button"
                onClick={() => onSelectChemistry?.(chem)}
                className={`h-9 px-3 rounded-full text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-950 dark:border-white shadow-xs'
                    : 'bg-slate-100/80 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-emerald-500/40'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${style.dotClass}`} />
                <span>{style.name}</span>
                {!isActive && <span className="text-[10px] opacity-65">(Compare)</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Crosshair Telemetry HUD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-white/10">
        <div className="space-y-0.5">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Thermometer className="w-3 h-3 text-emerald-500 shrink-0" />
            <span>{hoveredTemp !== null ? 'Inspected Temp' : 'Selected Zone Temp'}</span>
          </span>
          <div className="text-sm sm:text-base font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
            {inspectedPoint.tempC}°C{' '}
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-sans">
              · {inspectedPoint.zoneLabel}
            </span>
          </div>
        </div>

        <div className="space-y-0.5">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>LiFePO4</span>
          </span>
          <div className="text-sm sm:text-base font-extrabold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            {inspectedPoint.lifepo4Km} km{' '}
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              ({inspectedPoint.lifepo4Pct}%)
            </span>
          </div>
        </div>

        <div className="space-y-0.5">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
            <span>Lithium-Ion</span>
          </span>
          <div className="text-sm sm:text-base font-extrabold font-mono tabular-nums text-cyan-600 dark:text-cyan-400">
            {inspectedPoint.liIonKm} km{' '}
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              ({inspectedPoint.liIonPct}%)
            </span>
          </div>
        </div>

        <div className="space-y-0.5">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span>Graphene / Gel</span>
          </span>
          <div className="text-sm sm:text-base font-extrabold font-mono tabular-nums text-amber-600 dark:text-amber-400">
            {inspectedPoint.grapheneKm} km{' '}
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              ({inspectedPoint.graphenePct}%)
            </span>
          </div>
        </div>
      </div>

      {/* Responsive D3 SVG Trend Chart */}
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="D3 trend chart showing single-charge EV range from 0 to 45 degrees Celsius across LiFePO4, Lithium-Ion, and Graphene chemistries"
          onPointerMove={handleSvgPointerMove}
          onPointerLeave={() => setHoveredTemp(null)}
          className="w-full h-auto select-none cursor-crosshair touch-none"
        >
          <defs>
            <linearGradient id="ev-active-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={activeColor} stopOpacity={0.28} />
              <stop offset="100%" stopColor={activeColor} stopOpacity={0.01} />
            </linearGradient>
          </defs>

          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Active Climate Zone Highlight Band */}
            <rect
              x={weatherBand.x}
              y={0}
              width={weatherBand.width}
              height={innerHeight}
              rx={6}
              fill={weatherBand.fill}
              stroke={weatherBand.stroke}
              strokeDasharray="3 3"
            />

            {/* Horizontal Y-Axis Gridlines & Labels */}
            {yTicks.map((tick) => {
              const yPos = yScale(tick);
              return (
                <g key={tick} transform={`translate(0, ${yPos})`}>
                  <line
                    x1={0}
                    x2={innerWidth}
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-800"
                    strokeWidth={1}
                  />
                  <text
                    x={-10}
                    y={4}
                    textAnchor="end"
                    className="fill-slate-500 dark:fill-slate-400 text-[11px] font-mono tabular-nums"
                  >
                    {tick} km
                  </text>
                </g>
              );
            })}

            {/* X-Axis Temperature Ticks */}
            {TEMPERATURE_SAMPLES.map((temp) => {
              const xPos = xScale(temp);
              return (
                <g key={temp} transform={`translate(${xPos}, ${innerHeight})`}>
                  <line
                    y1={0}
                    y2={5}
                    stroke="currentColor"
                    className="text-slate-300 dark:text-slate-700"
                  />
                  <text
                    y={20}
                    textAnchor="middle"
                    className={`text-[11px] font-mono tabular-nums ${
                      inspectedPoint.tempC === temp
                        ? 'fill-slate-900 dark:fill-white font-bold'
                        : 'fill-slate-500 dark:fill-slate-400'
                    }`}
                  >
                    {temp}°C
                  </text>
                </g>
              );
            })}

            {/* Subtle Area Fill Below Active Chemistry */}
            <path d={areaPath} fill="url(#ev-active-area-grad)" />

            {/* Inactive Comparison Curves (Dashed) */}
            {(['lifepo4', 'li-ion', 'graphene'] as BatteryChemistry[])
              .filter((chem) => chem !== activeChemistry)
              .map((chem) => (
                <path
                  key={chem}
                  d={paths[chem]}
                  fill="none"
                  stroke={CHEMISTRY_STYLES[chem].color}
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  strokeOpacity={0.75}
                />
              ))}

            {/* Active Chemistry Curve (Solid Prominent) */}
            <path
              d={paths[activeChemistry]}
              fill="none"
              stroke={activeColor}
              strokeWidth={3.2}
              strokeLinecap="round"
            />

            {/* Vertical Crosshair & Data Nodes at Inspected Temp */}
            <line
              x1={xScale(inspectedPoint.tempC)}
              x2={xScale(inspectedPoint.tempC)}
              y1={0}
              y2={innerHeight}
              stroke="currentColor"
              className="text-slate-400 dark:text-slate-500"
              strokeWidth={1.25}
              strokeDasharray="3 3"
            />

            {/* Points on all 3 curves */}
            <circle
              cx={xScale(inspectedPoint.tempC)}
              cy={yScale(inspectedPoint.lifepo4Km)}
              r={activeChemistry === 'lifepo4' ? 5.5 : 4}
              fill={CHEMISTRY_STYLES.lifepo4.color}
              stroke="#ffffff"
              strokeWidth={1.5}
            />
            <circle
              cx={xScale(inspectedPoint.tempC)}
              cy={yScale(inspectedPoint.liIonKm)}
              r={activeChemistry === 'li-ion' ? 5.5 : 4}
              fill={CHEMISTRY_STYLES['li-ion'].color}
              stroke="#ffffff"
              strokeWidth={1.5}
            />
            <circle
              cx={xScale(inspectedPoint.tempC)}
              cy={yScale(inspectedPoint.grapheneKm)}
              r={activeChemistry === 'graphene' ? 5.5 : 4}
              fill={CHEMISTRY_STYLES.graphene.color}
              stroke="#ffffff"
              strokeWidth={1.5}
            />
          </g>
        </svg>
      </div>

      {/* Explanatory Footnote */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/70 dark:border-white/10">
        <span>
          Solid line marks your selected chemistry ({CHEMISTRY_STYLES[activeChemistry].name}); dashed curves compare alternatives under identical speed &amp; load.
        </span>
        <span className="font-mono">Hover or tap chart to inspect 0°C – 45°C range</span>
      </div>
    </div>
  );
};
