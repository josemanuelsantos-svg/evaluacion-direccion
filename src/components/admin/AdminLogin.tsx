import React, { useState } from 'react';
import { ArrowLeft, Lock, KeyRound, ShieldAlert } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (password: string) => boolean;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(password);
    if (!success) {
      setHasError(true);
    } else {
      setHasError(false);
      setPassword('');
    }
  };

  return (
    <div className="animate-fade-in max-w-md mx-auto mt-12 px-4">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-medium transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al portal
      </button>

      <div className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-md">
            <Lock className="w-8 h-8" />
          </div>
        </div>

        <h2 className="text-2xl font-black text-center text-slate-900 mb-2">
          Acceso Auditor / Dirección
        </h2>
        <p className="text-xs text-center text-slate-500 mb-8">
          Panel de consulta confidencial de informes y configuración del centro.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Contraseña Maestra
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setHasError(false);
                }}
                className={`w-full p-3.5 bg-slate-50 text-slate-900 border rounded-xl outline-none transition-all ${
                  hasError 
                    ? 'border-rose-500 ring-2 ring-rose-200 bg-rose-50/50' 
                    : 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:bg-white'
                }`}
                placeholder="Introduzca la clave autorizada"
                autoFocus
              />
              <KeyRound className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>

            {hasError && (
              <div className="flex items-center gap-1.5 text-rose-600 text-xs font-semibold mt-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Clave incorrecta. Verifique sus credenciales.</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow cursor-pointer"
          >
            Acceder al Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};
