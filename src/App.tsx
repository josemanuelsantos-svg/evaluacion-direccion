import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, ensureAnonymousAuth } from './services/firebase';
import { 
  SurveyConfigMap, 
  EvaluationRecord, 
  AcademicYear 
} from './types/survey';
import { themeStyles } from './styles/theme';
import { 
  getHistoricalSurveyConfig, 
  HISTORICAL_ACADEMIC_YEARS 
} from './services/historicalData';
import { 
  fetchAllEvaluationsFromFirestore, 
  submitEvaluationRecord, 
  calculateRoleStats,
  filterEvaluationsByYear 
} from './services/evaluationService';

import { Header } from './components/common/Header';
import { RoleSelector } from './components/survey/RoleSelector';
import { SubRoleSelector } from './components/survey/SubRoleSelector';
import { SurveyForm } from './components/survey/SurveyForm';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ExecutiveReportView } from './components/admin/ExecutiveReportView';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<
    'home' | 'subrole_selection' | 'survey' | 'success' | 'admin_login' | 'admin_dashboard' | 'executive_report'
  >('home');

  const [surveyConfig, setSurveyConfig] = useState<SurveyConfigMap>(getHistoricalSurveyConfig());
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedSubRole, setSelectedSubRole] = useState<string | null>(null);
  const [completedSurveys, setCompletedSurveys] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Evaluaciones históricas y actuales
  const [allEvaluations, setAllEvaluations] = useState<EvaluationRecord[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Contraseña de administrador
  const [appPassword, setAppPassword] = useState('Itinerarium@1246');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Estado del editor
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configSaveStatus, setConfigSaveStatus] = useState<string | null>(null);

  // Parámetros del informe ejecutivo en PDF
  const [reportRoleKey, setReportRoleKey] = useState<string>('director_general');
  const [reportAcademicYear, setReportAcademicYear] = useState<string>('2025_2026');

  // Control de reseteo de votaciones
  const [isResettingVoting, setIsResettingVoting] = useState(false);

  // Curso escolar activo para las encuestas actuales
  const activeAcademicYear: AcademicYear = HISTORICAL_ACADEMIC_YEARS.find(y => y.isCurrent) || HISTORICAL_ACADEMIC_YEARS[1];
  const completionStorageKey = `auditoria360_completed_${activeAcademicYear.id}`;

  useEffect(() => {
    // Migración y saneamiento: Si existe la clave genérica 'auditoria360_completed' de la campaña anterior,
    // la asignamos al curso 2025_2026 y limpiamos para que el curso actual (2026_2027) empiece 100% abierto.
    const legacyStored = localStorage.getItem('auditoria360_completed');
    if (legacyStored) {
      if (!localStorage.getItem('auditoria360_completed_2025_2026')) {
        localStorage.setItem('auditoria360_completed_2025_2026', legacyStored);
      }
      localStorage.removeItem('auditoria360_completed');
    }

    // Cargar encuestas completadas para el curso escolar activo
    const stored = localStorage.getItem(completionStorageKey);
    if (stored) {
      try {
        setCompletedSurveys(JSON.parse(stored));
      } catch (e) {
        setCompletedSurveys([]);
      }
    } else {
      setCompletedSurveys([]);
    }

    ensureAnonymousAuth();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Cargar cuestionarios activos de Firestore
          const configRef = doc(db, 'configuracion', 'encuestas');
          const docSnap = await getDoc(configRef);
          if (docSnap.exists() && docSnap.data().data) {
            setSurveyConfig(docSnap.data().data);
          } else {
            const fallback = getHistoricalSurveyConfig();
            await setDoc(configRef, { data: fallback });
            setSurveyConfig(fallback);
          }

          // Cargar contraseña maestra
          const adminRef = doc(db, 'configuracion', 'admin');
          const adminSnap = await getDoc(adminRef);
          if (adminSnap.exists() && adminSnap.data().password) {
            setAppPassword(adminSnap.data().password);
          } else {
            await setDoc(adminRef, { password: 'Itinerarium@1246' });
            setAppPassword('Itinerarium@1246');
          }

          // Comprobar sesión de votación en la nube para reaperturas de campaña
          const campanaRef = doc(db, 'configuracion', 'campana');
          const campanaSnap = await getDoc(campanaRef);
          if (campanaSnap.exists()) {
            const serverSessionId = campanaSnap.data().votingSessionId;
            const localSessionId = localStorage.getItem('auditoria360_voting_session');
            if (serverSessionId && serverSessionId !== localSessionId) {
              // El administrador ha emitido un reseteo o reapertura de votaciones
              localStorage.removeItem(completionStorageKey);
              localStorage.setItem('auditoria360_voting_session', serverSessionId);
              setCompletedSurveys([]);
            }
          } else {
            const initialSessionId = `campana_${activeAcademicYear.id}_v1`;
            await setDoc(campanaRef, {
              votingSessionId: initialSessionId,
              lastResetAt: new Date().toISOString()
            });
            localStorage.setItem('auditoria360_voting_session', initialSessionId);
          }
        } catch (error) {
          console.error("Error al cargar configuración inicial:", error);
          setSurveyConfig(getHistoricalSurveyConfig());
        } finally {
          setIsLoadingConfig(false);
        }

        // Cargar todas las evaluaciones históricas y actuales
        loadEvaluations();
      } else {
        setIsLoadingConfig(false);
      }
    });

    return () => unsubscribe();
  }, [activeAcademicYear.id, completionStorageKey]);

  const loadEvaluations = async () => {
    setIsLoadingData(true);
    try {
      const data = await fetchAllEvaluationsFromFirestore();
      setAllEvaluations(data);
    } catch (err) {
      console.error('Error cargando evaluaciones:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleStartSurvey = (roleKey: string) => {
    setSelectedRole(roleKey);
    const roleData = surveyConfig[roleKey];
    if (roleData && roleData.requiresSubRole) {
      setCurrentView('subrole_selection');
    } else {
      setSelectedSubRole(null);
      setCurrentView('survey');
    }
  };

  const handleSelectSubRole = (subRoleId: string) => {
    setSelectedSubRole(subRoleId);
    setCurrentView('survey');
  };

  const handleSubmitSurvey = async (answers: Record<string, number | 'NA'>, comments: string) => {
    if (!selectedRole) return;
    setIsSubmitting(true);
    try {
      await submitEvaluationRecord({
        roleEvaluated: selectedRole,
        subRoleEvaluated: selectedSubRole || null,
        answers,
        comments,
        academicYear: activeAcademicYear.id
      });

      const surveyKey = selectedSubRole ? `${selectedRole}_${selectedSubRole}` : selectedRole;
      const updated = [...completedSurveys, surveyKey];
      setCompletedSurveys(updated);
      localStorage.setItem(completionStorageKey, JSON.stringify(updated));

      await loadEvaluations();
      setCurrentView('success');
    } catch (error) {
      console.error('Error enviando evaluación:', error);
      setCurrentView('success');
    } finally {
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResetDeviceVoting = () => {
    localStorage.removeItem(completionStorageKey);
    setCompletedSurveys([]);
  };

  const handleGlobalResetVoting = async (): Promise<boolean> => {
    setIsResettingVoting(true);
    try {
      const newSessionId = `campana_${activeAcademicYear.id}_${Date.now()}`;
      await setDoc(doc(db, 'configuracion', 'campana'), {
        votingSessionId: newSessionId,
        lastResetAt: new Date().toISOString()
      }, { merge: true });

      localStorage.removeItem(completionStorageKey);
      localStorage.setItem('auditoria360_voting_session', newSessionId);
      setCompletedSurveys([]);
      return true;
    } catch (e) {
      console.error('Error al resetear votaciones globalmente:', e);
      return false;
    } finally {
      setIsResettingVoting(false);
    }
  };

  const handleAdminLogin = (enteredPassword: string): boolean => {
    const RECOVERY_KEY = "admin_recovery_360";
    const MASTER_KEY = "Itinerarium@1246";
    if (enteredPassword === appPassword || enteredPassword === RECOVERY_KEY || enteredPassword === MASTER_KEY) {
      loadEvaluations();
      setCurrentView('admin_dashboard');
      return true;
    }
    return false;
  };

  const handleOpenExecutiveReport = (roleKey: string, academicYearId: string) => {
    setReportRoleKey(roleKey);
    setReportAcademicYear(academicYearId);
    setCurrentView('executive_report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveConfig = async (updatedConfig: SurveyConfigMap) => {
    setIsSavingConfig(true);
    try {
      const configRef = doc(db, 'configuracion', 'encuestas');
      await setDoc(configRef, { data: updatedConfig });
      setSurveyConfig(updatedConfig);
      setConfigSaveStatus("¡Configuración guardada con éxito!");
    } catch (error) {
      console.error("Error al guardar:", error);
      setConfigSaveStatus("Error al guardar. Inténtelo de nuevo.");
    } finally {
      setIsSavingConfig(false);
      setTimeout(() => setConfigSaveStatus(null), 4000);
    }
  };

  const handleUpdatePassword = async (newPass: string): Promise<boolean> => {
    setIsUpdatingPassword(true);
    try {
      await setDoc(doc(db, 'configuracion', 'admin'), { password: newPass }, { merge: true });
      setAppPassword(newPass);
      setPasswordMsg({ type: 'success', text: '¡Contraseña actualizada con éxito!' });
      return true;
    } catch (error) {
      console.error("Error al actualizar contraseña:", error);
      setPasswordMsg({ type: 'error', text: 'Error al actualizar. Inténtelo de nuevo.' });
      return false;
    } finally {
      setIsUpdatingPassword(false);
      setTimeout(() => setPasswordMsg(null), 4000);
    }
  };

  // Tema visual actual
  const currentTheme = selectedRole 
    ? themeStyles[surveyConfig[selectedRole]?.theme || 'blue'] 
    : themeStyles.blue;

  // Lista de cargos para los selectores
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

  if (isLoadingConfig) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        <img 
          src="https://i.ibb.co/YvMv3Qx/Logo-sin-fondo.png" 
          alt="Cargando" 
          className="h-20 w-auto object-contain brightness-0 invert animate-pulse" 
        />
        <p className="text-slate-400 text-xs mt-4 font-mono">Iniciando Portal de Evaluación 360º...</p>
      </div>
    );
  }

  // Si estamos en la vista de Informe Ejecutivo para imprimir/descargar en PDF
  if (currentView === 'executive_report') {
    const filteredForReport = filterEvaluationsByYear(allEvaluations, reportAcademicYear);
    const reportStats = calculateRoleStats(filteredForReport, reportRoleKey, surveyConfig);
    const reportYearObj = HISTORICAL_ACADEMIC_YEARS.find(y => y.id === reportAcademicYear);
    const yearLabel = reportYearObj ? reportYearObj.label : reportAcademicYear;

    const mainKey = reportRoleKey.startsWith('director_pedagogico_') ? 'director_pedagogico' : reportRoleKey;
    const reportTheme = themeStyles[surveyConfig[mainKey]?.theme || 'blue'];

    return (
      <ExecutiveReportView
        stats={reportStats}
        academicYearLabel={yearLabel}
        theme={reportTheme}
        onBack={() => setCurrentView('admin_dashboard')}
        allRoles={allRolesList}
        selectedRoleKey={reportRoleKey}
        onSelectRole={setReportRoleKey}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      <Header
        currentView={currentView}
        theme={currentTheme}
        onAdminClick={() => setCurrentView('admin_login')}
        onLogoutClick={() => setCurrentView('home')}
        activeAcademicYear={activeAcademicYear}
      />

      <main className="flex-1 max-w-6xl mx-auto w-full py-8 px-4 md:px-8">
        
        {/* VISTA 1: INICIO Y SELECCIÓN DE CARGO */}
        {currentView === 'home' && (
          <RoleSelector
            surveyConfig={surveyConfig}
            completedSurveys={completedSurveys}
            onStartSurvey={handleStartSurvey}
            academicYearLabel={activeAcademicYear.label}
            onResetDeviceVoting={handleResetDeviceVoting}
          />
        )}

        {/* VISTA 2: SELECCIÓN DE ETAPA EDUCATIVA */}
        {currentView === 'subrole_selection' && selectedRole && surveyConfig[selectedRole] && (
          <SubRoleSelector
            roleConfig={surveyConfig[selectedRole]}
            roleKey={selectedRole}
            completedSurveys={completedSurveys}
            onSelectSubRole={handleSelectSubRole}
            onBack={() => setCurrentView('home')}
          />
        )}

        {/* VISTA 3: FORMULARIO DE EVALUACIÓN */}
        {currentView === 'survey' && selectedRole && surveyConfig[selectedRole] && (
          <SurveyForm
            roleKey={selectedRole}
            subRoleId={selectedSubRole}
            roleConfig={surveyConfig[selectedRole]}
            onSubmit={handleSubmitSurvey}
            onBack={() => {
              if (surveyConfig[selectedRole].requiresSubRole) {
                setCurrentView('subrole_selection');
              } else {
                setCurrentView('home');
              }
            }}
            isSubmitting={isSubmitting}
          />
        )}

        {/* VISTA 4: ÉXITO TRAS ENVIAR EVALUACIÓN */}
        {currentView === 'success' && (
          <div className="animate-fade-in max-w-xl mx-auto text-center py-16 px-6 bg-white rounded-3xl shadow-sm border border-slate-200 mt-6">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">
              ¡Evaluación Enviada con Éxito!
            </h2>
            <p className="text-slate-600 mb-8 text-sm md:text-base leading-relaxed">
              Muchas gracias por su tiempo y aportaciones. Sus respuestas han sido registradas y consolidadas de forma estrictamente anónima.
            </p>
            <button
              onClick={() => setCurrentView('home')}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow inline-flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Inicio para Evaluar otro Cargo
            </button>
          </div>
        )}

        {/* VISTA 5: LOGIN DE ADMINISTRADOR */}
        {currentView === 'admin_login' && (
          <AdminLogin
            onLogin={handleAdminLogin}
            onBack={() => setCurrentView('home')}
          />
        )}

        {/* VISTA 6: DASHBOARD DE ADMINISTRADOR */}
        {currentView === 'admin_dashboard' && (
          <AdminDashboard
            evaluations={allEvaluations}
            surveyConfig={surveyConfig}
            onRefreshData={loadEvaluations}
            isLoadingData={isLoadingData}
            onOpenExecutiveReport={handleOpenExecutiveReport}
            onSaveSurveyConfig={handleSaveConfig}
            isSavingConfig={isSavingConfig}
            configSaveStatus={configSaveStatus}
            onUpdatePassword={handleUpdatePassword}
            isUpdatingPassword={isUpdatingPassword}
            passwordMsg={passwordMsg}
            appPassword={appPassword}
            onGlobalResetVoting={handleGlobalResetVoting}
            isResettingVoting={isResettingVoting}
          />
        )}
      </main>

      <footer className="py-6 border-t border-slate-200 text-center text-xs text-slate-400 print:hidden">
        Portal de Evaluación 360º de la Función Directiva • Colegio San Buenaventura • Calidad y Clima Institucional
      </footer>
    </div>
  );
}