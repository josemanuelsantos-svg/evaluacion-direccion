export interface SkillDefinition {
  id: string;
  skillName: string;
  category: string;
  aptitudeDescription: string;
  highAdvice: string;
  lowAdvice: string;
}

export interface SkillProgressItem {
  id: string;
  skillName: string;
  category: string;
  aptitudeDescription: string;
  scoreYearA: number;
  scoreYearB: number;
  delta: number;
  maturityLevel: {
    label: string;
    badgeBg: string;
    badgeText: string;
    code: 'maestria' | 'competente' | 'en_desarrollo' | 'prioridad';
  };
  evolutionStatus: {
    label: string;
    color: string;
    code: 'en_ascenso' | 'consolidado' | 'estable' | 'requiere_atencion';
  };
  recommendation: string;
}

export const SKILL_DEFINITIONS: Record<string, SkillDefinition> = {
  // --- DIRECTOR GENERAL ---
  dg_1: {
    id: "dg_1",
    skillName: "Visión Estratégica y Alineamiento del Claustro",
    category: "Liderazgo Institucional",
    aptitudeDescription: "Capacidad para inspirar, transmitir el rumbo del centro y lograr que el equipo comparta los objetivos institucionales.",
    highAdvice: "Mantener sesiones periódicas de recordatorio de metas estratégicas y celebrar los hitos conseguidos por la comunidad educativa.",
    lowAdvice: "Reforzar la claridad en las asambleas iniciales del curso, desglosando los objetivos en metas pedagógicas concretas y tangibles para cada etapa."
  },
  dg_2: {
    id: "dg_2",
    skillName: "Temple, Serenidad y Gestión Eficaz de Crisis",
    category: "Inteligencia Emocional y Resolución",
    aptitudeDescription: "Habilidad para mantener el autocontrol, tranquilizar al claustro y tomar determinaciones firmes ante imprevistos graves.",
    highAdvice: "Consolidar los protocolos de contingencia como un activo referente y servir de mentor a los coordinadores en gestión del estrés.",
    lowAdvice: "Elaborar un protocolo de comunicación rápida ante incidentes para evitar la incertidumbre y el rumor en el claustro."
  },
  dg_3: {
    id: "dg_3",
    skillName: "Toma de Decisiones y Optimización Organizativa",
    category: "Gestión y Eficacia",
    aptitudeDescription: "Destreza directiva para implementar cambios estructurales y normativos que agilicen el día a día escolar.",
    highAdvice: "Continuar delegando en las comisiones pedagógicas para no sobrecargar la mesa de dirección.",
    lowAdvice: "Evaluar el impacto práctico de cada nueva directriz consultando previamente con los coordinadores de ciclo."
  },
  dg_4: {
    id: "dg_4",
    skillName: "Impulso de la Innovación y Desarrollo del Talento",
    category: "Dinamización Pedagógica",
    aptitudeDescription: "Proactividad para motivar a los docentes a investigar metodologías activas y formarse de forma continua.",
    highAdvice: "Fomentar un banco de buenas prácticas docentes donde los profesores compartan sus proyectos innovadores.",
    lowAdvice: "Crear un canal de recepción ágil para ideas de aula y destinar pequeños presupuestos semilla a iniciativas piloto."
  },
  dg_5: {
    id: "dg_5",
    skillName: "Empatía, Escucha y Sensibilidad Personal",
    category: "Relaciones Humanas y Clima",
    aptitudeDescription: "Aptitud para conectar humanamente con la realidad particular, dificultades familiares y salud del docente.",
    highAdvice: "La cercanía demostrada es el pilar de la cohesión del centro; continuar con las entrevistas individuales de cuidado.",
    lowAdvice: "Reservar espacios en agenda semanales sin citas de gestión para pasear por las salas de profesores y mostrar disponibilidad informal."
  },
  dg_6: {
    id: "dg_6",
    skillName: "Reconocimiento del Esfuerzo y Motivación Docente",
    category: "Liderazgo Transformacional",
    aptitudeDescription: "Hábito directivo de valorar públicamente y en privado el esfuerzo silencioso y los logros de los trabajadores.",
    highAdvice: "Mantener los mensajes de felicitación institucional y extender el reconocimiento a las familias y redes del centro.",
    lowAdvice: "Establecer la costumbre de agradecer personalmente el trabajo tras eventos grandes, festivales o periodos de evaluaciones."
  },
  dg_7: {
    id: "dg_7",
    skillName: "Mediación Imparcial y Resolución de Conflictos",
    category: "Convivencia y Justicia",
    aptitudeDescription: "Capacidad para escuchar con ecuanimidad a todas las partes en disputa antes de dictaminar una solución.",
    highAdvice: "El estilo mediador justo es una seña de identidad franciscana; preservar siempre la confidencialidad estricta.",
    lowAdvice: "Evitar resoluciones apresuradas; dedicar tiempo a contrastar las versiones con prudencia y neutralidad visible."
  },
  dg_8: {
    id: "dg_8",
    skillName: "Ejemplaridad y Coherencia en Valores Franciscanos",
    category: "Identidad Institucional",
    aptitudeDescription: "Grado en que la conducta del directivo refleja la sencillez, hospitalidad, justicia y fraternidad del ideario.",
    highAdvice: "Un referente moral que genera orgullo de pertenencia en el centro.",
    lowAdvice: "Cuidar la coherencia entre el discurso en celebraciones y las decisiones operativas del día a día."
  },
  dg_9: {
    id: "dg_9",
    skillName: "Cercanía, Trato Humano y Accesibilidad",
    category: "Comunicación y Presencia",
    aptitudeDescription: "Disponibilidad real y apertura de la puerta del despacho para atender problemas urgentes del claustro.",
    highAdvice: "Política de puertas abiertas excelente y ampliamente reconocida.",
    lowAdvice: "Evitar que la carga administrativa aísle al directivo en su despacho en las horas de recreo y entradas."
  },
  dg_10: {
    id: "dg_10",
    skillName: "Transparencia y Rigor en la Comunicación Interna",
    category: "Comunicación y Presencia",
    aptitudeDescription: "Habilidad para transmitir circulares, acuerdos y calendarios con la debida antelación y claridad.",
    highAdvice: "Los canales de comunicación funcionan de manera fluida y predecible.",
    lowAdvice: "Centralizar los avisos en un único boletín o plataforma para evitar duplicidades o avisos de última hora."
  },
  dg_11: {
    id: "dg_11",
    skillName: "Apertura a la Crítica Constructiva y Mejora Continua",
    category: "Madurez y Humildad Directiva",
    aptitudeDescription: "Disposición a encajar propuestas contrarias sin adoptar posturas defensivas y rectificar si es necesario.",
    highAdvice: "Capacidad de escucha crítica encomiable que genera un clima de confianza total.",
    lowAdvice: "Agradecer explícitamente cuando un docente se atreva a señalar un error de gestión en beneficio del centro."
  },
  dg_12: {
    id: "dg_12",
    skillName: "Liderazgo Institucional y Defensa del Equipo",
    category: "Liderazgo Institucional",
    aptitudeDescription: "Firmeza para respaldar a los trabajadores frente a presiones externas, inspección o demandas infundadas.",
    highAdvice: "El claustro se siente respaldado y protegido ante cualquier adversidad.",
    lowAdvice: "Transmitir con mayor contundencia a los docentes que la dirección está a su lado ante reclamaciones injustas de familias."
  },

  // --- DIRECTOR PEDAGÓGICO ---
  dp_1: {
    id: "dp_1",
    skillName: "Agilidad Organizativa y Gestión de Incidencias",
    category: "Eficacia Operativa",
    aptitudeDescription: "Destreza para resolver cuadrantes de guardias, sustituciones y ajustes horarios sin demoras.",
    highAdvice: "Excelente capacidad operativa y rapidez resolutiva.",
    lowAdvice: "Digitalizar y automatizar el parte de guardias matinal para reducir la fricción en las primeras horas."
  },
  dp_2: {
    id: "dp_2",
    skillName: "Asesoramiento y Acompañamiento Didáctico",
    category: "Liderazgo Pedagógico",
    aptitudeDescription: "Utilidad pedagógica de sus consejos para programaciones, metodologías y situaciones de aula.",
    highAdvice: "Referente pedagógico clave; compartir su experiencia mediante sesiones de modelado.",
    lowAdvice: "Potenciar las visitas amistosas a las aulas para ofrecer feedback pedagógico no fiscalizador."
  },
  dp_3: {
    id: "dp_3",
    skillName: "Provisión de Recursos para la Diversidad (NEAE)",
    category: "Inclusión y Recursos",
    aptitudeDescription: "Facilitador de apoyos, adaptaciones curriculares y coordinación con el gabinete de orientación.",
    highAdvice: "Compromiso ejemplar con la educación inclusiva y el soporte a la diversidad.",
    lowAdvice: "Reunirse mensualmente con el equipo de PT/AL y orientación para anticipar refuerzos en aulas sobrecargadas."
  },
  dp_4: {
    id: "dp_4",
    skillName: "Eficiencia y Gestión del Tiempo en Reuniones",
    category: "Eficacia Operativa",
    aptitudeDescription: "Habilidad para ceñirse al orden del día, evitar divagaciones y respetar los horarios pactados.",
    highAdvice: "Reuniones ejecutivas, productivas y puntuales.",
    lowAdvice: "Enviar el orden del día con 24h de antelación y fijar un reloj visible con límite para cada tema tratado."
  },
  dp_5: {
    id: "dp_5",
    skillName: "Cuidado y Preocupación por el Bienestar Docente",
    category: "Relaciones Humanas y Clima",
    aptitudeDescription: "Interés sincero por la carga mental, salud física y bienestar emocional de los profesores.",
    highAdvice: "Liderazgo compasivo que previene activamente el síndrome de burnout.",
    lowAdvice: "Revisar periódicamente la carga burocrática acumulada para suprimir tareas superfluas."
  },
  dp_6: {
    id: "dp_6",
    skillName: "Apoyo a Iniciativas e Innovaciones Docentes",
    category: "Liderazgo Pedagógico",
    aptitudeDescription: "Facilitador que dice 'sí' a las propuestas ilusionantes de los profesores y elimina trabas.",
    highAdvice: "Motor de innovación que empodera al claustro.",
    lowAdvice: "Ofrecer flexibilidad horaria o de espacios cuando un departamento plantee un proyecto interdisciplinar."
  },
  dp_7: {
    id: "dp_7",
    skillName: "Feedback Formativo y Correcciones Respetuosas",
    category: "Acompañamiento Profesional",
    aptitudeDescription: "Tacto y diplomacia al señalar un error o aspecto a mejorar a un docente sin herir su dignidad.",
    highAdvice: "Dominio de la retroalimentación positiva y constructiva.",
    lowAdvice: "Aplicar la técnica del feedback sándwich (fortaleza + aspecto a mejorar + muestra de confianza personal)."
  },
  dp_8: {
    id: "dp_8",
    skillName: "Responsabilidad y Liderazgo Compartido",
    category: "Eficacia Operativa",
    aptitudeDescription: "Asunción directa de responsabilidades pedagógicas propias sin delegar excesivamente hacia abajo.",
    highAdvice: "Asume el timón con autoridad moral y compromiso intachable.",
    lowAdvice: "Delimitar con claridad qué tareas corresponden a la jefatura y cuáles a los tutores."
  },
  dp_9: {
    id: "dp_9",
    skillName: "Soporte Firme ante Situaciones Difíciles con Familias",
    category: "Gestión de Convivencia",
    aptitudeDescription: "Presencia tranquilizadora y respaldo al profesor en tutorías complejas o entrevistas tensas.",
    highAdvice: "El profesorado se siente 100% amparado en las reuniones conflictivas con padres.",
    lowAdvice: "Acompañar presencialmente al tutor cuando se anticipe una entrevista de alta hostilidad."
  },
  dp_10: {
    id: "dp_10",
    skillName: "Intervención Ágil ante Problemas Graves de Convivencia",
    category: "Gestión de Convivencia",
    aptitudeDescription: "Rapidez y contundencia formativa al actuar ante conductas disruptivas o acoso escolar.",
    highAdvice: "Gestión de la convivencia rápida, educativa y garantista.",
    lowAdvice: "Reducir los tiempos de respuesta desde que el tutor remite una incidencia hasta la aplicación de la medida correctora."
  },
  dp_11: {
    id: "dp_11",
    skillName: "Tacto Pedagógico y Cercanía con el Alumnado",
    category: "Acompañamiento al Alumnado",
    aptitudeDescription: "Cuidado afectivo y respeto en las interacciones diarias con niños y adolescentes.",
    highAdvice: "Los alumnos respetan y admiran su figura por su tono cercano y justo.",
    lowAdvice: "Mantener siempre el control del tono de voz, incluso en situaciones disciplinarias severas."
  },
  dp_12: {
    id: "dp_12",
    skillName: "Equidad e Imparcialidad en la Aplicación de Normas",
    category: "Gestión de Convivencia",
    aptitudeDescription: "Trato justo sin favoritismos ni excepciones arbitrarias en el Reglamento de Régimen Interior.",
    highAdvice: "Criterio ético ejemplar en la aplicación del plan de convivencia.",
    lowAdvice: "Publicar con transparencia los criterios de aplicación de sanciones para disipar cualquier sensación de disparidad."
  },

  // --- COORDINADORA DE PASTORAL ---
  cp_1: {
    id: "cp_1",
    skillName: "Planificación Pastoral sin Sobrecarga Docente",
    category: "Organización y Tiempos",
    aptitudeDescription: "Previsión y aviso anticipado de campañas, oraciones y celebraciones para no alterar la marcha académica.",
    highAdvice: "Excelente coordinación del calendario pastoral.",
    lowAdvice: "Presentar el cronograma trimestral completo al inicio del periodo para que los tutores planifiquen sus horas de clase."
  },
  cp_2: {
    id: "cp_2",
    skillName: "Provisión de Materiales Didácticos Aplicables",
    category: "Recursos y Metodología Pastoral",
    aptitudeDescription: "Calidad y utilidad pedagógica de las guías, dinámicas y lecturas entregadas a los tutores.",
    highAdvice: "Materiales frescos, atractivos y de gran valor educativo.",
    lowAdvice: "Ofrecer alternativas adaptadas a cada nivel madurativo del alumnado, evitando fichas genéricas."
  },
  cp_3: {
    id: "cp_3",
    skillName: "Creatividad y Conexión con los Jóvenes",
    category: "Dinamización",
    aptitudeDescription: "Capacidad para conectar los valores evangélicos con la música, inquietudes y lenguaje actual del alumnado.",
    highAdvice: "Celebraciones emotivas que dejan huella en los chicos.",
    lowAdvice: "Incorporar formatos audiovisuales y participación activa de los propios alumnos en los guiones de las celebraciones."
  },
  cp_4: {
    id: "cp_4",
    skillName: "Estructura Ágil y Desburocratizada",
    category: "Organización y Tiempos",
    aptitudeDescription: "Facilidad en la gestión sin exigir memorias, formularios o justificaciones innecesarias a los profesores.",
    highAdvice: "Pastoral ligera, ágil y centrada en la experiencia humana.",
    lowAdvice: "Simplificar al mínimo la recogida de evaluaciones de las campañas solidarias."
  },
  cp_5: {
    id: "cp_5",
    skillName: "Acogida, Calidez y Hospitalidad Franciscana",
    category: "Trato Humano y Espiritual",
    aptitudeDescription: "Tono acogedor que hace que cualquier docente o alumno se sienta querido y bienvenido.",
    highAdvice: "El corazón del carisma franciscano encarnado en el centro.",
    lowAdvice: "Dedicar unos minutos al inicio de la jornada para saludar personalmente a los nuevos docentes."
  },
  cp_6: {
    id: "cp_6",
    skillName: "Disposición para la Escucha y Acompañamiento",
    category: "Acompañamiento Personal",
    aptitudeDescription: "Disponibilidad discreta y afectuosa para acompañar a docentes en momentos de dolor o pérdida.",
    highAdvice: "Espacio seguro de escucha activa imprescindible en el centro.",
    lowAdvice: "Habilitar un rincón tranquilo y confortable para conversaciones personales que requieran intimidad."
  },
  cp_7: {
    id: "cp_7",
    skillName: "Respeto ante la Pluralidad y Libertad de Creencias",
    category: "Inclusión y Diálogo",
    aptitudeDescription: "Capacidad para proponer la fe sin imponerla, respetando los distintos procesos personales del claustro.",
    highAdvice: "Modelo de evangelización respetuosa y atrayente.",
    lowAdvice: "Enfocar las reflexiones en valores universales donde cualquier persona del equipo pueda sentirse plenamente integrada."
  },
  cp_8: {
    id: "cp_8",
    skillName: "Soporte Humano en Situaciones Delicadas de Aula",
    category: "Acompañamiento al Alumnado",
    aptitudeDescription: "Apoyo ante pérdidas familiares de alumnos, duelos o crisis existenciales en las clases.",
    highAdvice: "Intervención inmediata y reconfortante en situaciones críticas de aula.",
    lowAdvice: "Tener preparadas dinámicas de aula específicas para momentos de duelo infantil y juvenil."
  },
  cp_9: {
    id: "cp_9",
    skillName: "Testimonio Coherente de Identidad Franciscana",
    category: "Identidad Institucional",
    aptitudeDescription: "Transmisión viva de la Paz y el Bien, el cuidado de la Creación y la fraternidad universal.",
    highAdvice: "Inspiradora por su sencillez y testimonio de vida.",
    lowAdvice: "Vincular más los proyectos pastorales con la ecología integral y el compromiso medioambiental del colegio."
  },
  cp_10: {
    id: "cp_10",
    skillName: "Coordinación Eficaz de Campañas Solidarias",
    category: "Acción Social",
    aptitudeDescription: "Gestión logística impecable de recogidas de alimentos, Domund, Cáritas o proyectos de desarrollo.",
    highAdvice: "Las campañas de solidaridad son un éxito colectivo gracias a su dinamización.",
    lowAdvice: "Mostrar a los alumnos el destino final de las ayudas con testimonios o vídeos directos de los beneficiarios."
  },
  cp_11: {
    id: "cp_11",
    skillName: "Sensibilización ante las Injusticias Sociales",
    category: "Acción Social",
    aptitudeDescription: "Aptitud para despertar el sentido crítico y la compasión activa en los estudiantes.",
    highAdvice: "Fomenta una mirada comprometida con los más vulnerables.",
    lowAdvice: "Organizar voluntariados reales para alumnos mayores en comedores o residencias locales."
  },
  cp_12: {
    id: "cp_12",
    skillName: "Generación de Comunidad y Fraternidad Escolar",
    category: "Clima y Comunidad",
    aptitudeDescription: "Habilidad para tejer lazos fraternos entre Infantil, Primaria, Secundaria y personal de administración y servicios.",
    highAdvice: "Elemento aglutinador clave que hace del centro una verdadera familia.",
    lowAdvice: "Promover encuentros de convivencia distendidos para todo el personal al menos dos veces al curso."
  },

  // --- ADMINISTRADOR DEL CENTRO ---
  ad_1: {
    id: "ad_1",
    skillName: "Garantía de Limpieza, Higiene y Confort en Aulas",
    category: "Infraestructuras y Espacios",
    aptitudeDescription: "Supervisión rigurosa de las condiciones de climatización, iluminación y salubridad del aula.",
    highAdvice: "Espacios de trabajo cuidados, dignos y confortables.",
    lowAdvice: "Revisar los filtros de ventilación y termostatos antes de las olas de calor o frío."
  },
  ad_3: {
    id: "ad_3",
    skillName: "Supervisión y Liderazgo del Personal de Servicios",
    category: "Gestión de Equipos",
    aptitudeDescription: "Coordinación efectiva de equipos de limpieza, comedor, portería y mantenimiento.",
    highAdvice: "Liderazgo firme y cercano con el personal no docente.",
    lowAdvice: "Celebrar reuniones de coordinación periódicas con los turnos de limpieza de tarde."
  },
  ad_4: {
    id: "ad_4",
    skillName: "Rigor en Seguridad, Evacuación y Prevención de Riesgos",
    category: "Seguridad y Normativa",
    aptitudeDescription: "Cumplimiento estricto de las normativas de seguridad laboral y planes de autoprotección.",
    highAdvice: "Garantiza un entorno escolar seguro y ajustado a la legalidad.",
    lowAdvice: "Realizar simulacros de evacuación sin aviso previo para comprobar la fluidez real en escaleras."
  },
  ad_5: {
    id: "ad_5",
    skillName: "Agilidad en Reparaciones y Mantenimiento Correctivo",
    category: "Operaciones y Averías",
    aptitudeDescription: "Velocidad de respuesta para arreglar persianas, pizarras, proyectores o fontanería averiada.",
    highAdvice: "Capacidad de resolución casi inmediata de averías.",
    lowAdvice: "Instalar un sistema digital de tickets para que los docentes conozcan el estado de su reparación."
  },
  ad_6: {
    id: "ad_6",
    skillName: "Amabilidad, Respeto y Calidad en el Trato Personal",
    category: "Relaciones Humanas",
    aptitudeDescription: "Tono cordial, educado y dispuesto a ayudar en las relaciones diarias con el claustro.",
    highAdvice: "Trato exquisito, muy valorado y agradecido por todo el personal.",
    lowAdvice: "Cuidar la serenidad en los picos de mayor estrés organizativo de la administración."
  },
  ad_7: {
    id: "ad_7",
    skillName: "Receptividad ante Demandas Materiales Extraordinarias",
    category: "Apoyo a la Docencia",
    aptitudeDescription: "Flexibilidad y escucha ante solicitudes de compras o mobiliario especial para proyectos educativos.",
    highAdvice: "Facilita la labor didáctica buscando soluciones materiales imaginativas.",
    lowAdvice: "Explicar las opciones alternativas cuando una compra no sea presupuestariamente viable."
  },
  ad_8: {
    id: "ad_8",
    skillName: "Coherencia con los Valores y Austeridad Franciscana",
    category: "Identidad Institucional",
    aptitudeDescription: "Gestión honrada de los bienes del colegio con sencillez, transparencia y sentido de responsabilidad.",
    highAdvice: "Gestor riguroso y testimonio de honradez y servicio desinteresado.",
    lowAdvice: "Compartir con el claustro las mejoras energéticas que hacen del colegio un centro más sostenible."
  },
  ad_9: {
    id: "ad_9",
    skillName: "Diligencia en Gestión de Material Fungible",
    category: "Gestión de Recursos",
    aptitudeDescription: "Abastecimiento puntual de tizas, folios, rotuladores y consumibles de aula.",
    highAdvice: "Nunca falta material esencial para la actividad diaria.",
    lowAdvice: "Establecer dos fechas fijas al mes para pedidos extraordinarios y evitar urgencias."
  },
  ad_12: {
    id: "ad_12",
    skillName: "Proactividad en Reformas y Modernización del Centro",
    category: "Infraestructuras y Futuro",
    aptitudeDescription: "Iniciativa para anticipar obras estivales, accesibilidad y embellecimiento de los patios y salas.",
    highAdvice: "Visión de futuro que transforma positivamente los espacios de aprendizaje.",
    lowAdvice: "Recoger sugerencias del profesorado sobre la ergonomía de los espacios de descanso y trabajo."
  }
};

