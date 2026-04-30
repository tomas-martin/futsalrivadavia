import type { Jugador, Pago, Config, Foto } from './types'

// ============================================================================
// MOCK DATA
// ============================================================================

const mockJugadores: Jugador[] = [
  {
    id: '1',
    nombre: 'Juan',
    dni: '12345678',
    categoria: 'Mayor',
    telefono: '2645123456',
    email: 'juan@email.com',
    activo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    nombre: 'Carlos',
    dni: '87654321',
    categoria: 'Juvenil',
    telefono: '2645654321',
    activo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockPagos: Pago[] = [
  {
    id: '1',
    jugador_id: '1',
    dni: '12345678',
    mes: 1,
    anio: 2024,
    estado: 'aprobado',
    fecha: new Date().toISOString(),
  },
  {
    id: '2',
    jugador_id: '1',
    dni: '12345678',
    mes: 2,
    anio: 2024,
    estado: 'pendiente',
    fecha: new Date().toISOString(),
  },
]

const mockConfig: Config = {
  cuota_valor: 5000,
  mp_alias: 'futsal.rivadavia',
  mp_cvu: '0000000000000000000000',
}

const mockFotos: Foto[] = []

// ============================================================================
// JUGADORES
// ============================================================================

export async function getJugadores(): Promise<Jugador[]> {
  return mockJugadores
}

export async function getJugadorByDni(dni: string): Promise<Jugador | null> {
  return mockJugadores.find(j => j.dni === dni) || null
}

export async function createJugador(
  jugador: Omit<Jugador, 'id' | 'created_at' | 'updated_at'>
): Promise<Jugador> {
  const newJugador: Jugador = {
    ...jugador,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  mockJugadores.push(newJugador)
  return newJugador
}

export async function updateJugador(id: string, updates: Partial<Jugador>): Promise<Jugador> {
  const index = mockJugadores.findIndex(j => j.id === id)
  if (index === -1) throw new Error('Jugador no encontrado')

  mockJugadores[index] = {
    ...mockJugadores[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }

  return mockJugadores[index]
}

export async function deleteJugador(id: string): Promise<void> {
  const index = mockJugadores.findIndex(j => j.id === id)
  if (index !== -1) mockJugadores.splice(index, 1)
}

// ============================================================================
// PAGOS
// ============================================================================

export async function getPagos(): Promise<Pago[]> {
  return mockPagos
}

export async function getPagosByJugador(jugadorId: string): Promise<Pago[]> {
  return mockPagos.filter(p => p.jugador_id === jugadorId)
}

export async function getPagosByDni(
  dni: string
): Promise<{ jugador: Jugador; pagos: Pago[] } | null> {
  const jugador = await getJugadorByDni(dni)
  if (!jugador || !jugador.id) return null

  const pagos = await getPagosByJugador(jugador.id)
  return { jugador, pagos }
}

export async function createPago(
  pago: Omit<Pago, 'id' | 'created_at'>
): Promise<Pago> {
  const newPago: Pago = {
    ...pago,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  }
  mockPagos.push(newPago)
  return newPago
}

export async function deletePago(id: string): Promise<void> {
  const index = mockPagos.findIndex(p => p.id === id)
  if (index !== -1) mockPagos.splice(index, 1)
}

// ============================================================================
// CONFIG
// ============================================================================

export async function getConfiguracion(): Promise<Config> {
  return mockConfig
}

export async function updateConfiguracion(updates: Partial<Config>): Promise<Config> {
  Object.assign(mockConfig, updates)
  return mockConfig
}

// ============================================================================
// GALERIA
// ============================================================================

export async function getFotos(): Promise<Foto[]> {
  return mockFotos
}

export async function addFoto(
  foto: Omit<Foto, 'id' | 'created_at'>
): Promise<Foto> {
  const newFoto: Foto = {
    ...foto,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  }
  mockFotos.push(newFoto)
  return newFoto
}

export async function deleteFoto(id: string): Promise<void> {
  const index = mockFotos.findIndex(f => f.id === id)
  if (index !== -1) mockFotos.splice(index, 1)
}

// ============================================================================
// ESTADISTICAS
// ============================================================================

export async function getEstadisticas() {
  const jugadores = await getJugadores()
  const pagos = await getPagos()
  const config = await getConfiguracion()

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  const jugadoresActivos = jugadores.filter(j => j.activo).length
  const pagosEsteMes = pagos.filter(
    p => p.mes === currentMonth && p.anio === currentYear
  )

  const recaudacionMes = pagosEsteMes.length * config.cuota_valor

  const jugadoresConPagoEsteMes = new Set(pagosEsteMes.map(p => p.jugador_id))
  const deudores = jugadores.filter(
    j => j.activo && !jugadoresConPagoEsteMes.has(j.id)
  ).length

  return {
    jugadoresActivos,
    pagosEsteMes: pagosEsteMes.length,
    recaudacionMes,
    deudores,
    valorCuota: config.cuota_valor,
  }
}