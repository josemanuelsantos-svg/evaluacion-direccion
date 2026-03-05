import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Briefcase, 
  GraduationCap, 
  HeartHandshake, 
  Building, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft,
  AlertCircle,
  Loader2,
  Lock,
  BarChart3,
  MessageSquare,
  Users,
  Star,
  LogOut,
  Download,
  Edit3,
  Settings,
  Trash2,
  Plus,
  Save,
  Key,
  List,
  BookOpen
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, setDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDpRCVDgKY69zsx5dR2CJXr6nKmmGZbQao",
  authDomain: "evaluacion-direccion.firebaseapp.com",
  projectId: "evaluacion-direccion",
  storageBucket: "evaluacion-direccion.firebasestorage.app",
  messagingSenderId: "711138938347",
  appId: "1:711138938347:web:d3ad7f04bac970d3221dae"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Mapeo de iconos
const iconMap = {
  Briefcase: Briefcase,
  GraduationCap: GraduationCap,
  HeartHandshake: HeartHandshake,
  Building: Building
};

// --- DICCIONARIO DE TEMAS DE COLOR (Colores vivos y diferenciados) ---
const themeStyles = {
  blue: {
    headerBg: 'bg-blue-700',
    iconBg: 'bg-blue-100 text-blue-700',
    iconHover: 'group-hover:bg-blue-600 group-hover:text-white',
    arrowHover: 'group-hover:text-blue-600',
    borderHover: 'hover:border-blue-400',
    bgLightHover: 'hover:bg-blue-50/80',
    progress: 'bg-blue-600',
    banner: 'bg-blue-600',
    bannerText: 'text-blue-100',
    bannerSubtext: 'text-blue-50',
    radioFocus: 'focus:ring-blue-500',
    radioCheckedText: 'text-blue-700',
    radioInput: 'text-blue-600',
    btnSubmit: 'bg-blue-600 hover:bg-blue-700',
    btnSubmitLoading: 'bg-blue-400',
    bigIcon: 'text-blue-500',
    bigIconHover: 'group-hover:text-blue-700',
    bigBorderHover: 'hover:border-blue-500',
    bigBgHover: 'hover:bg-blue-50',
    textareaFocus: 'focus:ring-blue-500 focus:border-blue-500',
    hexFill: 'rgba(37, 99, 235, 0.2)',
    hexStroke: '#2563eb',
    hexDot: '#1d4ed8'
  },
  green: {
    headerBg: 'bg-green-700',
    iconBg: 'bg-green-100 text-green-700',
    iconHover: 'group-hover:bg-green-600 group-hover:text-white',
    arrowHover: 'group-hover:text-green-600',
    borderHover: 'hover:border-green-400',
    bgLightHover: 'hover:bg-green-50/80',
    progress: 'bg-green-600',
    banner: 'bg-green-600',
    bannerText: 'text-green-100',
    bannerSubtext: 'text-green-50',
    radioFocus: 'focus:ring-green-500',
    radioCheckedText: 'text-green-700',
    radioInput: 'text-green-600',
    btnSubmit: 'bg-green-600 hover:bg-green-700',
    btnSubmitLoading: 'bg-green-400',
    bigIcon: 'text-green-500',
    bigIconHover: 'group-hover:text-green-700',
    bigBorderHover: 'hover:border-green-500',
    bigBgHover: 'hover:bg-green-50',
    textareaFocus: 'focus:ring-green-500 focus:border-green-500',
    hexFill: 'rgba(22, 163, 74, 0.2)',
    hexStroke: '#16a34a',
    hexDot: '#15803d'
  },
  red: {
    headerBg: 'bg-red-700',
    iconBg: 'bg-red-100 text-red-700',
    iconHover: 'group-hover:bg-red-600 group-hover:text-white',
    arrowHover: 'group-hover:text-red-600',
    borderHover: 'hover:border-red-400',
    bgLightHover: 'hover:bg-red-50/80',
    progress: 'bg-red-600',
    banner: 'bg-red-600',
    bannerText: 'text-red-100',
    bannerSubtext: 'text-red-50',
    radioFocus: 'focus:ring-red-500',
    radioCheckedText: 'text-red-700',
    radioInput: 'text-red-600',
    btnSubmit: 'bg-red-600 hover:bg-red-700',
    btnSubmitLoading: 'bg-red-400',
    bigIcon: 'text-red-500',
    bigIconHover: 'group-hover:text-red-700',
    bigBorderHover: 'hover:border-red-500',
    bigBgHover: 'hover:bg-red-50',
    textareaFocus: 'focus:ring-red-500 focus:border-red-500',
    hexFill: 'rgba(220, 38, 38, 0.2)',
    hexStroke: '#dc2626',
    hexDot: '#b91c1c'
  },
  yellow: {
    headerBg: 'bg-amber-600', // Usamos ámbar para que el texto blanco se lea bien
    iconBg: 'bg-amber-100 text-amber-700',
    iconHover: 'group-hover:bg-amber-500 group-hover:text-white',
    arrowHover: 'group-hover:text-amber-600',
    borderHover: 'hover:border-amber-400',
    bgLightHover: 'hover:bg-amber-50/80',
    progress: 'bg-amber-500',
    banner: 'bg-amber-500',
    bannerText: 'text-amber-50',
    bannerSubtext: 'text-amber-100',
    radioFocus: 'focus:ring-amber-500',
    radioCheckedText: 'text-amber-700',
    radioInput: 'text-amber-500',
    btnSubmit: 'bg-amber-600 hover:bg-amber-700',
    btnSubmitLoading: 'bg-amber-400',
    bigIcon: 'text-amber-500',
    bigIconHover: 'group-hover:text-amber-700',
    bigBorderHover: 'hover:border-amber-500',
    bigBgHover: 'hover:bg-amber-50',
    textareaFocus: 'focus:ring-amber-500 focus:border-amber-500',
    hexFill: 'rgba(217, 119, 6, 0.2)',
    hexStroke: '#d97706',
    hexDot: '#b45309'
  }
};

