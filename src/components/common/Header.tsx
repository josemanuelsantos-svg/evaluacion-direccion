import React from 'react';
import { Lock, LogOut, Calendar } from 'lucide-react';
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
  const headerBgClass = isEvaluating ? theme.headerBg : 'bg-slate-900';

  return (
    <header className={`${headerBgClass} text-white py-4 px-4 md:px-8 shadow-md relative z-10 transition-colors duration-500 print:hidden`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="https://i.ibb.co/YvMv3Qx/Logo-sin-fondo.png" 
            alt="Logo de la Institución" 
            className="h-12 w-auto object-contain brightness-0 invert opacity-90" 
          />
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-3">
              Portal de Evaluación 360º
              <span className="text-[10px] md:text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono font-medium border border-slate-700 tracking-wider">
                v2.0
              </span>
            </h1>
            <div className="flex items-center gap-2 text-slate-300 text-xs hidden sm:flex">
              <span>Auditoría de Calidad Institucional</span>
              {activeAcademicYear && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-300">
                    <Calendar className="w-3.5 h-3.5" />
                    {activeAcademicYear.label.split(' ')[1]}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {currentView !== 'admin_dashboard' && currentView !== 'admin_login' && currentView !== 'executive_report' && (
          <button 
            onClick={onAdminClick}
            className="p-2 text-white/70 hover:text-white hover:bg-black/20 rounded-full transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Acceso Auditor / Administrador"
          >
            <Lock className="w-5 h-5" />
            <span className="hidden sm:inline">Auditor</span>
          </button>
        )}

        {(currentView === 'admin_dashboard' || currentView === 'executive_report') && (
          <button 
            onClick={onLogoutClick}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </button>
        )}
      </div>
    </header>
  );
};
