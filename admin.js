// ===== ADMIN.JS =====

// ========================
// LOGIN
// ========================
const loginOverlay = document.getElementById('loginOverlay');
const adminPanel = document.getElementById('adminPanel');

function checkSession() {
  if (isAdminLoggedIn()) {
    loginOverlay.style.display = 'none';
    adminPanel.style.display = 'flex';
    initAdmin();
  }
}

document.getElementById('btnLogin').addEventListener('click', doLogin);
document.getElementById('loginPass').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });

function doLogin() {
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value;
  const err = document.getElementById('loginError');
  if (autenticarAdmin(user, pass)) {
    setAdminSession();
    loginOverlay.style.display = 'none';
    adminPanel.style.display = 'flex';
    err.style.display = 'none';
    initAdmin();
  } else {
    err.style.display = 'block';
    document.getElementById('loginPass').value = '';
  }
}

document.getElementById('btnLogout').addEventListener('click', () => {
  clearAdminSession();
  adminPanel.style.display = 'none';
  loginOverlay.style.display = 'flex';
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
});

checkSession();

// ========================
// TABS
// ========================
const tabTitles = {
  dashboard: 'Dashboard',
  pagos: 'Gestión de Pagos',
  jugadores: 'Jugadores',
  galeria: 'Galería',
  config: 'Configuración'
};

document.querySelectorAll('.sn-btn[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sn-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    document.getElementById('tabTitle').textContent = tabTitles[btn.dataset.tab] || '';
    if (btn.dataset.tab === 'dashboard') renderDashboard();
    if (btn.dataset.tab === 'pagos') renderTablaPagos();
    if (btn.dataset.tab === 'jugadores') renderTablaJugadores();
    if (btn.dataset.tab === 'galeria') renderGaleriaAdmin();
    if (btn.dataset.tab === 'config') cargarConfig();
  });
});

function initAdmin() {
  renderDashboard();
  poblarFiltroMes();
  initFiltrosPagos();
  initModalJugador();
  initGaleriaAdmin();
  initConfig();
  initModalPagoAdmin();
}

// ========================
// DASHBOARD
// ========================
function renderDashboard() {
  const jugadores = getJugadores();
  const pagos = getPagos();
  const mesActual = new Date().getMonth();
  const pendientesRevision = pagos.filter(p => p.estado === 'en_revision');
  const aprobadosMes = pagos.filter(p => p.estado === 'aprobado' && p.mes === mesActual && p.anio === AÑO_ACTUAL);
  const totalRecaudado = aprobadosMes.length * (getConfig().cuota_valor || 3500);

  const cardsData = [
    { label: 'Jugadores activos', value: jugadores.filter(j => j.activo).length, sub: `${jugadores.length} en total` },
    { label: 'Pagos en revisión', value: pendientesRevision.length, sub: 'Requieren atención', color: pendientesRevision.length > 0 ? '#facc15' : null },
    { label: `Pagos ${MESES[mesActual]}`, value: aprobadosMes.length, sub: `de ${jugadores.length} jugadores` },
    { label: 'Recaudado (mes)', value: `$${(totalRecaudado/1000).toFixed(1)}k`, sub: MESES[mesActual] + ' ' + AÑO_ACTUAL },
  ];

  document.getElementById('dashCards').innerHTML = cardsData.map(c => `
    <div class="dash-card">
      <div class="dash-card-label">${c.label}</div>
      <div class="dash-card-value" style="${c.color ? `color:${c.color}` : ''}">${c.value}</div>
      <div class="dash-card-sub">${c.sub}</div>
    </div>
  `).join('');

  const dashPend = document.getElementById('dashPendientes');
  if (pendientesRevision.length === 0) {
    dashPend.innerHTML = `<div class="empty-table">✅ No hay pagos pendientes de revisión.</div>`;
    return;
  }

  dashPend.innerHTML = renderMiniTablaPagos(pendientesRevision);
  dashPend.querySelectorAll('.btn-aprobar').forEach(btn => {
    btn.addEventListener('click', () => { aprobarPago(btn.dataset.id); renderDashboard(); });
  });
  dashPend.querySelectorAll('.btn-rechazar').forEach(btn => {
    btn.addEventListener('click', () => { rechazarPago(btn.dataset.id); renderDashboard(); });
  });
  dashPend.querySelectorAll('.btn-ver-comp').forEach(btn => {
    btn.addEventListener('click', () => verComprobante(btn.dataset.id));
  });
}

