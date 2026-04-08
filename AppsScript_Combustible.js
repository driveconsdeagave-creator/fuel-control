// ═══════════════════════════════════════════════════
// CONTROL DE COMBUSTIBLE — Google Apps Script
// ═══════════════════════════════════════════════════
// PASOS:
// 1. Abre Google Sheets → Extensiones → Apps Script
// 2. Borra todo y pega este código
// 3. Ejecuta "configurarHoja" (botón ▶ arriba)
// 4. Ve a Implementar → Nueva implementación
//    - Tipo: App web
//    - Ejecutar como: Yo
//    - Acceso: Cualquier persona
// 5. Copia la URL que te da
// ═══════════════════════════════════════════════════

// ── PARÁMETROS DE RENDIMIENTO ──
var PARAMS = {
  "1ton":    { min: 9,  max: 12, label: "Pickup 1 Ton",     unit: "km/L" },
  "3ton":    { min: 4,  max: 7,  label: "Pickup 3 Ton",     unit: "km/L" },
  "mini":    { min: 11, max: 15, label: "Mini Pickup",       unit: "km/L" },
  "chico":   { min: 3,  max: 6,  label: "Tractor Chico",    unit: "L/hr" },
  "mediano": { min: 8,  max: 14, label: "Tractor Mediano",  unit: "L/hr" },
  "grande":  { min: 10, max: 16, label: "Tractor Grande",   unit: "L/hr" }
};

// ══════════════════════════════════════
// CONFIGURAR HOJA (ejecutar 1 sola vez)
// ══════════════════════════════════════
function configurarHoja() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.rename("Control de Combustible");

  // ── Pestaña VEHICULOS ──
  var sheetV = ss.getSheetByName("Vehiculos") || ss.insertSheet("Vehiculos");
  sheetV.clear();
  var hV = ["Fecha","Hora","Núm Económico","Vehículo","Año","Categoría","Operador","Gasolinera","Combustible","Km Anterior","Km Actual","Km Recorridos","Litros","Precio/Litro","Costo Total","Rendimiento km/L","Costo/km","Rango Esperado","Estado","Latitud","Longitud","Google Maps"];
  sheetV.getRange(1,1,1,hV.length).setValues([hV]).setBackground("#b8860b").setFontColor("#fff").setFontWeight("bold").setFontSize(10);
  sheetV.setFrozenRows(1);
  sheetV.setColumnWidth(7,200);sheetV.setColumnWidth(8,150);sheetV.setColumnWidth(22,250);

  // ── Pestaña TRACTORES ──
  var sheetT = ss.getSheetByName("Tractores") || ss.insertSheet("Tractores");
  sheetT.clear();
  var hT = ["Fecha","Hora","Núm Económico","Tractor","HP","Categoría","Operador","Combustible","Hrs Anterior","Hrs Actual","Hrs Trabajadas","Litros","Precio/Litro","Costo Total","Consumo L/hr","Costo/hr","Rango Esperado","Estado","Latitud","Longitud","Google Maps"];
  sheetT.getRange(1,1,1,hT.length).setValues([hT]).setBackground("#5aaad4").setFontColor("#fff").setFontWeight("bold").setFontSize(10);
  sheetT.setFrozenRows(1);
  sheetT.setColumnWidth(7,200);sheetT.setColumnWidth(21,250);

  // ── Pestaña PARÁMETROS ──
  var sheetP = ss.getSheetByName("Parámetros") || ss.insertSheet("Parámetros");
  sheetP.clear();
  var dP = [
    ["Tipo","Categoría","Detalle","Mínimo","Máximo","Unidad"],
    ["Vehículo","Pickup 1 Ton","Hilux · NP300 · Mitsubishi",9,12,"km/L"],
    ["Vehículo","Pickup 3 Ton","Ford F350 · RAM 4000",4,7,"km/L"],
    ["Vehículo","Mini Pickup","RAM 700",11,15,"km/L"],
    ["Tractor","Tractor Chico","25-40 HP",3,6,"L/hr"],
    ["Tractor","Tractor Mediano","80-90 HP",8,14,"L/hr"],
    ["Tractor","Tractor Grande","105-110 HP",10,16,"L/hr"]
  ];
  sheetP.getRange(1,1,dP.length,6).setValues(dP);
  sheetP.getRange(1,1,1,6).setBackground("#6abf6a").setFontColor("#fff").setFontWeight("bold");
  sheetP.setFrozenRows(1);

  // ── Pestaña CATÁLOGO VEHÍCULOS ──
  var sheetCV = ss.getSheetByName("Catálogo Vehículos") || ss.insertSheet("Catálogo Vehículos");
  sheetCV.clear();
  var veh = [
    ["Núm Económico","Vehículo","Año","Categoría"],
    ["S/N","Nissan NP300",2017,"1ton"],["CAC-01","Ford F350",2014,"3ton"],
    ["CAC-02","Ford F350",2014,"3ton"],["CAC-03","Ford F350",2017,"3ton"],
    ["CAC-04","Ford F350",2019,"3ton"],["CAC-05","Ford F350",2019,"3ton"],
    ["CAC-06","Ford F350",2019,"3ton"],["CAC-07","Ford F350",2019,"3ton"],
    ["CAC-10","HILUX",2020,"1ton"],["CAC-11","HILUX",2020,"1ton"],
    ["CAC-12","Ford F350",2021,"3ton"],["CAC-13","RAM 4000",2021,"3ton"],
    ["CAC-14","HILUX",2021,"1ton"],["CAC-15","HILUX",2022,"1ton"],
    ["CAC-16","HILUX",2022,"1ton"],["CAC-17","Ford F350",2022,"3ton"],
    ["CAC-18","Ford F350",2022,"3ton"],["CAC-19","RAM 700",2023,"mini"],
    ["CAC-20","MITSUBISHI",2023,"1ton"],["CAC-22","RAM 700",2023,"mini"],
    ["CAC-24","HILUX",2023,"1ton"]
  ];
  sheetCV.getRange(1,1,veh.length,4).setValues(veh);
  sheetCV.getRange(1,1,1,4).setBackground("#e0a64a").setFontColor("#fff").setFontWeight("bold");
  sheetCV.setFrozenRows(1);

  // ── Pestaña CATÁLOGO TRACTORES ──
  var sheetCT = ss.getSheetByName("Catálogo Tractores") || ss.insertSheet("Catálogo Tractores");
  sheetCT.clear();
  var trac = [
    ["Núm Económico","Tractor","HP","Categoría"],
    ["CAT-01","New Holland TC35DA",90,"mediano"],["CAT-04","KUBOTA M8540",85,"mediano"],
    ["CAT-05","KUBOTA M8540",85,"mediano"],["CAT-07","New Holland 6610S",90,"mediano"],
    ["CAT-08","New Holland 6610S",90,"mediano"],["CAT-09","New Holland TD85F",80,"mediano"],
    ["CAT-10","NH Workmaster 40",40,"chico"],["CAT-13","NH Workmaster 40",40,"chico"],
    ["CAT-14","NH Workmaster 40",40,"chico"],["CAT-15","NH Workmaster 40",40,"chico"],
    ["CAT-16","NH Workmaster 40",40,"chico"],["CAT-017","New Holland 25hp",25,"chico"],
    ["CAT-19","New Holland 7610S",105,"grande"],["CAT-20","New Holland NH100",110,"grande"],
    ["CAT-21","New Holland 90HP",90,"mediano"]
  ];
  sheetCT.getRange(1,1,trac.length,4).setValues(trac);
  sheetCT.getRange(1,1,1,4).setBackground("#5aaad4").setFontColor("#fff").setFontWeight("bold");
  sheetCT.setFrozenRows(1);

  // Eliminar hoja default
  var def = ss.getSheetByName("Hoja 1") || ss.getSheetByName("Sheet1");
  if (def && ss.getSheets().length > 1) ss.deleteSheet(def);

  ss.setActiveSheet(sheetV);
  SpreadsheetApp.getUi().alert(
    "✅ ¡Configuración completa!\n\n" +
    "Pestañas creadas:\n" +
    "• Vehiculos\n• Tractores\n• Parámetros\n• Catálogo Vehículos\n• Catálogo Tractores\n\n" +
    "SIGUIENTE PASO:\n" +
    "Implementar → Nueva implementación → App web\n" +
    "Ejecutar como: Yo\n" +
    "Acceso: Cualquier persona\n" +
    "Copia la URL."
  );
}

