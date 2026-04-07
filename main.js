// ===== MAIN.JS =====

// --- Navbar scroll ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 30 ? '0 4px 20px rgba(255,107,0,0.15)' : '';
});

// --- Hamburger ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// --- Smooth section reveal ---
const revealEls = document.querySelectorAll('.club-section, .galeria-section, .cuotas-section, .contacto-section, .ubicacion-section');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.08 });
revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(40px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  observer.observe(el);
});

// ========================
// ===== CUOTAS =====
// ========================

const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const dniInput = document.getElementById('dniInput');
const btnBuscar = document.getElementById('btnBuscarDNI');
const buscarError = document.getElementById('buscarError');
const btnVolver = document.getElementById('btnVolver');
const btnVolverStep2 = document.getElementById('btnVolverStep2');

let jugadorActual = null;
let mesesSeleccionados = [];

function showError(el, msg) {
  el.textContent = msg;
  el.style.display = 'block';
}
function hideError(el) {
  el.style.display = 'none';
}

// Buscar jugador por DNI
btnBuscar.addEventListener('click', () => {
  const dni = dniInput.value.trim();
  hideError(buscarError);
  if (!dni || dni.length < 7) {
    showError(buscarError, 'Ingresá un DNI válido (mínimo 7 dígitos).');
    return;
  }
  const jugador = getJugadorByDNI(dni);
  if (!jugador) {
    showError(buscarError, 'No encontramos ningún jugador con ese DNI. Contactate con la administración.');
    return;
  }
  jugadorActual = jugador;
  renderEstadoCuotas(jugador);
  step1.style.display = 'none';
  step2.style.display = 'block';
});
dniInput.addEventListener('keydown', e => { if (e.key === 'Enter') btnBuscar.click(); });

btnVolver.addEventListener('click', () => {
  step2.style.display = 'none';
  step1.style.display = 'block';
  dniInput.value = '';
  jugadorActual = null;
  mesesSeleccionados = [];
});
btnVolverStep2.addEventListener('click', () => {
  step3.style.display = 'none';
  step2.style.display = 'block';
  mesesSeleccionados = [];
  if (jugadorActual) renderEstadoCuotas(jugadorActual);
});

function renderEstadoCuotas(jugador) {
  const mesActual = new Date().getMonth();
  const infoEl = document.getElementById('jugadorInfo');
  const estadoEl = document.getElementById('cuotasEstado');

  infoEl.innerHTML = `
    <h4>${jugador.nombre}</h4>
    <p>DNI: ${jugador.dni} · Categoría: ${jugador.categoria}</p>
  `;

  // Construir lista de meses
  let html = `<h4>Estado de Cuotas ${AÑO_ACTUAL}</h4><div style="margin-bottom:0.8rem">`;
  let hayPendientes = false;

  for (let m = 0; m <= mesActual; m++) {
    const estado = getMesEstado(jugador.dni, m);
    let clase = 'pendiente', icono = '⚠️', texto = 'Pendiente';
    if (estado === 'aprobado') { clase = 'pagada'; icono = '✅'; texto = 'Pagada'; }
    if (estado === 'en_revision') { clase = 'en-revision'; icono = '🔄'; texto = 'En revisión'; }
    if (estado === 'rechazado') { clase = 'vencida'; icono = '❌'; texto = 'Rechazada'; }
    if (estado === 'pendiente' || estado === 'rechazado') hayPendientes = true;
    html += `<span class="cuota-badge ${clase}">${icono} ${MESES[m]} — ${texto}</span>`;
  }
  html += `</div>`;

  const atraso = cuotasAtrasadas(jugador.dni);
  if (atraso === 0) {
    html += `<div class="form-success">✅ ¡Estás al día con todas tus cuotas! Gracias por tu compromiso.</div>`;
  } else {
    html += `<div class="form-error" style="margin-bottom:1rem">⚠️ Tenés <strong>${atraso}</strong> cuota${atraso > 1 ? 's' : ''} pendiente${atraso > 1 ? 's' : ''}.</div>`;
  }

  if (hayPendientes) {
    html += `<button class="btn btn-primary btn-full" id="btnIrPagar">Pagar Cuotas Pendientes</button>`;
  }

  estadoEl.innerHTML = html;

  if (hayPendientes) {
    document.getElementById('btnIrPagar').addEventListener('click', () => {
      renderFormPago(jugador);
      step2.style.display = 'none';
      step3.style.display = 'block';
    });
  }
}

function renderFormPago(jugador) {
  const cfg = getConfig();
  const mesActual = new Date().getMonth();

  // MP info
  document.getElementById('mpAlias').innerHTML = `<strong>Alias:</strong> ${cfg.mp_alias || 'futsal.rivadavia'}`;
  document.getElementById('mpCvu').innerHTML = `<strong>CVU:</strong> ${cfg.mp_cvu || '—'}`;
  document.getElementById('mpMonto').textContent = '';

  // Meses pendientes
  const mesesPendientesEl = document.getElementById('mesesPagar');
  let html = `<div class="meses-check-grid">`;
  mesesSeleccionados = [];

  for (let m = 0; m <= mesActual; m++) {
    const estado = getMesEstado(jugador.dni, m);
    if (estado === 'pendiente' || estado === 'rechazado') {
      html += `
        <label class="mes-checkbox">
          <input type="checkbox" name="mes" value="${m}" class="mes-chk"/>
          ${MESES[m]}
        </label>`;
    }
  }
  html += `</div>`;
  mesesPendientesEl.innerHTML = html;

  // Actualizar monto al seleccionar
  mesesPendientesEl.querySelectorAll('.mes-chk').forEach(chk => {
    chk.addEventListener('change', actualizarMonto);
  });

  function actualizarMonto() {
    mesesSeleccionados = Array.from(mesesPendientesEl.querySelectorAll('.mes-chk:checked')).map(c => parseInt(c.value));
    const total = mesesSeleccionados.length * (cfg.cuota_valor || 3500);
    document.getElementById('mpMonto').textContent = mesesSeleccionados.length > 0
      ? `TOTAL: $${total.toLocaleString('es-AR')}`
      : '';
  }
}

