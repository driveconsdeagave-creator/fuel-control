// ═══════════════════════════════════════════════════
// CONTROL DE COMBUSTIBLE — PWA (Vanilla JS)
// ═══════════════════════════════════════════════════

// ── CONFIGURACION ──
// >>> ACTUALIZA ESTA URL despues de re-desplegar el Apps Script v2 <<<
var API = "https://script.google.com/macros/s/AKfycbyMrV0iE4f45VtmBX-w32gS8XNDC0F_T7NDfngCIxOOJiEkRJRN4kporHZzDbFpsXT-/exec";

// ── CATALOGOS ──
var VEHICLES = [
  { id: "SN", eco: "S/N", name: "Nissan NP300", year: 2017, cat: "1ton" },
  { id: "CAC-01", eco: "CAC-01", name: "Ford F350", year: 2014, cat: "3ton" },
  { id: "CAC-02", eco: "CAC-02", name: "Ford F350", year: 2014, cat: "3ton" },
  { id: "CAC-03", eco: "CAC-03", name: "Ford F350", year: 2017, cat: "3ton" },
  { id: "CAC-04", eco: "CAC-04", name: "Ford F350", year: 2019, cat: "3ton" },
  { id: "CAC-05", eco: "CAC-05", name: "Ford F350", year: 2019, cat: "3ton" },
  { id: "CAC-06", eco: "CAC-06", name: "Ford F350", year: 2019, cat: "3ton" },
  { id: "CAC-07", eco: "CAC-07", name: "Ford F350", year: 2019, cat: "3ton" },
  { id: "CAC-10", eco: "CAC-10", name: "HILUX", year: 2020, cat: "1ton" },
  { id: "CAC-11", eco: "CAC-11", name: "HILUX", year: 2020, cat: "1ton" },
  { id: "CAC-12", eco: "CAC-12", name: "Ford F350", year: 2021, cat: "3ton" },
  { id: "CAC-13", eco: "CAC-13", name: "RAM 4000", year: 2021, cat: "3ton" },
  { id: "CAC-14", eco: "CAC-14", name: "HILUX", year: 2021, cat: "1ton" },
  { id: "CAC-15", eco: "CAC-15", name: "HILUX", year: 2022, cat: "1ton" },
  { id: "CAC-16", eco: "CAC-16", name: "HILUX", year: 2022, cat: "1ton" },
  { id: "CAC-17", eco: "CAC-17", name: "Ford F350", year: 2022, cat: "3ton" },
  { id: "CAC-18", eco: "CAC-18", name: "Ford F350", year: 2022, cat: "3ton" },
  { id: "CAC-19", eco: "CAC-19", name: "RAM 700", year: 2023, cat: "mini" },
  { id: "CAC-20", eco: "CAC-20", name: "MITSUBISHI", year: 2023, cat: "1ton" },
  { id: "CAC-22", eco: "CAC-22", name: "RAM 700", year: 2023, cat: "mini" },
  { id: "CAC-24", eco: "CAC-24", name: "HILUX", year: 2023, cat: "1ton" }
];