// ========================
// PAGOS
// ========================
function poblarFiltroMes() {
  const sel = document.getElementById('filtroMes');
  MESES.forEach((m, i) => {
    const opt = document.createElement('option');
    opt.value = i; opt.textContent = m;
    sel.appendChild(opt);
  });
}

function initFiltrosPagos() {
  document.getElementById('filtroDni').addEventListener('input', renderTablaPagos);
  document.getElementById('filtroEstado').addEventListener('change', renderTablaPagos);
  document.getElementById('filtroMes').addEventListener('change', renderTablaPagos);
  document.getElementById('btnAgregarPagoAdmin').addEventListener('click', () => {
    abrirModalPagoAdmin(null);
  });
}

function renderTablaPagos() {
  let pagos = getPagos().filter(p => p.anio === AÑO_ACTUAL);
  const jugadores = getJugadores();
  const filtroTexto = document.getElementById('filtroDni').value.toLowerCase();
  const filtroEstado = document.getElementById('filtroEstado').value;
  const filtroMes = document.getElementById('filtroMes').value;

  if (filtroTexto) {
    const dnisFiltrados = jugadores
      .filter(j => j.dni.includes(filtroTexto) || j.nombre.toLowerCase().includes(filtroTexto))
      .map(j => j.dni);
    pagos = pagos.filter(p => dnisFiltrados.includes(p.dni));
  }
  if (filtroEstado) pagos = pagos.filter(p => p.estado === filtroEstado);
  if (filtroMes !== '') pagos = pagos.filter(p => p.mes === parseInt(filtroMes));

  // Sort: más recientes primero
  pagos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const wrap = document.getElementById('tablaPagos');
  if (pagos.length === 0) {
    wrap.innerHTML = `<div class="empty-table">No se encontraron pagos con los filtros seleccionados.</div>`;
    return;
  }

  wrap.innerHTML = renderMiniTablaPagos(pagos);
  wrap.querySelectorAll('.btn-aprobar').forEach(btn => {
    btn.addEventListener('click', () => { aprobarPago(btn.dataset.id); renderTablaPagos(); });
  });
  wrap.querySelectorAll('.btn-rechazar').forEach(btn => {
    btn.addEventListener('click', () => { rechazarPago(btn.dataset.id); renderTablaPagos(); });
  });
  wrap.querySelectorAll('.btn-ver-comp').forEach(btn => {
    btn.addEventListener('click', () => verComprobante(btn.dataset.id));
  });
  wrap.querySelectorAll('.btn-eliminar-pago').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('¿Eliminar este pago?')) {
        eliminarPago(btn.dataset.id);
        renderTablaPagos();
      }
    });
  });
}