// ══════════════════════════════════════
// HELPERS
// ══════════════════════════════════════
function getEstado(metric, cat, type) {
  var p = PARAMS[cat];
  if (!p || metric <= 0) return "—";
  if (type === "vehicle") {
    if (metric < p.min) return "⚠ BAJO";
    if (metric > p.max) return "⚠ ALTO";
  } else {
    if (metric > p.max) return "⚠ ALTO";
    if (metric < p.min) return "⚠ BAJO";
  }
  return "✅ Normal";
}

function getRango(cat) {
  var p = PARAMS[cat];
  return p ? (p.min + "–" + p.max + " " + p.unit) : "—";
}

function getLastReading(sheetName, colEco, colReading, ecoNum) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return null;
  var rows = sheet.getLastRow() - 1;
  var ecoData = sheet.getRange(2, colEco, rows, 1).getValues();
  var readingData = sheet.getRange(2, colReading, rows, 1).getValues();
  for (var i = ecoData.length - 1; i >= 0; i--) {
    if (String(ecoData[i][0]) === String(ecoNum)) return readingData[i][0];
  }
  return null;
}

function colorEstado(sheet, row, col, estado) {
  var cell = sheet.getRange(row, col);
  if (estado === "⚠ BAJO")     { cell.setBackground("#ffcccc").setFontColor("#cc0000"); }
  else if (estado === "⚠ ALTO") { cell.setBackground("#e8d5f5").setFontColor("#7b2cb8"); }
  else if (estado === "✅ Normal") { cell.setBackground("#ccffcc").setFontColor("#008800"); }
}

