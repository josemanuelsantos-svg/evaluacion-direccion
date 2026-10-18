import historicalEvals from '../data/evaluaciones_2025_2026.json';
import historicalConfig from '../data/configuracion_2025_2026.json';
import historicalReport from '../data/informe_consolidado_2025_2026.json';
import { EvaluationRecord, SurveyConfigMap, AcademicYear } from '../types/survey';

export const HISTORICAL_ACADEMIC_YEARS: AcademicYear[] = [
  {
    id: '2025_2026',
    label: 'Curso 2025/2026 (Histórico Cerrado)',
    isFrozen: true,
    isCurrent: false,
    startDate: '2025-09-01',
    endDate: '2026-08-31'
  },
  {
    id: '2026_2027',
    label: 'Curso 2026/2027 (Campaña Activa)',
    isFrozen: false,
    isCurrent: true,
    startDate: '2026-09-01',
    endDate: '2027-08-31'
  }
];

export function getHistoricalEvaluations(): EvaluationRecord[] {
  return (historicalEvals as any[]).map(e => {
    const cleanAnswers: Record<string, number | 'NA'> = {};
    if (e.answers) {
      Object.entries(e.answers).forEach(([k, v]) => {
        // En el curso 2025/2026, la opción 0 correspondía al botón 'N/A (No aplica)'
        cleanAnswers[k] = v === 0 ? 'NA' : (v as number);
      });
    }
    return {
      ...e,
      answers: cleanAnswers,
      academicYear: '2025_2026'
    };
  });
}

export function getHistoricalSurveyConfig(): SurveyConfigMap {
  return (historicalConfig as any).data || {};
}

export function getHistoricalConsolidatedReport() {
  return historicalReport;
}
