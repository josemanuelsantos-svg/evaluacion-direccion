import React, { useState } from 'react';
import { 
  ArrowLeft, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  ClipboardList 
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
  { value: 1, label: "Totalmente en desacuerdo" },
  { value: 2, label: "En desacuerdo" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "De acuerdo" },
  { value: 5, label: "Totalmente de acuerdo" },
  { value: 0, label: "N/A (No aplica / Sin experiencia directa)" }
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
    <div className="animate-fade-in max-w-5xl mx-auto relative pb-16">
      
      {/* BARRA FLOTANTE DE PROGRESO */}
      <div className="sticky top-0 left-0 w-full bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-200 z-40 mb-6 rounded-b-xl overflow-hidden print:hidden">
        <div className="h-2 w-full bg-slate-100">
          <div 
            className={`h-full transition-all duration-300 ease-out ${theme.progress}`} 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex justify-between items-center text-xs font-semibold text-slate-600">
          <span>Progreso de la evaluación</span>
          <span className="font-bold">{progressPercent}% ({answeredCount} de {totalQuestions} preguntas)</span>
        </div>
      </div>

      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-medium transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Volver atrás
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        
        {/* BANNER INSTITUCIONAL DEL CARGO */}
        <div className={`${theme.banner} p-6 md:p-8 text-white flex items-center gap-5 shadow-inner`}>
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
            <Icon className="w-10 h-10 text-white opacity-95" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold flex flex-wrap items-center gap-2">
              <span>Evaluación: {roleConfig.title}</span>
              {subRoleTitle && (
                <span className={`${theme.bannerText} text-xl md:text-2xl font-normal opacity-90`}>
                  | {subRoleTitle}
                </span>
              )}
            </h2>
            <p className={`${theme.bannerSubtext} text-sm mt-1 font-medium`}>
              Sus respuestas son estrictamente confidenciales y anónimas.
            </p>
          </div>
        </div>

        {/* ALERTA DE PREGUNTAS SIN RESPONDER */}
        {showValidation && unansweredCount > 0 && (
          <div className="m-6 p-4 bg-rose-50 border-l-4 border-rose-500 flex items-start gap-3 rounded-r-xl">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-rose-900 font-bold text-sm">Faltan respuestas por completar</h4>
              <p className="text-rose-700 text-sm mt-1">
                Por favor, responde a todas las preguntas para enviar la evaluación. Faltan <strong>{unansweredCount}</strong> preguntas por valorar.
              </p>
            </div>
          </div>
        )}

        {/* BLOQUES DE PREGUNTAS POR SECCIÓN */}
        <div className="p-6 md:p-8 space-y-12">
          {roleConfig.sections.map((section, sIndex) => (
            <div key={sIndex} className="space-y-6">
              <div className="border-b-2 border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-extrabold text-slate-800">
                  {section.category}
                </h3>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                  Bloque {sIndex + 1} de {roleConfig.sections.length}
                </span>
              </div>
              
              <div className="space-y-6">
                {section.questions.map((q, qIndex) => {
                  const isMissing = showValidation && answers[q.id] === undefined;

                  return (
                    <div 
                      key={q.id} 
                      className={`p-5 rounded-xl border transition-all ${
                        isMissing 
                          ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-200' 
                          : 'bg-slate-50/50 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <p className="font-semibold text-slate-800 mb-4 text-base leading-relaxed">
                        <span className="text-slate-400 mr-2 font-mono font-bold">{qIndex + 1}.</span> 
                        {q.text}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-8 mt-2">
                        {scaleOptions.map((opt) => (
                          <label 
                            key={opt.value} 
                            className="flex items-center gap-2 cursor-pointer py-1 group select-none"
                            title={opt.label}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              value={opt.value}
                              checked={answers[q.id] === opt.value}
                              onChange={() => handleAnswerChange(q.id, opt.value)}
                              className={`w-5 h-5 border-slate-300 cursor-pointer ${theme.radioInput} ${theme.radioFocus}`}
                            />
                            <span className={`text-sm md:text-base transition-colors ${
                              answers[q.id] === opt.value 
                                ? `font-black ${theme.radioCheckedText}` 
                                : 'text-slate-600 group-hover:text-slate-900'
                            }`}>
                              {opt.value > 0 ? opt.value : "N/A"}
                            </span>
                          </label>
                        ))}
                      </div>
                      
                      <div className="mt-3 text-[11px] text-slate-400 flex justify-between px-1 border-t border-slate-200/60 pt-2">
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
            <h3 className="text-lg font-extrabold text-slate-800">
              Comentarios Cualitativos Abiertos (Opcional)
            </h3>
            <p className="text-sm text-slate-500">
              Detalle situaciones concretas, propuestas de mejora o aspectos que valora especialmente de la gestión y el trato humano recibido:
            </p>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className={`w-full min-h-[130px] p-4 bg-white text-slate-900 border border-slate-300 rounded-xl outline-none resize-y shadow-sm transition-all ${theme.textareaFocus}`}
              placeholder="Escriba aquí sus observaciones o sugerencias de forma totalmente anónima..."
            />
          </div>
        </div>

        {/* BOTÓN DE ENVÍO */}
        <div className="bg-slate-50 p-6 md:p-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Al enviar, sus respuestas serán cifradas y consolidadas de forma irreversible.
          </p>
          <button
            onClick={handleTriggerValidation}
            disabled={isSubmitting}
            className={`font-bold py-3.5 px-8 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-white w-full sm:w-auto cursor-pointer ${
              isSubmitting 
                ? `${theme.btnSubmitLoading} cursor-not-allowed` 
                : theme.btnSubmit
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center">
            <div className={`flex items-center justify-center w-16 h-16 mx-auto rounded-full mb-4 ${theme.iconBg}`}>
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">¿Confirmar Envío?</h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Está a punto de enviar su valoración de forma definitiva. Sus respuestas quedarán registradas de manera completamente anónima.
            </p>
            
            <div className="flex flex-col-reverse sm:flex-row justify-center gap-3">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors w-full sm:w-auto cursor-pointer"
              >
                Revisar respuestas
              </button>
              <button 
                onClick={handleConfirmSubmit}
                className={`px-6 py-2.5 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 w-full sm:w-auto shadow ${theme.btnSubmit} cursor-pointer`}
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
