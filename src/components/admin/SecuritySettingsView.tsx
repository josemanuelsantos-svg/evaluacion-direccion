import React, { useState } from 'react';
import { Lock, Save, Loader2, CheckCircle2, AlertCircle, Download, Database, Shield } from 'lucide-react';
import { EvaluationRecord } from '../../types/survey';

interface SecuritySettingsViewProps {
  onUpdatePassword: (newPass: string) => Promise<boolean>;
  isUpdatingPassword: boolean;
  passwordMsg: { type: 'success' | 'error'; text: string } | null;
  evaluations: EvaluationRecord[];
}

export const SecuritySettingsView: React.FC<SecuritySettingsViewProps> = ({
  onUpdatePassword,
  isUpdatingPassword,
  passwordMsg,
  evaluations
}) => {
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

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

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Seguridad y Copias de Seguridad</h2>
        <p className="text-sm text-slate-600 mt-1">
          Gestione las credenciales de acceso y salvaguarde los datos históricos del centro.
        </p>
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
