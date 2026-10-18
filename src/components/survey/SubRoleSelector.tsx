import React from 'react';
import { ArrowLeft, BookOpen, GraduationCap, CheckCircle2 } from 'lucide-react';
import { RoleSurveyConfig } from '../../types/survey';
import { themeStyles } from '../../styles/theme';

interface SubRoleSelectorProps {
  roleConfig: RoleSurveyConfig;
  roleKey: string;
  completedSurveys: string[];
  onSelectSubRole: (subRoleId: string) => void;
  onBack: () => void;
}

export const SubRoleSelector: React.FC<SubRoleSelectorProps> = ({
  roleConfig,
  roleKey,
  completedSurveys,
  onSelectSubRole,
  onBack
}) => {
  const roleTheme = themeStyles[roleConfig.theme || 'blue'];

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-medium transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al inicio
      </button>

      <div className="mb-8 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2">
          Seleccione la Etapa Educativa
        </h2>
        <p className="text-slate-600 max-w-3xl leading-relaxed">
          Para la figura de <strong>{roleConfig.title}</strong>, indique con qué etapa interactúa en su día a día docente.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto md:mx-0">
        {(roleConfig.subRoles || []).map((subRole) => {
          const isCompleted = completedSurveys.includes(`${roleKey}_${subRole.id}`);

          return (
            <button
              key={subRole.id}
              onClick={() => !isCompleted && onSelectSubRole(subRole.id)}
              disabled={isCompleted}
              className={`flex flex-col items-center justify-center text-center p-8 rounded-2xl border transition-all duration-200 group ${
                isCompleted 
                  ? 'opacity-70 cursor-not-allowed bg-slate-50 border-slate-200' 
                  : `bg-white border-slate-200 hover:shadow-lg ${roleTheme.bigBorderHover} ${roleTheme.bigBgHover} cursor-pointer`
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4" />
              ) : (
                subRole.id === 'infantil_primaria' ? (
                  <BookOpen className={`w-12 h-12 ${roleTheme.bigIcon} mb-4 ${roleTheme.bigIconHover} transition-colors`} />
                ) : (
                  <GraduationCap className={`w-12 h-12 ${roleTheme.bigIcon} mb-4 ${roleTheme.bigIconHover} transition-colors`} />
                )
              )}

              <h3 className="text-xl font-bold text-slate-800 mb-2">{subRole.title}</h3>

              {isCompleted ? (
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Completado
                </span>
              ) : (
                <span className="text-xs text-slate-400 font-medium group-hover:text-slate-600">
                  Haga clic para iniciar evaluación
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
