import React from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
  ClipboardList, 
  ShieldCheck, 
  Lock, 
  Award,
  Sparkles
} from 'lucide-react';
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
    <div className="animate-fade-in max-w-5xl mx-auto space-y-8">
      
      {/* HERO BANNER PRINCIPAL */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-700/60 relative overflow-hidden">
        {/* Adorno visual de fondo */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-20 -top-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {academicYearLabel}
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              Proceso Activo
            </span>
          </div>

          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-3">
            Evaluación 360º del Equipo Directivo
          </h2>
          
          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6 font-normal">
            Su valoración sincera y constructiva sobre la gestión, cercanía y liderazgo del equipo directivo es una herramienta clave para consolidar el buen clima laboral, afianzar el ideario franciscano y promover la mejora continua en nuestro colegio.
          </p>

          {/* Micro-pills de garantías */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-700/60 text-xs text-slate-300">
            <div className="flex items-center gap-2 bg-white/5 py-2 px-3 rounded-xl border border-white/5">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>100% Anónimo:</strong> Sin registro de identidad ni IP</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 py-2 px-3 rounded-xl border border-white/5">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>Formativo:</strong> Orientado al desarrollo colegial</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 py-2 px-3 rounded-xl border border-white/5">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span><strong>Confidencial:</strong> Cifrado de respuestas</span>
            </div>
          </div>
        </div>
      </div>

      {/* TARJETAS DE CARGOS DIRECTIVOS */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-800">
            Seleccione el Cargo a Evaluar
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            Puede completar las evaluaciones en cualquier orden
          </span>
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
                className={`flex flex-col text-left p-6 md:p-7 rounded-2xl border transition-all duration-300 group relative ${
                  isFullyCompleted 
                    ? 'opacity-85 cursor-not-allowed bg-slate-50 border-slate-200' 
                    : `bg-white border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 ${cardTheme.borderHover} cursor-pointer`
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3.5 rounded-2xl transition-all shadow-xs ${
                    isFullyCompleted 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : `${cardTheme.iconBg} ${cardTheme.iconHover}`
                  }`}>
                    {isFullyCompleted ? <CheckCircle2 className="w-7 h-7" /> : <Icon className="w-7 h-7" />}
                  </div>

                  {!isFullyCompleted ? (
                    <div className="flex items-center gap-1 text-slate-400 group-hover:text-slate-800 text-xs font-bold transition-all group-hover:translate-x-1">
                      <span>Evaluar</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  ) : (
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                      ✓ Completado
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-black mb-2 text-slate-900 group-hover:text-blue-900 transition-colors">
                  {data.title}
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  {isFullyCompleted 
                    ? "Evaluación registrada de forma segura. ¡Muchas gracias por su aportación a la calidad del colegio!" 
                    : data.description}
                </p>

                {/* Pie de tarjeta con indicador de secciones */}
                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>{data.sections.length} dimensiones evaluadas</span>
                  <span>{data.sections.reduce((acc, s) => acc + s.questions.length, 0)} preguntas</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