export function getMaturityLevel(score: number): {
  label: string;
  badgeBg: string;
  badgeText: string;
  code: 'maestria' | 'competente' | 'en_desarrollo' | 'prioridad';
} {
  if (score >= 4.5) {
    return {
      label: "Maestría / Referente",
      badgeBg: "bg-emerald-100 border-emerald-300",
      badgeText: "text-emerald-800",
      code: "maestria"
    };
  } else if (score >= 4.0) {
    return {
      label: "Competente / Sólido",
      badgeBg: "bg-blue-100 border-blue-300",
      badgeText: "text-blue-800",
      code: "competente"
    };
  } else if (score >= 3.5) {
    return {
      label: "En Desarrollo",
      badgeBg: "bg-amber-100 border-amber-300",
      badgeText: "text-amber-800",
      code: "en_desarrollo"
    };
  } else {
    return {
      label: "Prioridad de Apoyo",
      badgeBg: "bg-rose-100 border-rose-300",
      badgeText: "text-rose-800",
      code: "prioridad"
    };
  }
}

export function getEvolutionStatus(delta: number, scoreCurrent: number): {
  label: string;
  color: string;
  code: 'en_ascenso' | 'consolidado' | 'estable' | 'requiere_atencion';
} {
  if (delta >= 0.15) {
    return {
      label: "En Ascenso Notorio",
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
      code: "en_ascenso"
    };
  } else if (delta <= -0.15) {
    return {
      label: "Requiere Acompañamiento",
      color: "text-rose-700 bg-rose-50 border-rose-200",
      code: "requiere_atencion"
    };
  } else if (scoreCurrent >= 4.5) {
    return {
      label: "Consolidado en Excelencia",
      color: "text-blue-700 bg-blue-50 border-blue-200",
      code: "consolidado"
    };
  } else {
    return {
      label: "Estable",
      color: "text-slate-700 bg-slate-50 border-slate-200",
      code: "estable"
    };
  }
}