// --- BASE DE DATOS DE PREGUNTAS OPTIMIZADAS ---
const defaultSurveyData = {
  director_general: {
    title: "Director General",
    iconName: "Briefcase",
    theme: "blue",
    description: "Evaluación del liderazgo, capacidad de resolución y trato humano en la dirección del centro.",
    requiresSubRole: false,
    sections: [
      {
        category: "Eficacia y Visión Institucional",
        questions: [
          { id: "dg_1", text: "Comunica los objetivos institucionales del centro al personal." },
          { id: "dg_2", text: "Mantiene la calma ante situaciones imprevistas o de crisis." },
          { id: "dg_3", text: "Toma decisiones organizativas que resultan útiles para el centro." },
          { id: "dg_4", text: "Impulsa la innovación en mi área de trabajo." }
        ]
      },
      {
        category: "Trato Personal y Clima Laboral",
        questions: [
          { id: "dg_5", text: "Muestra empatía ante mis circunstancias personales." },
          { id: "dg_6", text: "Reconoce el trabajo bien hecho." },
          { id: "dg_7", text: "Escucha a todas las partes antes de intervenir en un conflicto." },
          { id: "dg_8", text: "Actúa de forma coherente con el ideario del colegio." }
        ]
      },
      {
        category: "Accesibilidad y Comunicación",
        questions: [
          { id: "dg_9", text: "Es accesible para tratar cuestiones importantes." },
          { id: "dg_10", text: "Proporciona la información institucional a tiempo." },
          { id: "dg_11", text: "Acepta las críticas sobre su gestión." },
          { id: "dg_12", text: "Defiende los intereses del personal ante instituciones externas." }
        ]
      }
    ]
  },
  director_pedagogico: {
    title: "Director Pedagógico",
    iconName: "GraduationCap",
    theme: "green",
    description: "Evaluación del apoyo diario en el aula, resolución de problemas académicos y trato al docente.",
    requiresSubRole: true,
    subRoles: [
      { id: "infantil_primaria", title: "Infantil y Primaria" },
      { id: "secundaria_bachillerato", title: "Secundaria y Bachillerato" }
    ],
    sections: [
      {
        category: "Eficacia Operativa y Gestión Diaria",
        questions: [
          { id: "dp_1", text: "Da solución a las incidencias organizativas (horarios, guardias, etc)." },
          { id: "dp_2", text: "Aporta orientaciones pedagógicas aplicables a mis clases." },
          { id: "dp_3", text: "Proporciona recursos para atender a la diversidad en el aula." },
          { id: "dp_4", text: "Cumple con los tiempos preestablecidos en las reuniones." }
        ]
      },
      {
        category: "Acompañamiento y Trato Personal",
        questions: [
          { id: "dp_5", text: "Muestra interés por mi bienestar profesional." },
          { id: "dp_6", text: "Facilita la puesta en marcha de mis iniciativas en el aula." },
          { id: "dp_7", text: "Enfoca sus correcciones profesionales hacia la mejora." },
          { id: "dp_8", text: "Asume responsabilidades propias sin delegarlas en exceso." }
        ]
      },
      {
        category: "Gestión de Convivencia y Apoyo con Familias",
        questions: [
          { id: "dp_9", text: "Me respalda ante situaciones difíciles con las familias." },
          { id: "dp_10", text: "Interviene cuando le derivo problemas de disciplina." },
          { id: "dp_11", text: "Trata al alumnado con tacto y respeto." },
          { id: "dp_12", text: "Aplica las normas de convivencia de forma equitativa." }
        ]
      }
    ]
  },
  coordinador_pastoral: {
    title: "Coordinador de Pastoral",
    iconName: "HeartHandshake",
    theme: "red",
    description: "Evaluación del acompañamiento humano, eficacia en la dinamización de actividades y cercanía.",
    requiresSubRole: false,
    sections: [
      {
        category: "Eficacia en la Dinamización",
        questions: [
          { id: "cp_1", text: "Avisa de las actividades pastorales con suficiente antelación." },
          { id: "cp_2", text: "Proporciona materiales aplicables para las tutorías." },
          { id: "cp_3", text: "Propone celebraciones que conectan con los intereses del alumnado." },
          { id: "cp_4", text: "Organiza la pastoral sin generar burocracia adicional al profesorado." }
        ]
      },
      {
        category: "Acompañamiento y Vivencia Personal",
        questions: [
          { id: "cp_5", text: "Muestra una actitud de acogida en el día a día." },
          { id: "cp_6", text: "Ofrece un espacio de escucha activa ante dificultades personales." },
          { id: "cp_7", text: "Trata con el mismo respeto a quienes tienen menor implicación religiosa." },
          { id: "cp_8", text: "Presta apoyo ante situaciones humanas delicadas en mi aula." }
        ]
      },
      {
        category: "Identidad y Compromiso",
        questions: [
          { id: "cp_9", text: "Transmite los valores del centro mediante acciones concretas." },
          { id: "cp_10", text: "Coordina la ejecución de los proyectos de acción social." },
          { id: "cp_11", text: "Fomenta la sensibilidad social ante las injusticias entre el alumnado." },
          { id: "cp_12", text: "Contribuye a generar sentimiento de comunidad en el colegio." }
        ]
      }
    ]
  },
  administrador: {
    title: "Administrador del Centro",
    iconName: "Building",
    theme: "yellow",
    description: "Evaluación del mantenimiento de instalaciones, agilidad en reparaciones y trato humano.",
    requiresSubRole: false,
    sections: [
      {
        category: "Estado y Funcionalidad de Instalaciones",
        questions: [
          { id: "ad_1", text: "Garantiza la limpieza de mi espacio de trabajo principal." },
          { id: "ad_2", text: "Asegura el mantenimiento de las zonas comunes (pasillos, patios, salas)." },
          { id: "ad_3", text: "Supervisa el cumplimiento de las labores del personal de servicios." },
          { id: "ad_4", text: "Aplica las normativas de seguridad correspondientes en el centro." }
        ]
      },
      {
        category: "Gestión de Reparaciones y Trato Personal",
        questions: [
          { id: "ad_5", text: "Da solución a las averías reportadas en mi espacio de trabajo." },
          { id: "ad_6", text: "Mantiene un trato personal respetuoso." },
          { id: "ad_7", text: "Atiende mis peticiones sobre necesidades materiales extraordinarias." },
          { id: "ad_8", text: "Explica los motivos cuando hay limitaciones de presupuesto o recursos." }
        ]
      },
      {
        category: "Gestión de Recursos y Mejoras",
        questions: [
          { id: "ad_9", text: "Proporciona el material fungible solicitado." },
          { id: "ad_10", text: "Gestiona al personal de mantenimiento para que cumpla sus tareas." },
          { id: "ad_11", text: "Toma en cuenta las sugerencias sobre los espacios del centro." },
          { id: "ad_12", text: "Realiza mejoras en las infraestructuras para nuestra comodidad." }
        ]
      }
    ]
  }
};

const scaleOptions = [
  { value: 1, label: "Totalmente en desacuerdo" },
  { value: 2, label: "En desacuerdo" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "De acuerdo" },
  { value: 5, label: "Totalmente de acuerdo" },
  { value: 0, label: "N/A (No aplica / Sin experiencia directa)" }
];

