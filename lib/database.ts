/**
 * Database functions for Futsal Rivadavia
 * 
 * Este archivo contiene todas las funciones de base de datos.
 * Actualmente usa datos mock, pero esta preparado para conectar con Supabase.
 * 
 * Para activar Supabase:
 * 1. Conecta Supabase en la configuracion del proyecto
 * 2. Crea las tablas usando el SQL schema en /lib/supabase-schema.sql
 * 3. Descomenta las importaciones y funciones de Supabase
 */

import type { Jugador, Pago, ConfiguracionClub, FotoGaleria } from './types'

// ============================================================================
// MOCK DATA (Reemplazar con Supabase cuando este conectado)
// ============================================================================

const mockJugadores: Jugador[] = [
  {
    id: '1',
    nombre: 'Juan',
    apellido: 'Perez',
    dni: '12345678',
    fecha_nacimiento: '1995-05-15',
    categoria: 'Primera',
    telefono: '2645123456',
    email: 'juan@email.com',
    activo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    nombre: 'Carlos',
    apellido: 'Rodriguez',
    dni: '87654321',
    fecha_nacimiento: '2008-03-20',
    categoria: 'Sub-15',
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
    monto: 5000,
    mes: 1,
    anio: 2024,
    fecha_pago: '2024-01-15',
    metodo_pago: 'efectivo',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    jugador_id: '1',
    monto: 5000,
    mes: 2,
    anio: 2024,
    fecha_pago: '2024-02-10',
    metodo_pago: 'transferencia',
    created_at: new Date().toISOString(),
  },
]

const mockConfig: ConfiguracionClub = {
  nombre_club: 'Futsal Rivadavia',
  valor_cuota: 5000,
  telefono: '+54 264 5123456',
  email: 'futsalrivadavia@gmail.com',
  direccion: 'Calle Principal 123, Rivadavia, San Juan',
  horarios: 'Lunes a Viernes: 18:00 - 22:00 | Sabados: 09:00 - 13:00',
  mensaje_bienvenida: 'Bienvenido a Futsal Rivadavia',
  redes_sociales: {
    instagram: 'https://instagram.com/futsalrivadavia',
    facebook: 'https://facebook.com/futsalrivadavia',
  },
}

const mockFotos: FotoGaleria[] = []

// ============================================================================
// JUGADORES
// ============================================================================

export async function getJugadores(): Promise<Jugador[]> {
  // TODO: Reemplazar con Supabase
  // const supabase = createClient()
  // const { data, error } = await supabase.from('jugadores').select('*').order('apellido')
  // if (error) throw error
  // return data
  
  return mockJugadores
}

export async function getJugadorByDni(dni: string): Promise<Jugador | null> {
  // TODO: Reemplazar con Supabase
  // const supabase = createClient()
  // const { data, error } = await supabase.from('jugadores').select('*').eq('dni', dni).single()
  // if (error) return null
  // return data
  
  return mockJugadores.find(j => j.dni === dni) || null
}

export async function createJugador(jugador: Omit<Jugador, 'id' | 'created_at' | 'updated_at'>): Promise<Jugador> {
  // TODO: Reemplazar con Supabase
  // const supabase = createClient()
  // const { data, error } = await supabase.from('jugadores').insert(jugador).select().single()
  // if (error) throw error
  // return data
  
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
  // TODO: Reemplazar con Supabase
  // const supabase = createClient()
  // const { data, error } = await supabase.from('jugadores').update(updates).eq('id', id).select().single()
  // if (error) throw error
  // return data
  
  const index = mockJugadores.findIndex(j => j.id === id)
  if (index === -1) throw new Error('Jugador no encontrado')
  mockJugadores[index] = { ...mockJugadores[index], ...updates, updated_at: new Date().toISOString() }
  return mockJugadores[index]
}

export async function deleteJugador(id: string): Promise<void> {
  // TODO: Reemplazar con Supabase
  // const supabase = createClient()
  // const { error } = await supabase.from('jugadores').delete().eq('id', id)
  // if (error) throw error
  
  const index = mockJugadores.findIndex(j => j.id === id)
  if (index !== -1) mockJugadores.splice(index, 1)
}

// ============================================================================
// PAGOS
// ============================================================================

export async function getPagos(): Promise<Pago[]> {
  // TODO: Reemplazar con Supabase
  return mockPagos
}

export async function getPagosByJugador(jugadorId: string): Promise<Pago[]> {
  // TODO: Reemplazar con Supabase
  return mockPagos.filter(p => p.jugador_id === jugadorId)
}

export async function getPagosByDni(dni: string): Promise<{ jugador: Jugador; pagos: Pago[] } | null> {
  const jugador = await getJugadorByDni(dni)
  if (!jugador) return null
  const pagos = await getPagosByJugador(jugador.id)
  return { jugador, pagos }
}

export async function createPago(pago: Omit<Pago, 'id' | 'created_at'>): Promise<Pago> {
  // TODO: Reemplazar con Supabase
  const newPago: Pago = {
    ...pago,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  }
  mockPagos.push(newPago)
  return newPago
}

export async function deletePago(id: string): Promise<void> {
  // TODO: Reemplazar con Supabase
  const index = mockPagos.findIndex(p => p.id === id)
  if (index !== -1) mockPagos.splice(index, 1)
}

// ============================================================================
// CONFIGURACION
// ============================================================================

export async function getConfiguracion(): Promise<ConfiguracionClub> {
  // TODO: Reemplazar con Supabase
  return mockConfig
}

export async function updateConfiguracion(updates: Partial<ConfiguracionClub>): Promise<ConfiguracionClub> {
  // TODO: Reemplazar con Supabase
  Object.assign(mockConfig, updates)
  return mockConfig
}

// ============================================================================
// GALERIA
// ============================================================================

export async function getFotos(): Promise<FotoGaleria[]> {
  // TODO: Reemplazar con Supabase + Storage
  return mockFotos
}

export async function addFoto(foto: Omit<FotoGaleria, 'id' | 'created_at'>): Promise<FotoGaleria> {
  // TODO: Reemplazar con Supabase + Storage
  const newFoto: FotoGaleria = {
    ...foto,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  }
  mockFotos.push(newFoto)
  return newFoto
}

export async function deleteFoto(id: string): Promise<void> {
  // TODO: Reemplazar con Supabase
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
  const pagosEsteMes = pagos.filter(p => p.mes === currentMonth && p.anio === currentYear)
  const recaudacionMes = pagosEsteMes.reduce((sum, p) => sum + p.monto, 0)
  
  // Calcular deudores (jugadores activos sin pago este mes)
  const jugadoresConPagoEsteMes = new Set(pagosEsteMes.map(p => p.jugador_id))
  const deudores = jugadores.filter(j => j.activo && !jugadoresConPagoEsteMes.has(j.id)).length
  
  return {
    jugadoresActivos,
    pagosEsteMes: pagosEsteMes.length,
    recaudacionMes,
    deudores,
    valorCuota: config.valor_cuota,
  }
}
