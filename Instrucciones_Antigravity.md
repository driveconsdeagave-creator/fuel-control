# Control de Combustible — PWA + Google Sheets
# Instrucciones para Antigravity

## CONTEXTO
Tengo una app de control de combustible para una empresa agrícola en Jalisco, México.
Ya tengo un Google Sheet configurado con Apps Script como backend.
Necesito una PWA que los operadores abran desde sus celulares Android.

## ARQUITECTURA
- Frontend: HTML/CSS/JS estático (PWA) — hospedar en GitHub Pages
- Backend: Google Apps Script (ya desplegado)
- Base de datos: Google Sheets (ya configurado)
- OCR de tickets: API de Anthropic (a través del Apps Script)

## URL DEL APPS SCRIPT (ya desplegado)
https://script.google.com/macros/s/AKfycbxBiR3kIB0yN0-0DEJFqrfF__P2zgl3EACeYG2BnIy12P0vBr5YhK96RIx6mcppaPqs/exec

## ENDPOINTS DISPONIBLES

### GET — Obtener último km/hr
- `?action=lastKm&eco=CAC-10` → `{ success: true, lastKm: 85420 }`
- `?action=lastHr&eco=CAT-05` → `{ success: true, lastHr: 1250.5 }`

### POST — Guardar registro de vehículo
```json
{
  "type": "vehicle",
  "date": "2025-04-06", "time": "14:30",
  "ecoNum": "CAC-10", "vehicleName": "HILUX", "vehicleYear": 2020,
  "vehicleCat": "1ton", "operator": "BALTAZAR PALOS",
  "station": "Pemex Tala", "fuelType": "magna",
  "kmPrev": 85000, "kmCurr": 85420, "kmDiff": 420,
  "liters": 45.5, "pricePerLiter": 24.51, "totalCost": 1115.25,
  "kml": 9.23, "costPerKm": 2.65,
  "isFirstRecord": false,
  "geo": { "lat": 20.3925, "lng": -103.7012 }
}
```

### POST — Guardar registro de tractor
```json
{
  "type": "tractor",
  "date": "2025-04-06", "time": "14:30",
  "ecoNum": "CAT-05", "tractorName": "KUBOTA M8540", "tractorHp": 85,
  "tractorCat": "mediano", "operator": "RAYMUNDO RINCON",
  "fuelType": "diesel",
  "hrPrev": 1200.5, "hrCurr": 1210.0, "hrDiff": 9.5,
  "liters": 95, "pricePerLiter": 24.50, "totalCost": 2327.50,
  "lph": 10.0, "costPerHr": 244.99,
  "isFirstRecord": false,
  "geo": { "lat": 20.3880, "lng": -103.6950 }
}
```

### POST — OCR de ticket
```json
{
  "action": "ocr",
  "base64Image": "...",
  "mediaType": "image/jpeg"
}
```
Responde: `{ success: true, data: { station, liters, totalCost, pricePerLiter, date, time, fuelType } }`

## PROBLEMA A RESOLVER
El POST desde fetch() en el navegador no llega al Apps Script.
Probablemente es un problema de CORS/redirect con Google Apps Script.
Necesitas encontrar la forma correcta de hacer POST a un Google Apps Script web app desde una PWA.
Soluciones comunes:
1. Usar XMLHttpRequest en vez de fetch
2. Enviar como form data
3. Usar un iframe oculto
4. Redirect approach: POST → redirect → GET con respuesta

## CATÁLOGO DE VEHÍCULOS
| Eco | Vehículo | Año | Categoría |
|---|---|---|---|
| S/N | Nissan NP300 | 2017 | 1ton |
| CAC-01 | Ford F350 | 2014 | 3ton |
| CAC-02 | Ford F350 | 2014 | 3ton |
| CAC-03 | Ford F350 | 2017 | 3ton |
| CAC-04 | Ford F350 | 2019 | 3ton |
| CAC-05 | Ford F350 | 2019 | 3ton |
| CAC-06 | Ford F350 | 2019 | 3ton |
| CAC-07 | Ford F350 | 2019 | 3ton |
| CAC-10 | HILUX | 2020 | 1ton |
| CAC-11 | HILUX | 2020 | 1ton |
| CAC-12 | Ford F350 | 2021 | 3ton |
| CAC-13 | RAM 4000 | 2021 | 3ton |
| CAC-14 | HILUX | 2021 | 1ton |
| CAC-15 | HILUX | 2022 | 1ton |
| CAC-16 | HILUX | 2022 | 1ton |
| CAC-17 | Ford F350 | 2022 | 3ton |
| CAC-18 | Ford F350 | 2022 | 3ton |
| CAC-19 | RAM 700 | 2023 | mini |
| CAC-20 | MITSUBISHI | 2023 | 1ton |
| CAC-22 | RAM 700 | 2023 | mini |
| CAC-24 | HILUX | 2023 | 1ton |