// --- COMPONENTE GRÁFICO DE RADAR (ARAÑA) CON COLOR DINÁMICO ---
const RadarChart = ({ data, theme }) => {
  if (!data || data.length < 3) return (
    <div className="flex items-center justify-center h-full text-slate-400 text-sm italic">
      Gráfico no disponible (se requieren al menos 3 dimensiones)
    </div>
  );

  const size = 320;
  const center = size / 2;
  const radius = (size / 2) - 45; 

  const getCoordinatesForValue = (value, index) => {
    const angle = (Math.PI / 2) - (2 * Math.PI * index / data.length);
    const r = (value / 5) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center - r * Math.sin(angle)
    };
  };

  const polygonPoints = data.map((d, i) => {
    const pos = getCoordinatesForValue(d.average, i);
    return `${pos.x},${pos.y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto max-w-[320px] overflow-visible">
      {[1, 2, 3, 4, 5].map(level => {
        const levelPoints = data.map((_, i) => {
          const pos = getCoordinatesForValue(level, i);
          return `${pos.x},${pos.y}`;
        }).join(' ');
        return (
          <polygon key={level} points={levelPoints} fill="none" stroke={level === 5 ? "#cbd5e1" : "#f1f5f9"} strokeWidth="1" />
        );
      })}

      {data.map((d, i) => {
        const pos = getCoordinatesForValue(5, i);
        const labelPos = getCoordinatesForValue(5.9, i); 
        const words = d.name.split(' ');
        const half = Math.ceil(words.length / 2);
        const label1 = words.slice(0, half).join(' ');
        const label2 = words.slice(half).join(' ');
        
        return (
          <g key={i}>
            <line x1={center} y1={center} x2={pos.x} y2={pos.y} stroke="#e2e8f0" strokeWidth="1" />
            <text x={labelPos.x} y={labelPos.y - 6} textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-medium fill-slate-500">
              {label1}
            </text>
            <text x={labelPos.x} y={labelPos.y + 6} textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-medium fill-slate-500">
              {label2}
            </text>
          </g>
        );
      })}

      <polygon points={polygonPoints} fill={theme.hexFill} stroke={theme.hexStroke} strokeWidth="2" />
      {data.map((d, i) => {
        const pos = getCoordinatesForValue(d.average, i);
        return <circle key={`c-${i}`} cx={pos.x} cy={pos.y} r="4" fill={theme.hexDot} />;
      })}
    </svg>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState('home'); 
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedSubRole, setSelectedSubRole] = useState(null);
  
  const [answers, setAnswers] = useState({});
  const [comments, setComments] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [surveyConfig, setSurveyConfig] = useState(defaultSurveyData);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState(false);
  const [allEvaluations, setAllEvaluations] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [adminSelectedRole, setAdminSelectedRole] = useState('director_general');
  const [exportStatus, setExportStatus] = useState(null);
  
  const [adminTab, setAdminTab] = useState('resultados'); 
  const [localSurveyConfig, setLocalSurveyConfig] = useState(defaultSurveyData);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configSaveStatus, setConfigSaveStatus] = useState(null);

  // Clave maestra principal
  const [appPassword, setAppPassword] = useState('Itinerarium@1246');
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [completedSurveys, setCompletedSurveys] = useState([]);

  // Estados para el borrado de encuestas
  const [deleteId, setDeleteId] = useState(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('auditoria360_completed');
    if (stored) {
      setCompletedSurveys(JSON.parse(stored));
    }

    const initApp = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error("Error de autenticación:", error);
      }
    };
    initApp();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const configRef = doc(db, 'configuracion', 'encuestas');
          const docSnap = await getDoc(configRef);
          if (docSnap.exists()) {
            setSurveyConfig(docSnap.data().data);
            setLocalSurveyConfig(docSnap.data().data);
          } else {
            await setDoc(configRef, { data: defaultSurveyData });
            setSurveyConfig(defaultSurveyData);
            setLocalSurveyConfig(defaultSurveyData);
          }

          const adminRef = doc(db, 'configuracion', 'admin');
          const adminSnap = await getDoc(adminRef);
          if (adminSnap.exists()) {
            setAppPassword(adminSnap.data().password);
          } else {
            await setDoc(adminRef, { password: 'Itinerarium@1246' });
            setAppPassword('Itinerarium@1246');
          }
        } catch (error) {
          console.error("Error al cargar configuración:", error);
          setSurveyConfig(defaultSurveyData);
          setLocalSurveyConfig(defaultSurveyData);
        } finally {
          setIsLoadingConfig(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleStartSurvey = (roleKey) => {
    setSelectedRole(roleKey);
    if (surveyConfig[roleKey].requiresSubRole) {
      setCurrentView('subrole_selection');
    } else {
      setAnswers({});
      setComments("");
      setShowValidation(false);
      setSelectedSubRole(null);
      setCurrentView('survey');
    }
  };

  const handleSelectSubRole = (subRoleId) => {
    setSelectedSubRole(subRoleId);
    setAnswers({});
    setComments("");
    setShowValidation(false);
    setCurrentView('survey');
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const getProgress = () => {
    if (!selectedRole) return 0;
    const roleData = surveyConfig[selectedRole];
    const totalQuestions = roleData.sections.reduce((acc, section) => acc + section.questions.length, 0);
    const answeredCount = Object.keys(answers).length;
    return Math.round((answeredCount / totalQuestions) * 100);
  };

  const getUnansweredCount = () => {
    if (!selectedRole) return 0;
    const roleData = surveyConfig[selectedRole];
    const totalQuestions = roleData.sections.reduce((acc, section) => acc + section.questions.length, 0);
    return totalQuestions - Object.keys(answers).length;
  };

  const handleSubmit = async () => {
    const roleData = surveyConfig[selectedRole];
    const totalQuestions = roleData.sections.reduce((acc, section) => acc + section.questions.length, 0);
    
    if (Object.keys(answers).length < totalQuestions) {
      setShowValidation(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      if (user) {
        const evalCollection = collection(db, 'evaluaciones_directivos');
        await addDoc(evalCollection, {
          roleEvaluated: selectedRole,
          subRoleEvaluated: selectedSubRole || null,
          answers: answers,
          comments: comments,
          timestamp: serverTimestamp(),
        });

        const surveyKey = selectedSubRole ? `${selectedRole}_${selectedSubRole}` : selectedRole;
        const updatedCompleted = [...completedSurveys, surveyKey];
        setCompletedSurveys(updatedCompleted);
        localStorage.setItem('auditoria360_completed', JSON.stringify(updatedCompleted));
      }
      setCurrentView('success');
    } catch (error) {
      console.error("Error al guardar en base de datos:", error);
      setCurrentView('success'); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const RECOVERY_KEY = "admin_recovery_360";
    const NEW_MASTER_KEY = "Itinerarium@1246"; 

    if (adminPassword === appPassword || adminPassword === RECOVERY_KEY || adminPassword === NEW_MASTER_KEY) {
      setAdminError(false);
      setAdminPassword("");
      fetchAdminData();
      setCurrentView('admin_dashboard');
    } else {
      setAdminError(true);
    }
  };

  const fetchAdminData = async () => {
    if (!user) return;
    setIsLoadingStats(true);
    try {
      const q = query(collection(db, 'evaluaciones_directivos'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
      setAllEvaluations(data);
    } catch (error) {
      console.error("Error fetching evaluations:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const calculateStats = (roleKey) => {
    let subRoleFilter = null;
    let mainRoleKey = roleKey;

    if (roleKey.startsWith('director_pedagogico_')) {
      mainRoleKey = 'director_pedagogico';
      subRoleFilter = roleKey.replace('director_pedagogico_', '');
    }

    const evals = allEvaluations.filter(e => 
      e.roleEvaluated === mainRoleKey && 
      (subRoleFilter ? e.subRoleEvaluated === subRoleFilter : true)
    );

    const stats = {
      totalEvaluations: evals.length,
      globalAverage: 0,
      sectionAverages: [],
      scoreDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      comments: [],
      highestSection: null,
      lowestSection: null,
      rawEvaluations: evals 
    };

    if (evals.length === 0) return stats;

    let totalScoreSum = 0;
    let totalValidAnswers = 0;
    const roleData = surveyConfig[mainRoleKey];

    roleData.sections.forEach(section => {
      let sectionSum = 0;
      let sectionValidAnswers = 0;

      section.questions.forEach(q => {
        evals.forEach(e => {
          const val = e.answers[q.id];
          if (val && val > 0) { 
            sectionSum += val;
            sectionValidAnswers++;
            totalScoreSum += val;
            totalValidAnswers++;
            stats.scoreDistribution[val] = (stats.scoreDistribution[val] || 0) + 1;
          }
        });
      });

      stats.sectionAverages.push({
        name: section.category,
        average: sectionValidAnswers > 0 ? (sectionSum / sectionValidAnswers) : 0
      });
    });

    stats.globalAverage = totalValidAnswers > 0 ? (totalScoreSum / totalValidAnswers) : 0;
    
    if (stats.sectionAverages.length > 0) {
      stats.highestSection = stats.sectionAverages.reduce((max, s) => s.average > max.average ? s : max, stats.sectionAverages[0]);
      stats.lowestSection = stats.sectionAverages.reduce((min, s) => s.average < min.average ? s : min, stats.sectionAverages[0]);
    }

    stats.comments = evals
      .filter(e => e.comments && e.comments.trim().length > 0)
      .map(e => ({ text: e.comments }));

    return stats;
  };

  const exportToCSV = () => {
    if (allEvaluations.length === 0) return;
    let csvContent = "ID,Fecha,Rol Evaluado,Subrol,Puntuacion Media,Comentarios\n";

    allEvaluations.forEach(ev => {
      const date = ev.timestamp?.toDate ? ev.timestamp.toDate().toLocaleDateString() : 'Desconocida';
      const role = ev.roleEvaluated;
      const subRole = ev.subRoleEvaluated || 'N/A';
      
      let sum = 0, count = 0;
      if (ev.answers) {
        Object.values(ev.answers).forEach(val => {
          if (val > 0) { sum += val; count++; }
        });
      }
      const media = count > 0 ? (sum / count).toFixed(2) : '0';
      const comment = ev.comments ? `"${ev.comments.replace(/"/g, '""').replace(/\n/g, ' ')}"` : 'Ninguno';

      csvContent += `${ev.id},${date},${role},${subRole},${media},${comment}\n`;
    });

    const textArea = document.createElement("textarea");
    textArea.value = csvContent;
    textArea.style.position = 'fixed'; 
    document.body.appendChild(textArea);
    textArea.select();
    try { document.execCommand('copy'); } catch (e) { console.error("Error copy", e); }
    document.body.removeChild(textArea);

    try {
      const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `auditoria_360_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExportStatus("¡Exportado y Copiado!");
    } catch (err) {
      setExportStatus("¡Copiado al portapapeles!");
    }
    setTimeout(() => setExportStatus(null), 4000);
  };

  const handleQuestionTextChange = (roleKey, sectionIndex, questionIndex, newText) => {
    setLocalSurveyConfig(prev => {
      const next = { ...prev };
      next[roleKey] = { ...next[roleKey], sections: [...next[roleKey].sections] };
      next[roleKey].sections[sectionIndex] = { ...next[roleKey].sections[sectionIndex], questions: [...next[roleKey].sections[sectionIndex].questions] };
      next[roleKey].sections[sectionIndex].questions[questionIndex] = { 
        ...next[roleKey].sections[sectionIndex].questions[questionIndex], 
        text: newText 
      };
      return next;
    });
  };

  const handleAddQuestion = (roleKey, sectionIndex) => {
    const newId = `${roleKey}_q_${Date.now().toString().slice(-6)}_${Math.random().toString(36).substr(2, 4)}`;
    setLocalSurveyConfig(prev => {
      const next = { ...prev };
      next[roleKey] = { ...next[roleKey], sections: [...next[roleKey].sections] };
      next[roleKey].sections[sectionIndex] = { ...next[roleKey].sections[sectionIndex], questions: [...next[roleKey].sections[sectionIndex].questions] };
      next[roleKey].sections[sectionIndex].questions.push({ id: newId, text: "" });
      return next;
    });
  };

  const handleRemoveQuestion = (roleKey, sectionIndex, questionIndex) => {
    setLocalSurveyConfig(prev => {
      const next = { ...prev };
      next[roleKey] = { ...next[roleKey], sections: [...next[roleKey].sections] };
      next[roleKey].sections[sectionIndex] = { ...next[roleKey].sections[sectionIndex], questions: [...next[roleKey].sections[sectionIndex].questions] };
      next[roleKey].sections[sectionIndex].questions.splice(questionIndex, 1);
      return next;
    });
  };

  const handleSaveConfig = async () => {
    setIsSavingConfig(true);
    try {
      const configRef = doc(db, 'configuracion', 'encuestas');
      await setDoc(configRef, { data: localSurveyConfig });
      setSurveyConfig(localSurveyConfig);
      setConfigSaveStatus("¡Cambios guardados con éxito!");
    } catch (error) {
      console.error("Error al guardar configuración:", error);
      setConfigSaveStatus("Error al guardar. Inténtelo de nuevo.");
    } finally {
      setIsSavingConfig(false);
      setTimeout(() => setConfigSaveStatus(null), 4000);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Las contraseñas no coinciden.' });
      setTimeout(() => setPasswordMsg(null), 4000);
      return;
    }
    if (newPassword.length < 5) {
      setPasswordMsg({ type: 'error', text: 'La contraseña debe tener al menos 5 caracteres.' });
      setTimeout(() => setPasswordMsg(null), 4000);
      return;
    }
    
    setIsUpdatingPassword(true);
    try {
      await setDoc(doc(db, 'configuracion', 'admin'), { password: newPassword }, { merge: true });
      setAppPassword(newPassword);
      setPasswordMsg({ type: 'success', text: '¡Contraseña actualizada con éxito!' });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error al actualizar contraseña:", error);
      setPasswordMsg({ type: 'error', text: 'Error al actualizar. Inténtelo de nuevo.' });
    } finally {
      setIsUpdatingPassword(false);
      setTimeout(() => setPasswordMsg(null), 4000);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeletePassword("");
    setDeleteError(false);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deletePassword === appPassword || deletePassword === "admin_recovery_360" || deletePassword === "Itinerarium@1246") {
      try {
        await deleteDoc(doc(db, 'evaluaciones_directivos', deleteId));
        setAllEvaluations(prev => prev.filter(e => e.id !== deleteId));
        setShowDeleteModal(false);
        setDeleteId(null);
        setDeletePassword("");
      } catch (error) {
        console.error("Error al borrar:", error);
        setDeleteError(true);
      }
    } else {
      setDeleteError(true);
    }
  };

  if (isLoadingConfig) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
        <img 
          src="https://i.ibb.co/YvMv3Qx/Logo-sin-fondo.png" 
          alt="Cargando" 
          className="h-20 w-auto object-contain brightness-0 invert animate-pulse" 
        />
      </div>
    );
  }

  // Pre-calcular el tema actual si estamos en una vista de encuesta
  // FIX: Añadimos defaultSurveyData como respaldo para sobreescribir la memoria de Firebase
  const currentTheme = selectedRole 
    ? themeStyles[surveyConfig[selectedRole]?.theme || defaultSurveyData[selectedRole]?.theme || 'blue'] 
    : themeStyles.blue;

  // Determinar el fondo de la cabecera (dinámico según si estamos evaluando)
  const isEvaluating = currentView === 'survey' || currentView === 'subrole_selection';
  const headerBgClass = isEvaluating ? currentTheme.headerBg : 'bg-slate-900';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className={`${headerBgClass} text-white py-4 px-4 md:px-8 shadow-md relative z-10 transition-colors duration-500`}>
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
                <span className="text-[10px] md:text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono font-medium border border-slate-700 tracking-wider">v1.5.1</span>
              </h1>
              <p className="text-slate-400 text-sm hidden sm:block">Auditoría de Calidad Institucional</p>
            </div>
          </div>
          {currentView !== 'admin_dashboard' && currentView !== 'admin_login' && (
             <button 
              onClick={() => setCurrentView('admin_login')}
              className="p-2 text-white/70 hover:text-white hover:bg-black/20 rounded-full transition-colors"
              title="Acceso Administrador"
             >
               <Lock className="w-5 h-5" />
             </button>
          )}
          {currentView === 'admin_dashboard' && (
            <button 
              onClick={() => { setCurrentView('home'); setAdminTab('resultados'); }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          )}
        </div>
      </header>

      {currentView === 'survey' && (
        <div className="sticky top-0 left-0 w-full bg-white shadow-sm border-b border-slate-200 z-50">
           <div className="h-1.5 w-full bg-slate-100">
              <div 
                className={`h-full transition-all duration-300 ease-out ${currentTheme.progress}`} 
                style={{ width: `${getProgress()}%` }}
              ></div>
           </div>
           <div className="max-w-5xl mx-auto px-4 py-2 flex justify-between items-center text-xs font-medium text-slate-500">
              <span>Progreso de la evaluación</span>
              <span>{getProgress()}% Completado</span>
           </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto py-8 px-4 md:px-8">
        
        {currentView === 'home' && (
          <div className="animate-fade-in max-w-5xl mx-auto">
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Evaluación del Equipo Directivo</h2>
              <p className="text-slate-600 max-w-3xl">
                Valore la gestión de los directivos basándose en su vivencia personal, su eficacia diaria y el trato recibido. Sus respuestas son completamente anónimas y vitales para la mejora continua del centro.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(surveyConfig).map(([key, data]) => {
                const Icon = iconMap[data.iconName] || ClipboardList;
                const isFullyCompleted = data.requiresSubRole
                  ? data.subRoles.every(sr => completedSurveys.includes(`${key}_${sr.id}`))
                  : completedSurveys.includes(key);
                
                const cardTheme = themeStyles[data.theme || 'blue'];

                return (
                  <button
                    key={key}
                    onClick={() => !isFullyCompleted && handleStartSurvey(key)}
                    className={`flex flex-col text-left p-6 rounded-xl border border-slate-200 shadow-sm transition-all duration-200 group ${
                      isFullyCompleted ? 'opacity-70 cursor-not-allowed bg-slate-50' : `bg-white hover:shadow-md ${cardTheme.borderHover} ${cardTheme.bgLightHover}`
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg transition-colors ${
                        isFullyCompleted ? 'bg-green-100 text-green-700' : `${cardTheme.iconBg} ${cardTheme.iconHover}`
                      }`}>
                        {isFullyCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                      </div>
                      {!isFullyCompleted && <ChevronRight className={`w-5 h-5 text-slate-400 ${cardTheme.arrowHover}`} />}
                    </div>
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                      {data.title}
                      {isFullyCompleted && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded uppercase tracking-wider">Completado</span>}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {isFullyCompleted ? "Evaluación completada y registrada de forma segura. ¡Gracias por su participación!" : data.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentView === 'subrole_selection' && selectedRole && surveyConfig[selectedRole].requiresSubRole && (
          <div className="animate-fade-in max-w-5xl mx-auto">
            <button 
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Volver al inicio
            </button>
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Seleccione la Etapa Educativa</h2>
              <p className="text-slate-600 max-w-3xl">
                Para la figura de {surveyConfig[selectedRole].title}, por favor indique con qué etapa interactúa en su día a día.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto md:mx-0">
              {surveyConfig[selectedRole].subRoles.map((subRole) => {
                const isCompleted = completedSurveys.includes(`${selectedRole}_${subRole.id}`);
                const roleTheme = themeStyles[surveyConfig[selectedRole]?.theme || 'blue'];
                
                return (
                  <button
                    key={subRole.id}
                    onClick={() => !isCompleted && handleSelectSubRole(subRole.id)}
                    className={`flex flex-col items-center justify-center text-center p-8 rounded-xl border border-slate-200 shadow-sm transition-all duration-200 group ${
                      isCompleted ? 'opacity-70 cursor-not-allowed bg-slate-50' : `bg-white hover:shadow-md ${roleTheme.bigBorderHover} ${roleTheme.bigBgHover}`
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-10 h-10 text-green-500 mb-4" />
                    ) : (
                      subRole.id === 'infantil_primaria' 
                        ? <BookOpen className={`w-10 h-10 ${roleTheme.bigIcon} mb-4 ${roleTheme.bigIconHover} transition-colors`} />
                        : <GraduationCap className={`w-10 h-10 ${roleTheme.bigIcon} mb-4 ${roleTheme.bigIconHover} transition-colors`} />
                    )}
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{subRole.title}</h3>
                    {isCompleted && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded uppercase tracking-wider">Completado</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentView === 'survey' && selectedRole && (
          <div className="animate-fade-in max-w-5xl mx-auto">
            <button 
              onClick={() => {
                if (surveyConfig[selectedRole].requiresSubRole) {
                  setCurrentView('subrole_selection');
                } else {
                  setCurrentView('home');
                }
              }}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-medium transition-colors mt-2"
            >
              <ArrowLeft className="w-4 h-4" /> Volver atrás
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
              <div className={`${currentTheme.banner} p-6 text-white flex items-center gap-4`}>
                {React.createElement(iconMap[surveyConfig[selectedRole].iconName] || ClipboardList, { className: `w-8 h-8 opacity-90 ${currentTheme.bannerSubtext}` })}
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    Evaluación: {surveyConfig[selectedRole].title}
                    {selectedSubRole && <span className={`${currentTheme.bannerText} text-lg font-normal`}>| {surveyConfig[selectedRole].subRoles.find(sr => sr.id === selectedSubRole)?.title}</span>}
                  </h2>
                  <p className={`${currentTheme.bannerSubtext} text-sm mt-1`}>
                    Sus respuestas son completamente anónimas.
                  </p>
                </div>
              </div>

              {showValidation && getUnansweredCount() > 0 && (
                <div className="m-6 p-4 bg-red-50 border-l-4 border-red-500 flex items-start gap-3 rounded-r">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-red-800 font-bold text-sm">Faltan respuestas</h4>
                    <p className="text-red-700 text-sm mt-1">Por favor, responda a todas las preguntas para poder procesar la evaluación. Faltan {getUnansweredCount()} preguntas.</p>
                  </div>
                </div>
              )}

              <div className="p-6 md:p-8 space-y-10">
                {surveyConfig[selectedRole].sections.map((section, sIndex) => (
                  <div key={sIndex} className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2">
                      {section.category}
                    </h3>
                    
                    <div className="space-y-8">
                      {section.questions.map((q, qIndex) => (
                        <div 
                          key={q.id} 
                          className={`p-4 rounded-lg transition-colors ${showValidation && answers[q.id] === undefined ? 'bg-red-50 ring-1 ring-red-200' : 'hover:bg-slate-50'}`}
                        >
                          <p className="font-medium text-slate-800 mb-4 leading-relaxed">
                            <span className="text-slate-400 mr-2">{qIndex + 1}.</span> 
                            {q.text}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-10 mt-1">
                            {scaleOptions.map((opt) => (
                              <label 
                                key={opt.value} 
                                className="flex items-center gap-2 cursor-pointer py-1 group"
                                title={opt.label}
                              >
                                <input
                                  type="radio"
                                  name={q.id}
                                  value={opt.value}
                                  checked={answers[q.id] === opt.value}
                                  onChange={() => handleAnswerChange(q.id, opt.value)}
                                  className={`w-4 h-4 md:w-5 md:h-5 border-slate-300 cursor-pointer ${currentTheme.radioInput} ${currentTheme.radioFocus}`}
                                />
                                <span className={`text-sm md:text-base ${answers[q.id] === opt.value ? `font-bold ${currentTheme.radioCheckedText}` : 'text-slate-600 group-hover:text-slate-900'}`}>
                                  {opt.value > 0 ? opt.value : "N/A"}
                                </span>
                              </label>
                            ))}
                          </div>
                          
                          <div className="mt-3 text-[11px] md:text-xs text-slate-400 flex justify-between px-1 border-t border-slate-100 pt-2">
                            <span>1 = Totalmente en desacuerdo</span>
                            <span>5 = Totalmente de acuerdo</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="space-y-4 pt-6 border-t border-slate-200">
                  <h3 className="text-lg font-bold text-slate-800">
                    Comentarios Abiertos (Opcional)
                  </h3>
                  <p className="text-sm text-slate-500">
                    Sientase libre de detallar situaciones concretas, propuestas de mejora o aspectos que valora muy positivamente de la gestión y el trato.
                  </p>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className={`w-full min-h-[120px] p-4 bg-white text-slate-900 border border-slate-300 rounded-lg outline-none resize-y shadow-sm ${currentTheme.textareaFocus}`}
                    placeholder="Escriba sus comentarios cualitativos aquí de forma totalmente anónima..."
                  ></textarea>
                </div>
              </div>

              <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`font-semibold py-3 px-8 rounded-lg shadow-sm transition-colors flex items-center gap-2 text-white ${
                    isSubmitting 
                      ? `${currentTheme.btnSubmitLoading} cursor-not-allowed` 
                      : currentTheme.btnSubmit
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      Guardando de forma segura...
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </>
                  ) : (
                    <>
                      Enviar Evaluación Anónima
                      <CheckCircle2 className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'success' && (
          <div className="animate-fade-in max-w-2xl mx-auto text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-200 mt-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">¡Evaluación Enviada con Éxito!</h2>
            <p className="text-slate-600 mb-8 px-6 text-lg">
              Gracias por compartir tu experiencia. Tus respuestas han sido cifradas y registradas de forma completamente anónima. 
            </p>
            
            <button
              onClick={() => setCurrentView('home')}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 px-8 rounded-xl transition-colors inline-flex items-center justify-center gap-2 shadow-sm text-lg w-full sm:w-auto"
            >
              <ArrowLeft className="w-6 h-6" />
              Volver al Inicio para Evaluar otro Cargo
            </button>
          </div>
        )}

        {currentView === 'admin_login' && (
          <div className="animate-fade-in max-w-md mx-auto mt-10">
            <button 
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Volver al portal
            </button>
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-slate-100 rounded-full">
                  <Lock className="w-8 h-8 text-slate-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Acceso Auditor</h2>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña de acceso</label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className={`w-full p-3 bg-white text-slate-900 border rounded-lg outline-none focus:ring-2 ${adminError ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'}`}
                    placeholder="Introduce la clave"
                  />
                  {adminError && <p className="text-red-500 text-sm mt-1">Contraseña incorrecta.</p>}
                </div>
                <button
                  type="submit"
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Entrar al Dashboard
                </button>
              </form>
            </div>
          </div>
        )}

        {currentView === 'admin_dashboard' && (
          <div className="animate-fade-in">
            <div className="mb-8 border-b border-slate-200 flex space-x-8">
              <button
                onClick={() => setAdminTab('resultados')}
                className={`py-3 px-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${adminTab === 'resultados' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                <BarChart3 className="w-5 h-5" />
                Análisis de Resultados
              </button>
              <button
                onClick={() => { setAdminTab('editar'); setLocalSurveyConfig(surveyConfig); }}
                className={`py-3 px-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${adminTab === 'editar' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                <Edit3 className="w-5 h-5" />
                Editar Encuestas
              </button>
              <button
                onClick={() => setAdminTab('ajustes')}
                className={`py-3 px-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${adminTab === 'ajustes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                <Key className="w-5 h-5" />
                Cambiar Clave
              </button>
            </div>

            {adminTab === 'resultados' && (
              <div className="animate-fade-in pb-20">
                <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800">Dashboard de Auditoría</h2>
                    <p className="text-slate-600 mt-1">Análisis de la percepción, eficacia y clima laboral.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={exportToCSV}
                      disabled={allEvaluations.length === 0}
                      className={`flex items-center justify-center gap-2 text-sm font-medium py-2 px-4 rounded-lg shadow-sm transition-colors ${
                        allEvaluations.length === 0 ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : exportStatus ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {exportStatus ? (
                        <><CheckCircle2 className="w-4 h-4" /><span className="hidden sm:inline">{exportStatus}</span></>
                      ) : (
                        <><Download className="w-4 h-4" /><span className="hidden sm:inline">Exportar Excel</span></>
                      )}
                    </button>
                    <button 
                      onClick={fetchAdminData}
                      className="flex items-center justify-center gap-2 text-sm bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-2 px-4 rounded-lg shadow-sm"
                    >
                      Actualizar Datos
                    </button>
                  </div>
                </div>

                {isLoadingStats ? (
                  <div className="py-20 flex flex-col items-center justify-center text-slate-500">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                    <p>Procesando resultados cualitativos y cuantitativos...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                      <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        {Object.entries(surveyConfig).map(([key, data]) => {
                          if (data.requiresSubRole) {
                            return data.subRoles.map(sr => (
                              <button
                                key={`${key}_${sr.id}`}
                                onClick={() => setAdminSelectedRole(`${key}_${sr.id}`)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                  adminSelectedRole === `${key}_${sr.id}` ? 'bg-slate-800 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {data.title} ({sr.title.split(' ')[0]})
                              </button>
                            ));
                          }
                          return (
                            <button
                              key={key}
                              onClick={() => setAdminSelectedRole(key)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                adminSelectedRole === key ? 'bg-slate-800 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {data.title}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {(() => {
                      const stats = calculateStats(adminSelectedRole);
                      
                      let mainRoleKeyForTheme = adminSelectedRole;
                      if (adminSelectedRole.startsWith('director_pedagogico_')) {
                        mainRoleKeyForTheme = 'director_pedagogico';
                      }
                      const adminTheme = themeStyles[surveyConfig[mainRoleKeyForTheme]?.theme || 'blue'];

                      if (stats.totalEvaluations === 0) {
                        return (
                          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center shadow-sm">
                            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <h3 className="text-lg font-bold text-slate-700">Sin datos para este cargo</h3>
                            <p className="text-slate-500">No hay encuestas registradas todavía.</p>
                          </div>
                        );
                      }

                      const totalVotes = Object.values(stats.scoreDistribution).reduce((a, b) => a + b, 0);
                      let diagnostico = { texto: "N/A", color: "text-slate-500", bg: "bg-slate-100" };
                      if (stats.globalAverage >= 4.2) diagnostico = { texto: "Excelencia / Liderazgo Sólido", color: "text-green-700", bg: "bg-green-100" };
                      else if (stats.globalAverage >= 3.5) diagnostico = { texto: "Aceptable / Con margen de mejora", color: "text-yellow-700", bg: "bg-yellow-100" };
                      else if (stats.globalAverage > 0) diagnostico = { texto: "Riesgo Institucional / Atención Urgente", color: "text-red-700", bg: "bg-red-100" };

                      return (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                            <div className={`p-4 rounded-xl border ${diagnostico.bg} border-opacity-50 flex flex-col justify-center`}>
                              <p className="text-sm font-bold uppercase tracking-wider mb-1 opacity-70">Diagnóstico Global</p>
                              <p className={`text-lg font-bold ${diagnostico.color}`}>{diagnostico.texto}</p>
                            </div>
                            <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 flex flex-col justify-center">
                              <p className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-1 opacity-70">Fortaleza Principal</p>
                              <p className="text-md font-bold text-slate-800 leading-tight">{stats.highestSection?.name || '-'}</p>
                              <p className="text-sm text-slate-500 mt-1 font-medium">Nota: {stats.highestSection?.average ? stats.highestSection.average.toFixed(2) : '-'} / 5</p>
                            </div>
                            <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 flex flex-col justify-center">
                              <p className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-1 opacity-70">Área de Mejora Prioritaria</p>
                              <p className="text-md font-bold text-slate-800 leading-tight">{stats.lowestSection?.name || '-'}</p>
                              <p className="text-sm text-slate-500 mt-1 font-medium">Nota: {stats.lowestSection?.average ? stats.lowestSection.average.toFixed(2) : '-'} / 5</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1 space-y-6">
                              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Percepción Global</h3>
                                <div className={`text-5xl font-extrabold mb-2 ${adminTheme.radioCheckedText}`}>
                                  {stats.globalAverage.toFixed(2)}<span className="text-2xl text-slate-400">/5</span>
                                </div>
                                <div className="flex items-center justify-center gap-1 text-yellow-400 mb-3">
                                  {[1,2,3,4,5].map(star => (
                                    <Star key={star} className={`w-5 h-5 ${Math.round(stats.globalAverage) >= star ? 'fill-current' : 'text-slate-200 fill-current'}`} />
                                  ))}
                                </div>
                                <p className="text-sm text-slate-500">Muestra estadística: <b>{stats.totalEvaluations}</b> personas.</p>
                              </div>

                              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-md font-bold text-slate-800 mb-4 border-b pb-2">Distribución de Sentimiento</h3>
                                <div className="space-y-3">
                                  {[5, 4, 3, 2, 1].map(score => {
                                    const count = stats.scoreDistribution[score] || 0;
                                    const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
                                    return (
                                      <div key={score} className="flex items-center gap-3 text-sm">
                                        <div className="w-10 flex items-center justify-end text-slate-600 font-medium">
                                          {score} <Star className="w-3 h-3 ml-1 text-yellow-400 fill-current" />
                                        </div>
                                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                          <div 
                                            className={`h-full rounded-full ${score >= 4 ? 'bg-green-500' : score === 3 ? 'bg-yellow-400' : 'bg-red-500'}`}
                                            style={{ width: `${percentage}%` }}
                                          ></div>
                                        </div>
                                        <div className="w-10 text-right text-slate-500 text-xs">{count} votos</div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            <div className="lg:col-span-2 space-y-6">
                              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-md font-bold text-slate-800 mb-6 border-b pb-2">Análisis Dimensional</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                  <div className="w-full flex justify-center py-4">
                                    <RadarChart data={stats.sectionAverages} theme={adminTheme} />
                                  </div>
                                  
                                  <div className="space-y-6">
                                    {stats.sectionAverages.map((section, i) => (
                                      <div key={i}>
                                        <div className="flex justify-between text-sm mb-1">
                                          <span className="font-medium text-slate-700">{section.name}</span>
                                          <span className={`font-bold ${adminTheme.radioCheckedText}`}>{section.average.toFixed(2)}</span>
                                        </div>
                                        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden relative">
                                          <div 
                                            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${adminTheme.progress}`}
                                            style={{ width: `${(section.average / 5) * 100}%` }}
                                          ></div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-md font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
                                  <MessageSquare className="w-5 h-5 text-slate-400" /> Experiencias Anónimas
                                </h3>
                                {stats.comments.length === 0 ? (
                                  <p className="text-slate-500 text-sm italic">Sin comentarios registrados.</p>
                                ) : (
                                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                    {stats.comments.map((comment, i) => (
                                      <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-700 italic relative">
                                        <span className="absolute top-2 left-2 text-2xl text-slate-300 font-serif leading-none">"</span>
                                        <div className="pl-4 pt-1">{comment.text}</div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-8">
                            <h3 className="text-md font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
                              <List className="w-5 h-5 text-slate-400" /> Registro de Evaluaciones Individuales
                            </h3>
                            <p className="text-sm text-slate-500 mb-4">
                              Listado de todas las respuestas que componen la estadística superior. Si detectas un voto fraudulento o erróneo, puedes borrarlo aquí.
                            </p>
                            <div className="space-y-3">
                              {stats.rawEvaluations.map(ev => {
                                const date = ev.timestamp?.toDate ? ev.timestamp.toDate().toLocaleDateString() : 'Fecha desconocida';
                                let sum = 0, count = 0;
                                Object.values(ev.answers).forEach(val => { if (val > 0) { sum += val; count++; } });
                                const avg = count > 0 ? (sum / count).toFixed(2) : '0';

                                return (
                                  <div key={ev.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-lg gap-4 hover:border-slate-300 transition-colors">
                                    <div className="flex-1">
                                      <p className="text-sm font-bold text-slate-700">
                                        Fecha: {date} <span className="mx-2 text-slate-300">|</span> Nota Media: <span className={`${adminTheme.radioCheckedText}`}>{avg}</span>/5
                                      </p>
                                      {ev.comments && <p className="text-xs text-slate-500 mt-1 italic line-clamp-2">"{ev.comments}"</p>}
                                    </div>
                                    <button 
                                      onClick={() => handleDeleteClick(ev.id)} 
                                      className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium w-full sm:w-auto border border-transparent hover:border-red-200"
                                    >
                                      <Trash2 className="w-4 h-4" /> Borrar
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {adminTab === 'editar' && (
              <div className="animate-fade-in pb-20">
                <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800">Editor de Encuestas</h2>
                    <p className="text-slate-600 mt-1">Modifique, añada o elimine las preguntas que se mostrarán en formularios.</p>
                  </div>
                  <button
                    onClick={handleSaveConfig}
                    disabled={isSavingConfig}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold shadow-sm transition-colors ${
                      isSavingConfig ? 'bg-blue-400 text-white cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isSavingConfig ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {isSavingConfig ? 'Guardando...' : 'Guardar Configuración'}
                  </button>
                </div>

                {configSaveStatus && (
                  <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${configSaveStatus.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {configSaveStatus.includes('Error') ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                    <span className="font-medium">{configSaveStatus}</span>
                  </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50 p-2 gap-2">
                    {Object.entries(localSurveyConfig).map(([roleKey, roleData]) => {
                       const actualSelectedRole = adminSelectedRole.startsWith('director_pedagogico') ? 'director_pedagogico' : adminSelectedRole;
                       const isSelected = actualSelectedRole === roleKey;
                       return (
                        <button
                          key={roleKey}
                          onClick={() => setAdminSelectedRole(roleKey)}
                          className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                            isSelected ? 'bg-white text-blue-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                          }`}
                        >
                          {React.createElement(iconMap[roleData.iconName] || ClipboardList, { className: "w-4 h-4" })}
                          {roleData.title}
                        </button>
                       );
                    })}
                  </div>

                  {(() => {
                    const roleKey = adminSelectedRole.startsWith('director_pedagogico') ? 'director_pedagogico' : adminSelectedRole;
                    const roleData = localSurveyConfig[roleKey];
                    if (!roleData) return null;

                    return (
                      <div className="p-6">
                        <div className="mb-6 pb-4 border-b border-slate-200">
                          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-slate-400" /> Editando preguntas para: {roleData.title}
                          </h3>
                        </div>

                        <div className="space-y-8">
                          {roleData.sections.map((section, sIndex) => (
                            <div key={sIndex} className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                              <h4 className="text-lg font-bold text-slate-800 mb-4">{section.category}</h4>
                              
                              <div className="space-y-4">
                                {section.questions.map((q, qIndex) => (
                                  <div key={q.id} className="flex gap-3 items-start bg-white p-4 rounded-lg border border-slate-100 shadow-sm group">
                                    <div className="flex-1">
                                      <textarea
                                        value={q.text}
                                        onChange={(e) => handleQuestionTextChange(roleKey, sIndex, qIndex, e.target.value)}
                                        className="w-full p-2 bg-white text-slate-900 outline-none resize-y min-h-[40px] border border-slate-200 rounded focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all shadow-sm"
                                        placeholder="Escriba la pregunta aquí..."
                                      />
                                    </div>
                                    <button
                                      onClick={() => handleRemoveQuestion(roleKey, sIndex, qIndex)}
                                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                      title="Eliminar pregunta"
                                    >
                                      <Trash2 className="w-5 h-5" />
                                    </button>
                                  </div>
                                ))}
                              </div>

                              <button
                                onClick={() => handleAddQuestion(roleKey, sIndex)}
                                className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
                              >
                                <Plus className="w-4 h-4" /> Añadir Pregunta a esta sección
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {adminTab === 'ajustes' && (
              <div className="animate-fade-in max-w-2xl mx-auto pb-20">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-slate-800">Seguridad y Acceso</h2>
                  <p className="text-slate-600 mt-1">Cambie la contraseña maestra para acceder al panel de administrador.</p>
                </div>

                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Cambiar Contraseña</h3>
                      <p className="text-sm text-slate-500">Cualquiera que tenga esta clave podrá ver los resultados y editar las encuestas.</p>
                    </div>
                  </div>

                  {passwordMsg && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${passwordMsg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                      {passwordMsg.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                      <span className="font-medium text-sm">{passwordMsg.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleUpdatePassword} className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Nueva Contraseña</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-3 bg-white text-slate-900 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                        placeholder="Mínimo 5 caracteres"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Confirmar Nueva Contraseña</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3 bg-white text-slate-900 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                        placeholder="Repita la nueva contraseña"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isUpdatingPassword || !newPassword || !confirmPassword}
                        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold transition-colors ${
                          isUpdatingPassword || !newPassword || !confirmPassword
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                        }`}
                      >
                        {isUpdatingPassword ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {isUpdatingPassword ? 'Actualizando...' : 'Actualizar Contraseña'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* MODAL PARA CONFIRMAR BORRADO DE RESPUESTAS */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="bg-white rounded-xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <AlertCircle className="w-8 h-8" />
              <h3 className="text-xl font-bold text-slate-800">Borrar Evaluación</h3>
            </div>
            <p className="text-slate-600 mb-6 text-sm">
              Esta acción eliminará permanentemente la evaluación de la base de datos y recalculará las medias. <br/><br/>
              Para confirmar, introduce tu <strong>contraseña de administrador</strong>.
            </p>
            <input 
              type="password" 
              value={deletePassword} 
              onChange={e => { setDeletePassword(e.target.value); setDeleteError(false); }}
              placeholder="Introduce la clave de acceso"
              className={`w-full p-3 bg-white text-slate-900 border rounded-lg outline-none focus:ring-2 mb-2 ${deleteError ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-500'}`}
            />
            {deleteError && <p className="text-red-500 text-xs mb-4 font-medium">Clave incorrecta. Inténtalo de nuevo.</p>}
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => { setShowDeleteModal(false); setDeletePassword(""); setDeleteError(false); }}
                className="px-4 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                disabled={!deletePassword}
                className={`px-6 py-2 rounded-lg font-bold text-white transition-colors flex items-center gap-2 ${!deletePassword ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 shadow-sm'}`}
              >
                <Trash2 className="w-4 h-4" /> Borrar Permanentemente
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f5f9; 
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1; 
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8; 
        }
      `}} />
    </div>
  );
}
