import React, { useState } from 'react';
import { 
  ArrowLeft, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  ClipboardList,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { RoleSurveyConfig } from '../../types/survey';
import { iconMap, themeStyles } from '../../styles/theme';

interface SurveyFormProps {
  roleKey: string;
  subRoleId?: string | null;
  roleConfig: RoleSurveyConfig;
  onSubmit: (answers: Record<string, number>, comments: string) => Promise<void>;
  onBack: () => void;
  isSubmitting: boolean;
}

const scaleOptions = [
  { value: 1, label: "Totalmente en desacuerdo", short: "1" },
  { value: 2, label: "En desacuerdo", short: "2" },
  { value: 3, label: "Neutral / Aceptable", short: "3" },
  { value: 4, label: "De acuerdo", short: "4" },
  { value: 5, label: "Totalmente de acuerdo", short: "5" },
  { value: 0, label: "N/A (Sin experiencia directa)", short: "N/A" }
];

export const SurveyForm: React.FC<SurveyFormProps> = ({
  roleKey,
  subRoleId,
  roleConfig,
  onSubmit,
  onBack,
  isSubmitting
}) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [comments, setComments] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const theme = themeStyles[roleConfig.theme || 'blue'];
  const Icon = iconMap[roleConfig.iconName] || ClipboardList;
  const subRoleTitle = subRoleId 
    ? roleConfig.subRoles?.find(sr => sr.id === subRoleId)?.title 
    : null;

  const totalQuestions = roleConfig.sections.reduce((acc, s) => acc + s.questions.length, 0);
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);
  const unansweredCount = totalQuestions - answeredCount;

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleTriggerValidation = () => {
    if (answeredCount < totalQuestions) {
      setShowValidation(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    await onSubmit(answers, comments);
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto relative pb-20">
      
      {/* BARRA SUPERIOR PEGAJOSA DE PROGRESO */}
      <div className="sticky top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200 z-40 mb-6 rounded-b-2xl overflow-hidden print:hidden">
        <div className="h-2 w-full bg-slate-100">
          <div 
            className={`h-full transition-all duration-300 ease-out ${theme.progress}`} 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex justify-between items-center text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${theme.progress}`} />
            Progreso de la evaluación
          </span>
          <span className="bg-slate-100 px-3 py-0.5 rounded-full text-slate-800 font-mono">
            {progressPercent}% ({answeredCount} de {totalQuestions} respondidas)
          </span>
        </div>
      </div>

      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Volver atrás
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden mb-8">
        
        {/* BANNER DEL CARGO CON GRADIENTE ELEGANTE */}
        <div className={`${theme.banner} p-6 md:p-8 text-white flex items-center gap-5 shadow-inner`}>
          <div className="p-3.5 bg-white/15 rounded-2xl backdrop-blur-md shadow-sm">
            <Icon className="w-9 h-9 text-white opacity-95" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black flex flex-wrap items-center gap-2">
              <span>Evaluación: {roleConfig.title}</span>
              {subRoleTitle && (
                <span className={`${theme.bannerText} text-xl md:text-2xl font-normal opacity-90`}>
                  | {subRoleTitle}
                </span>
              )}
            </h2>
            <p className={`${theme.bannerSubtext} text-xs md:text-sm mt-1 font-medium`}>
              Sus valoraciones son estrictamente confidenciales y anónimas.
            </p>
          </div>
        </div>

        {/* ALERTA DE PREGUNTAS PENDIENTES */}
        {showValidation && unansweredCount > 0 && (
          <div className="m-6 p-4 bg-rose-50 border border-rose-200 flex items-start gap-3 rounded-2xl shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-rose-900 font-bold text-sm">Faltan respuestas por completar</h4>
              <p className="text-rose-700 text-xs md:text-sm mt-0.5">
                Por favor, responde a todas las preguntas para poder registrar la evaluación. Faltan <strong>{unansweredCount}</strong> preguntas por valorar.
              </p>
            </div>
          </div>
        )}

        {/* CUESTIONARIO BLOQUE A BLOQUE */}
        <div className="p-6 md:p-10 space-y-12">
          {roleConfig.sections.map((section, sIndex) => (
            <div key={sIndex} className="space-y-6">
              <div className="border-b-2 border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Dimensión {sIndex + 1} de {roleConfig.sections.length}</span>
                  <h3 className="text-lg md:text-xl font-black text-slate-800">
                    {section.category}
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {section.questions.length} preguntas
                </span>
              </div>
              
              <div className="space-y-6">
                {section.questions.map((q, qIndex) => {
                  const isMissing = showValidation && answers[q.id] === undefined;
                  const currentVal = answers[q.id];

                  return (
                    <div 
                      key={q.id} 
                      className={`p-5 md:p-6 rounded-2xl border transition-all ${
                        isMissing 
                          ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-200' 
                          : 'bg-slate-50/60 border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <p className="font-bold text-slate-900 mb-4 text-sm md:text-base leading-relaxed">
                        <span className="text-slate-400 mr-2 font-mono">{qIndex + 1}.</span> 
                        {q.text}
                      </p>
                      
                      {/* SELECTOR SEGMENTADO MODERNO */}
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                        {scaleOptions.map((opt) => {
                          const isSelected = currentVal === opt.value;
                          const isNA = opt.value === 0;

                          return (
                            <button
                              type="button"
                              key={opt.value}
                              onClick={() => handleAnswerChange(q.id, opt.value)}
                              className={`py-3 px-2 rounded-xl text-center border font-bold text-xs transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                                isSelected
                                  ? isNA
                                    ? 'bg-slate-800 text-white border-slate-800 shadow-md scale-102'
                                    : `${theme.headerBg} text-white border-transparent shadow-md scale-102`
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100/80'
                              }`}
                            >
                              <span className="text-base font-black">
                                {opt.short}
                              </span>
                              <span className={`text-[10px] line-clamp-1 leading-tight font-medium ${isSelected ? 'text-white/90' : 'text-slate-400'}`}>
                                {opt.label.split(' ')[0]}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      
                      <div className="mt-3.5 text-[11px] text-slate-400 flex justify-between px-1 border-t border-slate-200/60 pt-2 font-medium">
                        <span>1 = Totalmente en desacuerdo</span>
                        <span>5 = Totalmente de acuerdo</span>
                        <span className="hidden sm:inline">N/A = Sin experiencia directa</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* COMENTARIOS ABIERTOS OPCIONALES */}
          <div className="space-y-3 pt-6 border-t-2 border-slate-100">
            <h3 className="text-lg font-black text-slate-800">
              Comentarios Cualitativos y Propuestas de Mejora (Opcional)
            </h3>
            <p className="text-xs md:text-sm text-slate-500">
              Detalle situaciones concretas, propuestas de mejora o aspectos que valora muy positivamente de la gestión y el trato humano recibido:
            </p>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className={`w-full min-h-[140px] p-4 bg-white text-slate-900 text-sm border border-slate-300 rounded-2xl outline-none resize-y shadow-xs transition-all ${theme.textareaFocus}`}
              placeholder="Escriba aquí sus comentarios de forma libre y totalmente anónima..."
            />
          </div>
        </div>

        {/* BOTÓN DE ENVÍO */}
        <div className="bg-slate-50/80 p-6 md:p-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Al pulsar enviar, sus respuestas serán consolidadas de forma irrevocable.
          </p>
          <button
            onClick={handleTriggerValidation}
            disabled={isSubmitting}
            className={`font-bold py-3.5 px-8 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-white w-full sm:w-auto cursor-pointer ${
              isSubmitting 
                ? `${theme.btnSubmitLoading} cursor-not-allowed` 
                : `${theme.btnSubmit} hover:shadow-lg active:scale-95`
            }`}
          >
            {isSubmitting ? (
              <>
                Guardando evaluación...
                <Loader2 className="w-5 h-5 animate-spin" />
              </>
            ) : (
              <>
                Enviar Evaluación Anónima
                <CheckCircle2 className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN DE ENVÍO */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center">
            <div className={`flex items-center justify-center w-16 h-16 mx-auto rounded-2xl mb-4 ${theme.iconBg} shadow-xs`}>
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">¿Confirmar Envío Definitivo?</h3>
            <p className="text-slate-600 text-xs md:text-sm mb-6 leading-relaxed">
              Está a punto de enviar su valoración de forma irreversible. Sus respuestas quedarán encriptadas y consolidadas de manera completamente anónima.
            </p>
            
            <div className="flex flex-col-reverse sm:flex-row justify-center gap-3">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors w-full sm:w-auto cursor-pointer text-xs"
              >
                Revisar respuestas
              </button>
              <button 
                onClick={handleConfirmSubmit}
                className={`px-6 py-2.5 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 w-full sm:w-auto shadow ${theme.btnSubmit} cursor-pointer text-xs`}
              >
                Sí, Enviar Ahora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
