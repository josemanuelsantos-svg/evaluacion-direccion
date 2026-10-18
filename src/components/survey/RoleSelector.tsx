import React from 'react';
import { CheckCircle2, ChevronRight, ClipboardList } from 'lucide-react';
import { SurveyConfigMap } from '../../types/survey';
import { iconMap, themeStyles } from '../../styles/theme';

interface RoleSelectorProps {
  surveyConfig: SurveyConfigMap;
  completedSurveys: string[];
  onStartSurvey: (roleKey: string) => void;
  academicYearLabel: string;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  surveyConfig,
  completedSurveys,
  onStartSurvey,
  academicYearLabel
}) => {
  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="mb-8 text-center md:text-left">
        <div className="inline-block bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
          {academicYearLabel}
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2">
          Evaluación del Equipo Directivo
        </h2>
        <p className="text-slate-600 max-w-3xl leading-relaxed">
          Valore la gestión de los directivos basándose en su vivencia personal, su eficacia diaria y el trato recibido. Sus respuestas son completamente anónimas, confidenciales y vitales para la mejora continua del centro.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(surveyConfig).map(([key, data]) => {
          const Icon = iconMap[data.iconName] || ClipboardList;
          const isFullyCompleted = data.requiresSubRole && data.subRoles
            ? data.subRoles.every(sr => completedSurveys.includes(`${key}_${sr.id}`))
            : completedSurveys.includes(key);
          
          const cardTheme = themeStyles[data.theme || 'blue'];

          return (
            <button
              key={key}
              onClick={() => !isFullyCompleted && onStartSurvey(key)}
              disabled={isFullyCompleted}
              className={`flex flex-col text-left p-6 rounded-2xl border transition-all duration-200 group relative ${
                isFullyCompleted 
                  ? 'opacity-80 cursor-not-allowed bg-slate-50 border-slate-200' 
                  : `bg-white border-slate-200 hover:shadow-lg ${cardTheme.borderHover} ${cardTheme.bgLightHover} cursor-pointer`
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3.5 rounded-xl transition-colors ${
                  isFullyCompleted ? 'bg-emerald-100 text-emerald-700' : `${cardTheme.iconBg} ${cardTheme.iconHover}`
                }`}>
                  {isFullyCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                </div>
                {!isFullyCompleted && (
                  <ChevronRight className={`w-5 h-5 text-slate-400 ${cardTheme.arrowHover} transition-transform group-hover:translate-x-1`} />
                )}
              </div>

              <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-slate-800">
                {data.title}
                {isFullyCompleted && (
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Completado
                  </span>
                )}
              </h3>

              <p className="text-slate-500 text-sm leading-relaxed">
                {isFullyCompleted 
                  ? "Evaluación completada y registrada de forma segura. ¡Muchas gracias por su participación!" 
                  : data.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
