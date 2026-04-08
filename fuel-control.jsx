import { useState, useEffect, useRef } from "react";

const API = "https://script.google.com/macros/s/AKfycbxBiR3kIB0yN0-0DEJFqrfF__P2zgl3EACeYG2BnIy12P0vBr5YhK96RIx6mcppaPqs/exec";

const VEHICLES = [
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
  { id: "CAC-24", eco: "CAC-24", name: "HILUX", year: 2023, cat: "1ton" },
];
const TRACTORS = [
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
  { id: "CAT-21", eco: "CAT-21", name: "New Holland 90HP", hp: 90, cat: "mediano" },
];
const V_OPS = ["BALTAZAR PALOS","MARIO ZUÑIGA AGUILERA","EMANUEL RUBIO DELGADO","ALBERTO PARTIDA","JORGE LOPEZ CARRANZA","ULISES GARCIA","TOMAS CASTAÑEDA","ALEJANDRO RAMIREZ","DAVIEL AUGUSTO GONZALEZ RIVERA","MARCOS SANCHEZ RUVALCABA","MANUEL GUTIERREZ TAMAYO","JORGE RODRIGUEZ LOPEZ","JESUCRISTIAN GUZMAN","FRANCISCO VANEGAS"];
const T_OPS = ["RAYMUNDO RINCON","HOMERO GALLEGOS","SALVADOR CORREA","JOSE ALFREDO ROSALES","BALTAZAR PALOS","LUIS ANGEL VARELA PERALES","LUIS ANTONIO VEGA PALACIOS"];

const PIN = "2835";
const todayS = () => new Date().toISOString().split("T")[0];
const nowTime = () => { const d = new Date(); return d.getHours().toString().padStart(2,"0")+":"+d.getMinutes().toString().padStart(2,"0"); };
const fmt$ = n => new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN"}).format(n);
const fN = (n,d=2) => Number(n).toFixed(d);

function getGeo() {
  return new Promise(resolve => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null), { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

async function apiGet(params) {
  const url = API + "?" + new URLSearchParams(params).toString();
  try {
    const r = await fetch(url, { redirect: "follow" });
    return await r.json();
  } catch { return null; }
}

async function apiPost(data) {
  try {
    // Google Apps Script redirects POST requests - use no-cors to ensure delivery
    await fetch(API, {
      method: "POST",
      mode: "no-cors",
      redirect: "follow",
      body: JSON.stringify(data),
    });
    // With no-cors we can't read the response, but the data arrives
    return { success: true };
  } catch (e) { console.error(e); return { success: false, message: e.toString() }; }
}

async function ocrTicket(b64, mt) {
  try {
    // Call Anthropic API directly for OCR
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mt, data: b64 } },
            { type: "text", text: 'Analiza este ticket de gasolinera mexicana. Responde SOLO JSON puro:\n{"station":"nombre","liters":numero,"totalCost":numero,"pricePerLiter":numero,"date":"YYYY-MM-DD","time":"HH:MM","fuelType":"magna/premium/diesel"}\nCampo que no leas pon null. SOLO JSON.' }
          ]
        }]
      })
    });
    const d = await res.json();
    const t = d.content?.map(c => c.text || "").join("") || "";
    return JSON.parse(t.replace(/```json|```/g, "").trim());
  } catch { return null; }
}

// ═══ THEME ═══
const C = { bg: "#111010", sf: "#1a1714", bd: "rgba(255,255,255,0.07)", bdL: "rgba(255,255,255,0.04)", gold: "#d4a437", goldD: "#b8860b", grn: "#6abf6a", red: "#d45050", blu: "#5aaad4", org: "#e0a64a", pur: "#a07ad4", tx: "#d4c9b8", txD: "#8a8078", txM: "#5c5650", acc: "#e8dcc8" };
const inpB = { width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.045)", border: `1px solid ${C.bd}`, borderRadius: 10, color: C.tx, fontSize: 15, outline: "none", boxSizing: "border-box" };
const lblB = { display: "block", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.4, color: C.txD, marginBottom: 7, fontWeight: 700 };
const CSS = `@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{to{transform:rotate(360deg)}}select option{background:#1a1714;color:#d4c9b8}input:focus,select:focus{border-color:rgba(212,164,55,.45)!important}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:3px}*{-webkit-tap-highlight-color:transparent}`;