var TRACTORS = [
  { id: "CAT-01", eco: "CAT-01", name: "New Holland TC35DA", hp: 90, cat: "mediano" },
  { id: "CAT-04", eco: "CAT-04", name: "KUBOTA M8540", hp: 85, cat: "mediano" },
  { id: "CAT-05", eco: "CAT-05", name: "KUBOTA M8540", hp: 85, cat: "mediano" },
  { id: "CAT-07", eco: "CAT-07", name: "New Holland 6610S", hp: 90, cat: "mediano" },
  { id: "CAT-08", eco: "CAT-08", name: "New Holland 6610S", hp: 90, cat: "mediano" },
  { id: "CAT-09", eco: "CAT-09", name: "New Holland TD85F", hp: 80, cat: "mediano" },
  { id: "CAT-10", eco: "CAT-10", name: "NH Workmaster 40", hp: 40, cat: "chico" },
  { id: "CAT-13", eco: "CAT-13", name: "NH Workmaster 40", hp: 40, cat: "chico" },
  { id: "CAT-14", eco: "CAT-14", name: "NH Workmaster 40", hp: 40, cat: "chico" },
  { id: "CAT-15", eco: "CAT-15", name: "NH Workmaster 40", hp: 40, cat: "chico" },
  { id: "CAT-16", eco: "CAT-16", name: "NH Workmaster 40", hp: 40, cat: "chico" },
  { id: "CAT-017", eco: "CAT-017", name: "New Holland 25hp", hp: 25, cat: "chico" },
  { id: "CAT-19", eco: "CAT-19", name: "New Holland 7610S", hp: 105, cat: "grande" },
  { id: "CAT-20", eco: "CAT-20", name: "New Holland NH100", hp: 110, cat: "grande" },
  { id: "CAT-21", eco: "CAT-21", name: "New Holland 90HP", hp: 90, cat: "mediano" }
];

var V_OPS = ["BALTAZAR PALOS","MARIO ZUNIGA AGUILERA","EMANUEL RUBIO DELGADO","ALBERTO PARTIDA","JORGE LOPEZ CARRANZA","ULISES GARCIA","TOMAS CASTANEDA","ALEJANDRO RAMIREZ","DAVIEL AUGUSTO GONZALEZ RIVERA","MARCOS SANCHEZ RUVALCABA","MANUEL GUTIERREZ TAMAYO","JORGE RODRIGUEZ LOPEZ","JESUCRISTIAN GUZMAN","FRANCISCO VANEGAS"];

var T_OPS = ["RAYMUNDO RINCON","HOMERO GALLEGOS","SALVADOR CORREA","JOSE ALFREDO ROSALES","BALTAZAR PALOS","LUIS ANGEL VARELA PERALES","LUIS ANTONIO VEGA PALACIOS"];

var PIN = "2835";

// ── STATE ──
var vState = { kmPrev: null, loadingKm: false, isFirst: false, ticketData: null, geo: null };
var tState = { hrPrev: null, loadingHr: false, isFirst: false, geo: null };
var QUEUE_KEY = "fuel_pending_queue";

// ═══════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════
function $(id) { return document.getElementById(id); }
function show(el) { if (typeof el === "string") el = $(el); if (el) el.classList.remove("hidden"); }
function hide(el) { if (typeof el === "string") el = $(el); if (el) el.classList.add("hidden"); }
function todayStr() { return new Date().toISOString().split("T")[0]; }
function nowTime() { var d = new Date(); return d.getHours().toString().padStart(2,"0") + ":" + d.getMinutes().toString().padStart(2,"0"); }
function fmt$(n) { return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n); }
function fN(n, d) { return Number(n).toFixed(d === undefined ? 2 : d); }

function getGeo() {
  return new Promise(function(resolve) {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      function(pos) { resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }); },
      function() { resolve(null); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

// ═══════════════════════════════════════
// OFFLINE QUEUE — guarda sin internet, sube cuando vuelve
// ═══════════════════════════════════════
function getQueue() {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY)) || []; }
  catch(e) { return []; }
}

function saveQueue(q) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
  updateQueueBadge();
}

function addToQueue(data) {
  var q = getQueue();
  q.push({ data: data, ts: Date.now() });
  saveQueue(q);
}

function updateQueueBadge() {
  var q = getQueue();
  var badge = $("queue-badge");
  if (!badge) return;
  if (q.length > 0) {
    badge.textContent = q.length + " pendiente" + (q.length > 1 ? "s" : "");
    show(badge);
  } else {
    hide(badge);
  }
}

function updateOnlineStatus() {
  var dot = $("status-dot");
  if (!dot) return;
  if (navigator.onLine) {
    dot.className = "status-dot online";
    dot.title = "Conectado";
  } else {
    dot.className = "status-dot offline";
    dot.title = "Sin internet";
  }
}

