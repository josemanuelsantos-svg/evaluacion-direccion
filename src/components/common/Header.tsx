import React from 'react';
import { Lock, LogOut, Calendar, ShieldCheck, Sparkles } from 'lucide-react';
import { ThemeStyle, AcademicYear } from '../../types/survey';

interface HeaderProps {
  currentView: string;
  theme: ThemeStyle;
  onAdminClick: () => void;
  onLogoutClick: () => void;
  activeAcademicYear?: AcademicYear;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  theme,
  onAdminClick,
  onLogoutClick,
  activeAcademicYear
}) => {
  const isEvaluating = currentView === 'survey' || currentView === 'subrole_selection';
  const headerBgClass = isEvaluating 
    ? `${theme.headerBg} shadow-md` 
    : 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 shadow-lg';

  return (
    <header className={`${headerBgClass} text-white py-3.5 px-4 md:px-8 relative z-20 transition-all duration-500 print:hidden`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img 
              src="https://i.ibb.co/YvMv3Qx/Logo-sin-fondo.png" 
              alt="Logo de la Institución" 
              className="h-11 w-auto object-contain brightness-0 invert opacity-95 transition-transform group-hover:scale-105" 
            />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Portal de Evaluación 360º
              </h1>
              <span className="text-[10px] bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 px-2 py-0.5 rounded-full font-mono font-bold border border-blue-400/30 tracking-wider">
                v2.1
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-xs hidden sm:flex mt-0.5">
              <span className="font-medium text-slate-400">Colegio San Buenaventura</span>
              {activeAcademicYear && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-300/90 bg-amber-400/10 px-2 py-0.5 rounded text-[11px] border border-amber-400/20">
                    <Calendar className="w-3 h-3" />
                    {activeAcademicYear.label.split(' ')[1]}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentView !== 'admin_dashboard' && currentView !== 'admin_login' && currentView !== 'executive_report' && (
            <button 
              onClick={onAdminClick}
              className="px-3.5 py-1.5 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center gap-2 text-xs font-bold cursor-pointer backdrop-blur-sm hover:border-white/20 active:scale-95"
              title="Acceso Auditor / Dirección"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Acceso Auditor</span>
            </button>
          )}

          {(currentView === 'admin_dashboard' || currentView === 'executive_report') && (
            <button 
              onClick={onLogoutClick}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-sm cursor-pointer hover:shadow active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
