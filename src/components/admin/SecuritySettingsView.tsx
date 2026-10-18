import React, { useState } from 'react';
import { 
  Lock, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Database, 
  Shield, 
  RefreshCw, 
  UserCheck 
} from 'lucide-react';
import { EvaluationRecord } from '../../types/survey';

interface SecuritySettingsViewProps {
  onUpdatePassword: (newPass: string) => Promise<boolean>;
  isUpdatingPassword: boolean;
  passwordMsg: { type: 'success' | 'error'; text: string } | null;
  evaluations: EvaluationRecord[];
  onGlobalResetVoting?: () => Promise<boolean>;
  isResettingVoting?: boolean;
}

export const SecuritySettingsView: React.FC<SecuritySettingsViewProps> = ({
  onUpdatePassword,
  isUpdatingPassword,
  passwordMsg,
  evaluations,
  onGlobalResetVoting,
  isResettingVoting = false
}) => {
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setLocalError('Las contraseñas no coinciden.');
      return;
    }
    if (newPass.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setLocalError(null);
    const ok = await onUpdatePassword(newPass);
    if (ok) {
      setNewPass('');
      setConfirmPass('');
    }
  };

  const handleDownloadBackupJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(evaluations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `respaldo_evaluaciones_360_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleTriggerGlobalReset = async () => {
    if (!onGlobalResetVoting) return;
    const confirm = window.confirm(
      "¿Confirmas que deseas resetear los bloqueos de votación para el Curso 2026/2027?\n\nEsta acción abrirá una nueva sesión de votación en la nube, permitiendo que cualquier docente o dispositivo que ya hubiera emitido un voto pueda volver a evaluar sin perder los informes históricos ya guardados."
    );
    if (!confirm) return;

    const ok = await onGlobalResetVoting();
    if (ok) {
      setResetSuccessMsg("¡Votaciones reabiertas con éxito! Todos los dispositivos y docentes tienen habilitado el acceso para evaluar.");
      setTimeout(() => setResetSuccessMsg(null), 6000);
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Seguridad y Copias de Seguridad</h2>
        <p className="text-sm text-slate-600 mt-1">
          Gestione las credenciales de acceso, el estado de las votaciones y salvaguarde los datos históricos del centro.
        </p>
      </div>

      {/* TARJETA DE CONTROL DE REAPERTURA DE VOTACIONES */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Control de Campaña y Reapertura de Votaciones</h3>
            <p className="text-xs text-slate-500">
              Permite desbloquear el acceso para que todo el claustro pueda volver a evaluar para el Curso 2026/2027.
            </p>
          </div>
        </div>

        {resetSuccessMsg && (
          <div className="mb-6 p-4 rounded-xl flex items-center gap-2 text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{resetSuccessMsg}</span>
          </div>
        )}

        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            Para garantizar el anonimato sin requerir cuentas de usuario individuales, el sistema utiliza un control de dispositivo para evitar envíos duplicados accidentales.
          </p>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>¿Por qué resetear los bloqueos?</span>
            </div>
            <p className="text-slate-500">
              Al iniciar la campaña 2026/2027 o si varios profesores comparten el mismo equipo informático en la sala de profesores, pulsar este botón emite una nueva sesión de votación en Firestore, dejando las encuestas 100% disponibles para todos sin alterar los 185 informes del curso anterior.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[11px] text-slate-400">
              Sesión activa: <span className="font-mono font-bold text-slate-700">Campaña Curso 2026/2027</span>
            </div>
            <button
              type="button"
              onClick={handleTriggerGlobalReset}
              disabled={isResettingVoting}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl shadow transition-all cursor-pointer disabled:bg-slate-300"
            >
              {isResettingVoting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              <span>Resetear Bloqueos de Votación (Habilitar para todos)</span>
            </button>
          </div>
        </div>
      </div>

      {/* TARJETA DE CAMBIO DE CLAVE */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Contraseña Maestra de Auditoría</h3>
            <p className="text-xs text-slate-500">
              Permite el acceso confidencial a informes ejecutivos, edición de encuestas y análisis comparativos.
            </p>
          </div>
        </div>

        {(passwordMsg || localError) && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-2 text-sm font-semibold ${
            localError || passwordMsg?.type === 'error'
              ? 'bg-rose-50 text-rose-800 border border-rose-200' 
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}>
            {localError || passwordMsg?.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            <span>{localError || passwordMsg?.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full p-3 bg-white text-slate-900 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              className="w-full p-3 bg-white text-slate-900 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Repita la nueva contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdatingPassword || !newPass || !confirmPass}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all cursor-pointer shadow text-white ${
              isUpdatingPassword || !newPass || !confirmPass
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isUpdatingPassword ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>Actualizar Contraseña</span>
          </button>
        </form>
      </div>

      {/* TARJETA DE RESPALDOS HISTÓRICOS */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Respaldo Integral de Datos</h3>
            <p className="text-xs text-slate-500">
              Descargue una copia completa de todas las evaluaciones históricas y actuales registradas ({evaluations.length} informes).
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-800">Copia de Seguridad en Formato JSON</p>
            <p className="text-xs text-slate-500">
              Estructura completa de respuestas, metadatos y comentarios anonimizados.
            </p>
          </div>

          <button
            onClick={handleDownloadBackupJSON}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-5 rounded-xl shadow transition-all cursor-pointer text-sm"
          >
            <Download className="w-4 h-4" />
            Descargar Respaldo JSON
          </button>
        </div>
      </div>
    </div>
  );
};