function syncQueue() {
  var q = getQueue();
  if (q.length === 0 || !navigator.onLine) return;

  var item = q[0];
  var payload = encodeURIComponent(JSON.stringify(item.data));
  var url = API + "?action=save&payload=" + payload;

  fetch(url, { redirect: "follow" })
    .then(function(r) { return r.json(); })
    .then(function(r) {
      if (r && r.success) {
        q.shift();
        saveQueue(q);
        if (q.length > 0) setTimeout(syncQueue, 1000); // sync next
      }
    })
    .catch(function() { /* retry later */ });
}

// ═══════════════════════════════════════
// API — GET para reads y saves, Form POST para OCR
// ═══════════════════════════════════════
function apiGet(params) {
  var url = API + "?" + new URLSearchParams(params).toString();
  return fetch(url, { redirect: "follow" })
    .then(function(r) { return r.json(); })
    .catch(function(e) { console.error("apiGet error:", e); return null; });
}

function apiSave(data) {
  // If offline, queue for later
  if (!navigator.onLine) {
    addToQueue(data);
    return Promise.resolve({ success: true, queued: true });
  }

  var payload = encodeURIComponent(JSON.stringify(data));
  var url = API + "?action=save&payload=" + payload;
  return fetch(url, { redirect: "follow" })
    .then(function(r) { return r.json(); })
    .catch(function(e) {
      // Network error — queue it
      console.error("apiSave error, queuing:", e);
      addToQueue(data);
      return { success: true, queued: true };
    });
}

// OCR: Call Gemini API directly from browser (supports CORS, no GAS needed)
var GEMINI_KEY = ""; // se carga de GAS al inicio
var GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

function apiOcr(base64, mediaType) {
  if (!GEMINI_KEY) {
    return Promise.resolve({ success: false, message: "API key no cargada. Recarga la app." });
  }

  return fetch(GEMINI_URL + "?key=" + GEMINI_KEY, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [
          { inlineData: { mimeType: mediaType, data: base64 } },
          { text: 'Analiza este ticket de gasolinera mexicana. Responde SOLO JSON puro sin markdown:\n{"station":"nombre","liters":numero,"totalCost":numero,"pricePerLiter":numero,"date":"YYYY-MM-DD","time":"HH:MM","fuelType":"magna/premium/diesel"}\nCampo que no leas pon null. SOLO el JSON, nada mas.' }
        ]
      }]
    })
  })
  .then(function(r) { return r.json(); })
  .then(function(r) {
    if (r.error) {
      return { success: false, message: "Gemini: " + (r.error.message || JSON.stringify(r.error)).substring(0, 200) };
    }
    try {
      var text = r.candidates[0].content.parts[0].text || "";
      var data = JSON.parse(text.replace(/```json|```/g, "").trim());
      return { success: true, data: data };
    } catch(e) {
      return { success: false, message: "No se pudo leer el ticket" };
    }
  })
  .catch(function(e) {
    return { success: false, message: "Error de red: " + e.toString() };
  });
}

// Load Gemini key from GAS on startup
function loadGeminiKey() {
  fetch(API + "?action=geminiKey", { redirect: "follow" })
    .then(function(r) { return r.json(); })
    .then(function(r) { if (r && r.key) GEMINI_KEY = r.key; })
    .catch(function() {});
}

// ═══════════════════════════════════════
// SCREEN NAVIGATION
// ═══════════════════════════════════════
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(function(s) { s.classList.remove("active"); });
  $(id).classList.add("active");
  window.scrollTo(0, 0);
}

function goHome() {
  showScreen("screen-role");
  resetVehicleForm();
  resetTractorForm();
  hidePinDialog();
}

