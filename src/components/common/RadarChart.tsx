import React from 'react';
import { DimensionAverage, ThemeStyle } from '../../types/survey';

interface RadarChartProps {
  data: DimensionAverage[];
  secondaryData?: DimensionAverage[];
  secondaryLabel?: string;
  primaryLabel?: string;
  theme: ThemeStyle;
  size?: number;
  showValues?: boolean;
}

export const RadarChart: React.FC<RadarChartProps> = ({ 
  data, 
  secondaryData,
  secondaryLabel = "Curso Anterior",
  primaryLabel = "Curso Actual",
  theme, 
  size = 340,
  showValues = true 
}) => {
  if (!data || data.length < 3) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm italic">
        Gráfico no disponible (se requieren al menos 3 dimensiones)
      </div>
    );
  }

  const center = size / 2;
  const radius = (size / 2) - 52;

  const getCoordinatesForValue = (value: number, index: number, total: number) => {
    const angle = (Math.PI / 2) - (2 * Math.PI * index / total);
    const r = (Math.max(0, Math.min(5, value)) / 5) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center - r * Math.sin(angle)
    };
  };

  const polygonPoints = data.map((d, i) => {
    const pos = getCoordinatesForValue(d.average, i, data.length);
    return `${pos.x},${pos.y}`;
  }).join(' ');

  const secondaryPoints = secondaryData && secondaryData.length === data.length
    ? secondaryData.map((d, i) => {
        const pos = getCoordinatesForValue(d.average, i, data.length);
        return `${pos.x},${pos.y}`;
      }).join(' ')
    : null;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <svg 
        viewBox={`0 0 ${size} ${size}`} 
        className="w-full h-auto max-w-[340px] overflow-visible"
      >
        {/* Grilla poligonal concéntrica de 1 a 5 */}
        {[1, 2, 3, 4, 5].map(level => {
          const levelPoints = data.map((_, i) => {
            const pos = getCoordinatesForValue(level, i, data.length);
            return `${pos.x},${pos.y}`;
          }).join(' ');
          return (
            <g key={level}>
              <polygon 
                points={levelPoints} 
                fill={level === 5 ? '#f8fafc' : 'none'} 
                stroke={level === 5 ? '#cbd5e1' : '#e2e8f0'} 
                strokeWidth={level === 5 ? '1.5' : '1'} 
                strokeDasharray={level === 5 ? 'none' : '3 3'}
              />
              <text 
                x={center + 4} 
                y={center - ((level / 5) * radius) + 3} 
                className="text-[9px] fill-slate-300 font-mono select-none"
              >
                {level}
              </text>
            </g>
          );
        })}

        {/* Ejes radiales y etiquetas de las dimensiones */}
        {data.map((d, i) => {
          const axisEnd = getCoordinatesForValue(5, i, data.length);
          const labelPos = getCoordinatesForValue(5.95, i, data.length);
          const words = d.name.split(' ');
          const half = Math.ceil(words.length / 2);
          const label1 = words.slice(0, half).join(' ');
          const label2 = words.slice(half).join(' ');
          
          return (
            <g key={i}>
              <line 
                x1={center} 
                y1={center} 
                x2={axisEnd.x} 
                y2={axisEnd.y} 
                stroke="#cbd5e1" 
                strokeWidth="1" 
              />
              <text 
                x={labelPos.x} 
                y={labelPos.y - 7} 
                textAnchor="middle" 
                dominantBaseline="middle" 
                className="text-[10px] font-semibold fill-slate-600 select-none"
              >
                {label1}
              </text>
              <text 
                x={labelPos.x} 
                y={labelPos.y + 6} 
                textAnchor="middle" 
                dominantBaseline="middle" 
                className="text-[10px] font-semibold fill-slate-600 select-none"
              >
                {label2}
              </text>
              {showValues && (
                <text 
                  x={labelPos.x} 
                  y={labelPos.y + 18} 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  className="text-[10px] font-bold fill-slate-800"
                >
                  {d.average.toFixed(2)}
                </text>
              )}
            </g>
          );
        })}

        {/* Polígono del Curso Anterior (si existe comparativa) */}
        {secondaryPoints && (
          <>
            <polygon 
              points={secondaryPoints} 
              fill="rgba(148, 163, 184, 0.15)" 
              stroke="#64748b" 
              strokeWidth="2" 
              strokeDasharray="4 4"
            />
            {secondaryData?.map((d, i) => {
              const pos = getCoordinatesForValue(d.average, i, data.length);
              return (
                <circle 
                  key={`sec-c-${i}`} 
                  cx={pos.x} 
                  cy={pos.y} 
                  r="3.5" 
                  fill="#64748b" 
                  stroke="#ffffff" 
                  strokeWidth="1"
                />
              );
            })}
          </>
        )}

        {/* Polígono del Curso Actual / Principal */}
        <polygon 
          points={polygonPoints} 
          fill={theme.hexFill} 
          stroke={theme.hexStroke} 
          strokeWidth="2.5" 
          className="transition-all duration-300"
        />

        {/* Puntos en vértices principales */}
        {data.map((d, i) => {
          const pos = getCoordinatesForValue(d.average, i, data.length);
          return (
            <circle 
              key={`point-${i}`} 
              cx={pos.x} 
              cy={pos.y} 
              r="4.5" 
              fill={theme.hexDot} 
              stroke="#ffffff" 
              strokeWidth="1.5"
              className="shadow-sm"
            />
          );
        })}
      </svg>

      {/* Leyenda comparativa si hay dos series */}
      {secondaryData && (
        <div className="flex items-center justify-center gap-6 mt-3 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-5 h-0.5 border-b-2 border-dashed border-slate-500 inline-block" />
            <span>{secondaryLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full inline-block ${theme.progress}`} />
            <span className="font-bold text-slate-900">{primaryLabel}</span>
          </div>
        </div>
      )}
    </div>
  );
};
