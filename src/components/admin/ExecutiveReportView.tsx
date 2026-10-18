import React from 'react';
import { 
  Printer, 
  ArrowLeft, 
  Star, 
  TrendingUp, 
  AlertTriangle, 
  MessageSquare, 
  Award,
  Users,
  Calendar,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { RoleStats, ThemeStyle } from '../../types/survey';
import { RadarChart } from '../common/RadarChart';

interface ExecutiveReportViewProps {
  stats: RoleStats;
  academicYearLabel: string;
  theme: ThemeStyle;
  onBack: () => void;
  allRoles: Array<{ key: string; title: string }>;
  selectedRoleKey: string;
  onSelectRole: (roleKey: string) => void;
}

export const ExecutiveReportView: React.FC<ExecutiveReportViewProps> = ({
  stats,
  academicYearLabel,
  theme,
  onBack,
  allRoles,
  selectedRoleKey,
  onSelectRole
}) => {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  const totalVotes = Object.values(stats.scoreDistribution).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 md:px-8 print:p-0 print:bg-white text-slate-800">
      
      {/* BARRA SUPERIOR DE ACCIONES EN PANTALLA (Oculta al imprimir) */}
      <div className="max-w-5xl mx-auto mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-xs uppercase tracking-wider px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Panel
          </button>
          
          <div className="h-6 w-px bg-slate-200" />
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Directivo:</span>
            <select
              value={selectedRoleKey}
              onChange={(e) => onSelectRole(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-xs font-extrabold text-slate-800 py-1.5 px-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {allRoles.map(r => (
                <option key={r.key} value={r.key}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl shadow transition-all hover:shadow-md cursor-pointer active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Descargar PDF (2-3 Págs)</span>
          </button>
        </div>
      </div>

      {/* DOCUMENTO FORMAL A4 (Paginado exactamente en 2-3 páginas) */}
      <div className="max-w-5xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-md border border-slate-200 print:border-none print:shadow-none print:p-0 print:rounded-none">
        
        {/* ========================================== */}
        {/* PÁGINA 1: FICHA EJECUTIVA & BALANCE GLOBAL */}
        {/* ========================================== */}
        <div className="page-1 print:min-h-[270mm] print:flex print:flex-col print:justify-between">
          <div>
            {/* CABECERA OFICIAL COMPACTA */}
            <header className="border-b-2 border-slate-900 pb-4 mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img 
                  src="https://i.ibb.co/YvMv3Qx/Logo-sin-fondo.png" 
                  alt="Escudo Institucional" 
                  className="h-14 w-auto object-contain filter drop-shadow-xs"
                />
                <div>
                  <span className="inline-block bg-slate-900 text-white text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded mb-0.5">
                    Documento Oficial Confidencial
                  </span>
                  <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                    Informe Ejecutivo de Evaluación 360º
                  </h1>
                  <p className="text-slate-500 font-medium text-xs">
                    Auditoría Colegial de Gestión Directiva, Percepción y Clima Laboral
                  </p>
                </div>
              </div>

              <div className="text-right border-l border-slate-200 pl-4 hidden sm:block print:block text-xs">
                <p className="text-[10px] uppercase font-bold text-slate-400">Periodo Evaluado</p>
                <p className="font-extrabold text-slate-800">{academicYearLabel}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Emisión: {currentDate}</p>
              </div>
            </header>

            {/* FICHA TÉCNICA DEL DIRECTIVO */}
            <section className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 print:bg-white print:border print:border-slate-300 print:p-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Cargo Directivo Evaluado
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                    {stats.roleTitle} {stats.subRoleTitle && <span className="text-slate-500 font-medium text-base">({stats.subRoleTitle})</span>}
                  </h2>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-semibold">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      Muestra: <strong className="text-slate-900">{stats.totalEvaluations} docentes/personal</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {academicYearLabel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-6 shrink-0">
                  <div className="text-center">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Media Global</p>
                    <div className={`text-3xl font-black ${stats.diagnostico.color} leading-none my-0.5`}>
                      {stats.globalAverage.toFixed(2)}
                      <span className="text-sm font-bold text-slate-400">/5</span>
                    </div>
                    <div className="flex justify-center gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map(st => (
                        <Star 
                          key={st} 
                          className={`w-3 h-3 ${Math.round(stats.globalAverage) >= st ? 'fill-current' : 'text-slate-200 fill-current'}`} 
                        />
                      ))}
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Diagnóstico</p>
                    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-black border ${stats.diagnostico.bg} ${stats.diagnostico.color}`}>
                      {stats.diagnostico.texto}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* SECCIÓN 1: RADAR & BARRAS DIMENSIONALES */}
            <section className="mb-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-600" />
                1. Radiografía Dimensional y Perfil Competencial
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-slate-50/60 p-3 rounded-xl border border-slate-100 print:bg-white print:border-none print:p-0">
                {/* Radar Compacto */}
                <div className="flex flex-col items-center justify-center">
                  <RadarChart data={stats.sectionAverages} theme={theme} size={250} showValues={true} />
                </div>

                {/* Barras de dimensión */}
                <div className="space-y-2.5">
                  {stats.sectionAverages.map((sec, idx) => {
                    const percent = (sec.average / 5) * 100;
                    return (
                      <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-bold text-slate-800 text-[11px]">{sec.name}</span>
                          <span className="font-black text-slate-900 text-xs">{sec.average.toFixed(2)} / 5</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden print:border print:border-slate-300">
                          <div 
                            className={`h-full rounded-full ${theme.progress}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}

                  {/* Distribución de Sentimiento */}
                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Distribución de Sentimiento
                    </p>
                    <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                      {[5, 4, 3, 2, 1].map(sc => {
                        const count = stats.scoreDistribution[sc] || 0;
                        const pct = totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(0) : '0';
                        return (
                          <div key={sc} className="p-1 rounded bg-slate-100 border border-slate-200 print:bg-white">
                            <span className="font-bold text-slate-800">{sc}★</span>
                            <div className="text-[9px] text-slate-500 font-semibold">{pct}% ({count})</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECCIÓN 2: FORTALEZAS & ÁREAS DE MEJORA TOP 3 */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2 print:grid-cols-2">
              {/* Fortalezas */}
              <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 print:bg-white print:border print:border-emerald-300">
                <h4 className="text-xs font-black text-emerald-900 flex items-center gap-1.5 mb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Principales Fortalezas Reconocidas
                </h4>
                <div className="space-y-1.5">
                  {stats.topQuestions.map((q, i) => (
                    <div key={q.id} className="flex items-start gap-2 bg-white p-2 rounded-lg border border-emerald-100 shadow-2xs text-[11px]">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-slate-700 leading-snug">{q.text}</p>
                        <p className="font-extrabold text-emerald-700 mt-0.5 text-[10px]">Nota: {q.average.toFixed(2)}/5</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mejoras */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 print:bg-white print:border print:border-amber-300">
                <h4 className="text-xs font-black text-amber-900 flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Oportunidades de Mejora Prioritarias
                </h4>
                <div className="space-y-1.5">
                  {stats.lowestQuestions.map((q, i) => (
                    <div key={q.id} className="flex items-start gap-2 bg-white p-2 rounded-lg border border-amber-100 shadow-2xs text-[11px]">
                      <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-slate-700 leading-snug">{q.text}</p>
                        <p className="font-extrabold text-amber-700 mt-0.5 text-[10px]">Nota: {q.average.toFixed(2)}/5</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Pie de página 1 */}
          <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[9px] text-slate-400">
            <span>Colegio San Buenaventura • Evaluación 360º de la Función Directiva</span>
            <span>Página 1 de 3</span>
          </div>
        </div>

        {/* SALTO DE PÁGINA IMPRESIÓN LIMPIO */}
        <div className="page-break-after hidden print:block" />

        {/* =================================================== */}
        {/* PÁGINA 2: ANÁLISIS DETALLADO PREGUNTA A PREGUNTA */}
        {/* =================================================== */}
        <div className="page-2 print:min-h-[270mm] print:flex print:flex-col print:justify-between pt-8 print:pt-0">
          <div>
            <div className="border-b-2 border-slate-900 pb-2 mb-4 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Evaluación: {stats.roleTitle}</span>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  2. Análisis Pormenorizado por Ítems y Habilidades
                </h3>
              </div>
              <span className="text-[10px] font-extrabold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                Escala 1 a 5
              </span>
            </div>

            {/* Grid compacto de 2 columnas de preguntas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 print:grid-cols-2">
              {stats.sectionDetails.map((sec, secIdx) => (
                <div key={secIdx} className="border border-slate-200 rounded-xl overflow-hidden print:border-slate-300">
                  <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 flex justify-between items-center print:bg-slate-200">
                    <h4 className="font-extrabold text-slate-900 text-[11px]">{sec.category}</h4>
                    <span className="font-black text-slate-900 text-[10px] bg-white px-2 py-0.5 rounded border border-slate-300">
                      Media: {sec.average.toFixed(2)}/5
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {sec.questions.map((q, qIdx) => (
                      <div key={q.id} className="p-2 flex items-center justify-between gap-2 hover:bg-slate-50 text-[10px]">
                        <div className="flex-1">
                          <p className="font-medium text-slate-700 leading-tight">
                            <span className="text-slate-400 font-mono font-bold mr-1">{qIdx + 1}.</span>
                            {q.text}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
                            <div 
                              className={`h-full ${theme.progress}`} 
                              style={{ width: `${(q.average / 5) * 100}%` }}
                            />
                          </div>
                          <span className={`font-black text-[11px] w-8 text-right ${q.average >= 4.0 ? 'text-slate-900' : 'text-amber-700'}`}>
                            {q.average.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pie de página 2 */}
          <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[9px] text-slate-400 mt-4">
            <span>Colegio San Buenaventura • Documento Confidencial</span>
            <span>Página 2 de 3</span>
          </div>
        </div>

        {/* SALTO DE PÁGINA IMPRESIÓN LIMPIO */}
        <div className="page-break-after hidden print:block" />

        {/* ======================================================== */}
        {/* PÁGINA 3: COMENTARIOS CUALITATIVOS & DILIGENCIA DE FIRMA */}
        {/* ======================================================== */}
        <div className="page-3 print:min-h-[270mm] print:flex print:flex-col print:justify-between pt-8 print:pt-0">
          <div>
            <div className="border-b-2 border-slate-900 pb-2 mb-4 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Evaluación: {stats.roleTitle}</span>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  3. Aportaciones Cualitativas del Claustro y Diligencia de Entrega
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-slate-500">
                {stats.comments.length} aportaciones anónimas
              </span>
            </div>

            {/* Grid de comentarios a 2 columnas para optimizar espacio */}
            {stats.comments.length === 0 ? (
              <div className="p-8 bg-slate-50 rounded-xl text-center text-slate-400 text-xs italic border border-slate-200">
                No se registraron comentarios cualitativos adicionales para este cargo en el periodo.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-6 print:grid-cols-2">
                {stats.comments.slice(0, 10).map((comm, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[10px] text-slate-700 italic relative leading-relaxed print:bg-white print:border print:border-slate-300 break-inside-avoid"
                  >
                    <span className="absolute top-1 left-1.5 text-xl text-slate-300 font-serif leading-none select-none">“</span>
                    <div className="pl-3">{comm.text}</div>
                    {comm.date && (
                      <div className="text-[9px] text-slate-400 text-right mt-1 not-italic">
                        {comm.date}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {stats.comments.length > 10 && (
              <p className="text-[10px] text-slate-400 text-center italic mb-4">
                (Mostrando las 10 aportaciones más representativas de {stats.comments.length} registradas en el portal digital)
              </p>
            )}
          </div>

          {/* DILIGENCIA FORMAL DE ENTREGA CON FIRMAS AL PIE */}
          <footer className="pt-4 border-t-2 border-slate-900 break-inside-avoid">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] text-slate-600 mb-4 print:grid-cols-2">
              <div>
                <p className="font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Finalidad Colegial del Informe
                </p>
                <p className="leading-snug">
                  Este informe es una herramienta confidencial de evaluación formativa. Los datos reflejan la percepción constructiva del equipo y sirven para afianzar el liderazgo, la cercanía personal y el ideario franciscano del centro.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 print:bg-white print:border print:border-slate-300">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Diligencia de Entrega y Recepción
                </div>
                <p className="text-[9px] leading-tight mb-4 text-slate-500">
                  Entregado al directivo para su conocimiento, reflexión y establecimiento de compromisos en su plan de desarrollo profesional.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200 text-[9px] text-center text-slate-500">
                  <div>
                    <div className="h-8 border-b border-dashed border-slate-300 mb-1" />
                    <span>Por la Titularidad / Dirección</span>
                  </div>
                  <div>
                    <div className="h-8 border-b border-dashed border-slate-300 mb-1" />
                    <span>Firma del Directivo Evaluado</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-[9px] text-slate-400 pt-2 border-t border-slate-100 flex justify-between items-center">
              <span>Colegio San Buenaventura • Documento Oficial Confidencial</span>
              <span>Página 3 de 3</span>
            </div>
          </footer>

        </div>

      </div>
    </div>
  );
};