function selectRole(role) {
  if (role === "vehicle") { showScreen("screen-vehicle"); getGeo().then(function(g) { vState.geo = g; updateVehicleGeo(); }); }
  else if (role === "tractor") { showScreen("screen-tractor"); getGeo().then(function(g) { tState.geo = g; updateTractorGeo(); }); }
  else if (role === "admin") { showScreen("screen-admin"); }
}

// ═══════════════════════════════════════
// PIN DIALOG
// ═══════════════════════════════════════
function showPinDialog() {
  hide("screen-role"); // hide role buttons conceptually
  show("pin-dialog");
  $("pin-input").value = "";
  $("pin-input").focus();
  hide("pin-error");
  // Hide role buttons
  document.querySelector(".role-buttons").classList.add("hidden");
}

function hidePinDialog() {
  hide("pin-dialog");
  $("pin-input").value = "";
  hide("pin-error");
  document.querySelector(".role-buttons").classList.remove("hidden");
}

function tryPin() {
  if ($("pin-input").value === PIN) {
    hidePinDialog();
    selectRole("admin");
  } else {
    show("pin-error");
    $("pin-input").classList.add("error");
    $("pin-input").value = "";
    setTimeout(function() { hide("pin-error"); $("pin-input").classList.remove("error"); }, 1500);
  }
}

// ═══════════════════════════════════════
// VEHICLE OPERATOR
// ═══════════════════════════════════════
function resetVehicleForm() {
  $("v-operator").value = "";
  $("v-vehicle").value = "";
  $("v-km").value = "";
  hide("v-step2"); hide("v-step3");
  hide("v-photo-preview"); show("v-photo-empty");
  hide("v-continue-btn");
  hide("v-manual-fields");
  $("v-photo-area").classList.remove("has-photo");
  $("v-file").value = "";
  vState = { kmPrev: null, loadingKm: false, isFirst: false, ticketData: null, geo: null };
  $("v-save-btn").disabled = true;
  $("v-save-btn").textContent = "Completa todos los pasos";
  hide("v-km-loading"); hide("v-km-prev-box"); hide("v-km-first"); hide("v-km-error"); hide("v-geo");
}

function vehicleStep1Check() {
  if ($("v-operator").value && $("v-vehicle").value) {
    show("v-step2");
  }
}

function onVehicleChange() {
  var vid = $("v-vehicle").value;
  vehicleStep1Check();
  if (!vid) { vState.kmPrev = null; vState.isFirst = false; return; }
  var v = VEHICLES.find(function(x) { return x.id === vid; });
  if (!v) return;

  // Fetch last km
  vState.loadingKm = true;
  show("v-km-loading"); hide("v-km-prev-box"); hide("v-km-first");
  apiGet({ action: "lastKm", eco: v.eco }).then(function(r) {
    vState.loadingKm = false;
    hide("v-km-loading");
    if (r && r.lastKm !== null && r.lastKm !== undefined) {
      vState.kmPrev = Number(r.lastKm);
      vState.isFirst = false;
      $("v-km-prev-val").textContent = fN(vState.kmPrev, 0) + " km";
      show("v-km-prev-box"); hide("v-km-first");
    } else {
      vState.kmPrev = null;
      vState.isFirst = true;
      hide("v-km-prev-box"); show("v-km-first");
    }
  });
}

