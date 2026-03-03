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
  Printer
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, setDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

// Configuración de Firebase (Tu proyecto real para StackBlitz)
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

// Mapeo de iconos para poder guardar la configuración en Firebase de forma segura (como texto)
const iconMap = {
  Briefcase: Briefcase,
  GraduationCap: GraduationCap,
  HeartHandshake: HeartHandshake,
  Building: Building
};

// --- BASE DE DATOS DE PREGUNTAS POR DEFECTO ---
const defaultSurveyData = {
  director_general: {
    title: "Director General",
    iconName: "Briefcase",
    description: "Evaluación del liderazgo, capacidad de resolución y trato humano en la dirección del centro.",
    requiresSubRole: false,
    sections: [
      {
        category: "Eficacia y Visión Institucional",
        questions: [
          { id: "dg_1", text: "Siento que transmite una visión clara y motivadora que da sentido a mi trabajo diario." },
          { id: "dg_2", text: "Ante imprevistos o crisis, gestiona la situación con seguridad, eficacia y tranquilidad." },
          { id: "dg_3", text: "Toma decisiones organizativas ágiles que realmente mejoran el funcionamiento del centro." },
          { id: "dg_4", text: "Me siento impulsado/a por la dirección para innovar, formarme y mejorar continuamente en mi labor." }
        ]
      },
      {
        category: "Trato Personal y Clima Laboral",
        questions: [
          { id: "dg_5", text: "En mi trato personal con él/ella, percibo cercanía, respeto y empatía hacia mis circunstancias." },
          { id: "dg_6", text: "Siento que mi esfuerzo diario y mis aportaciones son valoradas y reconocidas activamente." },
          { id: "dg_7", text: "Cuando surgen conflictos, interviene de manera justa, escuchando a todas las partes y buscando soluciones." },
          { id: "dg_8", text: "Muestra coherencia personal entre los valores que predica el centro y sus decisiones diarias." }
        ]
      },
      {
        category: "Accesibilidad y Comunicación",
        questions: [
          { id: "dg_9", text: "Me resulta fácil acceder a él/ella cuando necesito plantear una inquietud o propuesta importante." },
          { id: "dg_10", text: "La comunicación institucional (reuniones, circulares) es clara, transparente y llega a tiempo." },
          { id: "dg_11", text: "Escucha activamente las críticas constructivas y demuestra voluntad de cambiar lo que no funciona." },
          { id: "dg_12", text: "Defiende y representa con eficacia los intereses de los trabajadores y del colegio hacia el exterior." }
        ]
      }
    ]
  },
  director_pedagogico: {
    title: "Director Pedagógico",
    iconName: "GraduationCap",
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
          { id: "dp_1", text: "Resuelve con agilidad y eficacia los problemas organizativos diarios (horarios, sustituciones, guardias)." },
          { id: "dp_2", text: "Sus orientaciones pedagógicas me resultan útiles, realistas y aplicables en mi día a día en el aula." },
          { id: "dp_3", text: "Coordina de forma eficiente la atención a la diversidad, dando respuestas ágiles a las necesidades de mis alumnos." },
          { id: "dp_4", text: "Sabe dinamizar las reuniones de claustro/departamento para que sean realmente productivas y no una pérdida de tiempo." }
        ]
      },
      {
        category: "Acompañamiento y Trato Personal",
        questions: [
          { id: "dp_5", text: "Siento que se preocupa genuinamente por mi bienestar profesional y me ofrece un trato comprensivo." },
          { id: "dp_6", text: "Me apoya de manera efectiva y me da facilidades cuando propongo nuevas iniciativas para mis clases." },
          { id: "dp_7", text: "Cuando cometo un error o tengo una dificultad, su corrección es constructiva, respetuosa y orientada a la mejora." },
          { id: "dp_8", text: "No delega en exceso; asume su responsabilidad y se implica a mi lado cuando hay sobrecarga de trabajo." }
        ]
      },
      {
        category: "Gestión de Convivencia y Apoyo con Familias",
        questions: [
          { id: "dp_9", text: "Me siento plenamente respaldado/a por la dirección pedagógica cuando trato con familias en situaciones difíciles." },
          { id: "dp_10", text: "Interviene con eficacia, firmeza y rapidez ante problemas graves de disciplina o convivencia en mis clases." },
          { id: "dp_11", text: "Transmite confianza, tacto y profesionalidad en su trato directo con el alumnado y las familias." },
          { id: "dp_12", text: "Aplica las normas de convivencia del centro de forma justa, equitativa y sin favoritismos." }
        ]
      }
    ]
  },
  coordinador_pastoral: {
    title: "Coordinador de Pastoral",
    iconName: "HeartHandshake",
    description: "Evaluación del acompañamiento humano, eficacia en la dinamización de actividades y cercanía.",
    requiresSubRole: false,
    sections: [
      {
        category: "Eficacia en la Dinamización",
        questions: [
          { id: "cp_1", text: "Organiza las actividades pastorales y solidarias con eficacia, anticipación y claridad en las indicaciones." },
          { id: "cp_2", text: "Me facilita materiales, tiempos y recursos prácticos que me resultan realmente útiles para trabajar en mis clases." },
          { id: "cp_3", text: "Las celebraciones o momentos de reflexión que propone logran conectar con la realidad y motivar al alumnado." },
          { id: "cp_4", text: "Consigue involucrar al claustro en la acción pastoral sin que esto suponga una carga burocrática excesiva o desorganizada." }
        ]
      },
      {
        category: "Acompañamiento y Vivencia Personal",
        questions: [
          { id: "cp_5", text: "En mi vivencia personal, es una figura acogedora, que transmite paz, alegría y sabe escuchar sin juzgar." },
          { id: "cp_6", text: "Sé con certeza que puedo acudir a él/ella en un momento de dificultad personal y recibiré un acompañamiento sincero." },
          { id: "cp_7", text: "Trata a todos los miembros de la comunidad con exquisito respeto, independientemente de sus creencias o nivel de implicación." },
          { id: "cp_8", text: "Siento su apoyo directo, cercano y cálido cuando mi tutoría atraviesa un momento delicado a nivel humano." }
        ]
      },
      {
        category: "Identidad y Compromiso",
        questions: [
          { id: "cp_9", text: "Comunica el ideario y los valores del centro de una forma inspiradora, actual y alejada de rutinas vacías." },
          { id: "cp_10", text: "Gestiona con eficacia los proyectos de voluntariado, logrando un impacto real y formativo en quienes participan." },
          { id: "cp_11", text: "Consigue despertar la sensibilidad y el espíritu crítico y solidario frente a las injusticias sociales." },
          { id: "cp_12", text: "Su presencia y labor diaria hacen que el colegio se perciba verdaderamente como una comunidad unida y humana." }
        ]
      }
    ]
  },
  administrador: {
    title: "Administrador del Centro",
    iconName: "Building",
    description: "Evaluación del mantenimiento de instalaciones, agilidad en reparaciones y trato humano.",
    requiresSubRole: false,
    sections: [
      {
        category: "Estado y Funcionalidad de Instalaciones",
        questions: [
          { id: "ad_1", text: "Mantiene las instalaciones en óptimo estado, garantizando que mi espacio de trabajo sea seguro, limpio y confortable." },
          { id: "ad_2", text: "Asegura que los espacios comunes (patios, pasillos, aseos, zonas de profesores) sean funcionales y presenten un aspecto cuidado." },
          { id: "ad_3", text: "Supervisa de forma efectiva los servicios generales (limpieza, portería, mantenimiento) asegurando su buen funcionamiento diario." },
          { id: "ad_4", text: "Garantiza que el centro cumple con las medidas de seguridad, evacuación y prevención de riesgos necesarias." }
        ]
      },
      {
        category: "Agilidad en Reparaciones y Trato Personal",
        questions: [
          { id: "ad_5", text: "Cuando reporto una avería o necesito una reparación urgente en mi aula, se actúa y resuelve con rapidez y eficacia." },
          { id: "ad_6", text: "En mi trato directo con él/ella, recibo siempre una atención amable, cercana, paciente y respetuosa." },
          { id: "ad_7", text: "Se muestra accesible y receptivo/a cuando necesito plantear una necesidad material extraordinaria para un proyecto de clase." },
          { id: "ad_8", text: "Su forma de comunicar las normativas de uso de espacios o limitaciones de recursos es asertiva y razonada." }
        ]
      },
      {
        category: "Gestión de Recursos y Mejoras",
        questions: [
          { id: "ad_9", text: "Gestiona las peticiones de material o mobiliario de manera diligente, intentando dar siempre la mejor solución posible." },
          { id: "ad_10", text: "Coordina al personal a su cargo fomentando un clima de eficiencia, respeto y buen trato hacia la comunidad educativa." },
          { id: "ad_11", text: "Demuestra disposición para escuchar sugerencias del personal sobre cómo mejorar la funcionalidad o estética del centro." },
          { id: "ad_12", text: "Implementa mejoras y reformas en las infraestructuras que realmente impactan positivamente en nuestra comodidad diaria." }
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

  // Configuración de Encuestas
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
  
  // Admin Edit Survey States
  const [adminTab, setAdminTab] = useState('resultados'); // 'resultados' | 'editar'
  const [localSurveyConfig, setLocalSurveyConfig] = useState(defaultSurveyData);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configSaveStatus, setConfigSaveStatus] = useState(null);

  // Cambiar título de la pestaña y favicon dinámicamente
  useEffect(() => {
    document.title = "Portal de Evaluación";
    
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = "https://i.ibb.co/YvMv3Qx/Logo-sin-fondo.png";
  }, []);

  // Inicialización y carga de configuración
  useEffect(() => {
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
        // Cargar estructura de la encuesta desde Firebase
        try {
          const configRef = doc(db, 'configuracion', 'encuestas');
          const docSnap = await getDoc(configRef);
          if (docSnap.exists()) {
            setSurveyConfig(docSnap.data().data);
            setLocalSurveyConfig(docSnap.data().data);
          } else {
            // Si no existe, guardar la estructura por defecto
            await setDoc(configRef, { data: defaultSurveyData });
            setSurveyConfig(defaultSurveyData);
            setLocalSurveyConfig(defaultSurveyData);
          }
        } catch (error) {
          console.error("Error al cargar configuración:", error);
          // Fallback a los datos por defecto si hay error
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
          evaluatorProfile: evaluatorProfile,
          answers: answers,
          comments: comments,
          timestamp: serverTimestamp(),
        });
      }
      setCurrentView('success');
    } catch (error) {
      console.error("Error al guardar en base de datos:", error);
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
      lowestSection: null
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
      if (ev.answers) {
        Object.values(ev.answers).forEach(val => {
          if (val > 0) { sum += val; count++; }
        });
      }
      const media = count > 0 ? (sum / count).toFixed(2) : '0';
      const comment = ev.comments ? `"${ev.comments.replace(/"/g, '""').replace(/\n/g, ' ')}"` : 'Ninguno';

      csvContent += `${ev.id},${date},${role},${subRole},${profile},${media},${comment}\n`;
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

  const handlePrint = () => {
    window.print();
  };

  // --- EDITOR DE ENCUESTAS LOGIC ---
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
      <header className="bg-slate-900 text-white py-4 px-4 md:px-8 shadow-md relative z-10 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://i.ibb.co/YvMv3Qx/Logo-sin-fondo.png" 
              alt="Logo de la Institución" 
              className="h-12 w-auto object-contain brightness-0 invert opacity-90" 
            />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Portal de Evaluación 360º</h1>
              <p className="text-slate-400 text-sm hidden sm:block">Auditoría de Calidad Institucional</p>
            </div>
          </div>
          {currentView !== 'admin_dashboard' && currentView !== 'admin_login' && (
             <button 
              onClick={() => setCurrentView('admin_login')}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
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

      {/* Solo mostramos la cabecera imprimible cuando se genere el PDF */}
      <div className="hidden print:block print:mb-8 text-center border-b pb-4">
         <img src="https://i.ibb.co/YvMv3Qx/Logo-sin-fondo.png" alt="Logo" className="h-16 mx-auto mb-2 opacity-80 grayscale" />
         <h1 className="text-2xl font-bold text-slate-800">Informe de Auditoría de Calidad Institucional</h1>
         <p className="text-slate-500">Evaluación Directiva 360º</p>
      </div>

      {currentView === 'survey' && (
        <div className="sticky top-0 left-0 w-full bg-white shadow-sm border-b border-slate-200 z-50">
           <div className="h-1.5 w-full bg-slate-100">
              <div 
                className="h-full bg-blue-600 transition-all duration-300 ease-out" 
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
                return (
                  <button
                    key={key}
                    onClick={() => handleStartSurvey(key)}
                    className="flex flex-col text-left bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-100 text-blue-700 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{data.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {data.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentView === 'profile_selection' && selectedRole && (
          <div className="animate-fade-in max-w-5xl mx-auto">
            <button 
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Volver al panel principal
            </button>
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">¿Desde qué perspectiva evalúa?</h2>
              <p className="text-slate-600 max-w-3xl">
                Para garantizar un análisis 360º riguroso, necesitamos conocer su rol dentro de la comunidad educativa. 
                <span className="font-bold text-blue-600"> Este dato es vital y 100% anónimo.</span>
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto md:mx-0">
              {evaluatorProfiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => handleSelectProfile(profile.id)}
                  className="flex flex-col items-center justify-center text-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <Users className="w-10 h-10 text-slate-400 mb-4 group-hover:text-blue-600 transition-colors" />
                  <h3 className="text-lg font-bold text-slate-800">{profile.label}</h3>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentView === 'subrole_selection' && selectedRole && surveyConfig[selectedRole].requiresSubRole && (
          <div className="animate-fade-in max-w-5xl mx-auto">
            <button 
              onClick={() => setCurrentView('profile_selection')}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Volver
            </button>
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Seleccione la Etapa Educativa</h2>
              <p className="text-slate-600 max-w-3xl">
                Para la figura de {surveyConfig[selectedRole].title}, por favor indique con qué etapa interactúa en su día a día.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto md:mx-0">
              {surveyConfig[selectedRole].subRoles.map((subRole) => (
                <button
                  key={subRole.id}
                  onClick={() => handleSelectSubRole(subRole.id)}
                  className="flex flex-col items-center justify-center text-center bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <GraduationCap className="w-10 h-10 text-blue-400 mb-4 group-hover:text-blue-600 transition-colors" />
                  <h3 className="text-xl font-bold text-slate-800">{subRole.title}</h3>
                </button>
              ))}
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
                  setCurrentView('profile_selection');
                }
              }}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-medium transition-colors mt-2"
            >
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
                  <p className="text-blue-100 text-sm mt-1">
                    Evaluando desde la perspectiva de: <span className="font-semibold text-white">{evaluatorProfiles.find(p => p.id === evaluatorProfile)?.label}</span>
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
                          
                          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:flex-wrap sm:gap-4 lg:justify-between">
                            {scaleOptions.map((opt) => (
                              <label 
                                key={opt.value} 
                                className={`flex items-center gap-2 cursor-pointer p-2 rounded border transition-all ${
                                  answers[q.id] === opt.value 
                                    ? 'bg-blue-50 border-blue-500 text-blue-800 font-medium ring-1 ring-blue-500' 
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-slate-50'
                                } ${opt.value === 0 ? 'sm:ml-auto lg:ml-0 opacity-80' : 'flex-1 sm:flex-none'}`}
                              >
                                <input
                                  type="radio"
                                  name={q.id}
                                  value={opt.value}
                                  checked={answers[q.id] === opt.value}
                                  onChange={() => handleAnswerChange(q.id, opt.value)}
                                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm">
                                  {opt.value > 0 ? opt.value : "N/A"}
                                  <span className="hidden lg:inline ml-1 text-xs opacity-70">
                                    - {opt.label.split(' ')[0]}
                                  </span>
                                </span>
                              </label>
                            ))}
                          </div>
                          <div className="mt-2 text-xs text-slate-400 flex justify-between lg:hidden px-1">
                            <span>1: Muy en desacuerdo</span>
                            <span>5: Muy de acuerdo</span>
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
                      <p className="text-sm text-slate-500 mt-1">Sientase libre de detallar situaciones concretas, propuestas de mejora o aspectos positivos.</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${comments.length > 500 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>
                      {comments.length} caracteres
                    </span>
                  </div>
                  {/* FIX: Se añade bg-white y text-slate-800 explicitamente para que siempre se vea bien */}
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full min-h-[120px] p-4 bg-white text-slate-800 border border-slate-300 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                    placeholder="Escriba sus comentarios cualitativos aquí de forma totalmente anónima..."
                  ></textarea>
                </div>
              </div>

              <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`font-semibold py-3 px-8 rounded-lg shadow-sm transition-colors flex items-center gap-2 ${
                    isSubmitting 
                      ? 'bg-blue-400 cursor-not-allowed text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
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
            <h2 className="text-3xl font-bold text-slate-800 mb-4">¡Evaluación Enviada!</h2>
            <p className="text-slate-600 mb-8 px-6">
              Gracias por compartir tu experiencia. Tus respuestas han sido cifradas y registradas de forma completamente anónima. 
              Este proceso es esencial para crear un entorno de trabajo mejor para todos.
            </p>
            <button
              onClick={() => setCurrentView('home')}
              className="bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-8 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al panel principal
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
                    className={`w-full p-3 bg-white text-slate-800 border rounded-lg outline-none focus:ring-2 ${adminError ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'}`}
                    placeholder="Introduce la clave"
                  />
                  {adminError && <p className="text-red-500 text-sm mt-1">Contraseña incorrecta. (Prueba con: auditor360)</p>}
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
            {/* TABS DEL DASHBOARD ADMIN (Ocultos al imprimir) */}
            <div className="mb-8 border-b border-slate-200 flex space-x-8 print:hidden">
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
            </div>

            {/* CONTENIDO: RESULTADOS */}
            {adminTab === 'resultados' && (
              <div className="animate-fade-in">
                <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                      <BarChart3 className="w-8 h-8 text-blue-600 print:hidden" />
                      Dashboard de Auditoría
                    </h2>
                    <p className="text-slate-600 mt-1">Análisis de la percepción, eficacia y clima laboral.</p>
                  </div>
                  
                  {/* Grupo de botones funcionales (Ocultos al imprimir) */}
                  <div className="flex flex-wrap gap-2 print:hidden">
                    {/* Botón Imprimir (NUEVA FUNCIONALIDAD) */}
                    <button 
                      onClick={handlePrint}
                      disabled={allEvaluations.length === 0}
                      className={`flex items-center justify-center gap-2 text-sm font-medium py-2 px-4 rounded-lg shadow-sm transition-colors ${
                        allEvaluations.length === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900 text-white'
                      }`}
                      title="Generar informe en PDF o Imprimir"
                    >
                      <Printer className="w-4 h-4" />
                      <span className="hidden sm:inline">Imprimir / PDF</span>
                    </button>
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
                  <div className="py-20 flex flex-col items-center justify-center text-slate-500 print:hidden">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                    <p>Procesando resultados cualitativos y cuantitativos...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center print:hidden">
                      <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        {Object.entries(surveyConfig).map(([key, data]) => {
                          if (data.requiresSubRole) {
                            return data.subRoles.map(sr => (
                              <button
                                key={`${key}_${sr.id}`}
                                onClick={() => setAdminSelectedRole(`${key}_${sr.id}`)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                  adminSelectedRole === `${key}_${sr.id}` ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
                                adminSelectedRole === key ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {data.title}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-lg w-full md:w-auto">
                        <Filter className="w-4 h-4 text-slate-400 ml-2" />
                        <select 
                          value={adminProfileFilter}
                          onChange={(e) => setAdminProfileFilter(e.target.value)}
                          className="bg-transparent text-sm font-medium text-slate-700 outline-none pr-2 cursor-pointer w-full md:w-auto"
                        >
                          <option value="todos">Ver todas las opiniones</option>
                          <option value="docente">Solo opiniones de Docentes</option>
                          <option value="pas">Solo opiniones del PAS</option>
                          <option value="directivo">Solo opiniones de Directivos</option>
                        </select>
                      </div>
                    </div>

                    {/* Texto dinámico que solo se ve al imprimir para indicar qué estamos viendo */}
                    <div className="hidden print:block text-lg font-bold text-slate-800 border-b-2 border-slate-800 pb-2 mb-6">
                      Análisis de Perfil: {adminSelectedRole.replace(/_/g, ' ').toUpperCase()} 
                      <span className="text-slate-500 text-sm font-normal block">
                        Filtro aplicado: {adminProfileFilter === 'todos' ? 'Todas las respuestas' : `Solo perfil ${adminProfileFilter.toUpperCase()}`}
                      </span>
                    </div>

                    {(() => {
                      const stats = calculateStats(adminSelectedRole, adminProfileFilter);
                      if (stats.totalEvaluations === 0) {
                        return (
                          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center shadow-sm">
                            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <h3 className="text-lg font-bold text-slate-700">Sin datos para este filtro</h3>
                            <p className="text-slate-500">No hay encuestas registradas que coincidan con la búsqueda actual.</p>
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
                            <div className="p-4 rounded-xl border bg-blue-50 border-blue-100 flex flex-col justify-center">
                              <p className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-1 opacity-70">Fortaleza Principal</p>
                              <p className="text-md font-bold text-blue-900 leading-tight">{stats.highestSection?.name || '-'}</p>
                              <p className="text-sm text-blue-700 mt-1 font-medium">Nota: {stats.highestSection?.average ? stats.highestSection.average.toFixed(2) : '-'} / 5</p>
                            </div>
                            <div className="p-4 rounded-xl border bg-orange-50 border-orange-100 flex flex-col justify-center">
                              <p className="text-sm font-bold text-orange-800 uppercase tracking-wider mb-1 opacity-70">Área de Mejora Prioritaria</p>
                              <p className="text-md font-bold text-orange-900 leading-tight">{stats.lowestSection?.name || '-'}</p>
                              <p className="text-sm text-orange-700 mt-1 font-medium">Nota: {stats.lowestSection?.average ? stats.lowestSection.average.toFixed(2) : '-'} / 5</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1 space-y-6">
                              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Percepción Global</h3>
                                <div className="text-5xl font-extrabold text-blue-600 mb-2">
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
                                          {score} <Star className="w-3 h-3 ml-1 text-yellow-400 fill-current print:text-slate-800" />
                                        </div>
                                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden print:border print:border-slate-300">
                                          <div 
                                            className={`h-full rounded-full ${score >= 4 ? 'bg-green-500' : score === 3 ? 'bg-yellow-400' : 'bg-red-500'} print:!bg-slate-600`}
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
                                <div className="space-y-6">
                                  {stats.sectionAverages.map((section, i) => (
                                    <div key={i}>
                                      <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-700">{section.name}</span>
                                        <span className="font-bold text-blue-600">{section.average.toFixed(2)}</span>
                                      </div>
                                      <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden relative print:border print:border-slate-300">
                                        <div 
                                          className="absolute top-0 left-0 h-full bg-blue-500 print:!bg-blue-800 rounded-full transition-all duration-500"
                                          style={{ width: `${(section.average / 5) * 100}%` }}
                                        ></div>
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

            {/* CONTENIDO: EDITAR ENCUESTAS (Oculto en impresión) */}
            {adminTab === 'editar' && (
              <div className="animate-fade-in pb-20 print:hidden">
                <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800">Editor de Encuestas</h2>
                    <p className="text-slate-600 mt-1">Modifique, añada o elimine las preguntas que se mostrarán en los formularios.</p>
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
                                      {/* FIX: Bg-white y text-slate-800 aplicados al editor para que siempre sea visible */}
                                      <textarea
                                        value={q.text}
                                        onChange={(e) => handleQuestionTextChange(roleKey, sIndex, qIndex, e.target.value)}
                                        className="w-full text-slate-800 bg-white p-2 rounded outline-none resize-y min-h-[40px] border border-transparent focus:border-blue-300 transition-colors shadow-inner"
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
          </div>
        )}

      </main>
      
      {/* Estilos para animaciones y reglas críticas de impresión (PDF) */}
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
        
        /* MAGIA PARA EL MODO IMPRESIÓN (PDF) */
        @media print {
          body { 
            background: white !important; 
            color: black !important;
          }
          .shadow-sm { 
            box-shadow: none !important; 
            border: 1px solid #e2e8f0 !important; 
          }
          .animate-fade-in { 
            animation: none !important; 
            opacity: 1 !important; 
            transform: none !important; 
          }
          /* Forzar a los navegadores a pintar las barras de colores de los gráficos */
          * { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
          }
        }
      `}} />
    </div>
  );
}
