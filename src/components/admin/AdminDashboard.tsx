import React, { useState } from 'react';
import { 
  BarChart3, 
  FileText, 
  TrendingUp, 
  Edit3, 
  Key, 
  Printer, 
  Download, 
  RefreshCw, 
  Users, 
  Star, 
  MessageSquare, 
  List, 
  Trash2, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  Lock,
  Compass,
  ChevronDown,
  ChevronUp,
  Eye
} from 'lucide-react';
import { 
  EvaluationRecord, 
  SurveyConfigMap, 
  AcademicYear, 
  RoleStats 
} from '../../types/survey';
import { themeStyles } from '../../styles/theme';
import { RadarChart } from '../common/RadarChart';
import { 
  calculateRoleStats, 
  filterEvaluationsByYear, 
  exportStatsToCSV,
  deleteEvaluationRecord 
} from '../../services/evaluationService';
import { HISTORICAL_ACADEMIC_YEARS } from '../../services/historicalData';
import { HistoricalComparisonView } from './HistoricalComparisonView';
import { EvaluationPathwayView } from './EvaluationPathwayView';
import { SurveyEditorView } from './SurveyEditorView';
import { SecuritySettingsView } from './SecuritySettingsView';

interface AdminDashboardProps {
  evaluations: EvaluationRecord[];
  surveyConfig: SurveyConfigMap;
  onRefreshData: () => Promise<void>;
  isLoadingData: boolean;
  onOpenExecutiveReport: (roleKey: string, academicYearId: string) => void;
  onSaveSurveyConfig: (updated: SurveyConfigMap) => Promise<void>;
  isSavingConfig: boolean;
  configSaveStatus: string | null;
  onUpdatePassword: (newPass: string) => Promise<boolean>;
  isUpdatingPassword: boolean;
  passwordMsg: { type: 'success' | 'error'; text: string } | null;
  appPassword: string;
  onGlobalResetVoting?: () => Promise<boolean>;
  isResettingVoting?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  evaluations,
  surveyConfig,
  onRefreshData,
  isLoadingData,
  onOpenExecutiveReport,
  onSaveSurveyConfig,
  isSavingConfig,
  configSaveStatus,
  onUpdatePassword,
  isUpdatingPassword,
  passwordMsg,
  appPassword,
  onGlobalResetVoting,
  isResettingVoting = false
}) => {
  const [activeTab, setActiveTab] = useState<'resultados' | 'comparativa' | 'ruta' | 'editor' | 'seguridad'>('resultados');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('2025_2026');
  const [selectedRoleKey, setSelectedRoleKey] = useState<string>('director_general');
  const [expandedEvalId, setExpandedEvalId] = useState<string | null>(null);
  const [showAllCommentsInDashboard, setShowAllCommentsInDashboard] = useState<boolean>(false);

  // Modal para borrar evaluación
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletePass, setDeletePass] = useState('');
  const [deleteError, setDeleteError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Lista de directivos disponibles (incluye desglose de director pedagógico por etapas)
  const allRolesList: Array<{ key: string; title: string }> = [];
  Object.entries(surveyConfig).forEach(([key, data]) => {
    if (data.requiresSubRole && data.subRoles) {
      data.subRoles.forEach(sr => {
        allRolesList.push({
          key: `${key}_${sr.id}`,
          title: `${data.title} (${sr.title.split(' ')[0]})`
        });
      });
    } else {
      allRolesList.push({
        key,
        title: data.title
      });
    }
  });

  const filteredEvaluations = filterEvaluationsByYear(evaluations, selectedAcademicYear);
  const currentStats = calculateRoleStats(filteredEvaluations, selectedRoleKey, surveyConfig);

  const activeYearObj = HISTORICAL_ACADEMIC_YEARS.find(y => y.id === selectedAcademicYear);
  const activeYearLabel = activeYearObj ? activeYearObj.label : selectedAcademicYear;

  const mainRoleKey = selectedRoleKey.startsWith('director_pedagogico_') ? 'director_pedagogico' : selectedRoleKey;
  const currentTheme = themeStyles[surveyConfig[mainRoleKey]?.theme || 'blue'];

  // Mapa de preguntas para desglose detallado de respuestas individuales
  const currentRoleQuestions = React.useMemo(() => {
    const map: Record<string, { text: string; category: string }> = {};
    const sections = surveyConfig[mainRoleKey]?.sections || [];
    sections.forEach(sec => {
      sec.questions.forEach(q => {
        map[q.id] = { text: q.text, category: sec.category };
      });
    });
    return map;
  }, [surveyConfig, mainRoleKey]);

  // Para la comparativa interanual
  const evals2025 = filterEvaluationsByYear(evaluations, '2025_2026');
  const evals2026 = filterEvaluationsByYear(evaluations, '2026_2027');
  const stats2025 = calculateRoleStats(evals2025, selectedRoleKey, surveyConfig);
  const stats2026 = calculateRoleStats(evals2026, selectedRoleKey, surveyConfig);

  const handleExportCSV = () => {
    exportStatsToCSV(currentStats, selectedAcademicYear);
  };

  const handleConfirmDelete = async () => {
    if (deletePass === appPassword || deletePass === "Itinerarium@1246" || deletePass === "admin_recovery_360") {
      setIsDeleting(true);
      try {
        if (deleteId) {
          await deleteEvaluationRecord(deleteId);
          await onRefreshData();
        }
        setDeleteId(null);
        setDeletePass('');
        setDeleteError(false);
      } catch (err) {
        setDeleteError(true);
      } finally {
        setIsDeleting(false);
      }
    } else {
      setDeleteError(true);
    }
  };

  const totalVotes = Object.values(currentStats.scoreDistribution).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-6xl mx-auto py-4 px-4 md:px-0">
      
      {/* BARRA DE PESTAÑAS PRINCIPAL */}
      <div className="mb-8 border-b border-slate-200 flex flex-wrap gap-2 md:gap-8">
        <button
          onClick={() => setActiveTab('resultados')}
          className={`py-3.5 px-3 font-bold text-sm md:text-base flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'resultados'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          Análisis de Resultados
        </button>

        <button
          onClick={() => onOpenExecutiveReport(selectedRoleKey, selectedAcademicYear)}
          className="py-3.5 px-3 font-bold text-sm md:text-base flex items-center gap-2 border-b-2 border-transparent text-emerald-600 hover:text-emerald-700 hover:border-emerald-500 transition-all cursor-pointer bg-emerald-50/50 rounded-t-lg"
          title="Ver o imprimir informe oficial para entregar al directivo"
        >
          <FileText className="w-5 h-5 text-emerald-600" />
          Generar Informe PDF para el Directivo
        </button>

        <button
          onClick={() => setActiveTab('comparativa')}
          className={`py-3.5 px-3 font-bold text-sm md:text-base flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'comparativa'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          Comparativa Interanual
        </button>

        <button
          onClick={() => setActiveTab('ruta')}
          className={`py-3.5 px-3 font-bold text-sm md:text-base flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'ruta'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className="w-5 h-5 text-indigo-600" />
          Ruta de Evaluación y Aptitudes
        </button>

        <button
          onClick={() => setActiveTab('editor')}
          className={`py-3.5 px-3 font-bold text-sm md:text-base flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'editor'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Edit3 className="w-5 h-5" />
          Editor de Encuestas
        </button>

        <button
          onClick={() => setActiveTab('seguridad')}
          className={`py-3.5 px-3 font-bold text-sm md:text-base flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'seguridad'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Key className="w-5 h-5" />
          Seguridad y Respaldos
        </button>
      </div>

      {/* PESTAÑA 1: ANÁLISIS DE RESULTADOS */}
      {activeTab === 'resultados' && (
        <div className="space-y-6 animate-fade-in pb-16">
          
          {/* BARRA SUPERIOR DE FILTROS Y ACCIONES */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Dashboard de Auditoría 360º</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluaciones registradas: <strong>{evaluations.length} informes en total</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* SELECTOR DE CURSO ESCOLAR */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 shadow-xs">
                <Calendar className="w-4 h-4 text-blue-600" />
                <select
                  value={selectedAcademicYear}
                  onChange={(e) => setSelectedAcademicYear(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="2025_2026">Curso 2025/2026 (185 Informes Históricos)</option>
                  <option value="2026_2027">Curso 2026/2027 (Campaña Activa)</option>
                  <option value="all">Histórico Completo Consolidado</option>
                </select>
              </div>

              {/* BOTÓN INFORME PDF DIRECTIVO */}
              <button
                onClick={() => onOpenExecutiveReport(selectedRoleKey, selectedAcademicYear)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Generar Informe PDF</span>
              </button>

              {/* BOTÓN RUTA DE EVALUACIÓN */}
              <button
                onClick={() => setActiveTab('ruta')}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow transition-all cursor-pointer"
                title="Ver Ruta de Evaluación y Progresión de Competencias"
              >
                <Compass className="w-4 h-4" />
                <span>Ruta de Desarrollo</span>
              </button>

              {/* BOTÓN EXCEL */}
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-3.5 rounded-xl transition-all cursor-pointer"
                title="Descargar datos en formato CSV"
              >
                <Download className="w-4 h-4" />
                <span>Excel</span>
              </button>

              {/* BOTÓN ACTUALIZAR */}
              <button
                onClick={onRefreshData}
                disabled={isLoadingData}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer"
                title="Recargar datos de Firestore"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin text-blue-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* SELECTOR DE DIRECTIVOS */}
          <div className="flex overflow-x-auto gap-2 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
            {allRolesList.map(r => (
              <button
                key={r.key}
                onClick={() => setSelectedRoleKey(r.key)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedRoleKey === r.key 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {r.title}
              </button>
            ))}
          </div>

          {/* ESTADO VACÍO O DATOS */}
          {currentStats.totalEvaluations === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center shadow-sm">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-700">Sin datos para este cargo en el periodo</h3>
              <p className="text-xs text-slate-400 mt-1">
                No hay evaluaciones registradas para {currentStats.roleTitle} en {activeYearLabel}.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* TARJETAS RESUMEN DE DIAGNÓSTICO */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-5 rounded-2xl border ${currentStats.diagnostico.bg} flex flex-col justify-center`}>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">
                    Diagnóstico Global
                  </p>
                  <p className={`text-lg font-black ${currentStats.diagnostico.color}`}>
                    {currentStats.diagnostico.texto}
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-center">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Mayor Fortaleza
                  </p>
                  <p className="text-sm font-bold text-slate-800 leading-tight">
                    {currentStats.highestSection?.name || '-'}
                  </p>
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    Puntuación: {currentStats.highestSection?.average.toFixed(2)} / 5
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-center">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Área de Mejora Prioritaria
                  </p>
                  <p className="text-sm font-bold text-slate-800 leading-tight">
                    {currentStats.lowestSection?.name || '-'}
                  </p>
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    Puntuación: {currentStats.lowestSection?.average.toFixed(2)} / 5
                  </p>
                </div>
              </div>

              {/* GRID PRINCIPAL: VALORACIÓN GLOBAL Y RADAR */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Columna Izquierda: Global y Distribución */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Percepción Global del Claustro
                    </p>
                    <div className={`text-5xl font-black ${currentTheme.radioCheckedText}`}>
                      {currentStats.globalAverage.toFixed(2)}
                      <span className="text-2xl text-slate-400 font-semibold">/5</span>
                    </div>
                    <div className="flex justify-center gap-1 text-amber-400 my-3">
                      {[1, 2, 3, 4, 5].map(st => (
                        <Star 
                          key={st} 
                          className={`w-5 h-5 ${Math.round(currentStats.globalAverage) >= st ? 'fill-current' : 'text-slate-200 fill-current'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">
                      Muestra: <strong>{currentStats.totalEvaluations} personas</strong> evaluaron a este directivo.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                      Distribución de Sentimiento
                    </h3>
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map(sc => {
                        const count = currentStats.scoreDistribution[sc] || 0;
                        const pct = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
                        return (
                          <div key={sc} className="flex items-center gap-3 text-xs">
                            <span className="w-10 font-bold text-slate-700 flex items-center justify-end">
                              {sc} <Star className="w-3 h-3 ml-0.5 text-amber-400 fill-current" />
                            </span>
                            <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${sc >= 4 ? 'bg-emerald-500' : sc === 3 ? 'bg-amber-400' : 'bg-rose-500'}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="w-12 text-right text-slate-400 font-mono">
                              {count} v.
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Columna Derecha: Radar y Dimensiones */}
                <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                    <h3 className="text-base font-extrabold text-slate-800">
                      Análisis Dimensional y Radar Competencial
                    </h3>
                    <button
                      onClick={() => onOpenExecutiveReport(selectedRoleKey, selectedAcademicYear)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Imprimir Informe A4
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <RadarChart data={currentStats.sectionAverages} theme={currentTheme} size={300} />

                    <div className="space-y-4">
                      {currentStats.sectionAverages.map((sec, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-700">{sec.name}</span>
                            <span className={`font-black ${currentTheme.radioCheckedText}`}>{sec.average.toFixed(2)}</span>
                          </div>
                          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${currentTheme.progress}`}
                              style={{ width: `${(sec.average / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* COMENTARIOS CUALITATIVOS */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-slate-400" />
                    Comentarios Cualitativos Registrados ({currentStats.comments.length})
                  </h3>
                  <div className="flex items-center gap-2">
                    {currentStats.comments.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAllCommentsInDashboard(!showAllCommentsInDashboard)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        {showAllCommentsInDashboard ? 'Modo compacto' : `Ver todos (${currentStats.comments.length})`}
                      </button>
                    )}
                    <span className="text-xs text-slate-400">Totalmente Anónimos</span>
                  </div>
                </div>

                {currentStats.comments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4">
                    No se registraron comentarios cualitativos adicionales en este periodo.
                  </p>
                ) : (
                  <div className={`space-y-3 ${showAllCommentsInDashboard ? '' : 'max-h-[360px] overflow-y-auto'} pr-2`}>
                    {currentStats.comments.map((comm, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs md:text-sm text-slate-700 italic relative">
                        <span className="absolute top-2 left-2 text-2xl text-slate-300 font-serif leading-none">“</span>
                        <div className="pl-4 pt-1 leading-relaxed">{comm.text}</div>
                        {comm.date && (
                          <div className="text-[10px] text-slate-400 text-right mt-1.5 not-italic">
                            {comm.date}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* REGISTRO INDIVIDUAL DE EVALUACIONES */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                      <List className="w-5 h-5 text-slate-400" />
                      Registro Individual de Evaluaciones ({currentStats.rawEvaluations.length})
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Listado de votos anónimos con opción de ver todas las respuestas a cada pregunta.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-2">
                  {currentStats.rawEvaluations.map(ev => {
                    let dateStr = 'Fecha desconocida';
                    if (ev.timestamp) {
                      if (ev.timestamp.toDate) dateStr = ev.timestamp.toDate().toLocaleDateString('es-ES');
                      else dateStr = new Date(ev.timestamp).toLocaleDateString('es-ES');
                    }
                    let sum = 0, count = 0;
                    Object.values(ev.answers).forEach((val: any) => {
                      if (typeof val === 'number' && val > 0) {
                        sum += val;
                        count++;
                      }
                    });
                    const avg = count > 0 ? (sum / count).toFixed(2) : '0';
                    const isExpanded = expandedEvalId === ev.id;
                    const answersCount = Object.keys(ev.answers || {}).length;

                    return (
                      <div key={ev.id} className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl transition-all hover:border-slate-300 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-700">
                              <span>Fecha: {dateStr}</span>
                              <span className="text-slate-300">|</span>
                              <span>Nota Media: <span className={`${currentTheme.radioCheckedText} font-black text-sm`}>{avg}</span>/5</span>
                              <span className="text-slate-300">|</span>
                              <span className="text-slate-500 font-medium">{answersCount} preguntas respondidas</span>
                            </div>
                            {ev.comments && !isExpanded && (
                              <p className="text-xs text-slate-600 mt-1.5 italic line-clamp-1">
                                "{ev.comments}"
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            <button
                              type="button"
                              onClick={() => setExpandedEvalId(isExpanded ? null : ev.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                isExpanded 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs'
                              }`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>{isExpanded ? 'Plegar respuestas' : 'Ver respuestas'}</span>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>

                            <button
                              onClick={() => {
                                setDeleteId(ev.id);
                                setDeletePass('');
                                setDeleteError(false);
                              }}
                              className="text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                              title="Borrar voto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* DESGLOSE COMPLETO DE RESPUESTAS AL EXPANDIR */}
                        {isExpanded && (
                          <div className="pt-3 border-t border-slate-200 space-y-3 animate-fade-in">
                            {ev.comments && (
                              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs italic text-slate-700 leading-relaxed">
                                <span className="font-bold not-italic text-slate-900 block mb-1">Comentario aportado por el evaluador:</span>
                                "{ev.comments}"
                              </div>
                            )}

                            <div>
                              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                                Respuestas ítem por ítem ({answersCount}):
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {Object.entries(ev.answers || {}).map(([qId, val]) => {
                                  const questionInfo = currentRoleQuestions[qId];
                                  const questionText = questionInfo ? questionInfo.text : `Pregunta: ${qId}`;
                                  const categoryName = questionInfo ? questionInfo.category : 'Dimensión';
                                  const isNA = (val as any) === 'NA' || val === 0 || typeof val !== 'number';

                                  return (
                                    <div key={qId} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-start justify-between gap-2 shadow-2xs">
                                      <div className="flex-1">
                                        <span className="text-[9px] uppercase font-bold text-slate-400 block leading-tight">{categoryName}</span>
                                        <p className="text-xs font-medium text-slate-800 leading-snug mt-0.5">{questionText}</p>
                                      </div>
                                      <span className={`px-2 py-1 rounded-md text-xs font-black shrink-0 ${
                                        isNA 
                                          ? 'bg-slate-100 text-slate-500' 
                                          : typeof val === 'number' && val >= 4 
                                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                                      }`}>
                                        {isNA ? 'N/A' : `${val} / 5`}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA 2: COMPARATIVA INTERANUAL */}
      {activeTab === 'comparativa' && (
        <HistoricalComparisonView
          statsYearA={stats2025}
          statsYearB={stats2026}
          labelYearA="Curso 2025/2026"
          labelYearB="Curso 2026/2027"
          theme={currentTheme}
          allRoles={allRolesList}
          selectedRoleKey={selectedRoleKey}
          onSelectRole={setSelectedRoleKey}
        />
      )}

      {/* PESTAÑA: RUTA DE EVALUACIÓN Y APTITUDES */}
      {activeTab === 'ruta' && (
        <EvaluationPathwayView
          statsYearA={stats2025}
          statsYearB={stats2026}
          labelYearA="Curso 2025/2026"
          labelYearB="Curso 2026/2027"
          theme={currentTheme}
          allRoles={allRolesList}
          selectedRoleKey={selectedRoleKey}
          onSelectRole={setSelectedRoleKey}
        />
      )}

      {/* PESTAÑA 3: EDITOR DE ENCUESTAS */}
      {activeTab === 'editor' && (
        <SurveyEditorView
          surveyConfig={surveyConfig}
          onSaveConfig={onSaveSurveyConfig}
          isSaving={isSavingConfig}
          saveStatus={configSaveStatus}
        />
      )}

      {/* PESTAÑA 4: SEGURIDAD Y RESPALDOS */}
      {activeTab === 'seguridad' && (
        <SecuritySettingsView
          onUpdatePassword={onUpdatePassword}
          isUpdatingPassword={isUpdatingPassword}
          passwordMsg={passwordMsg}
          evaluations={evaluations}
          onGlobalResetVoting={onGlobalResetVoting}
          isResettingVoting={isResettingVoting}
        />
      )}

      {/* MODAL DE CONFIRMACIÓN DE BORRADO DE EVALUACIÓN */}
      {deleteId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3 mb-4 text-rose-600">
              <AlertCircle className="w-8 h-8" />
              <h3 className="text-xl font-bold text-slate-800">Borrar Evaluación</h3>
            </div>
            <p className="text-slate-600 mb-6 text-xs leading-relaxed">
              Esta acción eliminará de forma permanente este registro de Firestore y recalculará las métricas. Introduzca la clave maestra para autorizar:
            </p>

            <input 
              type="password" 
              value={deletePass} 
              onChange={e => { setDeletePass(e.target.value); setDeleteError(false); }}
              placeholder="Introduce la contraseña maestra"
              className={`w-full p-3 bg-white text-slate-900 border rounded-xl outline-none focus:ring-2 mb-2 ${
                deleteError ? 'border-rose-500 ring-rose-200' : 'border-slate-300 focus:ring-blue-500'
              }`}
              autoFocus
            />
            {deleteError && (
              <p className="text-rose-600 text-xs mb-4 font-semibold">Clave incorrecta.</p>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button 
                onClick={() => { setDeleteId(null); setDeletePass(''); setDeleteError(false); }}
                className="px-4 py-2 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer text-xs"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmDelete}
                disabled={!deletePass || isDeleting}
                className={`px-5 py-2 rounded-xl font-bold text-white transition-all flex items-center gap-1.5 text-xs cursor-pointer shadow ${
                  !deletePass ? 'bg-rose-300 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                <Trash2 className="w-4 h-4" /> Borrar Permanentemente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