function handleVehiclePhoto(input) {
  var file = input.files && input.files[0];
  if (!file) return;

  var reader = new FileReader();
  reader.onload = function(ev) {
    var dataUrl = ev.target.result;
    // Show preview
    $("v-preview-img").src = dataUrl;
    hide("v-photo-empty"); show("v-photo-preview");
    $("v-photo-area").classList.add("has-photo");

    // Show scanning state
    $("v-scan-status").className = "scan-status scan-scanning";
    $("v-scan-status").innerHTML = '<div class="scan-title">Leyendo ticket...</div><div class="scan-bar"><div class="scan-bar-fill"></div></div>';

    // Compress and send to OCR in a single request
    compressImage(dataUrl, 800, 0.5, function(compressedB64, compressedType) {
      apiOcr(compressedB64, compressedType).then(function(r) {
        if (r && r.success && r.data) {
          vState.ticketData = r.data;
          $("v-scan-status").className = "scan-status scan-ok";
          var html = '<div class="scan-title">Ticket leido</div><div class="scan-data">';
          if (r.data.station) html += r.data.station + "<br>";
          html += (r.data.liters || "?") + " L<br>";
          html += '<span class="scan-cost">$' + (r.data.totalCost || "?") + "</span>";
          html += "</div>";
          $("v-scan-status").innerHTML = html;
          show("v-continue-btn");
        } else {
          $("v-scan-status").className = "scan-status";
          var errMsg = "Error desconocido";
          if (r) {
            if (r.message) errMsg = r.message;
            else if (r.data && r.data.error) errMsg = r.data.error;
            else errMsg = JSON.stringify(r).substring(0, 200);
          }
          $("v-scan-status").innerHTML = '<div class="scan-error">' + errMsg + '</div><div style="font-size:11px;color:#8a8078;margin-top:6px">Usa entrada manual abajo</div>';
          show("v-manual-btn");
        }
      }).catch(function(e) {
        $("v-scan-status").className = "scan-status";
        $("v-scan-status").innerHTML = '<div class="scan-error">Error: ' + e.toString() + '</div>';
        show("v-manual-btn");
      });
    });
  };
  reader.readAsDataURL(file);
}

function toggleManualEntry() {
  var fields = $("v-manual-fields");
  if (fields.classList.contains("hidden")) { show(fields); } else { hide(fields); }
}

function applyManualVehicle() {
  var liters = parseFloat($("v-liters").value);
  var price = parseFloat($("v-price").value);
  var total = parseFloat($("v-total").value);
  var station = $("v-station").value;
  var fuelType = $("v-fuelType").value;

  if (!liters || liters <= 0) { alert("Ingresa los litros"); return; }
  if (!total && (!price || price <= 0)) { alert("Ingresa precio o total"); return; }

  if (!total && price > 0) total = liters * price;
  if (!price && total > 0) price = total / liters;

  vState.ticketData = {
    station: station || "Manual",
    liters: liters,
    totalCost: total,
    pricePerLiter: price,
    date: todayStr(),
    time: nowTime(),
    fuelType: fuelType
  };

  // Update photo area to show manual data
  hide("v-photo-empty"); show("v-photo-preview");
  $("v-preview-img").src = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="70" height="90" fill="%238a8078"><rect width="70" height="90" rx="8" fill="%231a1714"/><text x="35" y="50" text-anchor="middle" font-size="30">&#9981;</text></svg>');
  $("v-scan-status").className = "scan-status scan-ok";
  $("v-scan-status").innerHTML = '<div class="scan-title">Datos manuales</div><div class="scan-data">' + station + "<br>" + liters + ' L<br><span class="scan-cost">' + fmt$(total) + "</span></div>";

  show("v-continue-btn");
  hide("v-manual-fields");
}

function vehicleGoStep3() {
  show("v-step3");
  // Re-trigger km fetch if needed
  if (!vState.loadingKm && !vState.isFirst && vState.kmPrev === null) {
    onVehicleChange();
  }
  updateVehicleGeo();
}

function vehicleValidateKm() {
  var km = Number($("v-km").value);
  hide("v-km-error");
  if (vState.kmPrev !== null && km > 0 && km <= vState.kmPrev) {
    $("v-km-error").textContent = "Debe ser mayor a " + fN(vState.kmPrev, 0);
    show("v-km-error");
  }
  updateVehicleSaveBtn();
}

