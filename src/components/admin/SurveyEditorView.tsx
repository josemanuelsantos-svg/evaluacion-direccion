import React, { useState } from 'react';
import { Settings, Plus, Trash2, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { SurveyConfigMap } from '../../types/survey';
import { iconMap } from '../../styles/theme';

interface SurveyEditorViewProps {
  surveyConfig: SurveyConfigMap;
  onSaveConfig: (updatedConfig: SurveyConfigMap) => Promise<void>;
  isSaving: boolean;
  saveStatus: string | null;
}

export const SurveyEditorView: React.FC<SurveyEditorViewProps> = ({
  surveyConfig,
  onSaveConfig,
  isSaving,
  saveStatus
}) => {
  const [localConfig, setLocalConfig] = useState<SurveyConfigMap>(surveyConfig);
  const [selectedRole, setSelectedRole] = useState<string>(Object.keys(surveyConfig)[0] || 'director_general');

  const handleQuestionTextChange = (roleKey: string, sIndex: number, qIndex: number, newText: string) => {
    setLocalConfig(prev => {
      const next = { ...prev };
      const role = { ...next[roleKey] };
      role.sections = [...role.sections];
      const section = { ...role.sections[sIndex] };
      section.questions = [...section.questions];
      section.questions[qIndex] = { ...section.questions[qIndex], text: newText };
      role.sections[sIndex] = section;
      next[roleKey] = role;
      return next;
    });
  };

  const handleAddQuestion = (roleKey: string, sIndex: number) => {
    const newId = `${roleKey}_q_${Date.now().toString().slice(-6)}_${Math.random().toString(36).substr(2, 4)}`;
    setLocalConfig(prev => {
      const next = { ...prev };
      const role = { ...next[roleKey] };
      role.sections = [...role.sections];
      const section = { ...role.sections[sIndex] };
      section.questions = [...section.questions, { id: newId, text: "" }];
      role.sections[sIndex] = section;
      next[roleKey] = role;
      return next;
    });
  };

  const handleRemoveQuestion = (roleKey: string, sIndex: number, qIndex: number) => {
    setLocalConfig(prev => {
      const next = { ...prev };
      const role = { ...next[roleKey] };
      role.sections = [...role.sections];
      const section = { ...role.sections[sIndex] };
      section.questions = section.questions.filter((_, idx) => idx !== qIndex);
      role.sections[sIndex] = section;
      next[roleKey] = role;
      return next;
    });
  };

  const handleSave = async () => {
    await onSaveConfig(localConfig);
  };

  const activeRoleData = localConfig[selectedRole];

  return (
    <div className="animate-fade-in space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Editor de Cuestionarios</h2>
          <p className="text-sm text-slate-600 mt-1">
            Adapte las preguntas y dimensiones para las campañas del centro educativo.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow transition-all cursor-pointer text-white ${
            isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isSaving ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>

      {saveStatus && (
        <div className={`p-4 rounded-xl flex items-center gap-2 text-sm font-semibold ${
          saveStatus.includes('Error') ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
        }`}>
          {saveStatus.includes('Error') ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span>{saveStatus}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Pestañas de directivos */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50 p-2 gap-2">
          {Object.entries(localConfig).map(([key, data]) => {
            const Icon = iconMap[data.iconName] || Settings;
            const isSelected = selectedRole === key;

            return (
              <button
                key={key}
                onClick={() => setSelectedRole(key)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected 
                    ? 'bg-white text-blue-700 shadow-sm border border-slate-200' 
                    : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {data.title}
              </button>
            );
          })}
        </div>

        {activeRoleData && (
          <div className="p-6 md:p-8 space-y-8">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-400" />
                Preguntas activas para: {activeRoleData.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {activeRoleData.description}
              </p>
            </div>

            <div className="space-y-8">
              {activeRoleData.sections.map((section, sIndex) => (
                <div key={sIndex} className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-extrabold text-slate-800">{section.category}</h4>
                    <span className="text-xs font-semibold text-slate-400">
                      {section.questions.length} preguntas
                    </span>
                  </div>

                  <div className="space-y-3">
                    {section.questions.map((q, qIndex) => (
                      <div key={q.id} className="flex gap-3 items-start bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs group">
                        <span className="text-xs font-bold text-slate-400 mt-2.5 w-6 text-right font-mono">
                          {qIndex + 1}.
                        </span>
                        <div className="flex-1">
                          <textarea
                            value={q.text}
                            onChange={(e) => handleQuestionTextChange(selectedRole, sIndex, qIndex, e.target.value)}
                            className="w-full p-2.5 bg-white text-slate-900 text-sm outline-none resize-y min-h-[46px] border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            placeholder="Escriba la redacción del ítem evaluativo..."
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveQuestion(selectedRole, sIndex, qIndex)}
                          className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar pregunta"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleAddQuestion(selectedRole, sIndex)}
                    className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Añadir Pregunta a esta dimensión
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