export function generateSkillPathway(
  questionAveragesYearA: Record<string, number>,
  questionAveragesYearB: Record<string, number>,
  roleKey: string
): SkillProgressItem[] {
  const result: SkillProgressItem[] = [];

  // Recorrer todas las definiciones que pertenezcan a este rol
  for (const [qId, def] of Object.entries(SKILL_DEFINITIONS)) {
    const isDG = roleKey.startsWith('director_general') && qId.startsWith('dg_');
    const isDP = roleKey.startsWith('director_pedagogico') && qId.startsWith('dp_');
    const isCP = roleKey.startsWith('coordinador_pastoral') && qId.startsWith('cp_');
    const isAD = roleKey.startsWith('administrador') && qId.startsWith('ad_');

    if (isDG || isDP || isCP || isAD) {
      const scoreA = questionAveragesYearA[qId] || 0;
      const scoreB = questionAveragesYearB[qId] || 0;
      const delta = scoreB > 0 && scoreA > 0 ? parseFloat((scoreB - scoreA).toFixed(2)) : 0;
      const activeScore = scoreB > 0 ? scoreB : scoreA;

      const maturity = getMaturityLevel(activeScore);
      const status = getEvolutionStatus(delta, activeScore);
      const recommendation = activeScore >= 4.2 ? def.highAdvice : def.lowAdvice;

      result.push({
        id: qId,
        skillName: def.skillName,
        category: def.category,
        aptitudeDescription: def.aptitudeDescription,
        scoreYearA: scoreA,
        scoreYearB: scoreB,
        delta: delta,
        maturityLevel: maturity,
        evolutionStatus: status,
        recommendation: recommendation
      });
    }
  }

  // Ordenar por categoría y luego por puntuación
  return result.sort((a, b) => b.scoreYearB - a.scoreYearB);
}