function updateVehicleSaveBtn() {
  var op = $("v-operator").value;
  var vid = $("v-vehicle").value;
  var km = Number($("v-km").value);
  var td = vState.ticketData;
  var kmPrev = vState.kmPrev;
  var isFirst = vState.isFirst;
  var kmDiff = kmPrev !== null ? km - kmPrev : null;

  var ok = op && vid && km > 0 && td && td.liters > 0 && td.totalCost > 0 && (isFirst || (kmDiff !== null && kmDiff > 0));
  $("v-save-btn").disabled = !ok;
  $("v-save-btn").textContent = ok ? "Guardar" : "Completa todos los pasos";
}

function updateVehicleGeo() {
  if (vState.geo) {
    $("v-geo").textContent = "Ubicacion: " + vState.geo.lat.toFixed(4) + ", " + vState.geo.lng.toFixed(4);
    show("v-geo");
  }
}

function saveVehicle() {
  if ($("v-save-btn").disabled) return;
  var vid = $("v-vehicle").value;
  var v = VEHICLES.find(function(x) { return x.id === vid; });
  var km = Number($("v-km").value);
  var td = vState.ticketData;
  var kmPrev = vState.kmPrev || 0;
  var kmDiff = vState.isFirst ? 0 : (km - kmPrev);
  var kml = kmDiff > 0 ? kmDiff / td.liters : 0;
  var costKm = kmDiff > 0 ? td.totalCost / kmDiff : 0;

  var data = {
    type: "vehicle",
    date: td.date || todayStr(),
    time: td.time || nowTime(),
    ecoNum: v.eco,
    vehicleName: v.name,
    vehicleYear: v.year,
    vehicleCat: v.cat,
    operator: $("v-operator").value,
    station: td.station || "",
    fuelType: td.fuelType || "",
    kmPrev: kmPrev,
    kmCurr: km,
    kmDiff: kmDiff,
    liters: td.liters,
    pricePerLiter: td.pricePerLiter || 0,
    totalCost: td.totalCost,
    kml: kml,
    costPerKm: costKm,
    isFirstRecord: !!vState.isFirst,
    geo: vState.geo
  };

  showSaving();
  apiSave(data).then(function(r) {
    hideSaving();
    if (r && r.success) {
      showSuccess("vehicle", r.queued);
    } else {
      alert("Error al guardar: " + (r ? r.message : "Sin respuesta del servidor"));
    }
  });
}

// ═══════════════════════════════════════
// TRACTOR OPERATOR
// ═══════════════════════════════════════
function resetTractorForm() {
  $("t-operator").value = "";
  $("t-tractor").value = "";
  $("t-liters").value = "";
  $("t-price").value = "";
  $("t-hr").value = "";
  hide("t-step2"); hide("t-total-box"); hide("t-stats");
  hide("t-hr-loading"); hide("t-hr-prev-box"); hide("t-hr-first"); hide("t-hr-error"); hide("t-geo");
  tState = { hrPrev: null, loadingHr: false, isFirst: false, geo: null };
  $("t-save-btn").disabled = true;
  $("t-save-btn").textContent = "Completa todos los campos";
}

function tractorStep1Check() {
  if ($("t-operator").value && $("t-tractor").value) {
    show("t-step2");
  }
}

function onTractorChange() {
  var tid = $("t-tractor").value;
  tractorStep1Check();
  if (!tid) { tState.hrPrev = null; tState.isFirst = false; return; }
  var t = TRACTORS.find(function(x) { return x.id === tid; });
  if (!t) return;

  tState.loadingHr = true;
  show("t-hr-loading"); hide("t-hr-prev-box"); hide("t-hr-first");
  apiGet({ action: "lastHr", eco: t.eco }).then(function(r) {
    tState.loadingHr = false;
    hide("t-hr-loading");
    if (r && r.lastHr !== null && r.lastHr !== undefined) {
      tState.hrPrev = Number(r.lastHr);
      tState.isFirst = false;
      $("t-hr-prev-val").textContent = fN(tState.hrPrev, 1) + " hrs";
      show("t-hr-prev-box"); hide("t-hr-first");
    } else {
      tState.hrPrev = null;
      tState.isFirst = true;
      hide("t-hr-prev-box"); show("t-hr-first");
    }
  });
}

