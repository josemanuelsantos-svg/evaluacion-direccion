export interface Question {
  id: string;
  text: string;
}

export interface SurveySection {
  category: string;
  questions: Question[];
}

export interface SubRole {
  id: string;
  title: string;
}

export interface RoleSurveyConfig {
  title: string;
  iconName: string;
  theme: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'slate';
  description: string;
  requiresSubRole: boolean;
  subRoles?: SubRole[];
  sections: SurveySection[];
}

export type SurveyConfigMap = Record<string, RoleSurveyConfig>;

export interface EvaluationRecord {
  id: string;
  roleEvaluated: string;
  subRoleEvaluated?: string | null;
  answers: Record<string, number | 'NA'>;
  comments?: string;
  timestamp?: any; // Firestore Timestamp or ISO string
  academicYear?: string; // e.g., '2025_2026', '2026_2027'
}

export interface DimensionAverage {
  name: string;
  average: number;
  sampleCount: number;
}

export interface QuestionAverage {
  id: string;
  text: string;
  average: number | null;
  sampleCount: number;
  distribution: Record<number, number>;
}

export interface SectionAverageDetail {
  category: string;
  average: number;
  sampleCount: number;
  questions: QuestionAverage[];
}

export interface RoleStats {
  roleKey: string;
  roleTitle: string;
  subRoleTitle?: string;
  totalEvaluations: number;
  globalAverage: number;
  diagnostico: {
    texto: string;
    color: string;
    bg: string;
    nivel: 'excelencia' | 'aceptable' | 'riesgo';
  };
  sectionAverages: DimensionAverage[];
  sectionDetails: SectionAverageDetail[];
  scoreDistribution: Record<number, number>;
  highestSection: DimensionAverage | null;
  lowestSection: DimensionAverage | null;
  topQuestions: QuestionAverage[];
  lowestQuestions: QuestionAverage[];
  comments: Array<{ text: string; date?: string }>;
  rawEvaluations: EvaluationRecord[];
}

export interface AcademicYear {
  id: string;
  label: string;
  isFrozen: boolean;
  isCurrent: boolean;
  startDate: string;
  endDate: string;
}

export interface ThemeStyle {
  headerBg: string;
  iconBg: string;
  iconHover: string;
  arrowHover: string;
  borderHover: string;
  bgLightHover: string;
  progress: string;
  banner: string;
  bannerText: string;
  bannerSubtext: string;
  radioFocus: string;
  radioCheckedText: string;
  radioInput: string;
  btnSubmit: string;
  btnSubmitLoading: string;
  bigIcon: string;
  bigIconHover: string;
  bigBorderHover: string;
  bigBgHover: string;
  textareaFocus: string;
  hexFill: string;
  hexStroke: string;
  hexDot: string;
}
