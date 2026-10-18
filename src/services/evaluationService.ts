import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  EvaluationRecord, 
  RoleStats, 
  SurveyConfigMap, 
  DimensionAverage, 
  QuestionAverage, 
  SectionAverageDetail 
} from '../types/survey';
import { getHistoricalEvaluations, getHistoricalSurveyConfig } from './historicalData';

export async function fetchAllEvaluationsFromFirestore(): Promise<EvaluationRecord[]> {
  try {
    const q = query(collection(db, 'evaluaciones_directivos'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    const firestoreDocs: EvaluationRecord[] = snapshot.docs.map(d => {
      const data = d.data();
      const academicYear = data.academicYear || determineAcademicYear(data.timestamp);
      const rawAnswers = data.answers || {};
      const cleanAnswers: Record<string, number | 'NA'> = {};

      Object.entries(rawAnswers).forEach(([k, v]) => {
        // En el curso histórico 2025/2026, el valor 0 guardado en Firestore correspondía al botón 'N/A' (No aplica)
        if (academicYear === '2025_2026' && v === 0) {
          cleanAnswers[k] = 'NA';
        } else if (v === 'NA' || (v as unknown) === 'N/A' || (v as unknown) === 'no_aplica') {
          cleanAnswers[k] = 'NA';
        } else {
          cleanAnswers[k] = v as (number | 'NA');
        }
      });

      return {
        id: d.id,
        roleEvaluated: data.roleEvaluated,
        subRoleEvaluated: data.subRoleEvaluated || null,
        answers: cleanAnswers,
        comments: data.comments || '',
        timestamp: data.timestamp,
        academicYear
      };
    });

    // Si Firestore no tiene los registros antiguos o estamos offline, asegurar que los 185 históricos estén presentes
    const historical = getHistoricalEvaluations();
    const existingIds = new Set(firestoreDocs.map(d => d.id));
    const merged = [...firestoreDocs];
    for (const h of historical) {
      if (!existingIds.has(h.id)) {
        merged.push(h);
      }
    }
    return merged;
  } catch (error) {
    console.warn('Error al conectar con Firestore, cargando datos locales respaldados:', error);
    return getHistoricalEvaluations();
  }
}

export function determineAcademicYear(timestamp: any): string {
  if (!timestamp) return '2025_2026';
  let date: Date;
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    date = timestamp.toDate();
  } else if (typeof timestamp === 'string') {
    date = new Date(timestamp);
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    return '2025_2026';
  }

  // Curso escolar en España: 1 de septiembre a 31 de agosto
  const year = date.getFullYear();
  const month = date.getMonth(); // 0 = Jan, 8 = Sept
  if (month >= 8) {
    // Septiembre a Diciembre
    return `${year}_${year + 1}`;
  } else {
    // Enero a Agosto
    return `${year - 1}_${year}`;
  }
}

export async function submitEvaluationRecord(payload: {
  roleEvaluated: string;
  subRoleEvaluated?: string | null;
  answers: Record<string, number | 'NA'>;
  comments?: string;
  academicYear?: string;
}): Promise<string> {
  const academicYear = payload.academicYear || '2026_2027';
  const evalCollection = collection(db, 'evaluaciones_directivos');
  const docRef = await addDoc(evalCollection, {
    roleEvaluated: payload.roleEvaluated,
    subRoleEvaluated: payload.subRoleEvaluated || null,
    answers: payload.answers,
    comments: payload.comments || '',
    academicYear: academicYear,
    timestamp: serverTimestamp(),
  });
  return docRef.id;
}

export async function deleteEvaluationRecord(id: string): Promise<void> {
  await deleteDoc(doc(db, 'evaluaciones_directivos', id));
}

export function filterEvaluationsByYear(
  evaluations: EvaluationRecord[],
  academicYear: string
): EvaluationRecord[] {
  if (academicYear === 'all') return evaluations;
  return evaluations.filter(e => {
    const year = e.academicYear || determineAcademicYear(e.timestamp);
    return year === academicYear;
  });
}

export function calculateRoleStats(
  evaluations: EvaluationRecord[],
  roleKeyWithSubrole: string,
  surveyConfig: SurveyConfigMap
): RoleStats {
  let subRoleFilter: string | null = null;
  let mainRoleKey = roleKeyWithSubrole;

  if (roleKeyWithSubrole.startsWith('director_pedagogico_')) {
    mainRoleKey = 'director_pedagogico';
    subRoleFilter = roleKeyWithSubrole.replace('director_pedagogico_', '');
  }

  const roleConfig = surveyConfig[mainRoleKey] || getHistoricalSurveyConfig()[mainRoleKey];
  const roleTitle = roleConfig?.title || mainRoleKey;
  const subRoleObj = roleConfig?.subRoles?.find(sr => sr.id === subRoleFilter);
  const subRoleTitle = subRoleObj ? subRoleObj.title : undefined;

  const relevantEvals = evaluations.filter(e => {
    const matchRole = e.roleEvaluated === mainRoleKey;
    const matchSub = subRoleFilter ? e.subRoleEvaluated === subRoleFilter : true;
    return matchRole && matchSub;
  });

  const emptyStats: RoleStats = {
    roleKey: roleKeyWithSubrole,
    roleTitle,
    subRoleTitle,
    totalEvaluations: 0,
    globalAverage: 0,
    diagnostico: {
      texto: "Sin evaluaciones registradas",
      color: "text-slate-500",
      bg: "bg-slate-100",
      nivel: "riesgo"
    },
    sectionAverages: [],
    sectionDetails: [],
    scoreDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    highestSection: null,
    lowestSection: null,
    topQuestions: [],
    lowestQuestions: [],
    comments: [],
    rawEvaluations: []
  };

  if (relevantEvals.length === 0 || !roleConfig) {
    return emptyStats;
  }

  let totalScoreSum = 0;
  let totalValidAnswers = 0;
  const scoreDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const sectionAverages: DimensionAverage[] = [];
  const sectionDetails: SectionAverageDetail[] = [];
  const allQuestionAverages: QuestionAverage[] = [];

  roleConfig.sections.forEach(section => {
    let sectionSum = 0;
    let sectionValid = 0;
    const sectionQuestions: QuestionAverage[] = [];

    section.questions.forEach(q => {
      let qSum = 0;
      let qValid = 0;
      const qDist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      relevantEvals.forEach(e => {
        const val = e.answers ? e.answers[q.id] : undefined;
        // Si es 'NA' o no respondido: NO se involucra ni sube ni baja la media
        if (val === 'NA' || (val as unknown) === 'N/A' || (val as unknown) === 'no_aplica' || val === null || val === undefined) {
          return;
        }

        // Si es un número (incluido 0): se computa como nota válida
        if (typeof val === 'number') {
          qSum += val;
          qValid++;
          const roundVal = Math.round(val);
          if (roundVal >= 0 && roundVal <= 5) {
            qDist[roundVal] = (qDist[roundVal] || 0) + 1;
            scoreDistribution[roundVal] = (scoreDistribution[roundVal] || 0) + 1;
          }

          sectionSum += val;
          sectionValid++;
          totalScoreSum += val;
          totalValidAnswers++;
        }
      });

      // Si no hubo respuestas numéricas (todos N/A), no se le asigna 0, sino null (no evaluable)
      const qAvg = qValid > 0 ? parseFloat((qSum / qValid).toFixed(2)) : null;
      const qItem: QuestionAverage = {
        id: q.id,
        text: q.text,
        average: qAvg,
        sampleCount: qValid,
        distribution: qDist
      };
      sectionQuestions.push(qItem);
      allQuestionAverages.push(qItem);
    });

    const secAvg = sectionValid > 0 ? parseFloat((sectionSum / sectionValid).toFixed(2)) : 0;
    sectionAverages.push({
      name: section.category,
      average: secAvg,
      sampleCount: sectionValid
    });

    sectionDetails.push({
      category: section.category,
      average: secAvg,
      sampleCount: sectionValid,
      questions: sectionQuestions
    });
  });

  const globalAvg = totalValidAnswers > 0 ? parseFloat((totalScoreSum / totalValidAnswers).toFixed(2)) : 0;

  let diagnostico: {
    texto: string;
    color: string;
    bg: string;
    nivel: 'excelencia' | 'aceptable' | 'riesgo';
  } = {
    texto: "Riesgo Institucional / Atención Urgente",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    nivel: "riesgo"
  };
  if (globalAvg >= 4.2) {
    diagnostico = {
      texto: "Excelencia / Liderazgo Sólido",
      color: "text-emerald-700",
      bg: "bg-emerald-50 border-emerald-200",
      nivel: "excelencia" as const
    };
  } else if (globalAvg >= 3.5) {
    diagnostico = {
      texto: "Aceptable / Margen de Mejora",
      color: "text-amber-700",
      bg: "bg-amber-50 border-amber-200",
      nivel: "aceptable" as const
    };
  }

  const highestSection = sectionAverages.length > 0
    ? [...sectionAverages].sort((a, b) => b.average - a.average)[0]
    : null;
  const lowestSection = sectionAverages.length > 0
    ? [...sectionAverages].sort((a, b) => a.average - b.average)[0]
    : null;

  const validQuestions = allQuestionAverages.filter(q => q.average !== null && q.sampleCount > 0);
  const sortedQuestions = [...validQuestions].sort((a, b) => (b.average ?? 0) - (a.average ?? 0));
  const topQuestions = sortedQuestions.slice(0, 3);
  const lowestQuestions = [...sortedQuestions].reverse().slice(0, 3);

  const comments = relevantEvals
    .filter(e => e.comments && e.comments.trim().length > 0)
    .map(e => {
      let dateStr = '';
      if (e.timestamp) {
        if (e.timestamp.toDate && typeof e.timestamp.toDate === 'function') {
          dateStr = e.timestamp.toDate().toLocaleDateString('es-ES');
        } else if (typeof e.timestamp === 'string') {
          dateStr = new Date(e.timestamp).toLocaleDateString('es-ES');
        }
      }
      return {
        text: e.comments!.trim(),
        date: dateStr
      };
    });

  return {
    roleKey: roleKeyWithSubrole,
    roleTitle,
    subRoleTitle,
    totalEvaluations: relevantEvals.length,
    globalAverage: globalAvg,
    diagnostico,
    sectionAverages,
    sectionDetails,
    scoreDistribution,
    highestSection,
    lowestSection,
    topQuestions,
    lowestQuestions,
    comments,
    rawEvaluations: relevantEvals
  };
}

export function exportStatsToCSV(stats: RoleStats, academicYearLabel: string): void {
  if (stats.rawEvaluations.length === 0) return;

  let csvContent = "ID,Fecha,Rol Evaluado,Subrol,Puntuacion Media,Comentarios\n";
  stats.rawEvaluations.forEach(ev => {
    let date = 'Desconocida';
    if (ev.timestamp) {
      if (ev.timestamp.toDate) date = ev.timestamp.toDate().toLocaleDateString('es-ES');
      else date = new Date(ev.timestamp).toLocaleDateString('es-ES');
    }
    const role = ev.roleEvaluated;
    const subRole = ev.subRoleEvaluated || 'N/A';

    let sum = 0, count = 0;
    if (ev.answers) {
      Object.values(ev.answers).forEach((val: any) => {
        if (val === 'NA' || val === 'N/A' || val === 'no_aplica' || val === null || val === undefined) return;
        if (typeof val === 'number') {
          sum += val;
          count++;
        }
      });
    }
    const media = count > 0 ? (sum / count).toFixed(2) : 'N/A';
    const comment = ev.comments ? `"${ev.comments.replace(/"/g, '""').replace(/[\r\n]+/g, ' ')}"` : 'Ninguno';
    csvContent += `"${ev.id}","${date}","${role}","${subRole}",${media},${comment}\n`;
  });

  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `auditoria_360_${stats.roleKey}_${academicYearLabel}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
