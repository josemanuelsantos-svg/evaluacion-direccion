import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, ArrowRight, BarChart3, AlertCircle } from 'lucide-react';
import { RoleStats, ThemeStyle } from '../../types/survey';

interface HistoricalComparisonViewProps {
  statsYearA: RoleStats;
  statsYearB: RoleStats;
  labelYearA: string;
  labelYearB: string;
  theme: ThemeStyle;
  allRoles: Array<{ key: string; title: string }>;
  selectedRoleKey: string;
  onSelectRole: (roleKey: string) => void;
}

export const HistoricalComparisonView: React.FC<HistoricalComparisonViewProps> = ({
  statsYearA,
  statsYearB,
  labelYearA,
  labelYearB,
  theme,
  allRoles,
  selectedRoleKey,
  onSelectRole
}) => {
  const diffGlobal = statsYearB.globalAverage - statsYearA.globalAverage;
  const diffSample = statsYearB.totalEvaluations - statsYearA.totalEvaluations;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* SELECTOR DE CARGO */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Comparativa Interanual de Liderazgo</h3>
          <p className="text-xs text-slate-500">
            Analice la evolución temporal de cada figura directiva contrastando dos cursos escolares.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {allRoles.map(r => (
            <button
              key={r.key}
              onClick={() => onSelectRole(r.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRoleKey === r.key 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r.title}
            </button>
          ))}
        </div>
      </div>

      {/* TARJETAS COMPARATIVAS CABECERA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Periodo A (Anterior) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            Curso Referencia
          </span>
          <h4 className="text-xl font-black text-slate-800 mt-2">{labelYearA}</h4>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-700">
              {statsYearA.globalAverage > 0 ? statsYearA.globalAverage.toFixed(2) : '-'}
            </span>
            <span className="text-sm font-semibold text-slate-400">/ 5.00</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Muestra participante: <strong>{statsYearA.totalEvaluations} personas</strong>
          </p>
        </div>

        {/* Evolución / Delta */}
        <div className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-center text-center ${
          diffGlobal > 0.05 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : diffGlobal < -0.05 
            ? 'bg-rose-50 border-rose-200 text-rose-900' 
            : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}>
          <span className="text-xs font-bold uppercase tracking-wider opacity-70">
            Evolución Interanual
          </span>
          <div className="flex items-center justify-center gap-2 mt-2">
            {diffGlobal > 0.05 ? (
              <TrendingUp className="w-8 h-8 text-emerald-600" />
            ) : diffGlobal < -0.05 ? (
              <TrendingDown className="w-8 h-8 text-rose-600" />
            ) : (
              <Minus className="w-8 h-8 text-slate-400" />
            )}
            <span className="text-3xl font-black">
              {diffGlobal > 0 ? `+${diffGlobal.toFixed(2)}` : diffGlobal.toFixed(2)}
            </span>
          </div>
          <p className="text-xs font-semibold mt-2">
            {diffGlobal > 0.05 
              ? 'Mejora en la percepción global del centro' 
              : diffGlobal < -0.05 
              ? 'Descenso con respecto al curso anterior' 
              : 'Estabilidad en la valoración institucional'}
          </p>
        </div>

        {/* Periodo B (Reciente / Actual) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            Curso Comparado
          </span>
          <h4 className="text-xl font-black text-slate-800 mt-2">{labelYearB}</h4>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-blue-600">
              {statsYearB.globalAverage > 0 ? statsYearB.globalAverage.toFixed(2) : '-'}
            </span>
            <span className="text-sm font-semibold text-slate-400">/ 5.00</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Muestra participante: <strong>{statsYearB.totalEvaluations} personas</strong>
          </p>
        </div>
      </div>

      {/* COMPARATIVA DIMENSIONAL DETALLADA */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h4 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Comparativa por Dimensiones Competenciales
        </h4>

        {statsYearA.sectionAverages.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            Sin datos dimensionales suficientes para comparar.
          </div>
        ) : (
          <div className="space-y-6">
            {statsYearA.sectionAverages.map((secA) => {
              const secB = statsYearB.sectionAverages.find(s => s.name === secA.name);
              const valA = secA.average;
              const valB = secB ? secB.average : 0;
              const delta = valB > 0 ? valB - valA : 0;

              return (
                <div key={secA.name} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <span className="font-bold text-slate-800 text-sm">{secA.name}</span>
                    <div className="flex items-center gap-4 text-xs font-bold">
                      <span className="text-slate-500">{labelYearA}: <strong className="text-slate-800">{valA.toFixed(2)}</strong></span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-blue-600">{labelYearB}: <strong className="text-blue-800">{valB > 0 ? valB.toFixed(2) : 'Sin datos'}</strong></span>
                      {valB > 0 && (
                        <span className={`px-2 py-0.5 rounded font-black ${
                          delta > 0.05 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : delta < -0.05 
                            ? 'bg-rose-100 text-rose-800' 
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {delta > 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-slate-500 h-full rounded-full" style={{ width: `${(valA / 5) * 100}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(valB / 5) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
