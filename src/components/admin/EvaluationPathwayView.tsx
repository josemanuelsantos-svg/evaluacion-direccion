import React, { useState } from 'react';
import { 
  Compass, 
  TrendingUp, 
  TrendingDown, 
  Printer, 
  ArrowRight, 
  Award, 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import { RoleStats, ThemeStyle } from '../../types/survey';
import { RadarChart } from '../common/RadarChart';
import { generateSkillPathway, SkillProgressItem } from '../../services/competencyService';

interface EvaluationPathwayViewProps {
  statsYearA: RoleStats;
  statsYearB: RoleStats;
  labelYearA: string;
  labelYearB: string;
  theme: ThemeStyle;
  allRoles: Array<{ key: string; title: string }>;
  selectedRoleKey: string;
  onSelectRole: (roleKey: string) => void;
  onBack?: () => void;
}

export const EvaluationPathwayView: React.FC<EvaluationPathwayViewProps> = ({
  statsYearA,
  statsYearB,
  labelYearA,
  labelYearB,
  theme,
  allRoles,
  selectedRoleKey,
  onSelectRole,
  onBack
}) => {
  const [activeFilter, setActiveFilter] = useState<'todas' | 'ascenso' | 'maestria' | 'prioridad'>('todas');

  // Mapear medias por pregunta para ambos años
  const qAveragesA: Record<string, number> = {};
  statsYearA.sectionDetails.forEach(s => {
    s.questions.forEach(q => { qAveragesA[q.id] = q.average; });
  });

  const qAveragesB: Record<string, number> = {};
  statsYearB.sectionDetails.forEach(s => {
    s.questions.forEach(q => { qAveragesB[q.id] = q.average; });
  });

  const pathwaySkills = generateSkillPathway(qAveragesA, qAveragesB, selectedRoleKey);

  const filteredSkills = pathwaySkills.filter(item => {
    if (activeFilter === 'ascenso') return item.evolutionStatus.code === 'en_ascenso';
    if (activeFilter === 'maestria') return item.maturityLevel.code === 'maestria';
    if (activeFilter === 'prioridad') return item.maturityLevel.code === 'prioridad' || item.evolutionStatus.code === 'requiere_atencion';
    return true;
  });

  const deltaGlobal = statsYearB.globalAverage > 0 && statsYearA.globalAverage > 0
    ? statsYearB.globalAverage - statsYearA.globalAverage
    : 0;

  const handlePrint = () => {
    window.print();
  };

  const roleTitle = statsYearB.roleTitle || statsYearA.roleTitle || selectedRoleKey;
  const subTitle = statsYearB.subRoleTitle || statsYearA.subRoleTitle;

  const maestriaCount = pathwaySkills.filter(s => s.maturityLevel.code === 'maestria').length;
  const ascensoCount = pathwaySkills.filter(s => s.delta > 0.05).length;
  const prioridadCount = pathwaySkills.filter(s => s.maturityLevel.code === 'prioridad' || s.delta < -0.1).length;

  return (
    <div className="space-y-8 animate-fade-in pb-16 print:p-0 print:m-0 text-slate-800">
      
      {/* BARRA SUPERIOR DE CONTROL (Oculta en PDF) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Volver"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl md:text-2xl font-black text-slate-900">
                Ruta de Evaluación y Desarrollo Profesional
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Análisis exhaustivo de habilidades, aptitudes y progresión interanual del directivo/docente.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Selector de Cargo */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase">Figura:</span>
            <select
              value={selectedRoleKey}
              onChange={(e) => onSelectRole(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              {allRoles.map(r => (
                <option key={r.key} value={r.key}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          {/* Botón Imprimir Ruta en PDF */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Ruta en PDF</span>
          </button>
        </div>
      </div>

      {/* DOCUMENTO DE LA RUTA (Optimizado para Pantalla e Impresión A4) */}
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0">
        
        {/* CABECERA FORMAL DE LA RUTA */}
        <header className="border-b-2 border-slate-800 pb-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img 
              src="https://i.ibb.co/YvMv3Qx/Logo-sin-fondo.png" 
              alt="Colegio San Buenaventura" 
              className="h-20 w-auto object-contain"
            />
            <div>
              <span className="inline-block bg-blue-100 text-blue-800 text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded mb-1">
                Plan de Acompañamiento y Mejora Continua
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Ruta de Evaluación de Competencias
              </h1>
              <p className="text-xs md:text-sm text-slate-600 font-medium">
                Informe Comparativo Interanual de Liderazgo, Aptitudes Pedagógicas y Clima Laboral
              </p>
            </div>
          </div>

          <div className="text-right border-l-2 border-slate-200 pl-6 hidden sm:block">
            <p className="text-xs uppercase font-bold text-slate-400">Horizonte Temporal</p>
            <p className="text-sm font-bold text-slate-800">{labelYearA} ➔ {labelYearB}</p>
            <p className="text-xs text-slate-500 mt-1">Colegio San Buenaventura</p>
          </div>
        </header>

        {/* FICHA TÉCNICA Y DIAGNÓSTICO DE PROGRESIÓN */}
        <section className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200 mb-8 print:bg-white print:border-2 print:border-slate-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Profesional Evaluado
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-0.5">
                {roleTitle} {subTitle && <span className="text-slate-500 font-semibold">({subTitle})</span>}
              </h2>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-4 font-medium">
                <span>Año Base: <strong>{statsYearA.totalEvaluations} evaluaciones</strong></span>
                <span>•</span>
                <span>Año Seguimiento: <strong>{statsYearB.totalEvaluations} evaluaciones</strong></span>
              </p>
            </div>

            {/* Métricas clave de evolución */}
            <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-8">
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{labelYearA}</p>
                <div className="text-3xl font-extrabold text-slate-600">
                  {statsYearA.globalAverage > 0 ? statsYearA.globalAverage.toFixed(2) : '-'}
                  <span className="text-xs text-slate-400">/5</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Evolución ($\Delta$)</p>
                <div className={`text-3xl font-black flex items-center justify-center gap-1 ${
                  deltaGlobal > 0.05 ? 'text-emerald-600' : deltaGlobal < -0.05 ? 'text-rose-600' : 'text-slate-700'
                }`}>
                  {deltaGlobal > 0 ? `+${deltaGlobal.toFixed(2)}` : deltaGlobal.toFixed(2)}
                </div>
              </div>

              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1">{labelYearB}</p>
                <div className="text-3xl font-black text-blue-600">
                  {statsYearB.globalAverage > 0 ? statsYearB.globalAverage.toFixed(2) : '-'}
                  <span className="text-xs text-slate-400">/5</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RADAR DE COMPETENCIAS SUPERPUESTO (INTERANUAL) */}
        <section className="mb-10 break-inside-avoid">
          <div className="border-b border-slate-200 pb-3 mb-6 flex justify-between items-center">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              1. Balance Dimensional Superpuesto (Evolución de Competencias)
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              Escala de Dominio: 1 (Inicial) a 5 (Maestría)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50/50 p-6 rounded-2xl border border-slate-100 print:bg-white print:border-none">
            {/* Gráfico Radar Dual */}
            <div className="flex justify-center">
              <RadarChart 
                data={statsYearB.sectionAverages.length > 0 ? statsYearB.sectionAverages : statsYearA.sectionAverages} 
                secondaryData={statsYearA.sectionAverages.length > 0 ? statsYearA.sectionAverages : undefined}
                secondaryLabel={labelYearA}
                primaryLabel={labelYearB}
                theme={theme}
                size={330}
              />
            </div>

            {/* Comparativa por Dimensión */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Progresión por Áreas de Gestión
              </h4>

              {statsYearA.sectionAverages.map((secA) => {
                const secB = statsYearB.sectionAverages.find(s => s.name === secA.name);
                const scoreA = secA.average;
                const scoreB = secB ? secB.average : scoreA;
                const deltaSec = scoreB - scoreA;

                return (
                  <div key={secA.name} className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="font-bold text-slate-800">{secA.name}</span>
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="text-slate-400">{scoreA.toFixed(2)}</span>
                        <ArrowRight className="w-3 h-3 text-slate-300" />
                        <span className="font-extrabold text-slate-900">{scoreB.toFixed(2)}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                          deltaSec > 0.05 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : deltaSec < -0.05 
                            ? 'bg-rose-100 text-rose-800' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {deltaSec > 0 ? `+${deltaSec.toFixed(2)}` : deltaSec.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-400 rounded-full" style={{ width: `${(scoreA / 5) * 100}%` }} />
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(scoreB / 5) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* MAPA DE SITUACIÓN ESTRATÉGICA DE HABILIDADES */}
        <section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4 break-inside-avoid print:grid-cols-3">
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 print:bg-white print:border-2 print:border-emerald-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Habilidades en Maestría</span>
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-emerald-700">{maestriaCount}</div>
            <p className="text-xs text-emerald-800/80 mt-1 leading-snug">
              Aptitudes con valoración $\ge 4.5/5$. Representan los puntos de anclaje y fortaleza del centro.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 print:bg-white print:border-2 print:border-blue-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">En Crecimiento Interanual</span>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-black text-blue-700">{ascensoCount}</div>
            <p className="text-xs text-blue-800/80 mt-1 leading-snug">
              Aptitudes que han experimentado un avance positivo respecto al curso anterior.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 print:bg-white print:border-2 print:border-amber-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Prioridad de Refuerzo</span>
              <Target className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-3xl font-black text-amber-700">{prioridadCount}</div>
            <p className="text-xs text-amber-800/80 mt-1 leading-snug">
              Áreas estratégicas donde focalizar los compromisos del nuevo plan de acción.
            </p>
          </div>
        </section>

        {/* MATRIZ EXHAUSTIVA DE HABILIDADES Y APTITUDES */}
        <section className="mb-10 break-inside-avoid">
          <div className="border-b border-slate-200 pb-3 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                2. Matriz Exhaustiva de Aptitudes y Competencias Observables
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Desglose detallado de conductas observables, niveles de madurez y recomendaciones pedagógicas.
              </p>
            </div>

            {/* Filtros rápidos (solo pantalla) */}
            <div className="flex flex-wrap gap-1.5 print:hidden">
              <button
                onClick={() => setActiveFilter('todas')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'todas' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todas ({pathwaySkills.length})
              </button>
              <button
                onClick={() => setActiveFilter('ascenso')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'ascenso' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                En Ascenso ({ascensoCount})
              </button>
              <button
                onClick={() => setActiveFilter('maestria')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'maestria' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Maestría ({maestriaCount})
              </button>
              <button
                onClick={() => setActiveFilter('prioridad')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'prioridad' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                Prioridad ({prioridadCount})
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredSkills.map((skill, index) => {
              const activeScore = skill.scoreYearB > 0 ? skill.scoreYearB : skill.scoreYearA;

              return (
                <div 
                  key={skill.id} 
                  className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all break-inside-avoid print:border print:border-slate-300"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Título de la Habilidad y Descripción */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          {skill.category}
                        </span>
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${skill.maturityLevel.badgeBg} ${skill.maturityLevel.badgeText}`}>
                          {skill.maturityLevel.label}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${skill.evolutionStatus.color}`}>
                          {skill.evolutionStatus.label}
                        </span>
                      </div>

                      <h4 className="text-base font-extrabold text-slate-900 mt-1">
                        <span className="text-slate-400 font-mono text-sm mr-1.5">{index + 1}.</span>
                        {skill.skillName}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {skill.aptitudeDescription}
                      </p>
                    </div>

                    {/* Comparativa Numérica */}
                    <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 print:bg-white print:border-slate-200 self-start">
                      <div className="text-right">
                        <span className="text-[9px] font-bold uppercase text-slate-400 block">{labelYearA.split(' ')[1]}</span>
                        <span className="text-xs font-semibold text-slate-500 font-mono">
                          {skill.scoreYearA > 0 ? skill.scoreYearA.toFixed(2) : '-'}
                        </span>
                      </div>

                      <ArrowRight className="w-3.5 h-3.5 text-slate-300" />

                      <div className="text-right">
                        <span className="text-[9px] font-bold uppercase text-blue-600 block">{labelYearB.split(' ')[1]}</span>
                        <span className="text-sm font-black text-slate-900 font-mono">
                          {skill.scoreYearB > 0 ? skill.scoreYearB.toFixed(2) : skill.scoreYearA.toFixed(2)}
                        </span>
                      </div>

                      <div className="pl-2 border-l border-slate-200">
                        <span className={`text-xs font-black px-2 py-0.5 rounded ${
                          skill.delta > 0.05 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : skill.delta < -0.05 
                            ? 'bg-rose-100 text-rose-800' 
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {skill.delta > 0 ? `+${skill.delta.toFixed(2)}` : skill.delta.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recomendación Pedagógica Específica */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-600 bg-slate-50/60 p-3 rounded-xl print:bg-white print:border print:border-slate-100">
                    <Target className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800">Orientación para el Plan de Desarrollo: </strong>
                      {skill.recommendation}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* PLAN DE RUTA: 3 METAS Y COMPROMISOS ESTRATÉGICOS PARA EL PRÓXIMO CURSO */}
        <section className="mb-10 bg-slate-50/80 p-8 rounded-3xl border border-slate-200 break-inside-avoid print:bg-white print:border-2 print:border-slate-300">
          <div className="border-b border-slate-200 pb-3 mb-6 flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              3. Itinerario de Compromisos y Metas para el Nuevo Curso
            </h3>
            <span className="text-xs font-bold text-slate-500 uppercase">
              Acuerdo Bilateral
            </span>
          </div>

          <div className="space-y-6">
            {/* Meta 1 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                <h4 className="text-sm font-bold text-slate-900">Consolidación y Proyección de Fortalezas Principales</h4>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Mantener los estándares de excelencia en las habilidades de maestría reconocidas por el claustro y compartir las buenas prácticas con los coordinadores de ciclo.
              </p>
              <div className="text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-500">
                <strong>Indicador de Éxito:</strong> Mantener una valoración $\ge 4.5$ en la auditoría 360º del próximo curso escolar.
              </div>
            </div>

            {/* Meta 2 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">2</span>
                <h4 className="text-sm font-bold text-slate-900">Acompañamiento y Mejora en el Área Prioritaria</h4>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Implementar medidas organizativas o de comunicación que reduzcan los puntos de fricción detectados en los ítems con margen de mejora.
              </p>
              <div className="text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-500">
                <strong>Indicador de Éxito:</strong> Registro de un avance interanual ($\Delta \ge +0.25$) en los ítems prioritarios evaluados.
              </div>
            </div>

            {/* Meta 3 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">3</span>
                <h4 className="text-sm font-bold text-slate-900">Innovación y Cuidado del Clima Humano Franciscano</h4>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Reforzar la presencia cercana, el agradecimiento explícito por el trabajo bien hecho y los momentos fraternos de comunidad en el centro.
              </p>
              <div className="text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-500">
                <strong>Indicador de Éxito:</strong> Aumento en el índice de satisfacción cualitativa en los comentarios anónimos del personal.
              </div>
            </div>
          </div>
        </section>

        {/* ACTA DE COMPROMISO Y FIRMAS DE SEGUIMIENTO */}
        <footer className="pt-8 border-t-2 border-slate-800 break-inside-avoid">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-600">
            <div>
              <p className="font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Carácter Formativo y Confidencial de la Ruta
              </p>
              <p className="leading-relaxed">
                Este documento es una herramienta colegiada de desarrollo profesional continuo. Establece las bases compartidas entre la Titularidad / Dirección y la persona evaluada para potenciar su vocación de servicio, su liderazgo pedagógico y la fidelidad al ideario franciscano del centro.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 print:bg-white print:border print:border-slate-300">
              <p className="text-xs font-bold text-slate-900 mb-1">
                Conformidad y Acuerdos de la Entrevista de Evaluación
              </p>
              <p className="text-[11px] text-slate-500 mb-6">
                Reunión celebrada para analizar la progresión de competencias y fijar los objetivos de desarrollo.
              </p>

              <div className="grid grid-cols-2 gap-4 text-center text-[10px] text-slate-500">
                <div>
                  <div className="h-10 border-b border-dashed border-slate-300 mb-1" />
                  <span>Por la Titularidad / Dirección</span>
                </div>
                <div>
                  <div className="h-10 border-b border-dashed border-slate-300 mb-1" />
                  <span>Firma del Profesional Evaluado</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-[10px] text-slate-400 border-t border-slate-100 pt-3">
            Ruta de Evaluación 360º de Competencias Docentes y Directivas • Colegio San Buenaventura • Documento Confidencial
          </div>
        </footer>

      </div>
    </div>
  );
};