function tractorCalcTotal() {
  var liters = parseFloat($("t-liters").value) || 0;
  var price = parseFloat($("t-price").value) || 0;
  var total = liters * price;
  if (total > 0) {
    $("t-total-val").textContent = fmt$(total);
    show("t-total-box");
  } else {
    hide("t-total-box");
  }
  tractorValidateHr();
}

function tractorValidateHr() {
  var hr = parseFloat($("t-hr").value) || 0;
  var liters = parseFloat($("t-liters").value) || 0;
  var price = parseFloat($("t-price").value) || 0;
  var total = liters * price;
  hide("t-hr-error");

  if (tState.hrPrev !== null && hr > 0 && hr <= tState.hrPrev) {
    $("t-hr-error").textContent = "Debe ser mayor a " + fN(tState.hrPrev, 1) + " hrs";
    show("t-hr-error");
  }

  var hrDiff = tState.hrPrev !== null ? hr - tState.hrPrev : null;
  if (hrDiff > 0 && liters > 0) {
    $("t-stat-hrs").textContent = fN(hrDiff, 1);
    $("t-stat-lph").textContent = fN(liters / hrDiff) + " L/hr";
    $("t-stat-costhr").textContent = total > 0 ? fmt$(total / hrDiff) : "—";
    show("t-stats");
  } else {
    hide("t-stats");
  }

  updateTractorSaveBtn();
}

function updateTractorSaveBtn() {
  var op = $("t-operator").value;
  var tid = $("t-tractor").value;
  var hr = parseFloat($("t-hr").value) || 0;
  var liters = parseFloat($("t-liters").value) || 0;
  var price = parseFloat($("t-price").value) || 0;
  var hrDiff = tState.hrPrev !== null ? hr - tState.hrPrev : null;

  var ok = op && tid && hr > 0 && liters > 0 && price > 0 && (tState.isFirst || (hrDiff !== null && hrDiff > 0));
  $("t-save-btn").disabled = !ok;
  $("t-save-btn").textContent = ok ? "Guardar Registro" : "Completa todos los campos";
}

function updateTractorGeo() {
  if (tState.geo) {
    $("t-geo").textContent = "Ubicacion: " + tState.geo.lat.toFixed(4) + ", " + tState.geo.lng.toFixed(4);
    show("t-geo");
  }
}

function saveTractor() {
  if ($("t-save-btn").disabled) return;
  var tid = $("t-tractor").value;
  var t = TRACTORS.find(function(x) { return x.id === tid; });
  var liters = parseFloat($("t-liters").value);
  var price = parseFloat($("t-price").value);
  var totalCost = liters * price;
  var hr = parseFloat($("t-hr").value);
  var hrPrev = tState.hrPrev || 0;
  var hrDiff = tState.isFirst ? 0 : (hr - hrPrev);
  var lph = hrDiff > 0 ? liters / hrDiff : 0;
  var costHr = hrDiff > 0 ? totalCost / hrDiff : 0;

  var data = {
    type: "tractor",
    date: todayStr(),
    time: nowTime(),
    ecoNum: t.eco,
    tractorName: t.name,
    tractorHp: t.hp,
    tractorCat: t.cat,
    operator: $("t-operator").value,
    fuelType: "diesel",
    hrPrev: hrPrev,
    hrCurr: hr,
    hrDiff: hrDiff,
    liters: liters,
    pricePerLiter: price,
    totalCost: totalCost,
    lph: lph,
    costPerHr: costHr,
    isFirstRecord: !!tState.isFirst,
    geo: tState.geo
  };

  showSaving();
  apiSave(data).then(function(r) {
    hideSaving();
    if (r && r.success) {
      showSuccess("tractor", r.queued);
    } else {
      alert("Error al guardar: " + (r ? r.message : "Sin respuesta del servidor"));
    }
  });
}

