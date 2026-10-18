import React from 'react';
import { 
  Printer, 
  ArrowLeft, 
  CheckCircle2, 
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
      
      {/* BARRA SUPERIOR DE ACCIONES (Se oculta al imprimir) */}
      <div className="max-w-5xl mx-auto mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Panel
          </button>
          
          <div className="h-6 w-px bg-slate-200" />
          
          {/* Selector rápido de directivo */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Directivo:</span>
            <select
              value={selectedRoleKey}
              onChange={(e) => onSelectRole(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-sm font-bold text-slate-800 py-1.5 px-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm transition-all hover:shadow active:scale-95"
          >
            <Printer className="w-5 h-5" />
            <span>Imprimir / Descargar PDF</span>
          </button>
        </div>
      </div>

      {/* DOCUMENTO EJECUTIVO FORMAL TIPO A4 */}
      <div className="max-w-5xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-md border border-slate-200 print:border-none print:shadow-none print:p-0 print:rounded-none">
        
        {/* CABECERA OFICIAL INSTITUCIONAL */}
        <header className="border-b-2 border-slate-800 pb-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img 
              src="https://i.ibb.co/YvMv3Qx/Logo-sin-fondo.png" 
              alt="Escudo Institucional" 
              className="h-20 w-auto object-contain filter drop-shadow-sm"
            />
            <div>
              <span className="inline-block bg-slate-800 text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded mb-1">
                Documento Oficial Confidencial
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Informe Ejecutivo de Evaluación 360º
              </h1>
              <p className="text-slate-600 font-medium text-sm">
                Auditoría de Gestión Directiva, Percepción del Claustro y Clima Organizacional
              </p>
            </div>
          </div>

          <div className="text-right border-l-2 border-slate-100 pl-6 hidden sm:block">
            <p className="text-xs uppercase font-bold text-slate-400">Periodo Evaluado</p>
            <p className="text-sm font-bold text-slate-800">{academicYearLabel}</p>
            <p className="text-xs text-slate-500 mt-1">Fecha de Emisión: {currentDate}</p>
          </div>
        </header>

        {/* FICHA TÉCNICA DEL DIRECTIVO */}
        <section className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 print:bg-white print:border-2 print:border-slate-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Cargo Directivo Evaluado
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                {stats.roleTitle}
                {stats.subRoleTitle && (
                  <span className="text-lg font-medium text-slate-500">
                    ({stats.subRoleTitle})
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <Users className="w-4 h-4 text-slate-500" />
                  Muestra participante: <strong className="text-slate-900">{stats.totalEvaluations} docentes/personal</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  {academicYearLabel}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-8">
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                  Valoración Global
                </p>
                <div className={`text-4xl font-black ${stats.diagnostico.color}`}>
                  {stats.globalAverage.toFixed(2)}
                  <span className="text-lg font-bold text-slate-400">/5</span>
                </div>
                <div className="flex justify-center gap-0.5 text-amber-400 mt-1">
                  {[1, 2, 3, 4, 5].map(st => (
                    <Star 
                      key={st} 
                      className={`w-3.5 h-3.5 ${Math.round(stats.globalAverage) >= st ? 'fill-current' : 'text-slate-200 fill-current'}`} 
                    />
                  ))}
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Diagnóstico
                </p>
                <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-extrabold border ${stats.diagnostico.bg} ${stats.diagnostico.color}`}>
                  {stats.diagnostico.texto}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* RADAR Y RESUMEN DIMENSIONAL */}
        <section className="mb-10 break-inside-avoid">
          <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-200 pb-2 mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            1. Perfil de Competencias y Desglose Dimensional
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Gráfico Radar */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50/60 rounded-xl border border-slate-100 print:bg-white print:border-none">
              <RadarChart data={stats.sectionAverages} theme={theme} size={320} />
              <p className="text-[11px] text-slate-400 text-center mt-2 font-medium">
                Representación poligonal del balance de liderazgo (escala 1 a 5)
              </p>
            </div>

            {/* Barras de puntuación por categoría */}
            <div className="space-y-5">
              {stats.sectionAverages.map((sec, idx) => {
                const percent = (sec.average / 5) * 100;
                let barColor = 'bg-blue-600';
                if (sec.average >= 4.5) barColor = 'bg-emerald-600';
                else if (sec.average >= 4.0) barColor = 'bg-blue-600';
                else if (sec.average >= 3.5) barColor = 'bg-amber-500';
                else barColor = 'bg-rose-500';

                return (
                  <div key={idx} className="bg-slate-50 p-3.5 rounded-lg border border-slate-100 print:bg-white print:border print:border-slate-200">
                    <div className="flex justify-between items-center text-sm mb-1.5">
                      <span className="font-bold text-slate-800">{sec.name}</span>
                      <span className="font-black text-slate-900 text-base">{sec.average.toFixed(2)} / 5</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden print:border print:border-slate-300">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Distribución de Votos */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Distribución General de Respuestas
                </p>
                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  {[5, 4, 3, 2, 1].map(sc => {
                    const count = stats.scoreDistribution[sc] || 0;
                    const pct = totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(0) : '0';
                    return (
                      <div key={sc} className="p-2 rounded bg-slate-100 print:bg-white print:border print:border-slate-200">
                        <span className="font-bold text-slate-800">{sc} ★</span>
                        <div className="text-[11px] text-slate-500 font-medium mt-0.5">{pct}% ({count})</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DESTACADOS: FORTALEZAS Y COMPROMISOS DE MEJORA */}
        <section className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6 break-inside-avoid">
          {/* Top Fortalezas */}
          <div className="p-6 rounded-xl bg-emerald-50/70 border border-emerald-200 print:bg-white print:border-2 print:border-emerald-300">
            <h4 className="text-base font-extrabold text-emerald-900 flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Principales Fortalezas Reconocidas
            </h4>
            <div className="space-y-3">
              {stats.topQuestions.map((q, i) => (
                <div key={q.id} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-emerald-100 shadow-sm print:border-slate-200">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-700 leading-snug">{q.text}</p>
                    <p className="text-xs font-extrabold text-emerald-700 mt-1">
                      Puntuación Media: {q.average.toFixed(2)} / 5
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Áreas de Mejora */}
          <div className="p-6 rounded-xl bg-amber-50/70 border border-amber-200 print:bg-white print:border-2 print:border-amber-300">
            <h4 className="text-base font-extrabold text-amber-900 flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Oportunidades de Mejora y Desarrollo
            </h4>
            <div className="space-y-3">
              {stats.lowestQuestions.map((q, i) => (
                <div key={q.id} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-amber-100 shadow-sm print:border-slate-200">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-700 leading-snug">{q.text}</p>
                    <p className="text-xs font-extrabold text-amber-700 mt-1">
                      Puntuación Media: {q.average.toFixed(2)} / 5
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DESGLOSE DETALLADO PREGUNTA A PREGUNTA */}
        <section className="mb-10 break-inside-avoid">
          <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-200 pb-2 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            2. Análisis Pormenorizado por Ítems
          </h3>

          <div className="space-y-6">
            {stats.sectionDetails.map((sec, secIdx) => (
              <div key={secIdx} className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 flex justify-between items-center print:bg-slate-200">
                  <h4 className="font-extrabold text-slate-900 text-sm">{sec.category}</h4>
                  <span className="font-black text-slate-900 text-sm bg-white px-3 py-0.5 rounded-full border border-slate-300">
                    Media Bloque: {sec.average.toFixed(2)} / 5
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {sec.questions.map((q, qIdx) => (
                    <div key={q.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-800">
                          <span className="text-slate-400 mr-2 font-mono">{qIdx + 1}.</span>
                          {q.text}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                          <div 
                            className="bg-blue-600 h-full rounded-full" 
                            style={{ width: `${(q.average / 5) * 100}%` }}
                          />
                        </div>
                        <span className={`text-sm font-black w-14 text-right ${q.average >= 4.0 ? 'text-slate-900' : 'text-amber-700'}`}>
                          {q.average.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* COMENTARIOS CUALITATIVOS ANONIMIZADOS */}
        <section className="mb-10 break-inside-avoid">
          <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            3. Aportaciones Cualitativas Anónimas del Claustro y Personal ({stats.comments.length})
          </h3>
          <p className="text-xs text-slate-500 mb-6 italic">
            Comentarios registrados en campo abierto de manera libre y estrictamente anónima, orientados a la mejora y el reconocimiento:
          </p>

          {stats.comments.length === 0 ? (
            <div className="p-6 bg-slate-50 rounded-xl text-center text-slate-400 text-sm italic">
              No se registraron comentarios cualitativos adicionales para este cargo en el periodo.
            </div>
          ) : (
            <div className="space-y-4">
              {stats.comments.map((comm, idx) => (
                <div 
                  key={idx} 
                  className="p-5 bg-slate-50 rounded-xl border border-slate-200 text-xs md:text-sm text-slate-700 italic relative leading-relaxed print:bg-white print:border print:border-slate-300 break-inside-avoid"
                >
                  <span className="absolute top-2 left-2 text-3xl text-slate-300 font-serif leading-none select-none">“</span>
                  <div className="pl-5 pt-1">{comm.text}</div>
                  {comm.date && (
                    <div className="text-[10px] text-slate-400 text-right mt-2 not-italic">
                      Registrado el {comm.date}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECCIÓN FORMAL DE ENTREGA Y COMPROMISO */}
        <footer className="mt-12 pt-8 border-t-2 border-slate-800 break-inside-avoid">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-600">
            <div>
              <p className="font-bold text-slate-900 uppercase tracking-wider mb-1">
                Finalidad de este Informe
              </p>
              <p className="leading-relaxed">
                Este informe es un instrumento colegial de evaluación formativa. Los datos recogidos reflejan la percepción anónima del equipo y constituyen una guía estratégica para fortalecer la gestión, consolidar el buen clima laboral y responder al ideario educativo del centro.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 print:bg-white print:border print:border-slate-300">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Diligencia de Entrega y Recepción
              </div>
              <p className="text-[11px] leading-snug mb-6">
                Entregado al directivo para su análisis y establecimiento de compromisos en el plan de mejora directiva del centro.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200 text-[10px] text-center text-slate-500">
                <div>
                  <div className="h-10 border-b border-dashed border-slate-300 mb-1" />
                  <span>Por la Titularidad / Dirección</span>
                </div>
                <div>
                  <div className="h-10 border-b border-dashed border-slate-300 mb-1" />
                  <span>Firma del Directivo Evaluado</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-[10px] text-slate-400 border-t border-slate-100 pt-3">
            Portal de Evaluación 360º de la Función Directiva • Colegio San Buenaventura • Documento Privado y Confidencial
          </div>
        </footer>

      </div>
    </div>
  );
};