function renderMiniTablaPagos(pagos) {
  const jugadores = getJugadores();
  return `
    <table>
      <thead>
        <tr>
          <th>Jugador</th><th>DNI</th><th>Mes</th><th>Estado</th>
          <th>Fecha</th><th>Comentario</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${pagos.map(p => {
          const j = jugadores.find(jg => jg.dni === p.dni);
          const nombre = j ? j.nombre : p.dni;
          const estadoBadge = {
            aprobado: `<span class="badge badge-success">✅ Aprobado</span>`,
            en_revision: `<span class="badge badge-warning">🔄 En revisión</span>`,
            rechazado: `<span class="badge badge-danger">❌ Rechazado</span>`,
          }[p.estado] || p.estado;
          const fecha = p.fecha ? new Date(p.fecha).toLocaleDateString('es-AR') : '—';
          const tieneComp = !!p.comprobante;
          return `
            <tr>
              <td><strong>${nombre}</strong>${j?.categoria ? `<br/><small style="color:var(--gray)">${j.categoria}</small>` : ''}</td>
              <td><code style="color:var(--orange)">${p.dni}</code></td>
              <td>${MESES[p.mes]}</td>
              <td>${estadoBadge}</td>
              <td style="color:var(--gray); font-size:0.85rem">${fecha}</td>
              <td style="color:var(--gray); font-size:0.85rem; max-width:120px; word-break:break-word">${p.comentario || '—'}</td>
              <td>
                ${tieneComp ? `<button class="action-btn btn-ver-comp" data-id="${p.id}" title="Ver comprobante">📄</button>` : ''}
                ${p.estado === 'en_revision' ? `
                  <button class="action-btn approve btn-aprobar" data-id="${p.id}" title="Aprobar">✅</button>
                  <button class="action-btn reject btn-rechazar" data-id="${p.id}" title="Rechazar">❌</button>
                ` : ''}
                <button class="action-btn danger btn-eliminar-pago" data-id="${p.id}" title="Eliminar">🗑️</button>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

function aprobarPago(id) {
  actualizarPago(id, { estado: 'aprobado', fecha_resolucion: new Date().toISOString() });
}
function rechazarPago(id) {
  const motivo = prompt('Motivo del rechazo (opcional):') || '';
  actualizarPago(id, { estado: 'rechazado', comentario_rechazo: motivo, fecha_resolucion: new Date().toISOString() });
}

function verComprobante(id) {
  const pago = getPagos().find(p => p.id === id);
  if (!pago || !pago.comprobante) return;

  const modal = document.getElementById('modalComprobante');
  const content = document.getElementById('comprobanteContent');
  const info = document.getElementById('comprobanteInfo');
  const acciones = document.getElementById('comprobanteAcciones');

  const j = getJugadores().find(jg => jg.dni === pago.dni);

  info.innerHTML = `
    <strong>${j ? j.nombre : pago.dni}</strong> — ${MESES[pago.mes]} ${pago.anio}<br/>
    Enviado: ${new Date(pago.fecha).toLocaleString('es-AR')}<br/>
    ${pago.comentario ? `Comentario: "${pago.comentario}"` : ''}
  `;

  if (pago.comprobante_tipo && pago.comprobante_tipo.startsWith('image')) {
    content.innerHTML = `<img src="${pago.comprobante}" style="max-width:100%; border-radius:8px; max-height:400px; object-fit:contain"/>`;
  } else {
    content.innerHTML = `<a href="${pago.comprobante}" download="${pago.comprobante_nombre || 'comprobante'}" class="btn btn-primary">⬇️ Descargar Comprobante</a>`;
  }

  acciones.innerHTML = `
    ${pago.estado === 'en_revision' ? `
      <button class="btn btn-primary" id="compAprobar">✅ Aprobar</button>
      <button class="btn btn-outline" style="color:var(--error); border-color:var(--error)" id="compRechazar">❌ Rechazar</button>
    ` : `<span class="badge ${pago.estado === 'aprobado' ? 'badge-success' : 'badge-danger'}">${pago.estado === 'aprobado' ? '✅ Ya aprobado' : '❌ Rechazado'}</span>`}
  `;

  modal.style.display = 'flex';

  modal.querySelector('#compAprobar')?.addEventListener('click', () => {
    aprobarPago(id);
    modal.style.display = 'none';
    renderTablaPagos();
    renderDashboard();
  });
  modal.querySelector('#compRechazar')?.addEventListener('click', () => {
    rechazarPago(id);
    modal.style.display = 'none';
    renderTablaPagos();
    renderDashboard();
  });
}

document.getElementById('btnCerrarComprobante').addEventListener('click', () => {
  document.getElementById('modalComprobante').style.display = 'none';
});

// ========================
// MODAL PAGO ADMIN
// ========================
function initModalPagoAdmin() {
  const sel = document.getElementById('mpaMes');
  MESES.forEach((m, i) => {
    const opt = document.createElement('option');
    opt.value = i; opt.textContent = m;
    sel.appendChild(opt);
  });

  document.getElementById('btnCancelarPagoAdmin').addEventListener('click', () => {
    document.getElementById('modalPagoAdmin').style.display = 'none';
  });

  document.getElementById('btnGuardarPagoAdmin').addEventListener('click', () => {
    const dni = document.getElementById('mpaDni').value.trim();
    const mes = parseInt(document.getElementById('mpaMes').value);
    const estado = document.getElementById('mpaEstado').value;
    const comentario = document.getElementById('mpaComentario').value.trim();
    const err = document.getElementById('modalPagoError');

    if (!dni || !getJugadorByDNI(dni)) {
      err.style.display = 'block'; err.textContent = 'DNI no encontrado en el sistema.'; return;
    }
    err.style.display = 'none';

    const existente = getPagos().find(p => p.dni === dni && p.mes === mes && p.anio === AÑO_ACTUAL);
    if (existente) {
      actualizarPago(existente.id, { estado, comentario, fecha: new Date().toISOString() });
    } else {
      agregarPago({ id: crypto.randomUUID(), dni, mes, anio: AÑO_ACTUAL, estado, comentario, fecha: new Date().toISOString(), comprobante: null });
    }

    document.getElementById('modalPagoAdmin').style.display = 'none';
    renderTablaPagos();
    renderDashboard();
  });
}

function abrirModalPagoAdmin() {
  document.getElementById('mpaDni').value = '';
  document.getElementById('mpaMes').value = new Date().getMonth();
  document.getElementById('mpaEstado').value = 'aprobado';
  document.getElementById('mpaComentario').value = '';
  document.getElementById('modalPagoError').style.display = 'none';
  document.getElementById('modalPagoAdmin').style.display = 'flex';
}

// ========================
// JUGADORES
// ========================
let editandoJugadorDni = null;

function initModalJugador() {
  document.getElementById('btnNuevoJugador').addEventListener('click', () => {
    editandoJugadorDni = null;
    document.getElementById('modalJugadorTitle').textContent = 'Nuevo Jugador';
    document.getElementById('mjDni').value = '';
    document.getElementById('mjDni').disabled = false;
    document.getElementById('mjNombre').value = '';
    document.getElementById('mjCategoria').value = 'Mayor';
    document.getElementById('mjEmail').value = '';
    document.getElementById('mjTelefono').value = '';
    document.getElementById('mjActivo').value = 'true';
    document.getElementById('modalJugadorError').style.display = 'none';
    document.getElementById('modalJugador').style.display = 'flex';
  });

  document.getElementById('btnCancelarJugador').addEventListener('click', () => {
    document.getElementById('modalJugador').style.display = 'none';
  });

  document.getElementById('btnGuardarJugador').addEventListener('click', () => {
    const dni = document.getElementById('mjDni').value.trim();
    const nombre = document.getElementById('mjNombre').value.trim();
    const categoria = document.getElementById('mjCategoria').value;
    const email = document.getElementById('mjEmail').value.trim();
    const telefono = document.getElementById('mjTelefono').value.trim();
    const activo = document.getElementById('mjActivo').value === 'true';
    const err = document.getElementById('modalJugadorError');

    if (!dni || dni.length < 7) { err.style.display = 'block'; err.textContent = 'DNI inválido.'; return; }
    if (!nombre) { err.style.display = 'block'; err.textContent = 'Ingresá el nombre.'; return; }
    err.style.display = 'none';

    if (editandoJugadorDni) {
      actualizarJugador(editandoJugadorDni, { nombre, categoria, email, telefono, activo });
    } else {
      if (getJugadorByDNI(dni)) { err.style.display = 'block'; err.textContent = 'Ya existe un jugador con ese DNI.'; return; }
      agregarJugador({ dni, nombre, categoria, email, telefono, activo });
    }

    document.getElementById('modalJugador').style.display = 'none';
    renderTablaJugadores();
    renderDashboard();
  });

  document.getElementById('filtroJugador').addEventListener('input', renderTablaJugadores);
}

function renderTablaJugadores() {
  let jugadores = getJugadores();
  const filtro = document.getElementById('filtroJugador').value.toLowerCase();
  if (filtro) jugadores = jugadores.filter(j => j.nombre.toLowerCase().includes(filtro) || j.dni.includes(filtro));

  const wrap = document.getElementById('tablaJugadores');
  if (jugadores.length === 0) {
    wrap.innerHTML = `<div class="empty-table">No se encontraron jugadores.</div>`;
    return;
  }

  wrap.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Nombre</th><th>DNI</th><th>Categoría</th><th>Estado</th>
          <th>Cuotas al día</th><th>Email</th><th>Teléfono</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${jugadores.map(j => {
          const atraso = cuotasAtrasadas(j.dni);
          const estadoBadge = j.activo
            ? `<span class="badge badge-success">Activo</span>`
            : `<span class="badge badge-danger">Inactivo</span>`;
          const cuotaBadge = atraso === 0
            ? `<span class="badge badge-success">✅ Al día</span>`
            : `<span class="badge badge-warning">⚠️ ${atraso} atraso${atraso>1?'s':''}</span>`;
          return `
            <tr>
              <td><strong>${j.nombre}</strong></td>
              <td><code style="color:var(--orange)">${j.dni}</code></td>
              <td><span class="badge badge-orange">${j.categoria}</span></td>
              <td>${estadoBadge}</td>
              <td>${cuotaBadge}</td>
              <td style="color:var(--gray);font-size:0.85rem">${j.email || '—'}</td>
              <td style="color:var(--gray);font-size:0.85rem">${j.telefono || '—'}</td>
              <td>
                <button class="action-btn btn-editar-jugador" data-dni="${j.dni}" title="Editar">✏️</button>
                <button class="action-btn danger btn-eliminar-jugador" data-dni="${j.dni}" title="Eliminar">🗑️</button>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;

  wrap.querySelectorAll('.btn-editar-jugador').forEach(btn => {
    btn.addEventListener('click', () => {
      const j = getJugadorByDNI(btn.dataset.dni);
      if (!j) return;
      editandoJugadorDni = j.dni;
      document.getElementById('modalJugadorTitle').textContent = 'Editar Jugador';
      document.getElementById('mjDni').value = j.dni;
      document.getElementById('mjDni').disabled = true;
      document.getElementById('mjNombre').value = j.nombre;
      document.getElementById('mjCategoria').value = j.categoria;
      document.getElementById('mjEmail').value = j.email || '';
      document.getElementById('mjTelefono').value = j.telefono || '';
      document.getElementById('mjActivo').value = j.activo ? 'true' : 'false';
      document.getElementById('modalJugadorError').style.display = 'none';
      document.getElementById('modalJugador').style.display = 'flex';
    });
  });

  wrap.querySelectorAll('.btn-eliminar-jugador').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm(`¿Eliminar a ${btn.dataset.dni}? También se eliminarán sus pagos.`)) {
        eliminarJugador(btn.dataset.dni);
        setPagos(getPagos().filter(p => p.dni !== btn.dataset.dni));
        renderTablaJugadores();
        renderDashboard();
      }
    });
  });
}

// ========================
// GALERÍA ADMIN
// ========================
let fotoBase64 = null;

function initGaleriaAdmin() {
  const uploadZona = document.getElementById('uploadZonaFoto');
  const fotoFile = document.getElementById('fotoFile');

  document.getElementById('btnSubirFoto').addEventListener('click', () => {
    fotoBase64 = null;
    document.getElementById('fotoDesc').value = '';
    document.getElementById('fotoPreview').style.display = 'none';
    document.getElementById('modalFotoError').style.display = 'none';
    uploadZona.querySelector('span').textContent = 'Click o arrastrá la imagen aquí';
    document.getElementById('modalFoto').style.display = 'flex';
  });

  uploadZona.addEventListener('click', () => fotoFile.click());
  uploadZona.addEventListener('dragover', e => { e.preventDefault(); });
  uploadZona.addEventListener('drop', e => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFotoFile(e.dataTransfer.files[0]); });
  fotoFile.addEventListener('change', () => { if (fotoFile.files[0]) handleFotoFile(fotoFile.files[0]); });

  function handleFotoFile(file) {
    const reader = new FileReader();
    reader.onload = e => {
      fotoBase64 = e.target.result;
      document.getElementById('fotoPreview').style.display = 'block';
      document.getElementById('fotoPreviewImg').src = fotoBase64;
      uploadZona.querySelector('span').textContent = '✅ ' + file.name;
    };
    reader.readAsDataURL(file);
  }

  document.getElementById('btnCancelarFoto').addEventListener('click', () => {
    document.getElementById('modalFoto').style.display = 'none';
  });

  document.getElementById('btnGuardarFoto').addEventListener('click', () => {
    const err = document.getElementById('modalFotoError');
    const desc = document.getElementById('fotoDesc').value.trim();
    if (!fotoBase64) { err.style.display = 'block'; err.textContent = 'Seleccioná una imagen.'; return; }
    err.style.display = 'none';
    const fotos = getFotos();
    fotos.push({ id: crypto.randomUUID(), src: fotoBase64, descripcion: desc, fecha: new Date().toISOString() });
    setFotos(fotos);
    document.getElementById('modalFoto').style.display = 'none';
    renderGaleriaAdmin();
  });
}

function renderGaleriaAdmin() {
  const fotos = getFotos();
  const grid = document.getElementById('galeriaAdmin');
  if (fotos.length === 0) {
    grid.innerHTML = `<div class="empty-table" style="grid-column:1/-1">No hay fotos cargadas aún.</div>`;
    return;
  }
  grid.innerHTML = fotos.map(f => `
    <div class="galeria-admin-item">
      <img src="${f.src}" alt="${f.descripcion || ''}"/>
      <div class="ga-overlay">
        <span class="ga-desc">${f.descripcion || ''}</span>
        <button class="action-btn danger btn-eliminar-foto" data-id="${f.id}" title="Eliminar">🗑️</button>
      </div>
    </div>
  `).join('');
  grid.querySelectorAll('.btn-eliminar-foto').forEach(btn => {
    btn.addEventListener('click', () => {
      setFotos(getFotos().filter(f => f.id !== btn.dataset.id));
      renderGaleriaAdmin();
    });
  });
}

// ========================
// CONFIG
// ========================
function initConfig() {
  document.getElementById('btnGuardarConfig').addEventListener('click', () => {
    const cfg = getConfig();
    const cuota = parseInt(document.getElementById('cfgCuota').value);
    const alias = document.getElementById('cfgAlias').value.trim();
    const cvu = document.getElementById('cfgCvu').value.trim();
    const user = document.getElementById('cfgUser').value.trim();
    const pass = document.getElementById('cfgPass').value;

    if (cuota > 0) cfg.cuota_valor = cuota;
    if (alias) cfg.mp_alias = alias;
    if (cvu) cfg.mp_cvu = cvu;
    if (user) cfg.admin_user = user;
    if (pass) cfg.admin_pass = pass;

    setConfig(cfg);
    const suc = document.getElementById('configSuccess');
    suc.style.display = 'block';
    setTimeout(() => suc.style.display = 'none', 3000);
  });
}

function cargarConfig() {
  const cfg = getConfig();
  document.getElementById('cfgCuota').value = cfg.cuota_valor || 3500;
  document.getElementById('cfgAlias').value = cfg.mp_alias || '';
  document.getElementById('cfgCvu').value = cfg.mp_cvu || '';
  document.getElementById('cfgUser').value = cfg.admin_user || '';
  document.getElementById('cfgPass').value = '';
}
