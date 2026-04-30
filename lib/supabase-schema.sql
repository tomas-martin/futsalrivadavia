-- ============================================================================
-- SCHEMA PARA FUTSAL RIVADAVIA - SUPABASE
-- ============================================================================
-- Ejecutar este SQL en el SQL Editor de Supabase para crear las tablas
-- ============================================================================

-- Tabla de Jugadores
CREATE TABLE IF NOT EXISTS jugadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  dni TEXT UNIQUE NOT NULL,
  fecha_nacimiento DATE,
  categoria TEXT NOT NULL DEFAULT 'Primera',
  telefono TEXT,
  email TEXT,
  direccion TEXT,
  foto_url TEXT,
  activo BOOLEAN DEFAULT true,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de Pagos
CREATE TABLE IF NOT EXISTS pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jugador_id UUID NOT NULL REFERENCES jugadores(id) ON DELETE CASCADE,
  monto DECIMAL(10,2) NOT NULL,
  mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
  anio INTEGER NOT NULL,
  fecha_pago DATE NOT NULL DEFAULT CURRENT_DATE,
  metodo_pago TEXT DEFAULT 'efectivo',
  comprobante_url TEXT,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- Prevenir pagos duplicados del mismo mes
  UNIQUE(jugador_id, mes, anio)
);

-- Tabla de Configuracion del Club
CREATE TABLE IF NOT EXISTS configuracion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_club TEXT DEFAULT 'Futsal Rivadavia',
  valor_cuota DECIMAL(10,2) DEFAULT 5000,
  telefono TEXT,
  email TEXT,
  direccion TEXT,
  horarios TEXT,
  mensaje_bienvenida TEXT,
  redes_sociales JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de Galeria de Fotos
CREATE TABLE IF NOT EXISTS galeria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  titulo TEXT,
  descripcion TEXT,
  categoria TEXT DEFAULT 'general',
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de Admins (para autenticacion)
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nombre TEXT,
  rol TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- INDICES para mejor performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_jugadores_dni ON jugadores(dni);
CREATE INDEX IF NOT EXISTS idx_jugadores_categoria ON jugadores(categoria);
CREATE INDEX IF NOT EXISTS idx_jugadores_activo ON jugadores(activo);
CREATE INDEX IF NOT EXISTS idx_pagos_jugador ON pagos(jugador_id);
CREATE INDEX IF NOT EXISTS idx_pagos_fecha ON pagos(mes, anio);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE jugadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeria ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Politicas para Jugadores (solo admins autenticados pueden modificar)
CREATE POLICY "jugadores_select_all" ON jugadores FOR SELECT USING (true);
CREATE POLICY "jugadores_insert_admin" ON jugadores FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);
CREATE POLICY "jugadores_update_admin" ON jugadores FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);
CREATE POLICY "jugadores_delete_admin" ON jugadores FOR DELETE USING (
  EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);

-- Politicas para Pagos (lectura publica por DNI, escritura solo admins)
CREATE POLICY "pagos_select_all" ON pagos FOR SELECT USING (true);
CREATE POLICY "pagos_insert_admin" ON pagos FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);
CREATE POLICY "pagos_update_admin" ON pagos FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);
CREATE POLICY "pagos_delete_admin" ON pagos FOR DELETE USING (
  EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);

-- Politicas para Configuracion (lectura publica, escritura admins)
CREATE POLICY "config_select_all" ON configuracion FOR SELECT USING (true);
CREATE POLICY "config_update_admin" ON configuracion FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);

-- Politicas para Galeria (lectura publica, escritura admins)
CREATE POLICY "galeria_select_all" ON galeria FOR SELECT USING (true);
CREATE POLICY "galeria_insert_admin" ON galeria FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);
CREATE POLICY "galeria_delete_admin" ON galeria FOR DELETE USING (
  EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);

-- Politicas para Admins
CREATE POLICY "admins_select_own" ON admins FOR SELECT USING (auth.uid() = id);

-- ============================================================================
-- TRIGGER para actualizar updated_at automaticamente
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER jugadores_updated_at
  BEFORE UPDATE ON jugadores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER configuracion_updated_at
  BEFORE UPDATE ON configuracion
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- DATOS INICIALES
-- ============================================================================
INSERT INTO configuracion (nombre_club, valor_cuota, telefono, email, direccion, horarios, mensaje_bienvenida)
VALUES (
  'Futsal Rivadavia',
  5000,
  '+54 264 5123456',
  'futsalrivadavia@gmail.com',
  'Calle Principal 123, Rivadavia, San Juan',
  'Lunes a Viernes: 18:00 - 22:00 | Sabados: 09:00 - 13:00',
  'Bienvenido a la familia de Futsal Rivadavia'
) ON CONFLICT DO NOTHING;