## CATÁLOGO DE TRACTORES
| Eco | Tractor | HP | Categoría |
|---|---|---|---|
| CAT-01 | New Holland TC35DA | 90 | mediano |
| CAT-04 | KUBOTA M8540 | 85 | mediano |
| CAT-05 | KUBOTA M8540 | 85 | mediano |
| CAT-07 | New Holland 6610S | 90 | mediano |
| CAT-08 | New Holland 6610S | 90 | mediano |
| CAT-09 | New Holland TD85F | 80 | mediano |
| CAT-10 | NH Workmaster 40 | 40 | chico |
| CAT-13 | NH Workmaster 40 | 40 | chico |
| CAT-14 | NH Workmaster 40 | 40 | chico |
| CAT-15 | NH Workmaster 40 | 40 | chico |
| CAT-16 | NH Workmaster 40 | 40 | chico |
| CAT-017 | New Holland 25hp | 25 | chico |
| CAT-19 | New Holland 7610S | 105 | grande |
| CAT-20 | New Holland NH100 | 110 | grande |
| CAT-21 | New Holland 90HP | 90 | mediano |

## OPERADORES DE VEHÍCULOS
BALTAZAR PALOS, MARIO ZUÑIGA AGUILERA, EMANUEL RUBIO DELGADO,
ALBERTO PARTIDA, JORGE LOPEZ CARRANZA, ULISES GARCIA,
TOMAS CASTAÑEDA, ALEJANDRO RAMIREZ, DAVIEL AUGUSTO GONZALEZ RIVERA,
MARCOS SANCHEZ RUVALCABA, MANUEL GUTIERREZ TAMAYO, JORGE RODRIGUEZ LOPEZ,
JESUCRISTIAN GUZMAN, FRANCISCO VANEGAS

## OPERADORES DE TRACTORES
RAYMUNDO RINCON, HOMERO GALLEGOS, SALVADOR CORREA,
JOSE ALFREDO ROSALES, BALTAZAR PALOS, LUIS ANGEL VARELA PERALES,
LUIS ANTONIO VEGA PALACIOS

## PARÁMETROS DE RENDIMIENTO
### Vehículos (km/L)
- Pickup 1 Ton (Hilux, NP300, Mitsubishi): 9–12 km/L
- Pickup 3 Ton (F350, RAM 4000): 4–7 km/L
- Mini Pickup (RAM 700): 11–15 km/L

### Tractores (L/hr)
- Tractor Chico 25-40 HP: 3–6 L/hr
- Tractor Mediano 80-90 HP: 8–14 L/hr
- Tractor Grande 105-110 HP: 10–16 L/hr

## PERFILES DE USUARIO

### Operador Vehículo (sin PIN)
Paso 1: Selecciona nombre y camioneta
Paso 2: Toma foto del ticket → OCR automático
Paso 3: Ingresa km actual (km anterior automático del Sheet)
Geolocalización automática al guardar

### Operador Tractor (sin PIN)
Paso 1: Selecciona nombre y tractor
Paso 2: Litros, precio diesel, horómetro actual (anterior automático del Sheet)
Geolocalización automática al guardar

### Administrador (PIN: 2835)
Abre directamente Google Sheets donde ve todo: historial, filtros, gráficas

## PWA CONFIG
- Nombre: Control de Combustible
- Tema oscuro: fondo #111010, dorado #d4a437
- Mobile-first, optimizado para Android Chrome
- Manifest con íconos para instalar en pantalla de inicio
- Service worker para uso offline básico

## DEPLOY
GitHub Pages (gratis). Crear repo, subir los archivos estáticos, activar Pages.

## INSTRUCCIÓN PARA ANTIGRAVITY
Crea una PWA completa (HTML/CSS/JS estáticos, sin framework) que se conecte al Google Apps Script endpoint listado arriba. El problema principal a resolver es que el POST desde fetch() no llega al Apps Script — encuentra la solución correcta para CORS con Google Apps Script (opciones: form submission approach, XMLHttpRequest, o redirect handling). Prueba que los datos lleguen al Google Sheet antes de continuar. Despliega en GitHub Pages.
