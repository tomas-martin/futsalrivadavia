// ===== DATA.JS — Base de datos local (localStorage) =====
// Simula una base de datos usando localStorage

const DB_KEY_JUGADORES = 'fr_jugadores';
const DB_KEY_PAGOS = 'fr_pagos';
const DB_KEY_CONFIG = 'fr_config';
const DB_KEY_FOTOS = 'fr_fotos';

// --- Meses del año ---
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const AÑO_ACTUAL = new Date().getFullYear();

// --- Config por defecto ---
const CONFIG_DEFAULT = {
  cuota_valor: 3500,
  mp_alias: 'futsal.rivadavia',
  mp_cvu: '0000003100099870123456',
  admin_user: 'admin',
  admin_pass: 'rivadavia2024'
};

// --- Jugadores demo ---
const JUGADORES_DEMO = [
  { dni: '38123456', nombre: 'Lucas Pérez', categoria: 'Mayor', activo: true, email: 'lucas@mail.com', telefono: '260412345' },
  { dni: '40234567', nombre: 'Matías González', categoria: 'Juvenil', activo: true, email: 'matias@mail.com', telefono: '260423456' },
  { dni: '42345678', nombre: 'Tomás Rodríguez', categoria: 'Mayor', activo: true, email: 'tomas@mail.com', telefono: '260434567' },
  { dni: '35678901', nombre: 'Federico Martínez', categoria: 'Mayor', activo: true, email: 'fede@mail.com', telefono: '260445678' },
  { dni: '43456789', nombre: 'Ignacio López', categoria: 'Infantil', activo: true, email: 'igna@mail.com', telefono: '260456789' },
];

// --- Pagos demo ---
function generarPagosDemo() {
  const pagos = [];
  const mesActual = new Date().getMonth(); // 0-indexed
  JUGADORES_DEMO.forEach(j => {
    // Lucas tiene todo pago
    if (j.dni === '38123456') {
      for (let m = 0; m <= mesActual; m++) {
        pagos.push({ id: crypto.randomUUID(), dni: j.dni, mes: m, anio: AÑO_ACTUAL, estado: 'aprobado', fecha: new Date().toISOString(), comprobante: null, comentario: 'Pago inicial demo' });
      }
    }
    // Matías tiene 2 meses atrasados
    if (j.dni === '40234567') {
      for (let m = 0; m <= mesActual - 2; m++) {
        pagos.push({ id: crypto.randomUUID(), dni: j.dni, mes: m, anio: AÑO_ACTUAL, estado: 'aprobado', fecha: new Date().toISOString(), comprobante: null, comentario: '' });
      }
    }
    // Tomás tiene un pago en revisión
    if (j.dni === '42345678') {
      for (let m = 0; m <= mesActual - 1; m++) {
        pagos.push({ id: crypto.randomUUID(), dni: j.dni, mes: m, anio: AÑO_ACTUAL, estado: 'aprobado', fecha: new Date().toISOString(), comprobante: null, comentario: '' });
      }
      pagos.push({ id: crypto.randomUUID(), dni: j.dni, mes: mesActual, anio: AÑO_ACTUAL, estado: 'en_revision', fecha: new Date().toISOString(), comprobante: null, comentario: 'Comprobante enviado' });
    }
  });
  return pagos;
}

// --- Inicializar DB ---
function initDB() {
  if (!localStorage.getItem(DB_KEY_JUGADORES)) {
    localStorage.setItem(DB_KEY_JUGADORES, JSON.stringify(JUGADORES_DEMO));
  }
  if (!localStorage.getItem(DB_KEY_PAGOS)) {
    localStorage.setItem(DB_KEY_PAGOS, JSON.stringify(generarPagosDemo()));
  }
  if (!localStorage.getItem(DB_KEY_CONFIG)) {
    localStorage.setItem(DB_KEY_CONFIG, JSON.stringify(CONFIG_DEFAULT));
  }
  if (!localStorage.getItem(DB_KEY_FOTOS)) {
    localStorage.setItem(DB_KEY_FOTOS, JSON.stringify([]));
  }
}

// --- Helpers ---
function getJugadores() { return JSON.parse(localStorage.getItem(DB_KEY_JUGADORES) || '[]'); }
function setJugadores(data) { localStorage.setItem(DB_KEY_JUGADORES, JSON.stringify(data)); }
function getPagos() { return JSON.parse(localStorage.getItem(DB_KEY_PAGOS) || '[]'); }
function setPagos(data) { localStorage.setItem(DB_KEY_PAGOS, JSON.stringify(data)); }
function getConfig() { return JSON.parse(localStorage.getItem(DB_KEY_CONFIG) || '{}'); }
function setConfig(data) { localStorage.setItem(DB_KEY_CONFIG, JSON.stringify(data)); }
function getFotos() { return JSON.parse(localStorage.getItem(DB_KEY_FOTOS) || '[]'); }
function setFotos(data) { localStorage.setItem(DB_KEY_FOTOS, JSON.stringify(data)); }

function getJugadorByDNI(dni) {
  return getJugadores().find(j => j.dni === dni.trim()) || null;
}

function getPagosByDNI(dni) {
  return getPagos().filter(p => p.dni === dni.trim() && p.anio === AÑO_ACTUAL);
}

function getMesEstado(dni, mes) {
  const pago = getPagos().find(p => p.dni === dni && p.mes === mes && p.anio === AÑO_ACTUAL);
  if (!pago) return 'pendiente';
  return pago.estado; // 'aprobado' | 'en_revision' | 'rechazado'
}

function agregarPago(pago) {
  const pagos = getPagos();
  pagos.push(pago);
  setPagos(pagos);
}

function actualizarPago(id, cambios) {
  const pagos = getPagos().map(p => p.id === id ? { ...p, ...cambios } : p);
  setPagos(pagos);
}

function eliminarPago(id) {
  setPagos(getPagos().filter(p => p.id !== id));
}

function agregarJugador(jugador) {
  const jugadores = getJugadores();
  jugadores.push(jugador);
  setJugadores(jugadores);
}

function actualizarJugador(dni, cambios) {
  const jugadores = getJugadores().map(j => j.dni === dni ? { ...j, ...cambios } : j);
  setJugadores(jugadores);
}

function eliminarJugador(dni) {
  setJugadores(getJugadores().filter(j => j.dni !== dni));
}

function cuotasAtrasadas(dni) {
  const mesActual = new Date().getMonth();
  let atraso = 0;
  for (let m = 0; m <= mesActual; m++) {
    const e = getMesEstado(dni, m);
    if (e === 'pendiente' || e === 'rechazado') atraso++;
  }
  return atraso;
}

// --- Autenticar admin ---
function autenticarAdmin(user, pass) {
  const cfg = getConfig();
  return user === cfg.admin_user && pass === cfg.admin_pass;
}

// --- Session admin ---
function setAdminSession() { sessionStorage.setItem('fr_admin', '1'); }
function clearAdminSession() { sessionStorage.removeItem('fr_admin'); }
function isAdminLoggedIn() { return sessionStorage.getItem('fr_admin') === '1'; }

// Init al cargar
initDB();
