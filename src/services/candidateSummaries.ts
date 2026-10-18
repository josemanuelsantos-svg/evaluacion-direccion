export interface CandidateSummary {
  roleKey: string;
  roleTitle: string;
  subRoleTitle?: string;
  globalScore: number;
  sampleCount: number;
  percentFives: number;
  diagnosticoGeneral: string;
  fortalezasClave: string[];
  areasMejoraRetos: string[];
  climaDocente: string;
}

export const CANDIDATE_SUMMARIES: Record<string, CandidateSummary> = {
  director_pedagogico_infantil_primaria: {
    roleKey: "director_pedagogico_infantil_primaria",
    roleTitle: "Director Pedagógico",
    subRoleTitle: "Infantil y Primaria",
    globalScore: 4.83,
    sampleCount: 28,
    percentFives: 89.8,
    diagnosticoGeneral: "Liderazgo de excelencia indiscutible y máxima aprobación unánime de todo el colegio. El claustro manifiesta una confianza absoluta en su gestión, destacando su compromiso total con el proyecto educativo, su cercanía personal y su capacidad de trabajo incansable que supera ampliamente sus obligaciones lectivas.",
    fortalezasClave: [
      "Eficacia resolutiva sobresaliente: Gestión inmediata y sin fricciones de horarios, guardias y sustituciones operativas (4.96/5).",
      "Respaldo total ante familias: Los tutores y docentes destacan sentirse plenamente amparados y apoyados en situaciones complejas (4.92/5).",
      "Motor tecnológico y metodológico: Impulso activo a la digitalización (Chromebooks), aprendizaje cooperativo, proyectos de centro e imagen del colegio.",
      "Ejemplaridad y humildad franciscana: Reconocido por ser el primero en llegar, realizar patios, filas, tutorías y apoyar en tareas cotidianas de aula como uno más."
    ],
    areasMejoraRetos: [
      "Presencia de acompañamiento en Infantil: Se solicita una presencia cotidiana más espontánea y preventiva en las aulas de Infantil, no únicamente al surgir incidencias.",
      "Prevención del desgaste personal (Burnout): El profesorado percibe sobrecarga de trabajo y un elevado desgaste físico/emocional por asumir demasiadas funciones operativas; se recomienda delegar y blindar tiempos de descanso.",
      "Optimización en orientación NEAE: Afianzar la agilidad en los protocolos de atención a la diversidad junto al departamento de orientación."
    ],
    climaDocente: "Ambiente de alta cohesión, admiración profesional y gratitud unánime en la etapa de Infantil y Primaria."
  },

  director_pedagogico_secundaria_bachillerato: {
    roleKey: "director_pedagogico_secundaria_bachillerato",
    roleTitle: "Director Pedagógico",
    subRoleTitle: "Secundaria y Bachillerato",
    globalScore: 4.26,
    sampleCount: 17,
    percentFives: 62.3,
    diagnosticoGeneral: "Liderazgo respetado por su corrección formal, orden metodológico y trato respetuoso. La labor pedagógica en las etapas superiores cuenta con una base sólida de valoración, si bien se aprecian fricciones operativas notables en la optimización de los tiempos de claustro y la sobrecarga docente.",
    fortalezasClave: [
      "Ideario y valores franciscanos: Coherencia ética, trato empático y estilo respetuoso con el equipo docente (4.80/5).",
      "Feedback formativo constructivo: Capacidad para corregir errores con pedagogía positiva y orientación a la mejora profesional (4.63/5).",
      "Accesibilidad y diálogo directo: Facilidad en el trato personal cara a cara para resolver dudas individuales de los profesores."
    ],
    areasMejoraRetos: [
      "Dinamización de reuniones de equipo: Es el ítem más crítico (3.24/5); el claustro reclama que las reuniones de los jueves tengan un orden del día más ágil y resolutivo para no convertirse en maratones de horas improductivas.",
      "Protección del tiempo lectivo y de preparación: Malestar por la sensación de 'trabajo por horas' y necesidad de preservar horas no lectivas para corrección y preparación de clases.",
      "Gestión de guardias y sustituciones: Mejorar el reparto de horas de sustitución para evitar la sensación de que siempre recaen sobre los mismos compañeros.",
      "Firmeza y agilidad disciplinaria: Mayor contundencia y rapidez de intervención ante conductas disruptivas graves en las aulas de ESO."
    ],
    climaDocente: "Clima profesional correcto y respetuoso, pero con demandas urgentes de optimización del tiempo y reducción de reuniones extensas."
  },

  director_general: {
    roleKey: "director_general",
    roleTitle: "Director General",
    globalScore: 4.24,
    sampleCount: 47,
    percentFives: 51.1,
    diagnosticoGeneral: "Liderazgo institucional valorado principalmente en su dimensión humana, pastoral y conciliadora. El claustro valora enormemente su bondad, cercanía y accesibilidad, pero reclama con firmeza mayor contundencia y agilidad organizativa para que la escucha activa se traduzca en transformaciones prácticas del centro.",
    fortalezasClave: [
      "Representación del Ideario Franciscano: Referente de sencillez, fraternidad y ambiente pacificador en la comunidad (4.58/5).",
      "Accesibilidad y cercanía personal: Facilidad para concertar reuniones, ausencia de distancias jerárquicas y actitud receptiva (4.52/5).",
      "Sensibilidad hacia la salud y conciliación: Gran empatía y trato humano ante dificultades familiares o de salud de los trabajadores (4.48/5)."
    ],
    areasMejoraRetos: [
      "Eficacia en decisiones organizativas: Es la valoración más baja (3.88/5); el profesorado siente que las reuniones de escucha deben culminar en decisiones firmes y cambios concretos.",
      "Respaldo visible al tutor de aula: Preocupación expresada por intervenciones directas con familias sin consulta ni respaldo previo al tutor responsable del caso.",
      "Agilidad en canales formales: Mejorar el tiempo de respuesta a correos electrónicos y solicitudes oficiales de los docentes.",
      "Ecuanimidad y comunicación institucional: Cuidar que no se perciban diferencias de trato o círculos de afinidad informal en la gestión colegial."
    ],
    climaDocente: "Clima de afecto personal y respeto mutuo, condicionado por la demanda de un liderazgo más ejecutivo y resolutivo."
  },

  coordinador_pastoral: {
    roleKey: "coordinador_pastoral",
    roleTitle: "Coordinadora de Pastoral",
    globalScore: 4.02,
    sampleCount: 47,
    percentFives: 44.9,
    diagnosticoGeneral: "Liderazgo de enorme entrega vocacional, alegría y carisma franciscano. El claustro reconoce su bondad y esfuerzo incansable, pero expresa un malestar transversal muy extendido debido a la saturación de campañas y actividades que interfieren en el ritmo académico cotidiano.",
    fortalezasClave: [
      "Testimonio auténtico de fe franciscana: Pasión, coherencia y entrega indiscutible en la vivencia del ideario colegial (4.33/5).",
      "Trato humano e integrador: Actitud respetuosa, cálida y cercana con todos los miembros de la comunidad sin exclusión (4.32/5).",
      "Capacidad de trabajo y dinamización: Esfuerzo continuo en la elaboración de materiales, dinámicas y momentos de reflexión."
    ],
    areasMejoraRetos: [
      "Principio de 'Menos es Más': Reclamación unánime del claustro para descongestionar el calendario pastoral y evitar la superposición de campañas.",
      "Involucración del claustro sin sobrecarga: Es el ítem más bajo (3.32/5); los tutores sienten que se les traslada una carga pastoral excesiva que resta horas lectivas.",
      "Interferencia con la vida académica: Planificar las propuestas evitando interrumpir los procesos de aprendizaje básicos (lectura, materias instrumentales).",
      "Adaptación madurativa de propuestas: Adecuar mejor las dinámicas a la edad real de los alumnos, especialmente en los primeros cursos."
    ],
    climaDocente: "Aprecio personal sincero hacia su persona, contrarrestado por una fatiga colectiva ante el exceso de actividades y la sobrecarga en tutorías."
  },

  administrador: {
    roleKey: "administrador",
    roleTitle: "Administrador del Centro",
    globalScore: 4.55,
    sampleCount: 46,
    percentFives: 68.6,
    diagnosticoGeneral: "Muy alta satisfacción del claustro con la gestión práctica, agilidad en reparaciones y evolución positiva en el trato personal. Se percibe un cambio sustancial a mejor en el centro gracias a una actitud servicial, resolutiva e incansable.",
    fortalezasClave: [
      "Ejemplo de servicio y laboriosidad franciscana: Reconocimiento unánime a su trabajo diario y disponibilidad permanente (4.91/5).",
      "Agilidad en reparaciones y mantenimiento: Resolución rápida de incidencias en aulas e instalaciones (4.76/5).",
      "Receptividad ante necesidades pedagógicas: Facilidad para gestionar materiales y mejoras en espacios docentes (4.62/5)."
    ],
    areasMejoraRetos: [
      "Seguridad y Plan de Evacuación: Necesidad urgente de actualizar y realizar simulacros formales de evacuación e incendios con docentes y alumnos (4.29/5).",
      "Visión estética y planificación a largo plazo: Superar la política de arreglos urgentes o parches temporales mediante un plan progresivo de renovación de aulas.",
      "Consulta activa de necesidades docentes: Mayor proactividad en preguntar periódicamente a los profesores sobre sus carencias materiales de aula."
    ],
    climaDocente: "Gran reconocimiento colectivo, valoración de cambio a mejor y agradecimiento por su cercanía y resolución práctica."
  }
};

export function getCandidateSummary(roleKeyWithSubrole: string): CandidateSummary | null {
  return CANDIDATE_SUMMARIES[roleKeyWithSubrole] || null;
}