// Upload zone
const uploadZone = document.getElementById('uploadZone');
const comprobanteFile = document.getElementById('comprobanteFile');
const filePreview = document.getElementById('filePreview');

uploadZone.addEventListener('click', () => comprobanteFile.click());
uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.style.background = 'rgba(255,107,0,0.1)'; });
uploadZone.addEventListener('dragleave', () => { uploadZone.style.background = ''; });
uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.style.background = '';
  if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
});
comprobanteFile.addEventListener('change', () => {
  if (comprobanteFile.files[0]) handleFile(comprobanteFile.files[0]);
});

let archivoBase64 = null;
let archivoNombre = '';
let archivoTipo = '';

function handleFile(file) {
  archivoNombre = file.name;
  archivoTipo = file.type;
  const reader = new FileReader();
  reader.onload = (e) => {
    archivoBase64 = e.target.result;
    filePreview.style.display = 'flex';
    filePreview.innerHTML = `✅ ${file.name} (${(file.size/1024).toFixed(1)} KB)`;
    uploadZone.querySelector('span').textContent = '✅ Archivo cargado. Click para cambiar.';
  };
  reader.readAsDataURL(file);
}

// Enviar pago
const btnEnviarPago = document.getElementById('btnEnviarPago');
const pagoError = document.getElementById('pagoError');
const pagoSuccess = document.getElementById('pagoSuccess');

btnEnviarPago.addEventListener('click', () => {
  hideError(pagoError);
  pagoSuccess.style.display = 'none';

  if (!jugadorActual) return;
  if (mesesSeleccionados.length === 0) {
    showError(pagoError, 'Seleccioná al menos una cuota a pagar.');
    return;
  }
  if (!archivoBase64) {
    showError(pagoError, 'Debés subir el comprobante de Mercado Pago.');
    return;
  }

  const comentario = document.getElementById('comentarioPago').value.trim();

  // Registrar un pago por cada mes seleccionado
  mesesSeleccionados.forEach(mes => {
    // Verificar si ya existe un pago en_revision para ese mes, si no, crear
    const existente = getPagos().find(p => p.dni === jugadorActual.dni && p.mes === mes && p.anio === AÑO_ACTUAL);
    if (existente) {
      actualizarPago(existente.id, {
        estado: 'en_revision',
        fecha: new Date().toISOString(),
        comprobante: archivoBase64,
        comprobante_nombre: archivoNombre,
        comprobante_tipo: archivoTipo,
        comentario
      });
    } else {
      agregarPago({
        id: crypto.randomUUID(),
        dni: jugadorActual.dni,
        mes,
        anio: AÑO_ACTUAL,
        estado: 'en_revision',
        fecha: new Date().toISOString(),
        comprobante: archivoBase64,
        comprobante_nombre: archivoNombre,
        comprobante_tipo: archivoTipo,
        comentario
      });
    }
  });

  // Reset
  archivoBase64 = null;
  archivoNombre = '';
  filePreview.style.display = 'none';
  document.getElementById('comentarioPago').value = '';
  uploadZone.querySelector('span').textContent = '📎 Arrastrá el comprobante aquí o hacé click para seleccionar';
  comprobanteFile.value = '';

  pagoSuccess.style.display = 'block';
  pagoSuccess.innerHTML = `✅ ¡Comprobante enviado correctamente! Tu pago de <strong>${mesesSeleccionados.length} cuota${mesesSeleccionados.length>1?'s':''}</strong> está siendo revisado por la administración.`;

  btnEnviarPago.disabled = true;
  setTimeout(() => {
    step3.style.display = 'none';
    step2.style.display = 'block';
    renderEstadoCuotas(jugadorActual);
    btnEnviarPago.disabled = false;
    mesesSeleccionados = [];
  }, 3000);
});

// ========================
// ===== CONTACTO =====
// ========================
const contactoForm = document.getElementById('contactoForm');
contactoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('contactoSuccess').style.display = 'block';
  contactoForm.reset();
  setTimeout(() => { document.getElementById('contactoSuccess').style.display = 'none'; }, 5000);
});

// ========================
// ===== GALERÍA — cargar fotos desde DB =====
// ========================
function renderGaleria() {
  const fotos = getFotos();
  if (fotos.length === 0) return;
  const grid = document.querySelector('.galeria-grid');
  // Limpiar items demo y agregar fotos reales
  fotos.forEach((foto, i) => {
    const item = document.createElement('div');
    item.className = 'galeria-item';
    item.innerHTML = `
      <div class="gi-overlay"><span>${foto.descripcion || ''}</span></div>
      <div class="gi-img" style="background-image: url('${foto.src}'); background-size:cover; background-position:center"></div>
    `;
    grid.appendChild(item);
  });
}
renderGaleria();