// ═══ ROLE SELECT ═══
function RoleSelect({ onSelect }) {
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  const tryPin = () => { if (pin === PIN) onSelect("admin"); else { setErr(true); setPin(""); setTimeout(() => setErr(false), 1500); } };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>⛽</div>
      <h1 style={{ color: C.acc, fontSize: 22, fontWeight: 700, marginBottom: 4, textAlign: "center" }}>Control de Combustible</h1>
      <p style={{ color: C.txM, fontSize: 13, marginBottom: 36, textAlign: "center" }}>Sistema de Gestión Agrícola</p>
      {!showPin ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 340 }}>
          {[
            { k: "vehicle", icon: "🚛", t: "Carga Vehículo", s: "Camionetas y pickups" },
            { k: "tractor", icon: "🚜", t: "Carga Tractor", s: "Tractores agrícolas" },
            { k: "_admin", icon: "📊", t: "Administrador", s: "Ver Google Sheets" },
          ].map(b => (
            <button key={b.k} onClick={() => b.k === "_admin" ? setShowPin(true) : onSelect(b.k)} style={{ padding: "16px 18px", borderRadius: 14, border: `1.5px solid ${C.bd}`, background: b.k === "_admin" ? C.sf : `linear-gradient(135deg, rgba(212,164,55,0.08), rgba(212,164,55,0.02))`, color: C.tx, fontSize: 15, fontWeight: 700, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 26 }}>{b.icon}</span>
              <div><div>{b.t}</div><div style={{ fontSize: 12, fontWeight: 400, color: C.txD, marginTop: 2 }}>{b.s}</div></div>
            </button>
          ))}
        </div>
      ) : (
        <div style={{ width: "100%", maxWidth: 300, animation: "fadeUp .3s ease" }}>
          <div style={{ fontSize: 13, color: C.txD, marginBottom: 14, textAlign: "center" }}>PIN de administrador</div>
          <input type="password" inputMode="numeric" maxLength={6} placeholder="••••" value={pin} onChange={e => setPin(e.target.value)} onKeyDown={e => e.key === "Enter" && tryPin()} autoFocus style={{ ...inpB, textAlign: "center", fontSize: 28, letterSpacing: 8, borderColor: err ? C.red : C.bd, marginBottom: 14 }} />
          {err && <div style={{ textAlign: "center", color: C.red, fontSize: 13, marginBottom: 12 }}>PIN incorrecto</div>}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => { setShowPin(false); setPin(""); }} style={{ flex: 1, padding: 13, borderRadius: 10, border: `1px solid ${C.bd}`, background: "transparent", color: C.txD, fontSize: 14, cursor: "pointer" }}>Cancelar</button>
            <button onClick={tryPin} style={{ flex: 1, padding: 13, borderRadius: 10, border: "none", background: `linear-gradient(135deg,${C.goldD},${C.gold})`, color: "#1a1612", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Entrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══ VEHICLE OPERATOR ═══
function VehicleOp({ onExit }) {
  const fileRef = useRef(null);
  const [step, setStep] = useState(1);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanErr, setScanErr] = useState(false);
  const [preview, setPreview] = useState(null);
  const [op, setOp] = useState("");
  const [vid, setVid] = useState("");
  const [km, setKm] = useState("");
  const [td, setTd] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [kmPrev, setKmPrev] = useState(null);
  const [loadingKm, setLoadingKm] = useState(false);
  const [geo, setGeo] = useState(null);

  useEffect(() => { getGeo().then(g => setGeo(g)); }, []);

  // Fetch last km when vehicle changes
  useEffect(() => {
    if (!vid) { setKmPrev(null); return; }
    const v = VEHICLES.find(x => x.id === vid);
    setLoadingKm(true);
    apiGet({ action: "lastKm", eco: v?.eco || vid }).then(r => {
      setKmPrev(r?.lastKm || null);
      setLoadingKm(false);
    });
  }, [vid]);

  const isF = vid && kmPrev === null && !loadingKm;
  const kmD = kmPrev !== null && km ? Number(km) - Number(kmPrev) : null;

  const handlePhoto = async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      setPreview(ev.target.result); setScanning(true); setScanErr(false); setScanResult(null);
      const res = await ocrTicket(ev.target.result.split(",")[1], f.type || "image/jpeg");
      setScanning(false);
      if (res && !res.error) { setScanResult(res); setTd(res); }
      else setScanErr(true);
    };
    reader.readAsDataURL(f);
  };

  const canSave = op && vid && km && td && td.liters > 0 && td.totalCost > 0 && !saving && (isF || (kmD !== null && kmD > 0));

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    const v = VEHICLES.find(x => x.id === vid);
    const kml = kmD > 0 ? kmD / td.liters : 0;
    const costKm = kmD > 0 ? td.totalCost / kmD : 0;

    await apiPost({
      type: "vehicle",
      date: td.date || todayS(), time: td.time || nowTime(),
      ecoNum: v?.eco || vid, vehicleName: v?.name || "", vehicleYear: v?.year || "",
      vehicleCat: v?.cat || "1ton", operator: op,
      station: td.station || "", fuelType: td.fuelType || "",
      kmPrev: kmPrev || 0, kmCurr: Number(km), kmDiff: kmD || 0,
      liters: td.liters, pricePerLiter: td.pricePerLiter || 0, totalCost: td.totalCost,
      kml, costPerKm: costKm, isFirstRecord: !!isF, geo,
    });
    setSaving(false);
    setSaved(true);
  };

  const reset = () => { setSaved(false); setStep(1); setOp(""); setVid(""); setKm(""); setPreview(null); setScanResult(null); setScanErr(false); setTd(null); setKmPrev(null); };

  if (saved) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ animation: "fadeUp .4s ease", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.grn, marginBottom: 8 }}>¡Registro guardado!</div>
        <div style={{ fontSize: 14, color: C.txD, marginBottom: 6 }}>Los datos ya están en Google Sheets</div>
        <div style={{ fontSize: 13, color: C.txM, marginBottom: 32 }}>Puedes registrar otra carga o salir</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={reset} style={{ padding: "14px 28px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${C.goldD},${C.gold})`, color: "#1a1612", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Nueva Carga</button>
          <button onClick={onExit} style={{ padding: "14px 28px", borderRadius: 10, border: `1px solid ${C.bd}`, background: "transparent", color: C.txD, fontSize: 15, cursor: "pointer" }}>Salir</button>
        </div>
      </div>
    </div>
  );

  const sec = { background: C.sf, border: `1px solid ${C.bd}`, borderRadius: 14, padding: 20, marginBottom: 16, animation: "fadeUp .35s ease" };
  const sN = (n, t) => (<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg,${C.goldD},${C.gold})`, color: "#1a1612", fontSize: 14, fontWeight: 700 }}>{n}</div><div style={{ fontSize: 15, fontWeight: 700, color: C.acc }}>{t}</div></div>);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans',sans-serif", color: C.tx }}>
      <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.bd}`, background: "rgba(0,0,0,.25)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 20 }}>🚛</span><div><div style={{ fontSize: 16, fontWeight: 700, color: C.acc }}>Carga Vehículo</div><div style={{ fontSize: 10, color: C.txM }}>Control de Combustible</div></div></div>
        <button onClick={onExit} style={{ background: "transparent", border: `1px solid ${C.bd}`, borderRadius: 8, color: C.txD, fontSize: 12, padding: "6px 14px", cursor: "pointer" }}>Salir</button>
      </div>

      <div style={{ padding: "20px 16px", maxWidth: 500, margin: "0 auto" }}>
        {/* STEP 1 */}
        <div style={sec}>
          {sN("1", "¿Quién eres y qué camioneta?")}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div><label style={lblB}>Tu nombre</label>
              <select value={op} onChange={e => { setOp(e.target.value); if (e.target.value && vid) setStep(s => Math.max(s, 2)); }} style={{ ...inpB, cursor: "pointer" }}>
                <option value="">Selecciona...</option>{V_OPS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div><label style={lblB}>Camioneta</label>
              <select value={vid} onChange={e => { setVid(e.target.value); if (op && e.target.value) setStep(s => Math.max(s, 2)); }} style={{ ...inpB, cursor: "pointer" }}>
                <option value="">Selecciona...</option>{VEHICLES.map(v => <option key={v.id} value={v.id}>{v.eco} — {v.name} ({v.year})</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* STEP 2: Photo */}
        {step >= 2 && (
          <div style={sec}>
            {sN("2", "Foto del ticket")}
            <div onClick={() => fileRef.current?.click()} style={{ border: `2px dashed ${preview ? C.grn : C.gold}33`, borderRadius: 12, padding: preview ? 14 : "30px 20px", textAlign: "center", cursor: "pointer", background: preview ? "rgba(106,191,106,0.03)" : "rgba(212,164,55,0.03)" }}>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{ display: "none" }} />
              {!preview && !scanning && (<><div style={{ fontSize: 42, marginBottom: 8 }}>📸</div><div style={{ fontSize: 15, fontWeight: 700, color: C.gold }}>Toca para tomar foto</div><div style={{ fontSize: 12, color: C.txD, marginTop: 4 }}>La IA lee los datos automáticamente</div></>)}
              {preview && (
                <div style={{ display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
                  <img src={preview} alt="t" style={{ width: 70, height: 90, objectFit: "cover", borderRadius: 8, border: `1px solid ${C.bd}`, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    {scanning && (<><div style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>🔍 Leyendo ticket...</div><div style={{ marginTop: 8, height: 3, background: C.bd, borderRadius: 2, overflow: "hidden" }}><div style={{ width: "65%", height: "100%", background: C.gold, borderRadius: 2, animation: "pulse 1.5s infinite" }} /></div></>)}
                    {scanResult && (<><div style={{ fontSize: 14, fontWeight: 700, color: C.grn, marginBottom: 6 }}>✅ Ticket leído</div><div style={{ fontSize: 13, color: C.tx, lineHeight: 1.6 }}>{scanResult.station && <div>📍 {scanResult.station}</div>}<div>⛽ {scanResult.liters || "?"} L</div><div style={{ fontWeight: 700, color: C.org }}>💰 ${scanResult.totalCost || "?"}</div></div></>)}
                    {scanErr && <div style={{ fontSize: 13, color: C.red }}>⚠️ No se pudo leer. Intenta otra foto.</div>}
                  </div>
                </div>
              )}
            </div>
            {scanResult && step < 3 && (<button onClick={() => setStep(3)} style={{ width: "100%", marginTop: 14, padding: 13, borderRadius: 10, border: "none", background: `linear-gradient(135deg,${C.goldD},${C.gold})`, color: "#1a1612", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Continuar →</button>)}
          </div>
        )}

        {/* STEP 3: Odometer */}
        {step >= 3 && (
          <div style={sec}>
            {sN("3", "Km del odómetro")}
            {loadingKm && <div style={{ padding: "10px 14px", fontSize: 13, color: C.txD }}>⏳ Consultando último registro...</div>}
            {kmPrev !== null && <div style={{ padding: "10px 14px", background: "rgba(106,191,106,0.06)", borderRadius: 8, marginBottom: 14, fontSize: 13, color: C.txD }}>Último registro: <strong style={{ color: C.grn }}>{fN(kmPrev, 0)} km</strong></div>}
            {isF && <div style={{ padding: "10px 14px", background: "rgba(90,170,212,0.06)", borderRadius: 8, marginBottom: 14, fontSize: 13, color: C.blu }}>ℹ️ Primer registro de esta camioneta</div>}
            <label style={lblB}>Km actual</label>
            <input type="number" inputMode="numeric" placeholder="Ej: 85420" value={km} onChange={e => setKm(e.target.value)} style={{ ...inpB, fontSize: 22, fontWeight: 700, textAlign: "center", letterSpacing: 2 }} />
            {kmD !== null && kmD <= 0 && <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(212,80,80,0.08)", borderRadius: 6, fontSize: 13, color: C.red }}>⚠️ Debe ser mayor a {fN(kmPrev, 0)}</div>}
            {geo && <div style={{ marginTop: 10, fontSize: 10, color: C.txM }}>📍 Ubicación capturada: {geo.lat.toFixed(4)}, {geo.lng.toFixed(4)}</div>}
            <button onClick={handleSave} disabled={!canSave} style={{ width: "100%", marginTop: 20, padding: 16, borderRadius: 12, border: "none", background: canSave ? `linear-gradient(135deg,${C.goldD},${C.gold})` : "rgba(255,255,255,0.04)", color: canSave ? "#1a1612" : C.txM, fontSize: 16, fontWeight: 700, cursor: canSave ? "pointer" : "not-allowed" }}>
              {saving ? "⏳ Guardando..." : canSave ? "💾 Guardar" : "Completa todos los pasos"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══ TRACTOR OPERATOR ═══
function TractorOp({ onExit }) {
  const [step, setStep] = useState(1);
  const [op, setOp] = useState("");
  const [tid, setTid] = useState("");
  const [liters, setLiters] = useState("");
  const [price, setPrice] = useState("");
  const [hr, setHr] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hrPrev, setHrPrev] = useState(null);
  const [loadingHr, setLoadingHr] = useState(false);
  const [geo, setGeo] = useState(null);

  useEffect(() => { getGeo().then(g => setGeo(g)); }, []);

  useEffect(() => {
    if (!tid) { setHrPrev(null); return; }
    const t = TRACTORS.find(x => x.id === tid);
    setLoadingHr(true);
    apiGet({ action: "lastHr", eco: t?.eco || tid }).then(r => {
      setHrPrev(r?.lastHr || null);
      setLoadingHr(false);
    });
  }, [tid]);

  const isF = tid && hrPrev === null && !loadingHr;
  const hrD = hrPrev !== null && hr ? Number(hr) - Number(hrPrev) : null;
  const totalCost = liters && price ? Number(liters) * Number(price) : 0;
  const canSave = op && tid && hr && liters > 0 && price > 0 && !saving && (isF || (hrD !== null && hrD > 0));

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    const t = TRACTORS.find(x => x.id === tid);
    const lph = hrD > 0 ? Number(liters) / hrD : 0;
    const costHr = hrD > 0 ? totalCost / hrD : 0;

    await apiPost({
      type: "tractor",
      date: todayS(), time: nowTime(),
      ecoNum: t?.eco || tid, tractorName: t?.name || "", tractorHp: t?.hp || "",
      tractorCat: t?.cat || "mediano", operator: op,
      fuelType: "diesel",
      hrPrev: hrPrev || 0, hrCurr: Number(hr), hrDiff: hrD || 0,
      liters: Number(liters), pricePerLiter: Number(price), totalCost,
      lph, costPerHr: costHr, isFirstRecord: !!isF, geo,
    });
    setSaving(false);
    setSaved(true);
  };

  const reset = () => { setSaved(false); setStep(1); setOp(""); setTid(""); setLiters(""); setPrice(""); setHr(""); setHrPrev(null); };

  if (saved) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ animation: "fadeUp .4s ease", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.grn, marginBottom: 8 }}>¡Registro guardado!</div>
        <div style={{ fontSize: 14, color: C.txD, marginBottom: 6 }}>Los datos ya están en Google Sheets</div>
        <div style={{ fontSize: 13, color: C.txM, marginBottom: 32 }}>Puedes registrar otra carga o salir</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={reset} style={{ padding: "14px 28px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${C.goldD},${C.gold})`, color: "#1a1612", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Nueva Carga</button>
          <button onClick={onExit} style={{ padding: "14px 28px", borderRadius: 10, border: `1px solid ${C.bd}`, background: "transparent", color: C.txD, fontSize: 15, cursor: "pointer" }}>Salir</button>
        </div>
      </div>
    </div>
  );

  const sec = { background: C.sf, border: `1px solid ${C.bd}`, borderRadius: 14, padding: 20, marginBottom: 16, animation: "fadeUp .35s ease" };
  const sN = (n, t) => (<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg,${C.goldD},${C.gold})`, color: "#1a1612", fontSize: 14, fontWeight: 700 }}>{n}</div><div style={{ fontSize: 15, fontWeight: 700, color: C.acc }}>{t}</div></div>);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans',sans-serif", color: C.tx }}>
      <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.bd}`, background: "rgba(0,0,0,.25)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 20 }}>🚜</span><div><div style={{ fontSize: 16, fontWeight: 700, color: C.acc }}>Carga Tractor</div><div style={{ fontSize: 10, color: C.txM }}>Control de Combustible</div></div></div>
        <button onClick={onExit} style={{ background: "transparent", border: `1px solid ${C.bd}`, borderRadius: 8, color: C.txD, fontSize: 12, padding: "6px 14px", cursor: "pointer" }}>Salir</button>
      </div>

      <div style={{ padding: "20px 16px", maxWidth: 500, margin: "0 auto" }}>
        {/* STEP 1 */}
        <div style={sec}>
          {sN("1", "¿Quién eres y qué tractor?")}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div><label style={lblB}>Tu nombre</label>
              <select value={op} onChange={e => { setOp(e.target.value); if (e.target.value && tid) setStep(2); }} style={{ ...inpB, cursor: "pointer" }}>
                <option value="">Selecciona...</option>{T_OPS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div><label style={lblB}>Tractor</label>
              <select value={tid} onChange={e => { setTid(e.target.value); if (op && e.target.value) setStep(2); }} style={{ ...inpB, cursor: "pointer" }}>
                <option value="">Selecciona...</option>{TRACTORS.map(t => <option key={t.id} value={t.id}>{t.eco} — {t.name} ({t.hp} HP)</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* STEP 2 */}
        {step >= 2 && (
          <div style={sec}>
            {sN("2", "Combustible y horómetro")}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div><label style={lblB}>Litros cargados</label><input type="number" inputMode="decimal" step="0.1" placeholder="Ej: 45.5" value={liters} onChange={e => setLiters(e.target.value)} style={inpB} /></div>
              <div><label style={lblB}>Precio diesel ($/L)</label><input type="number" inputMode="decimal" step="0.01" placeholder="Ej: 24.50" value={price} onChange={e => setPrice(e.target.value)} style={inpB} /></div>
            </div>

            {totalCost > 0 && (
              <div style={{ padding: "10px 14px", background: "rgba(224,166,74,0.06)", borderRadius: 8, border: "1px solid rgba(224,166,74,0.1)", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: C.txD }}>Costo total</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: C.org }}>{fmt$(totalCost)}</span>
              </div>
            )}

            <div style={{ borderTop: `1px solid ${C.bd}`, paddingTop: 16, marginTop: 4 }}>
              {loadingHr && <div style={{ padding: "10px 14px", fontSize: 13, color: C.txD }}>⏳ Consultando último horómetro...</div>}
              {hrPrev !== null && <div style={{ padding: "10px 14px", background: "rgba(106,191,106,0.06)", borderRadius: 8, border: "1px solid rgba(106,191,106,0.1)", marginBottom: 14, fontSize: 13, color: C.txD }}>Último horómetro: <strong style={{ color: C.grn }}>{fN(hrPrev, 1)} hrs</strong></div>}
              {isF && <div style={{ padding: "10px 14px", background: "rgba(90,170,212,0.06)", borderRadius: 8, border: "1px solid rgba(90,170,212,0.1)", marginBottom: 14, fontSize: 13, color: C.blu }}>ℹ️ Primer registro de este tractor</div>}
              <label style={lblB}>Horómetro actual</label>
              <input type="number" inputMode="decimal" step="0.1" placeholder="Ej: 1250.5" value={hr} onChange={e => setHr(e.target.value)} style={{ ...inpB, fontSize: 22, fontWeight: 700, textAlign: "center", letterSpacing: 2 }} />
              {hrD !== null && hrD <= 0 && <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(212,80,80,0.08)", borderRadius: 6, fontSize: 13, color: C.red }}>⚠️ Debe ser mayor a {fN(hrPrev, 1)} hrs</div>}
              {hrD > 0 && liters > 0 && (
                <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(106,191,106,0.06)", borderRadius: 8, border: "1px solid rgba(106,191,106,0.12)", display: "flex", gap: 16 }}>
                  <div><div style={{ fontSize: 10, color: C.txD }}>Hrs trabajadas</div><div style={{ fontSize: 17, fontWeight: 700, color: C.acc }}>{fN(hrD, 1)}</div></div>
                  <div><div style={{ fontSize: 10, color: C.txD }}>Consumo</div><div style={{ fontSize: 17, fontWeight: 700, color: C.org }}>{fN(Number(liters) / hrD)} L/hr</div></div>
                  {totalCost > 0 && <div><div style={{ fontSize: 10, color: C.txD }}>Costo/hr</div><div style={{ fontSize: 17, fontWeight: 700, color: C.blu }}>{fmt$(totalCost / hrD)}</div></div>}
                </div>
              )}
              {geo && <div style={{ marginTop: 10, fontSize: 10, color: C.txM }}>📍 Ubicación capturada: {geo.lat.toFixed(4)}, {geo.lng.toFixed(4)}</div>}
            </div>

            <button onClick={handleSave} disabled={!canSave} style={{ width: "100%", marginTop: 20, padding: 16, borderRadius: 12, border: "none", background: canSave ? `linear-gradient(135deg,${C.goldD},${C.gold})` : "rgba(255,255,255,0.04)", color: canSave ? "#1a1612" : C.txM, fontSize: 16, fontWeight: 700, cursor: canSave ? "pointer" : "not-allowed" }}>
              {saving ? "⏳ Guardando..." : canSave ? "💾 Guardar Registro" : "Completa todos los campos"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══ ADMIN ═══
function AdminView({ onExit }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>📊</div>
        <h2 style={{ color: C.acc, fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Panel de Administrador</h2>
        <p style={{ color: C.txD, fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
          Todos los datos se guardan directamente en Google Sheets. Ahí puedes ver el historial completo, crear gráficas, filtrar por vehículo, operador o fecha, y ver las alertas de rendimiento.
        </p>
        <p style={{ color: C.txD, fontSize: 13, marginBottom: 32 }}>
          Las filas se colorean automáticamente: <span style={{ color: C.grn }}>✅ verde</span> = normal, <span style={{ color: C.red }}>🔴 rojo</span> = bajo rendimiento, <span style={{ color: C.pur }}>🟣 morado</span> = rendimiento sospechoso.
        </p>
        <a href="https://docs.google.com/spreadsheets" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 10, background: `linear-gradient(135deg,${C.goldD},${C.gold})`, color: "#1a1612", fontSize: 15, fontWeight: 700, textDecoration: "none", marginBottom: 16 }}>
          📋 Abrir Google Sheets
        </a>
        <br />
        <button onClick={onExit} style={{ padding: "12px 24px", borderRadius: 10, border: `1px solid ${C.bd}`, background: "transparent", color: C.txD, fontSize: 14, cursor: "pointer", marginTop: 8 }}>← Volver</button>
      </div>
    </div>
  );
}

// ═══ MAIN ═══
export default function App() {
  const [role, setRole] = useState(null);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{CSS}</style>
      {!role && <RoleSelect onSelect={setRole} />}
      {role === "vehicle" && <VehicleOp onExit={() => setRole(null)} />}
      {role === "tractor" && <TractorOp onExit={() => setRole(null)} />}
      {role === "admin" && <AdminView onExit={() => setRole(null)} />}
    </>
  );
}