// ══════════════════════════════════════
// WEB APP — GET (último km/hr)
// ══════════════════════════════════════
function doGet(e) {
  var action = (e.parameter || {}).action || "";
  var result = {};

  if (action === "lastKm") {
    result = { success: true, lastKm: getLastReading("Vehiculos", 3, 11, e.parameter.eco) };
  } else if (action === "lastHr") {
    result = { success: true, lastHr: getLastReading("Tractores", 3, 10, e.parameter.eco) };
  } else {
    result = { success: true, message: "Control de Combustible API activa" };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ══════════════════════════════════════
// WEB APP — POST (guardar registro / OCR)
// ══════════════════════════════════════
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // ── OCR de ticket ──
    if (data.action === "ocr") {
      var ocrResult = ocrTicket(data.base64Image, data.mediaType || "image/jpeg");
      return ContentService.createTextOutput(JSON.stringify({
        success: !ocrResult.error, data: ocrResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ── Registro de VEHÍCULO ──
    if (data.type === "vehicle") {
      var sheet = ss.getSheetByName("Vehiculos");
      var cat = data.vehicleCat || "1ton";
      var isFirst = data.isFirstRecord;
      var kml = isFirst ? 0 : (data.kml || 0);
      var costKm = isFirst ? 0 : (data.costPerKm || 0);
      var estado = isFirst ? "1er registro" : getEstado(kml, cat, "vehicle");
      var mapsLink = data.geo ? "https://www.google.com/maps?q=" + data.geo.lat + "," + data.geo.lng : "";

      sheet.appendRow([
        data.date || "", data.time || "",
        data.ecoNum || "", data.vehicleName || "", data.vehicleYear || "", (PARAMS[cat] || {}).label || cat,
        data.operator || "", data.station || "", data.fuelType || "",
        data.kmPrev || 0, data.kmCurr || 0, isFirst ? "" : (data.kmDiff || 0),
        data.liters || 0, data.pricePerLiter || "", data.totalCost || 0,
        isFirst ? "1er registro" : (Math.round(kml * 100) / 100),
        isFirst ? "" : (Math.round(costKm * 100) / 100),
        getRango(cat), estado,
        (data.geo || {}).lat || "", (data.geo || {}).lng || "", mapsLink
      ]);
      colorEstado(sheet, sheet.getLastRow(), 19, estado);

      return ContentService.createTextOutput(JSON.stringify({
        success: true, message: "Vehículo registrado"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ── Registro de TRACTOR ──
    if (data.type === "tractor") {
      var sheet = ss.getSheetByName("Tractores");
      var cat = data.tractorCat || "mediano";
      var isFirst = data.isFirstRecord;
      var lph = isFirst ? 0 : (data.lph || 0);
      var costHr = isFirst ? 0 : (data.costPerHr || 0);
      var estado = isFirst ? "1er registro" : getEstado(lph, cat, "tractor");
      var mapsLink = data.geo ? "https://www.google.com/maps?q=" + data.geo.lat + "," + data.geo.lng : "";

      sheet.appendRow([
        data.date || "", data.time || "",
        data.ecoNum || "", data.tractorName || "", data.tractorHp || "", (PARAMS[cat] || {}).label || cat,
        data.operator || "", data.fuelType || "diesel",
        data.hrPrev || 0, data.hrCurr || 0, isFirst ? "" : (Math.round((data.hrDiff || 0) * 10) / 10),
        data.liters || 0, data.pricePerLiter || "", data.totalCost || 0,
        isFirst ? "1er registro" : (Math.round(lph * 100) / 100),
        isFirst ? "" : (Math.round(costHr * 100) / 100),
        getRango(cat), estado,
        (data.geo || {}).lat || "", (data.geo || {}).lng || "", mapsLink
      ]);
      colorEstado(sheet, sheet.getLastRow(), 18, estado);

      return ContentService.createTextOutput(JSON.stringify({
        success: true, message: "Tractor registrado"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: false, message: "Acción no reconocida"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false, message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ══════════════════════════════════════
// OCR — Lectura de tickets con Anthropic
// ══════════════════════════════════════
// Configurar API key:
// Archivo → Configuración del proyecto → Propiedades del script
// Clave: ANTHROPIC_API_KEY   Valor: sk-ant-XXXXXXX

function ocrTicket(base64Image, mediaType) {
  var apiKey = PropertiesService.getScriptProperties().getProperty("ANTHROPIC_API_KEY");
  if (!apiKey) return { error: "API key no configurada" };

  var response = UrlFetchApp.fetch("https://api.anthropic.com/v1/messages", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    payload: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64Image } },
          { type: "text", text: 'Analiza este ticket de gasolinera mexicana. Responde SOLO JSON puro:\n{"station":"nombre","liters":numero,"totalCost":numero,"pricePerLiter":numero,"date":"YYYY-MM-DD","time":"HH:MM","fuelType":"magna/premium/diesel"}\nCampo que no leas pon null. SOLO JSON.' }
        ]
      }]
    }),
    muteHttpExceptions: true
  });

  try {
    var result = JSON.parse(response.getContentText());
    var text = (result.content || []).map(function(c) { return c.text || ""; }).join("");
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (err) {
    return { error: "No se pudo leer el ticket" };
  }
}