// ═══════════════════════════════════════
// SUCCESS SCREEN
// ═══════════════════════════════════════
function showSuccess(type, wasQueued) {
  showScreen("screen-success");
  if (wasQueued) {
    $("screen-success").querySelector(".success-title").textContent = "Guardado en cola!";
    $("screen-success").querySelector(".success-desc").textContent = "Se subira automaticamente cuando haya internet";
  } else {
    $("screen-success").querySelector(".success-title").textContent = "Registro guardado!";
    $("screen-success").querySelector(".success-desc").textContent = "Los datos ya estan en Google Sheets";
  }
  $("success-new-btn").onclick = function() {
    if (type === "vehicle") {
      resetVehicleForm();
      showScreen("screen-vehicle");
      getGeo().then(function(g) { vState.geo = g; updateVehicleGeo(); });
    } else {
      resetTractorForm();
      showScreen("screen-tractor");
      getGeo().then(function(g) { tState.geo = g; updateTractorGeo(); });
    }
  };
}

// ═══════════════════════════════════════
// SAVING OVERLAY
// ═══════════════════════════════════════
function showSaving() {
  var ov = document.createElement("div");
  ov.id = "saving-overlay";
  ov.className = "saving-overlay";
  ov.innerHTML = '<div class="saving-spinner"></div>';
  document.body.appendChild(ov);
}

function hideSaving() {
  var ov = $("saving-overlay");
  if (ov) ov.remove();
}

// ═══════════════════════════════════════
// IMAGE COMPRESSION (for OCR via GET)
// ═══════════════════════════════════════
function compressImage(dataUrl, maxDim, quality, callback) {
  var img = new Image();
  img.onload = function() {
    var w = img.width, h = img.height;
    if (w > maxDim || h > maxDim) {
      if (w > h) { h = Math.round(h * maxDim / w); w = maxDim; }
      else { w = Math.round(w * maxDim / h); h = maxDim; }
    }
    var canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    canvas.getContext("2d").drawImage(img, 0, 0, w, h);
    var compressed = canvas.toDataURL("image/jpeg", quality);
    var b64 = compressed.split(",")[1];
    callback(b64, "image/jpeg");
  };
  img.src = dataUrl;
}

// ═══════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════
function populateSelects() {
  // Vehicle operators
  var vOp = $("v-operator");
  V_OPS.forEach(function(name) {
    var opt = document.createElement("option");
    opt.value = name; opt.textContent = name;
    vOp.appendChild(opt);
  });

  // Vehicles
  var vSel = $("v-vehicle");
  VEHICLES.forEach(function(v) {
    var opt = document.createElement("option");
    opt.value = v.id; opt.textContent = v.eco + " \u2014 " + v.name + " (" + v.year + ")";
    vSel.appendChild(opt);
  });

  // Tractor operators
  var tOp = $("t-operator");
  T_OPS.forEach(function(name) {
    var opt = document.createElement("option");
    opt.value = name; opt.textContent = name;
    tOp.appendChild(opt);
  });

  // Tractors
  var tSel = $("t-tractor");
  TRACTORS.forEach(function(t) {
    var opt = document.createElement("option");
    opt.value = t.id; opt.textContent = t.eco + " \u2014 " + t.name + " (" + t.hp + " HP)";
    tSel.appendChild(opt);
  });
}

// Register service worker
function registerSW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(function(e) { console.log("SW registration failed:", e); });
  }
}

// Init
document.addEventListener("DOMContentLoaded", function() {
  populateSelects();
  registerSW();
  loadGeminiKey();
  showScreen("screen-role");

  // Offline/Online handling
  updateOnlineStatus();
  updateQueueBadge();
  window.addEventListener("online", function() {
    updateOnlineStatus();
    syncQueue();
  });
  window.addEventListener("offline", function() {
    updateOnlineStatus();
  });

  // Sync any pending items on load
  if (navigator.onLine) syncQueue();
});
