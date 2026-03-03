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
  Filter,
  Edit3,
  Settings,
  Trash2,
  Plus,
  Save,
  Printer,
  Database,
  Calendar,
  X
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, setDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

// Configuración de Firebase (Tu proyecto real)
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

const iconMap = {
  Briefcase: Briefcase,
  GraduationCap: GraduationCap,
  HeartHandshake: HeartHandshake,
  Building: Building
};

// --- BASE DE DATOS AUDITADA (LENGUAJE EXPERTO 360º) ---
const defaultSurveyData = {
  director_general: {
    title: "Director General",
    iconName: "Briefcase",
    description: "Evaluación del liderazgo estratégico, visión institucional y gestión del clima organizacional.",
    requiresSubRole: false,
    sections: [
      {
        category: "Liderazgo y Visión Estratégica",
        questions: [
          { id: "dg_1", text: "Transmite una visión clara y motivadora que da sentido a nuestro proyecto educativo." },
          { id: "dg_2", text: "Gestiona las situaciones de crisis o imprevistos con seguridad, eficacia y transparencia." },
          { id: "dg_3", text: "Toma decisiones estratégicas y organizativas que mejoran el funcionamiento global del centro." },
          { id: "dg_4", text: "Impulsa activamente la innovación, la formación continua y la mejora de la calidad educativa." }
        ]
      },
      {
        category: "Gestión de Personas y Clima Laboral",
        questions: [
          { id: "dg_5", text: "Fomenta un clima laboral de confianza, respeto mutuo y colaboración entre todo el personal." },
          { id: "dg_6", text: "Reconoce y valora el esfuerzo, la dedicación y los logros de los profesionales del centro." },
          { id: "dg_7", text: "Interviene en los conflictos institucionales de manera justa, imparcial y orientada a soluciones." },
          { id: "dg_8", text: "Muestra coherencia entre los valores del ideario del centro y sus decisiones directivas diarias." }
        ]
      },
      {
        category: "Comunicación y Representación Institucional",
        questions: [
          { id: "dg_9", text: "Se muestra accesible y receptivo/a para escuchar propuestas o inquietudes del personal." },
          { id: "dg_10", text: "Mantiene una comunicación institucional clara, transparente y fluida con toda la comunidad." },
          { id: "dg_11", text: "Acepta las críticas constructivas y demuestra capacidad de autocrítica y rectificación." },
          { id: "dg_12", text: "Representa y defiende eficazmente los intereses del colegio y su personal ante el exterior." }
        ]
      }
    ]
  },
  director_pedagogico: {
    title: "Director Pedagógico",
    iconName: "GraduationCap",
    description: "Evaluación de la organización académica, acompañamiento al docente y resolución en el aula.",
    requiresSubRole: true,
    subRoles: [
      { id: "infantil_primaria", title: "Infantil y Primaria" },
      { id: "secundaria_bachillerato", title: "Secundaria y Bachillerato" }
    ],
    sections: [
      {
        category: "Organización y Eficacia Académica",
        questions: [
          { id: "dp_1", text: "Planifica y resuelve con eficacia la organización diaria (horarios, guardias, sustituciones)." },
          { id: "dp_2", text: "Proporciona orientaciones pedagógicas útiles, actualizadas y aplicables a la realidad del aula." },
          { id: "dp_3", text: "Coordina eficazmente la respuesta a la diversidad y la atención a necesidades educativas especiales." },
          { id: "dp_4", text: "Lidera y dinamiza las reuniones (claustros, evaluaciones) para que resulten verdaderamente productivas." }
        ]
      },
      {
        category: "Acompañamiento y Desarrollo Docente",
        questions: [
          { id: "dp_5", text: "Muestra empatía y preocupación genuina por el bienestar y desarrollo profesional del equipo docente." },
          { id: "dp_6", text: "Apoya, anima y facilita recursos cuando los docentes proponen nuevas iniciativas o proyectos." },
          { id: "dp_7", text: "Ofrece un feedback constructivo y respetuoso ante posibles errores o áreas de mejora profesional." },
          { id: "dp_8", text: "Asume responsabilidades y se implica directamente junto al equipo en momentos de sobrecarga." }
        ]
      },
      {
        category: "Convivencia y Relación con Familias",
        questions: [
          { id: "dp_9", text: "Respalda y acompaña de manera efectiva al docente en situaciones complejas con las familias." },
          { id: "dp_10", text: "Interviene con rapidez y firmeza ante problemas graves de convivencia o disciplina en el aula." },
          { id: "dp_11", text: "Muestra profesionalidad, tacto y cercanía en su trato directo con el alumnado y sus familias." },
          { id: "dp_12", text: "Aplica las normativas de convivencia del centro de forma justa, equitativa y sin agravios comparativos." }
        ]
      }
    ]
  },
  coordinador_pastoral: {
    title: "Coordinador de Pastoral",
    iconName: "HeartHandshake",
    description: "Evaluación de la dinamización de valores, acompañamiento personal y compromiso social.",
    requiresSubRole: false,
    sections: [
      {
        category: "Dinamización e Integración de Valores",
        questions: [
          { id: "cp_1", text: "Planifica las actividades pastorales con eficacia, anticipación y proporcionando recursos útiles." },
          { id: "cp_2", text: "Logra integrar la dimensión pastoral y en valores de forma natural en el día a día escolar." },
          { id: "cp_3", text: "Las celebraciones y dinámicas propuestas conectan de forma efectiva con la realidad del alumnado." },
          { id: "cp_4", text: "Fomenta la participación del claustro en pastoral sin que ello suponga una carga burocrática excesiva." }
        ]
      },
      {
        category: "Acompañamiento y Trato Humano",
        questions: [
          { id: "cp_5", text: "Transmite en su trato personal una actitud de acogida, empatía y saber escuchar sin emitir juicios." },
          { id: "cp_6", text: "Ofrece un acompañamiento humano y espiritual cercano a quien lo solicita en momentos de dificultad." },
          { id: "cp_7", text: "Trata a todo el personal con exquisito respeto, independientemente de sus creencias o compromiso religioso." },
          { id: "cp_8", text: "Apoya y orienta eficazmente la labor de acción tutorial en su dimensión de crecimiento personal." }
        ]
      },
      {
        category: "Identidad y Compromiso Social",
        questions: [
          { id: "cp_9", text: "Comunica el ideario del centro de manera inspiradora, actual y altamente significativa." },
          { id: "cp_10", text: "Impulsa proyectos de voluntariado y aprendizaje-servicio logrando un impacto formativo real." },
          { id: "cp_11", text: "Sensibiliza activamente a la comunidad educativa frente a realidades de desigualdad e injusticia social." },
          { id: "cp_12", text: "Contribuye de manera decisiva a crear un sentido de comunidad unida, solidaria y fraterna." }
        ]
      }
    ]
  },
  administrador: {
    title: "Administrador del Centro",
    iconName: "Building",
    description: "Evaluación de la gestión de infraestructuras, agilidad operativa y atención al personal.",
    requiresSubRole: false,
    sections: [
      {
        category: "Estado y Funcionalidad de Infraestructuras",
        questions: [
          { id: "ad_1", text: "Garantiza que los espacios de trabajo e instalaciones sean seguros, limpios y confortables." },
          { id: "ad_2", text: "Asegura el buen estado y la funcionalidad de los espacios comunes (patios, pasillos, zonas docentes)." },
          { id: "ad_3", text: "Supervisa con eficacia el funcionamiento diario de los servicios generales (limpieza, mantenimiento, portería)." },
          { id: "ad_4", text: "Vela por el cumplimiento riguroso de las normativas de seguridad, evacuación y prevención de riesgos." }
        ]
      },
      {
        category: "Agilidad Operativa y Atención Personal",
        questions: [
          { id: "ad_5", text: "Actúa con rapidez y eficacia resolutiva cuando se reporta una avería o necesidad urgente de reparación." },
          { id: "ad_6", text: "Atiende las consultas, incidencias y peticiones con amabilidad, paciencia y actitud de servicio." },
          { id: "ad_7", text: "Se muestra accesible y resolutivo/a para proporcionar recursos materiales extraordinarios para proyectos." },
          { id: "ad_8", text: "Comunica las normativas de uso de espacios o limitaciones de recursos de forma clara, asertiva y justificada." }
        ]
      },
      {
        category: "Gestión de Recursos y Liderazgo de Equipos",
        questions: [
          { id: "ad_9", text: "Gestiona las compras y suministros de manera diligente para asegurar la disponibilidad de material básico." },
          { id: "ad_10", text: "Lidera al Personal de Administración y Servicios fomentando un clima de eficiencia y respeto institucional." },
          { id: "ad_11", text: "Escucha activamente y valora las sugerencias de mejora sobre la estética o funcionalidad de las instalaciones." },
          { id: "ad_12", text: "Planifica y ejecuta mejoras en las infraestructuras que impactan positivamente en la calidad del entorno." }
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
  { value: 0, label: "N/A (Sin información)" }
];

const evaluatorProfiles = [
  { id: 'docente', label: 'Docente / Profesorado' },
  { id: 'pas', label: 'Personal de Administración y Servicios (PAS)' },
  { id: 'directivo', label: 'Miembro del Equipo Directivo' }
];

export default function App() {
  const [currentView, setCurrentView] = useState('home'); 
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedSubRole, setSelectedSubRole] = useState(null);
  const [evaluatorProfile, setEvaluatorProfile] = useState(null);
  
  const [answers, setAnswers] = useState({});
  const [comments, setComments] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Configuración
  const [surveyConfig, setSurveyConfig] = useState(defaultSurveyData);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  // Admin States
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState(false);
  const [allEvaluations, setAllEvaluations] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [adminSelectedRole, setAdminSelectedRole] = useState('director_general');
  const [adminProfileFilter, setAdminProfileFilter] = useState('todos');
  const [exportStatus, setExportStatus] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null); // ID del registro a borrar
  
  // Admin Tabs: 'resultados' | 'registros' | 'editar'
  const [adminTab, setAdminTab] = useState('resultados'); 
  const [localSurveyConfig, setLocalSurveyConfig] = useState(defaultSurveyData);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configSaveStatus, setConfigSaveStatus] = useState(null);

  // Inicializar Firebase Auth y Título
  useEffect(() => {
    document.title = "Portal de Evaluación";
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = "https://i.ibb.co/YvMv3Qx/Logo-sin-fondo.png";

    const initApp = async () => {
      try { await signInAnonymously(auth); } 
      catch (error) { console.error("Error Auth:", error); }
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
        } catch (error) {
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
    setCurrentView('profile_selection');
  };

  const handleSelectProfile = (profileId) => {
    setEvaluatorProfile(profileId);
    if (surveyConfig[selectedRole].requiresSubRole) {
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
    const totalQuestions = surveyConfig[selectedRole].sections.reduce((acc, section) => acc + section.questions.length, 0);
    return Math.round((Object.keys(answers).length / totalQuestions) * 100);
  };

  const handleSubmit = async () => {
    const totalQuestions = surveyConfig[selectedRole].sections.reduce((acc, section) => acc + section.questions.length, 0);
    if (Object.keys(answers).length < totalQuestions) {
      setShowValidation(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      if (user) {
        await addDoc(collection(db, 'evaluaciones_directivos'), {
          roleEvaluated: selectedRole,
          subRoleEvaluated: selectedSubRole || null,
          evaluatorProfile: evaluatorProfile,
          answers: answers,
          comments: comments,
          timestamp: serverTimestamp(),
        });
      }
      setCurrentView('success');
    } catch (error) {
      console.error("Error DB:", error);
      setCurrentView('success'); 
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- ADMIN FUNCTIONS ---
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === 'auditor360') {
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

  const handleDeleteEvaluation = async () => {
    if(!deleteModalId) return;
    try {
      await deleteDoc(doc(db, 'evaluaciones_directivos', deleteModalId));
      setAllEvaluations(prev => prev.filter(e => e.id !== deleteModalId));
      setDeleteModalId(null);
    } catch (error) {
      console.error("Error eliminando documento:", error);
    }
  };

  const calculateStats = (roleKey, profileFilter) => {
    let subRoleFilter = null;
    let mainRoleKey = roleKey;
    if (roleKey.startsWith('director_pedagogico_')) {
      mainRoleKey = 'director_pedagogico';
      subRoleFilter = roleKey.replace('director_pedagogico_', '');
    }

    const evals = allEvaluations.filter(e => 
      e.roleEvaluated === mainRoleKey && 
      (subRoleFilter ? e.subRoleEvaluated === subRoleFilter : true) &&
      (profileFilter !== 'todos' ? e.evaluatorProfile === profileFilter : true)
    );

    const stats = {
      totalEvaluations: evals.length,
      globalAverage: 0,
      sectionAverages: [],
      scoreDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      comments: [],
      highestSection: null,
      lowestSection: null,
      enps: { score: 0, promoters: 0, passives: 0, detractors: 0 }
    };

    if (evals.length === 0) return stats;

    let totalScoreSum = 0;
    let totalValidAnswers = 0;
    
    evals.forEach(e => {
      let formSum = 0, formCount = 0;
      Object.values(e.answers || {}).forEach(val => {
        if (val > 0) { formSum += val; formCount++; }
      });
      if (formCount > 0) {
        const formAvg = formSum / formCount;
        if (formAvg >= 4.5) stats.enps.promoters++;
        else if (formAvg >= 3.5) stats.enps.passives++;
        else stats.enps.detractors++;
      }
    });
    
    stats.enps.score = Math.round(((stats.enps.promoters - stats.enps.detractors) / evals.length) * 100);

    surveyConfig[mainRoleKey].sections.forEach(section => {
      let sectionSum = 0, sectionValidAnswers = 0;
      section.questions.forEach(q => {
        evals.forEach(e => {
          const val = (e.answers || {})[q.id];
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
      .map(e => ({ text: e.comments, profile: e.evaluatorProfile }));

    return stats;
  };

  const exportToCSV = () => {
    if (allEvaluations.length === 0) return;
    let csvContent = "ID,Fecha,Rol Evaluado,Subrol,Perfil Evaluador,Puntuacion Media,Comentarios\n";
    allEvaluations.forEach(ev => {
      const date = ev.timestamp?.toDate ? ev.timestamp.toDate().toLocaleDateString() : 'Desconocida';
      const role = ev.roleEvaluated;
      const subRole = ev.subRoleEvaluated || 'N/A';
      const profile = ev.evaluatorProfile || 'N/A';
      
      let sum = 0, count = 0;
      if (ev.answers) { Object.values(ev.answers).forEach(val => { if (val > 0) { sum += val; count++; } }); }
      const media = count > 0 ? (sum / count).toFixed(2) : '0';
      const comment = ev.comments ? `"${ev.comments.replace(/"/g, '""').replace(/\n/g, ' ')}"` : 'Ninguno';
      csvContent += `${ev.id},${date},${role},${subRole},${profile},${media},${comment}\n`;
    });

    const textArea = document.createElement("textarea");
    textArea.value = csvContent;
    textArea.style.position = 'fixed'; 
    document.body.appendChild(textArea);
    textArea.select();
    try { document.execCommand('copy'); } catch (e) {}
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

  // --- EDITOR ENCUESTAS ---
  const handleQuestionTextChange = (roleKey, sectionIndex, questionIndex, newText) => {
    setLocalSurveyConfig(prev => {
      const next = { ...prev };
      next[roleKey].sections[sectionIndex].questions[questionIndex].text = newText;
      return next;
    });
  };
  const handleAddQuestion = (roleKey, sectionIndex) => {
    const newId = `${roleKey}_q_${Date.now().toString().slice(-6)}`;
    setLocalSurveyConfig(prev => {
      const next = { ...prev };
      next[roleKey].sections[sectionIndex].questions.push({ id: newId, text: "" });
      return next;
    });
  };
  const handleRemoveQuestion = (roleKey, sectionIndex, questionIndex) => {
    setLocalSurveyConfig(prev => {
      const next = { ...prev };
      next[roleKey].sections[sectionIndex].questions.splice(questionIndex, 1);
      return next;
    });
  };
  const handleSaveConfig = async () => {
    setIsSavingConfig(true);
    try {
      await setDoc(doc(db, 'configuracion', 'encuestas'), { data: localSurveyConfig });
      setSurveyConfig(localSurveyConfig);
      setConfigSaveStatus("¡Cambios guardados!");
    } catch (error) { setConfigSaveStatus("Error al guardar."); } 
    finally { setIsSavingConfig(false); setTimeout(() => setConfigSaveStatus(null), 4000); }
  };

  if (isLoadingConfig) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <p className="font-medium text-lg">Cargando plataforma 360º...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Modal Confirmación Borrado */}
      {deleteModalId && (
        <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle className="w-8 h-8" />
              <h3 className="text-xl font-bold">¿Eliminar registro?</h3>
            </div>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Esta acción es irreversible. Se borrarán permanentemente todas las notas y comentarios asociados a esta respuesta individual de la base de datos.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteModalId(null)} className="px-5 py-2.5 text-slate-700 font-medium hover:bg-slate-100 rounded-lg transition-colors">
                Cancelar
              </button>
              <button onClick={handleDeleteEvaluation} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 font-medium text-white rounded-lg transition-colors flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-slate-900 text-white py-4 px-4 md:px-8 shadow-md relative z-10 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://i.ibb.co/YvMv3Qx/Logo-sin-fondo.png" alt="Logo" className="h-12 w-auto object-contain brightness-0 invert opacity-90" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Portal de Evaluación 360º</h1>
              <p className="text-slate-400 text-sm hidden sm:block">Auditoría de Calidad Institucional</p>
            </div>
          </div>
          {currentView !== 'admin_dashboard' && currentView !== 'admin_login' && (
             <button onClick={() => setCurrentView('admin_login')} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors" title="Acceso Administrador">
               <Lock className="w-5 h-5" />
             </button>
          )}
          {currentView === 'admin_dashboard' && (
            <button onClick={() => { setCurrentView('home'); setAdminTab('resultados'); }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm">
              <LogOut className="w-4 h-4" /> Cerrar Sesión
            </button>
          )}
        </div>
      </header>

      <div className="hidden print:block print:mb-8 text-center border-b pb-4">
         <img src="https://i.ibb.co/YvMv3Qx/Logo-sin-fondo.png" alt="Logo" className="h-16 mx-auto mb-2 opacity-80 grayscale" />
         <h1 className="text-2xl font-bold text-slate-800">Informe de Auditoría de Calidad Institucional</h1>
         <p className="text-slate-500">Evaluación Directiva 360º</p>
      </div>

      {currentView === 'survey' && (
        <div className="sticky top-0 left-0 w-full bg-white shadow-sm border-b border-slate-200 z-50 print:hidden">
           <div className="h-1.5 w-full bg-slate-100">
              <div className="h-full bg-blue-600 transition-all duration-300 ease-out" style={{ width: `${getProgress()}%` }}></div>
           </div>
           <div className="max-w-5xl mx-auto px-4 py-2 flex justify-between items-center text-xs font-medium text-slate-500">
              <span>Progreso de la evaluación</span><span>{getProgress()}% Completado</span>
           </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto py-8 px-4 md:px-8">
        
        {/* VISTA HOME Y SELECCIONES */}
        {currentView === 'home' && (
          <div className="animate-fade-in max-w-5xl mx-auto">
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Evaluación del Equipo Directivo</h2>
              <p className="text-slate-600 max-w-3xl">
                Valore la gestión directiva basándose en su vivencia personal, eficacia y trato recibido. 
                Sus respuestas son estrictamente anónimas y fundamentales para la mejora continua.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(surveyConfig).map(([key, data]) => {
                const Icon = iconMap[data.iconName] || ClipboardList;
                return (
                  <button key={key} onClick={() => handleStartSurvey(key)} className="flex flex-col text-left bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-100 text-blue-700 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors"><Icon className="w-6 h-6" /></div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{data.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{data.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentView === 'profile_selection' && selectedRole && (
          <div className="animate-fade-in max-w-5xl mx-auto">
            <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" /> Volver al panel
            </button>
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">¿Desde qué perspectiva evalúa?</h2>
              <p className="text-slate-600 max-w-3xl">Para un análisis 360º riguroso, indique su rol en la comunidad. <span className="font-bold text-blue-600">Dato 100% anónimo.</span></p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto md:mx-0">
              {evaluatorProfiles.map((profile) => (
                <button key={profile.id} onClick={() => handleSelectProfile(profile.id)} className="flex flex-col items-center justify-center text-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group">
                  <Users className="w-10 h-10 text-slate-400 mb-4 group-hover:text-blue-600 transition-colors" />
                  <h3 className="text-lg font-bold text-slate-800">{profile.label}</h3>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentView === 'subrole_selection' && selectedRole && surveyConfig[selectedRole].requiresSubRole && (
          <div className="animate-fade-in max-w-5xl mx-auto">
            <button onClick={() => setCurrentView('profile_selection')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" /> Volver
            </button>
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Seleccione la Etapa Educativa</h2>
              <p className="text-slate-600 max-w-3xl">Para la figura de {surveyConfig[selectedRole].title}, indique con qué etapa interactúa.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto md:mx-0">
              {surveyConfig[selectedRole].subRoles.map((subRole) => (
                <button key={subRole.id} onClick={() => handleSelectSubRole(subRole.id)} className="flex flex-col items-center justify-center text-center bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group">
                  <GraduationCap className="w-10 h-10 text-blue-400 mb-4 group-hover:text-blue-600 transition-colors" />
                  <h3 className="text-xl font-bold text-slate-800">{subRole.title}</h3>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* VISTA ENCUESTA ACTIVA */}
        {currentView === 'survey' && selectedRole && (
          <div className="animate-fade-in max-w-5xl mx-auto">
            <button onClick={() => { surveyConfig[selectedRole].requiresSubRole ? setCurrentView('subrole_selection') : setCurrentView('profile_selection') }} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-medium transition-colors mt-2">
              <ArrowLeft className="w-4 h-4" /> Volver atrás
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
              <div className="bg-blue-600 p-6 text-white flex items-center gap-4">
                {React.createElement(iconMap[surveyConfig[selectedRole].iconName] || ClipboardList, { className: "w-8 h-8 opacity-90" })}
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    Evaluación: {surveyConfig[selectedRole].title}
                    {selectedSubRole && <span className="text-blue-200 text-lg font-normal">| {surveyConfig[selectedRole].subRoles.find(sr => sr.id === selectedSubRole)?.title}</span>}
                  </h2>
                  <p className="text-blue-100 text-sm mt-1">Perfil: <span className="font-semibold text-white">{evaluatorProfiles.find(p => p.id === evaluatorProfile)?.label}</span></p>
                </div>
              </div>

              {showValidation && (Object.keys(answers).length < surveyConfig[selectedRole].sections.reduce((acc, section) => acc + section.questions.length, 0)) && (
                <div className="m-6 p-4 bg-red-50 border-l-4 border-red-500 flex items-start gap-3 rounded-r">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-red-800 font-bold text-sm">Faltan respuestas</h4>
                    <p className="text-red-700 text-sm mt-1">Por favor, responda a todas las preguntas. Faltan {surveyConfig[selectedRole].sections.reduce((acc, section) => acc + section.questions.length, 0) - Object.keys(answers).length} preguntas.</p>
                  </div>
                </div>
              )}

              <div className="p-6 md:p-8 space-y-10">
                {surveyConfig[selectedRole].sections.map((section, sIndex) => (
                  <div key={sIndex} className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2">{section.category}</h3>
                    
                    <div className="space-y-8">
                      {section.questions.map((q, qIndex) => (
                        <div key={q.id} className={`p-5 rounded-xl transition-colors ${showValidation && answers[q.id] === undefined ? 'bg-red-50 ring-1 ring-red-200' : 'bg-slate-50 border border-slate-100'}`}>
                          <p className="font-medium text-slate-800 mb-4 leading-relaxed text-lg">
                            <span className="text-blue-600 font-bold mr-2">{qIndex + 1}.</span> {q.text}
                          </p>
                          
                          {/* NUEVA ESCALA DE OPCIONES (Mejorada visualmente) */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                            {scaleOptions.map((opt) => {
                              const isSelected = answers[q.id] === opt.value;
                              return (
                                <label 
                                  key={opt.value} 
                                  className={`flex flex-row xl:flex-col items-center xl:justify-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                    isSelected 
                                      ? 'bg-blue-600 border-blue-600 text-white shadow-md transform scale-[1.02]' 
                                      : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50'
                                  }`}
                                >
                                  <input type="radio" name={q.id} value={opt.value} checked={isSelected} onChange={() => handleAnswerChange(q.id, opt.value)} className="hidden" />
                                  {opt.value > 0 && (
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                                      {opt.value}
                                    </div>
                                  )}
                                  <span className={`text-sm xl:text-center leading-tight font-medium ${opt.value === 0 ? 'xl:mt-1' : ''}`}>
                                    {opt.label}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="space-y-4 pt-6 border-t border-slate-200">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Comentarios Abiertos (Opcional)</h3>
                      <p className="text-sm text-slate-500 mt-1">Detalle situaciones concretas, propuestas de mejora o aspectos positivos.</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded hidden sm:block ${comments.length > 500 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>
                      {comments.length} caracteres
                    </span>
                  </div>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full min-h-[120px] p-4 bg-white text-slate-800 border border-slate-300 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                    placeholder="Escriba sus comentarios cualitativos aquí de forma totalmente anónima..."
                  ></textarea>
                </div>
              </div>

              <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-end">
                <button onClick={handleSubmit} disabled={isSubmitting} className={`font-semibold py-3 px-8 rounded-lg shadow-sm transition-colors flex items-center gap-2 ${isSubmitting ? 'bg-blue-400 cursor-not-allowed text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                  {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Guardando...</> : <><CheckCircle2 className="w-5 h-5" /> Enviar Evaluación</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'success' && (
           <div className="animate-fade-in max-w-2xl mx-auto text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-200 mt-10">
             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-10 h-10 text-green-600" /></div>
             <h2 className="text-3xl font-bold text-slate-800 mb-4">¡Evaluación Registrada!</h2>
             <p className="text-slate-600 mb-8 px-6">Tus respuestas han sido cifradas y guardadas de forma anónima.</p>
             <button onClick={() => setCurrentView('home')} className="bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-8 rounded-lg transition-colors inline-flex items-center gap-2"><ArrowLeft className="w-5 h-5" /> Volver al inicio</button>
           </div>
        )}

        {/* VISTA: DASHBOARD ADMIN */}
        {currentView === 'admin_dashboard' && (
          <div className="animate-fade-in">
            {/* MENÚ DE PESTAÑAS */}
            <div className="mb-8 border-b border-slate-200 flex space-x-2 sm:space-x-8 overflow-x-auto print:hidden">
              <button onClick={() => setAdminTab('resultados')} className={`py-3 px-4 font-medium flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${adminTab === 'resultados' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                <BarChart3 className="w-5 h-5" /> Resultados
              </button>
              <button onClick={() => setAdminTab('registros')} className={`py-3 px-4 font-medium flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${adminTab === 'registros' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                <Database className="w-5 h-5" /> Gestión de Registros
              </button>
              <button onClick={() => { setAdminTab('editar'); setLocalSurveyConfig(surveyConfig); }} className={`py-3 px-4 font-medium flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${adminTab === 'editar' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                <Edit3 className="w-5 h-5" /> Editar Encuestas
              </button>
            </div>

            {/* TAB: RESULTADOS */}
            {adminTab === 'resultados' && (
              <div className="animate-fade-in">
                <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">Dashboard de Auditoría</h2>
                    <p className="text-slate-600 mt-1">Análisis de la percepción, eficacia y clima laboral.</p>
                  </div>
                  <div className="flex flex-wrap gap-2 print:hidden">
                    <button onClick={handlePrint} disabled={allEvaluations.length === 0} className={`flex items-center justify-center gap-2 text-sm font-medium py-2 px-4 rounded-lg shadow-sm transition-colors ${allEvaluations.length === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900 text-white'}`}><Printer className="w-4 h-4" /><span className="hidden sm:inline">Imprimir PDF</span></button>
                    <button onClick={exportToCSV} disabled={allEvaluations.length === 0} className={`flex items-center justify-center gap-2 text-sm font-medium py-2 px-4 rounded-lg shadow-sm transition-colors ${allEvaluations.length === 0 ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : exportStatus ? 'bg-emerald-600 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                      {exportStatus ? <><CheckCircle2 className="w-4 h-4" /><span className="hidden sm:inline">{exportStatus}</span></> : <><Download className="w-4 h-4" /><span className="hidden sm:inline">Exportar Excel</span></>}
                    </button>
                    <button onClick={fetchAdminData} className="flex items-center justify-center gap-2 text-sm bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-2 px-4 rounded-lg shadow-sm">Actualizar</button>
                  </div>
                </div>

                {isLoadingStats ? (
                  <div className="py-20 flex flex-col items-center justify-center text-slate-500 print:hidden"><Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" /><p>Procesando resultados...</p></div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center print:hidden">
                      <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        {Object.entries(surveyConfig).map(([key, data]) => {
                          if (data.requiresSubRole) {
                            return data.subRoles.map(sr => (
                              <button key={`${key}_${sr.id}`} onClick={() => setAdminSelectedRole(`${key}_${sr.id}`)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${adminSelectedRole === `${key}_${sr.id}` ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                {data.title} ({sr.title.split(' ')[0]})
                              </button>
                            ));
                          }
                          return (
                            <button key={key} onClick={() => setAdminSelectedRole(key)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${adminSelectedRole === key ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                              {data.title}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-lg w-full md:w-auto">
                        <Filter className="w-4 h-4 text-slate-400 ml-2" />
                        <select value={adminProfileFilter} onChange={(e) => setAdminProfileFilter(e.target.value)} className="bg-transparent text-sm font-medium text-slate-700 outline-none pr-2 cursor-pointer w-full md:w-auto">
                          <option value="todos">Ver todas las opiniones</option>
                          <option value="docente">Solo opiniones de Docentes</option>
                          <option value="pas">Solo opiniones del PAS</option>
                          <option value="directivo">Solo opiniones de Directivos</option>
                        </select>
                      </div>
                    </div>

                    <div className="hidden print:block text-lg font-bold text-slate-800 border-b-2 border-slate-800 pb-2 mb-6">
                      Análisis de Perfil: {adminSelectedRole.replace(/_/g, ' ').toUpperCase()} 
                      <span className="text-slate-500 text-sm font-normal block">Filtro aplicado: {adminProfileFilter === 'todos' ? 'Todas las respuestas' : `Solo perfil ${adminProfileFilter.toUpperCase()}`}</span>
                    </div>

                    {(() => {
                      const stats = calculateStats(adminSelectedRole, adminProfileFilter);
                      if (stats.totalEvaluations === 0) return (<div className="bg-white p-12 rounded-xl border border-slate-200 text-center shadow-sm"><Users className="w-12 h-12 text-slate-300 mx-auto mb-3" /><h3 className="text-lg font-bold text-slate-700">Sin datos</h3></div>);
                      
                      const totalVotes = Object.values(stats.scoreDistribution).reduce((a, b) => a + b, 0);
                      let enpsColor = "text-slate-500"; let enpsBg = "bg-slate-100"; let enpsLabel = "Crítico";
                      if (stats.enps.score >= 30) { enpsColor = "text-emerald-700"; enpsBg = "bg-emerald-100"; enpsLabel = "Excelente"; }
                      else if (stats.enps.score >= 0) { enpsColor = "text-amber-700"; enpsBg = "bg-amber-100"; enpsLabel = "Aceptable"; }
                      else { enpsColor = "text-rose-700"; enpsBg = "bg-rose-100"; enpsLabel = "Riesgo"; }

                      return (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
                            <div className={`p-5 rounded-xl border ${enpsBg} border-opacity-50 flex flex-col justify-center relative overflow-hidden`}>
                              <div className="relative z-10">
                                <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-70" title="Employee Net Promoter Score">Nivel de Lealtad (eNPS)</p>
                                <div className="flex items-baseline gap-2">
                                  <p className={`text-4xl font-extrabold ${enpsColor}`}>{stats.enps.score > 0 ? `+${stats.enps.score}` : stats.enps.score}</p>
                                  <p className={`text-sm font-bold uppercase ${enpsColor} opacity-80`}>{enpsLabel}</p>
                                </div>
                                <div className="flex gap-2 mt-2 text-[10px] font-medium text-slate-600 opacity-80">
                                  <span className="text-emerald-700">{Math.round((stats.enps.promoters/stats.totalEvaluations)*100)}% Promotores</span>
                                  <span className="text-rose-700">{Math.round((stats.enps.detractors/stats.totalEvaluations)*100)}% Detractores</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-5 rounded-xl border bg-white border-slate-200 shadow-sm flex flex-col justify-center">
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nota Global</p>
                              <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-extrabold text-blue-600">{stats.globalAverage.toFixed(2)}</p>
                                <p className="text-xl text-slate-400 font-medium">/ 5</p>
                              </div>
                              <p className="text-xs font-medium text-slate-400 mt-2">Basado en {stats.totalEvaluations} respuestas</p>
                            </div>
                            <div className="p-5 rounded-xl border bg-blue-50 border-blue-100 flex flex-col justify-center">
                              <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1 opacity-70">Fortaleza Principal</p>
                              <p className="text-sm font-bold text-blue-900 leading-tight line-clamp-2">{stats.highestSection?.name || '-'}</p>
                              <p className="text-xs text-blue-700 mt-2 font-medium">Nota: {stats.highestSection?.average ? stats.highestSection.average.toFixed(2) : '-'} / 5</p>
                            </div>
                            <div className="p-5 rounded-xl border bg-orange-50 border-orange-100 flex flex-col justify-center">
                              <p className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-1 opacity-70">Área de Mejora</p>
                              <p className="text-sm font-bold text-orange-900 leading-tight line-clamp-2">{stats.lowestSection?.name || '-'}</p>
                              <p className="text-xs text-orange-700 mt-2 font-medium">Nota: {stats.lowestSection?.average ? stats.lowestSection.average.toFixed(2) : '-'} / 5</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1 space-y-6">
                              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-md font-bold text-slate-800 mb-4 border-b pb-2">Distribución de Sentimiento</h3>
                                <div className="space-y-3">
                                  {[5, 4, 3, 2, 1].map(score => {
                                    const count = stats.scoreDistribution[score] || 0;
                                    const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
                                    return (
                                      <div key={score} className="flex items-center gap-3 text-sm">
                                        <div className="w-10 flex items-center justify-end text-slate-600 font-medium">{score} <Star className="w-3 h-3 ml-1 text-yellow-400 fill-current print:text-slate-800" /></div>
                                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden print:border print:border-slate-300">
                                          <div className={`h-full rounded-full ${score >= 4 ? 'bg-green-500' : score === 3 ? 'bg-yellow-400' : 'bg-red-500'} print:!bg-slate-600`} style={{ width: `${percentage}%` }}></div>
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
                                <div className="space-y-6">
                                  {stats.sectionAverages.map((section, i) => (
                                    <div key={i}>
                                      <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-700">{section.name}</span>
                                        <span className="font-bold text-blue-600">{section.average.toFixed(2)}</span>
                                      </div>
                                      <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden relative print:border print:border-slate-300">
                                        <div className="absolute top-0 left-0 h-full bg-blue-500 print:!bg-blue-800 rounded-full transition-all duration-500" style={{ width: `${(section.average / 5) * 100}%` }}></div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-md font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
                                  <MessageSquare className="w-5 h-5 text-slate-400" /> Experiencias Anónimas
                                </h3>
                                {stats.comments.length === 0 ? (
                                  <p className="text-slate-500 text-sm italic">Sin comentarios registrados.</p>
                                ) : (
                                  <div className="space-y-4 max-h-[400px] print:max-h-none overflow-y-auto pr-2">
                                    {stats.comments.map((comment, i) => (
                                      <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-700 italic relative print:bg-white print:border-slate-300">
                                        <span className="absolute top-2 left-2 text-2xl text-slate-300 font-serif leading-none">"</span>
                                        <div className="pl-4 pt-1 mb-2">{comment.text}</div>
                                        <div className="text-xs text-blue-600 font-medium text-right mt-2 pt-2 border-t border-slate-200">
                                          Escrito por: {evaluatorProfiles.find(p => p.id === comment.profile)?.label || 'Perfil desconocido'}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* TAB: GESTIÓN DE REGISTROS (NUEVO) */}
            {adminTab === 'registros' && (
              <div className="animate-fade-in pb-20 print:hidden">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-slate-800">Base de Datos de Respuestas</h2>
                  <p className="text-slate-600 mt-1">Revise todas las encuestas enviadas o elimine registros de prueba.</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                          <th className="p-4 font-semibold">Fecha</th>
                          <th className="p-4 font-semibold">Cargo Evaluado</th>
                          <th className="p-4 font-semibold">Perfil Evaluador</th>
                          <th className="p-4 font-semibold text-center">Nota Media</th>
                          <th className="p-4 font-semibold text-center">Comentario</th>
                          <th className="p-4 font-semibold text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allEvaluations.length === 0 ? (
                          <tr><td colSpan="6" className="p-8 text-center text-slate-500">No hay respuestas registradas.</td></tr>
                        ) : (
                          allEvaluations.map((ev) => {
                            // Calcular media de este registro
                            let sum = 0, count = 0;
                            if (ev.answers) { Object.values(ev.answers).forEach(val => { if(val > 0) {sum += val; count++;} }); }
                            const avg = count > 0 ? (sum/count).toFixed(2) : '-';
                            const date = ev.timestamp?.toDate ? ev.timestamp.toDate().toLocaleString('es-ES', {day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'}) : 'Desconocida';
                            
                            return (
                              <tr key={ev.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors text-sm">
                                <td className="p-4 text-slate-600 font-medium whitespace-nowrap"><Calendar className="w-4 h-4 inline-block mr-2 text-slate-400" />{date}</td>
                                <td className="p-4 font-semibold text-blue-800">
                                  {surveyConfig[ev.roleEvaluated]?.title || ev.roleEvaluated}
                                  {ev.subRoleEvaluated && <span className="block text-xs text-slate-500 font-normal mt-0.5">{ev.subRoleEvaluated.replace('_', ' ')}</span>}
                                </td>
                                <td className="p-4 text-slate-600">{evaluatorProfiles.find(p => p.id === ev.evaluatorProfile)?.label || 'Anónimo'}</td>
                                <td className="p-4 text-center font-bold text-slate-800">{avg}</td>
                                <td className="p-4 text-center">
                                  {ev.comments && ev.comments.trim().length > 0 ? <MessageSquare className="w-5 h-5 mx-auto text-blue-500" title={ev.comments} /> : <span className="text-slate-300">-</span>}
                                </td>
                                <td className="p-4 text-center">
                                  <button onClick={() => setDeleteModalId(ev.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Eliminar registro">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: EDITAR ENCUESTAS */}
            {adminTab === 'editar' && (
              <div className="animate-fade-in pb-20 print:hidden">
                <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800">Editor de Encuestas</h2>
                    <p className="text-slate-600 mt-1">Modifique, añada o elimine las preguntas que se mostrarán en los formularios.</p>
                  </div>
                  <button onClick={handleSaveConfig} disabled={isSavingConfig} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold shadow-sm transition-colors ${isSavingConfig ? 'bg-blue-400 text-white cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                    {isSavingConfig ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Guardar Configuración
                  </button>
                </div>
                {configSaveStatus && (
                  <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${configSaveStatus.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {configSaveStatus.includes('Error') ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />} <span className="font-medium">{configSaveStatus}</span>
                  </div>
                )}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50 p-2 gap-2">
                    {Object.entries(localSurveyConfig).map(([roleKey, roleData]) => {
                       const actualSelectedRole = adminSelectedRole.startsWith('director_pedagogico') ? 'director_pedagogico' : adminSelectedRole;
                       return (
                        <button key={roleKey} onClick={() => setAdminSelectedRole(roleKey)} className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${actualSelectedRole === roleKey ? 'bg-white text-blue-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'}`}>
                          {React.createElement(iconMap[roleData.iconName] || ClipboardList, { className: "w-4 h-4" })} {roleData.title}
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
                          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Settings className="w-5 h-5 text-slate-400" /> Editando preguntas para: {roleData.title}</h3>
                        </div>
                        <div className="space-y-8">
                          {roleData.sections.map((section, sIndex) => (
                            <div key={sIndex} className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                              <h4 className="text-lg font-bold text-slate-800 mb-4">{section.category}</h4>
                              <div className="space-y-4">
                                {section.questions.map((q, qIndex) => (
                                  <div key={q.id} className="flex gap-3 items-start bg-white p-4 rounded-lg border border-slate-100 shadow-sm group">
                                    <div className="flex-1">
                                      <textarea value={q.text} onChange={(e) => handleQuestionTextChange(roleKey, sIndex, qIndex, e.target.value)} className="w-full text-slate-800 bg-white p-2 rounded outline-none resize-y min-h-[40px] border border-transparent focus:border-blue-300 transition-colors shadow-inner" placeholder="Escriba la pregunta aquí..." />
                                    </div>
                                    <button onClick={() => handleRemoveQuestion(roleKey, sIndex, qIndex)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100" title="Eliminar pregunta">
                                      <Trash2 className="w-5 h-5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <button onClick={() => handleAddQuestion(roleKey, sIndex)} className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
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
          </div>
        )}
      </main>

      <footer className="max-w-6xl mx-auto py-6 px-4 border-t border-slate-200 mt-auto print:hidden">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400">
          <p>© {new Date().getFullYear()} Colegio - Auditoría de Calidad Institucional.</p>
          <div className="flex items-center gap-2">
            <span className="bg-slate-200 text-slate-600 px-2 py-1 rounded text-[10px] tracking-wider uppercase">Pro Edition</span>
            <span>v2.1.0</span>
          </div>
        </div>
      </footer>
      
      <style dangerouslySetInnerHTML={{__html: `
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        @media print {
          body { background: white !important; color: black !important; }
          .shadow-sm { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
          .animate-fade-in { animation: none !important; opacity: 1 !important; transform: none !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}} />
    </div>
  );
}
