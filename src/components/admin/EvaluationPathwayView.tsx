import React, { useState } from 'react';
import { 
  Compass, 
  TrendingUp, 
  Printer, 
  ArrowRight, 
  Award, 
  Target, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import { RoleStats, ThemeStyle } from '../../types/survey';
import { RadarChart } from '../common/RadarChart';
import { generateSkillPathway } from '../../services/competencyService';

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
      
      {/* BARRA DE ACCIÓN EN PANTALLA (Oculta al imprimir) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
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
              <Compass className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl md:text-2xl font-black text-slate-900">
                Ruta de Evaluación y Desarrollo Profesional
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Análisis comparativo de aptitudes y proyección interanual (Formato A4 optimizado).
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase">Directivo:</span>
            <select
              value={selectedRoleKey}
              onChange={(e) => onSelectRole(e.target.value)}
              className="bg-transparent text-xs font-extrabold text-slate-800 outline-none cursor-pointer"
            >
              {allRoles.map(r => (
                <option key={r.key} value={r.key}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Ruta (3 Páginas)</span>
          </button>
        </div>
      </div>

      {/* DOCUMENTO FORMAL A4 */}
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0">
        
        {/* ========================================================= */}
        {/* PÁGINA 1: CABECERA, RADAR SUPERPUESTO & MAPA DE APTITUDES */}
        {/* ========================================================= */}
        <div className="page-1 print:min-h-[270mm] print:flex print:flex-col print:justify-between">
          <div>
            {/* CABECERA OFICIAL */}
            <header className="border-b-2 border-slate-900 pb-3 mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src="https://i.ibb.co/YvMv3Qx/Logo-sin-fondo.png" 
                  alt="Colegio San Buenaventura" 
                  className="h-14 w-auto object-contain"
                />
                <div>
                  <span className="inline-block bg-indigo-100 text-indigo-900 text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded mb-0.5">
                    Plan de Acompañamiento y Crecimiento
                  </span>
                  <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                    Ruta de Evaluación y Desarrollo Profesional
                  </h1>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Diagnóstico Comparativo de Habilidades, Aptitudes y Plan de Mejora Continua
                  </p>
                </div>
              </div>

              <div className="text-right border-l border-slate-200 pl-4 hidden sm:block print:block text-xs">
                <p className="text-[9px] uppercase font-bold text-slate-400">Periodo Interanual</p>
                <p className="font-extrabold text-slate-800">{labelYearA.split(' ')[1]} ➔ {labelYearB.split(' ')[1]}</p>
                <p className="text-[9px] text-slate-500 mt-0.5">Colegio San Buenaventura</p>
              </div>
            </header>

            {/* FICHA TÉCNICA INTERANUAL */}
            <section className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 print:bg-white print:border print:border-slate-300 print:p-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Profesional Evaluado
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                    {roleTitle} {subTitle && <span className="text-slate-500 font-semibold text-base">({subTitle})</span>}
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    Muestra comparada: <strong>{statsYearA.totalEvaluations}</strong> (Año Base) vs <strong>{statsYearB.totalEvaluations}</strong> (Año Actual)
                  </p>
                </div>

                <div className="flex items-center gap-5 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-6 shrink-0">
                  <div className="text-center">
                    <p className="text-[9px] font-bold uppercase text-slate-400">{labelYearA.split(' ')[1]}</p>
                    <div className="text-2xl font-black text-slate-600">
                      {statsYearA.globalAverage > 0 ? statsYearA.globalAverage.toFixed(2) : '-'}
                      <span className="text-xs text-slate-400">/5</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-[9px] font-bold uppercase text-slate-400">Evolución ($\Delta$)</p>
                    <div className={`text-2xl font-black ${
                      deltaGlobal > 0.05 ? 'text-emerald-600' : deltaGlobal < -0.05 ? 'text-rose-600' : 'text-slate-700'
                    }`}>
                      {deltaGlobal > 0 ? `+${deltaGlobal.toFixed(2)}` : deltaGlobal.toFixed(2)}
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-[9px] font-bold uppercase text-blue-600">{labelYearB.split(' ')[1]}</p>
                    <div className="text-2xl font-black text-blue-600">
                      {statsYearB.globalAverage > 0 ? statsYearB.globalAverage.toFixed(2) : '-'}
                      <span className="text-xs text-slate-400">/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECCIÓN 1: RADAR SUPERPUESTO */}
            <section className="mb-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-600" />
                1. Balance Competencial Superpuesto (Expansión Interanual)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-slate-50/60 p-3 rounded-xl border border-slate-100 print:bg-white print:border-none print:p-0">
                <div className="flex justify-center">
                  <RadarChart 
                    data={statsYearB.sectionAverages.length > 0 ? statsYearB.sectionAverages : statsYearA.sectionAverages} 
                    secondaryData={statsYearA.sectionAverages.length > 0 ? statsYearA.sectionAverages : undefined}
                    secondaryLabel={labelYearA}
                    primaryLabel={labelYearB}
                    theme={theme}
                    size={240}
                  />
                </div>

                <div className="space-y-2">
                  {statsYearA.sectionAverages.map((secA) => {
                    const secB = statsYearB.sectionAverages.find(s => s.name === secA.name);
                    const scoreA = secA.average;
                    const scoreB = secB ? secB.average : scoreA;
                    const deltaSec = scoreB - scoreA;

                    return (
                      <div key={secA.name} className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs text-[10px]">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-slate-800">{secA.name}</span>
                          <div className="flex items-center gap-1.5 font-mono">
                            <span className="text-slate-400">{scoreA.toFixed(2)}</span>
                            <ArrowRight className="w-2.5 h-2.5 text-slate-300" />
                            <span className="font-black text-slate-900">{scoreB.toFixed(2)}</span>
                            <span className={`px-1 py-0.2 rounded text-[9px] font-black ${
                              deltaSec > 0.05 ? 'bg-emerald-100 text-emerald-800' : deltaSec < -0.05 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {deltaSec > 0 ? `+${deltaSec.toFixed(2)}` : deltaSec.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-400 rounded-full" style={{ width: `${(scoreA / 5) * 100}%` }} />
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(scoreB / 5) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* MAPA DE SITUACIÓN DE APTITUDES */}
            <section className="grid grid-cols-3 gap-3 mb-2 print:grid-cols-3">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 print:bg-white print:border print:border-emerald-300 text-center">
                <span className="text-[9px] font-bold uppercase text-emerald-800">Maestría ($\ge 4.5$)</span>
                <div className="text-2xl font-black text-emerald-700 my-0.5">{maestriaCount}</div>
                <p className="text-[9px] text-emerald-900/80 leading-tight">Fortalezas consolidadas</p>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 print:bg-white print:border print:border-blue-300 text-center">
                <span className="text-[9px] font-bold uppercase text-blue-800">En Crecimiento</span>
                <div className="text-2xl font-black text-blue-700 my-0.5">{ascensoCount}</div>
                <p className="text-[9px] text-blue-900/80 leading-tight">Avance respecto al año base</p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 print:bg-white print:border print:border-amber-300 text-center">
                <span className="text-[9px] font-bold uppercase text-amber-800">Prioridad de Refuerzo</span>
                <div className="text-2xl font-black text-amber-700 my-0.5">{prioridadCount}</div>
                <p className="text-[9px] text-amber-900/80 leading-tight">Foco del plan de acción</p>
              </div>
            </section>
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[9px] text-slate-400">
            <span>Ruta de Evaluación 360º • Colegio San Buenaventura</span>
            <span>Página 1 de 3</span>
          </div>
        </div>

        {/* SALTO DE PÁGINA IMPRESIÓN LIMPIO */}
        <div className="page-break-after hidden print:block" />

        {/* ===================================================== */}
        {/* PÁGINA 2: MATRIZ EXHAUSTIVA DE APTITUDES OBSERVABLES */}
        {/* ===================================================== */}
        <div className="page-2 print:min-h-[270mm] print:flex print:flex-col print:justify-between pt-8 print:pt-0">
          <div>
            <div className="border-b-2 border-slate-900 pb-2 mb-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Profesional: {roleTitle}</span>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  2. Matriz Exhaustiva de Aptitudes y Conductas Observables
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-slate-500">
                {pathwaySkills.length} competencias valoradas
              </span>
            </div>

            {/* Grid compacto de 2 columnas con las habilidades */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 print:grid-cols-2">
              {pathwaySkills.map((skill, index) => (
                <div 
                  key={skill.id} 
                  className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs text-[10px] break-inside-avoid print:border-slate-300"
                >
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <span className="font-extrabold text-slate-900 leading-tight flex-1">
                      <span className="text-slate-400 font-mono mr-1">{index + 1}.</span>
                      {skill.skillName}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded font-black text-[9px] shrink-0 border ${skill.maturityLevel.badgeBg} ${skill.maturityLevel.badgeText}`}>
                      {skill.maturityLevel.label.split(' ')[0]}
                    </span>
                  </div>

                  <p className="text-slate-500 text-[9px] leading-snug mb-1.5">
                    {skill.aptitudeDescription}
                  </p>

                  <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded-lg border border-slate-100 print:bg-white text-[9px]">
                    <div className="flex items-center gap-1 font-mono">
                      <span className="text-slate-400">{labelYearA.split(' ')[1]}: {skill.scoreYearA > 0 ? skill.scoreYearA.toFixed(2) : '-'}</span>
                      <ArrowRight className="w-2.5 h-2.5 text-slate-300" />
                      <span className="font-bold text-slate-800">{labelYearB.split(' ')[1]}: {skill.scoreYearB > 0 ? skill.scoreYearB.toFixed(2) : skill.scoreYearA.toFixed(2)}</span>
                    </div>

                    <span className={`px-1.5 py-0.2 rounded font-black ${
                      skill.delta > 0.05 ? 'bg-emerald-100 text-emerald-800' : skill.delta < -0.05 ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {skill.delta > 0 ? `+${skill.delta.toFixed(2)}` : skill.delta.toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-1.5 text-[9px] text-slate-600 bg-indigo-50/40 p-1.5 rounded border border-indigo-100/60 leading-snug">
                    <strong className="text-indigo-900">Orientación: </strong>{skill.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[9px] text-slate-400 mt-4">
            <span>Colegio San Buenaventura • Documento Confidencial</span>
            <span>Página 2 de 3</span>
          </div>
        </div>

        {/* SALTO DE PÁGINA IMPRESIÓN LIMPIO */}
        <div className="page-break-after hidden print:block" />

        {/* ======================================================== */}
        {/* PÁGINA 3: PLAN DE COMPROMISOS & DILIGENCIA DE FIRMA */}
        {/* ======================================================== */}
        <div className="page-3 print:min-h-[270mm] print:flex print:flex-col print:justify-between pt-8 print:pt-0">
          <div>
            <div className="border-b-2 border-slate-900 pb-2 mb-4 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Horizonte de Crecimiento</span>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-indigo-600" />
                  3. Itinerario de Compromisos y Metas para el Próximo Curso
                </h3>
              </div>
              <span className="text-[10px] font-extrabold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                Acuerdo Bilateral
              </span>
            </div>

            <div className="space-y-4 mb-6">
              {/* Meta 1 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 print:bg-white print:border-slate-300">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">1</span>
                  <h4 className="text-xs font-bold text-slate-900">Consolidación y Proyección de Fortalezas Principales</h4>
                </div>
                <p className="text-[10px] text-slate-600 mb-2 leading-relaxed">
                  Preservar los estándares en las habilidades de maestría reconocidas por el claustro y compartir buenas prácticas mediante sesiones de modelado con el resto del equipo.
                </p>
                <div className="text-[9px] bg-white p-2 rounded-lg border border-slate-200 text-slate-500 font-medium">
                  <strong>Indicador de Éxito:</strong> Mantener una valoración $\ge 4.5$ en la auditoría del próximo curso escolar.
                </div>
              </div>

              {/* Meta 2 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 print:bg-white print:border-slate-300">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center">2</span>
                  <h4 className="text-xs font-bold text-slate-900">Acompañamiento y Mejora en el Área Prioritaria</h4>
                </div>
                <p className="text-[10px] text-slate-600 mb-2 leading-relaxed">
                  Implementar medidas organizativas y de comunicación que reduzcan los puntos de fricción detectados en los ítems con margen de mejora.
                </p>
                <div className="text-[9px] bg-white p-2 rounded-lg border border-slate-200 text-slate-500 font-medium">
                  <strong>Indicador de Éxito:</strong> Aumento interanual ($\Delta \ge +0.25$) en los ítems prioritarios evaluados.
                </div>
              </div>

              {/* Meta 3 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 print:bg-white print:border-slate-300">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">3</span>
                  <h4 className="text-xs font-bold text-slate-900">Innovación y Cuidado del Clima Humano Franciscano</h4>
                </div>
                <p className="text-[10px] text-slate-600 mb-2 leading-relaxed">
                  Reforzar la presencia cercana, el reconocimiento explícito del esfuerzo docente y los momentos fraternos de comunidad en el centro.
                </p>
                <div className="text-[9px] bg-white p-2 rounded-lg border border-slate-200 text-slate-500 font-medium">
                  <strong>Indicador de Éxito:</strong> Reducción de dispersión en comentarios cualitativos e incremento de satisfacción general.
                </div>
              </div>
            </div>
          </div>

          {/* DILIGENCIA FORMAL DE ENTREGA CON FIRMAS */}
          <footer className="pt-4 border-t-2 border-slate-900 break-inside-avoid">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] text-slate-600 mb-4 print:grid-cols-2">
              <div>
                <p className="font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Carácter Formativo y Confidencial
                </p>
                <p className="leading-snug">
                  Este itinerario es una herramienta colegiada de desarrollo profesional continuo. Establece las bases compartidas entre la Titularidad / Dirección y la persona evaluada para potenciar su vocación educativa y liderazgo franciscano.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 print:bg-white print:border print:border-slate-300">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  Diligencia de Entrevista y Compromisos
                </div>
                <p className="text-[9px] leading-tight mb-4 text-slate-500">
                  Reunión celebrada para analizar la progresión de competencias y fijar los objetivos del curso.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200 text-[9px] text-center text-slate-500">
                  <div>
                    <div className="h-8 border-b border-dashed border-slate-300 mb-1" />
                    <span>Por la Titularidad / Dirección</span>
                  </div>
                  <div>
                    <div className="h-8 border-b border-dashed border-slate-300 mb-1" />
                    <span>Firma del Profesional Evaluado</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-[9px] text-slate-400 pt-2 border-t border-slate-100 flex justify-between items-center">
              <span>Ruta de Evaluación 360º de Competencias Docentes y Directivas • Colegio San Buenaventura</span>
              <span>Página 3 de 3</span>
            </div>
          </footer>

        </div>

      </div>
    </div>
  );
};
