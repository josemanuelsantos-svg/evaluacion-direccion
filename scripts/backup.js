const https = require("https");
const fs = require("fs");
const path = require("path");

const backupDir = path.resolve(__dirname, "../backups/curso_2025_2026");
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = "";
      res.on("data", chunk => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

function convertValue(val) {
  if (!val) return null;
  if ("stringValue" in val) return val.stringValue;
  if ("integerValue" in val) return parseInt(val.integerValue, 10);
  if ("doubleValue" in val) return parseFloat(val.doubleValue);
  if ("booleanValue" in val) return val.booleanValue;
  if ("timestampValue" in val) return val.timestampValue;
  if ("nullValue" in val) return null;
  if ("mapValue" in val) {
    const res = {};
    const fields = val.mapValue.fields || {};
    for (const k in fields) {
      res[k] = convertValue(fields[k]);
    }
    return res;
  }
  if ("arrayValue" in val) {
    const values = val.arrayValue.values || [];
    return values.map(convertValue);
  }
  return val;
}

function cleanDoc(doc) {
  const res = { id: doc.name.split("/").pop() };
  const fields = doc.fields || {};
  for (const k in fields) {
    res[k] = convertValue(fields[k]);
  }
  return res;
}

async function run() {
  console.log("-> Descargando evaluaciones históricas de Firestore...");
  const evalsData = await fetchJson(
    "https://firestore.googleapis.com/v1/projects/evaluacion-direccion/databases/(default)/documents/evaluaciones_directivos?pageSize=500"
  );
  const rawDocs = evalsData.documents || [];
  console.log(`-> Obtenidas ${rawDocs.length} evaluaciones registradas.`);
  fs.writeFileSync(
    path.join(backupDir, "evaluaciones_raw.json"),
    JSON.stringify(rawDocs, null, 2)
  );

  const cleanDocs = rawDocs.map(cleanDoc);
  cleanDocs.sort((a, b) => (a.timestamp || "").localeCompare(b.timestamp || ""));
  fs.writeFileSync(
    path.join(backupDir, "evaluaciones_clean.json"),
    JSON.stringify(cleanDocs, null, 2)
  );

  console.log("-> Descargando configuración de encuestas de Firestore...");
  const configEncuestas = await fetchJson(
    "https://firestore.googleapis.com/v1/projects/evaluacion-direccion/databases/(default)/documents/configuracion/encuestas"
  );
  const cleanConfig = cleanDoc(configEncuestas);
  fs.writeFileSync(
    path.join(backupDir, "configuracion_encuestas.json"),
    JSON.stringify(cleanConfig, null, 2)
  );

  // Calcular estadísticas e informe consolidado por cargo
  const configData = cleanConfig.data || {};
  const roles = [
    { key: "director_general", title: "Director General", subRole: null },
    {
      key: "director_pedagogico",
      title: "Director Pedagógico (Infantil y Primaria)",
      subRole: "infantil_primaria"
    },
    {
      key: "director_pedagogico",
      title: "Director Pedagógico (Secundaria y Bachillerato)",
      subRole: "secundaria_bachillerato"
    },
    { key: "coordinador_pastoral", title: "Coordinadora de Pastoral", subRole: null },
    { key: "administrador", title: "Administrador del Centro", subRole: null }
  ];

  const fullReport = {
    generatedAt: new Date().toISOString(),
    totalEvaluations: cleanDocs.length,
    period: "Curso 2025-2026 (Marzo - Abril 2026)",
    rolesSummary: {}
  };

  roles.forEach(r => {
    const roleKey = r.key;
    const sub = r.subRole;
    const evals = cleanDocs.filter(
      e => e.roleEvaluated === roleKey && (sub ? e.subRoleEvaluated === sub : true)
    );
    const roleConfig = configData[roleKey];

    let totalScoreSum = 0;
    let totalValidAnswers = 0;
    const scoreDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const sectionAverages = [];

    if (roleConfig && roleConfig.sections) {
      roleConfig.sections.forEach(sec => {
        let secSum = 0;
        let secValid = 0;
        (sec.questions || []).forEach(q => {
          evals.forEach(e => {
            const v = e.answers ? e.answers[q.id] : undefined;
            if (v && v > 0) {
              secSum += v;
              secValid++;
              totalScoreSum += v;
              totalValidAnswers++;
              scoreDistribution[v] = (scoreDistribution[v] || 0) + 1;
            }
          });
        });
        sectionAverages.push({
          category: sec.category,
          average: secValid > 0 ? parseFloat((secSum / secValid).toFixed(2)) : 0,
          sampleCount: secValid
        });
      });
    }

    const comments = evals
      .filter(e => e.comments && e.comments.trim().length > 0)
      .map(e => ({
        date: e.timestamp,
        comment: e.comments.trim()
      }));

    const globalAvg =
      totalValidAnswers > 0
        ? parseFloat((totalScoreSum / totalValidAnswers).toFixed(2))
        : 0;
    const reportKey = sub ? `${roleKey}_${sub}` : roleKey;

    let diagnostico = "N/A";
    if (globalAvg >= 4.2) diagnostico = "Excelencia / Liderazgo Sólido";
    else if (globalAvg >= 3.5) diagnostico = "Aceptable / Margen de mejora";
    else if (globalAvg > 0) diagnostico = "Riesgo Institucional / Atención Urgente";

    fullReport.rolesSummary[reportKey] = {
      title: r.title,
      totalResponses: evals.length,
      globalAverage: globalAvg,
      diagnostico: diagnostico,
      sectionAverages: sectionAverages,
      scoreDistribution: scoreDistribution,
      commentsCount: comments.length,
      comments: comments
    };
  });

  fs.writeFileSync(
    path.join(backupDir, "informe_consolidado_curso_2025_2026.json"),
    JSON.stringify(fullReport, null, 2)
  );

  // CSV
  let csv = "ID,Fecha,Cargo,Subrol,Media_Evaluacion,Comentarios\n";
  cleanDocs.forEach(e => {
    let sum = 0,
      count = 0;
    if (e.answers) {
      Object.values(e.answers).forEach(v => {
        if (v > 0) {
          sum += v;
          count++;
        }
      });
    }
    const avg = count > 0 ? (sum / count).toFixed(2) : "0";
    const comment = e.comments ? `"${e.comments.replace(/"/g, '""').replace(/\r?\n|\r/g, " ")}"` : "";
    csv += `"${e.id}","${e.timestamp || ""}","${e.roleEvaluated || ""}","${e.subRoleEvaluated || ""}",${avg},${comment}\n`;
  });
  fs.writeFileSync(path.join(backupDir, "evaluaciones_curso_2025_2026.csv"), csv);

  console.log("¡Copia de seguridad y cálculo de informes finalizado con éxito en:", backupDir);
}

run().catch(console.error);
