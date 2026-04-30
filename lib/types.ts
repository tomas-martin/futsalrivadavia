// ===== TIPOS PARA FUTSAL RIVADAVIA =====

export type Categoria = "Mayor" | "Juvenil" | "Infantil";

export type EstadoPago = "pendiente" | "en_revision" | "aprobado" | "rechazado";

export interface Jugador {
  id?: string;
  dni: string;
  nombre: string;
  categoria: Categoria;
  activo: boolean;
  email?: string;
  telefono?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Pago {
  id: string;
  jugador_id?: string;
  dni: string;
  mes: number; // 0-11
  anio: number;
  estado: EstadoPago;
  fecha: string;
  fecha_resolucion?: string;
  comprobante?: string;
  comprobante_nombre?: string;
  comprobante_tipo?: string;
  comentario?: string;
  comentario_rechazo?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Config {
  id?: string;
  cuota_valor: number;
  mp_alias: string;
  mp_cvu: string;
  admin_user?: string;
  admin_pass?: string;
  updated_at?: string;
}

export interface Foto {
  id: string;
  src: string;
  descripcion: string;
  orden?: number;
  created_at?: string;
}

export interface ContactoMensaje {
  id?: string;
  nombre: string;
  email: string;
  mensaje: string;
  leido?: boolean;
  created_at?: string;
}

// ===== CONSTANTES =====

export const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
] as const;

export const CATEGORIAS: Categoria[] = ["Mayor", "Juvenil", "Infantil"];

export const AÑO_ACTUAL = new Date().getFullYear();

// ===== STATS DEL CLUB =====

export const CLUB_STATS = {
  fundado: 2015,
  jugadores: "45+",
  titulos: 12,
  categorias: 3,
} as const;

export const CLUB_INFO = {
  nombre: "Futsal Rivadavia",
  ubicacion: "Rivadavia, Mendoza, Argentina",
  direccion: "Estadio Municipal, Rivadavia, Mendoza",
  telefono: "+54 260 4XX-XXXX",
  email: "info@futsalrivadavia.com.ar",
  horarios: "Lunes, Miércoles y Viernes — 19:00 a 21:00 hs",
  moto: "LA NARANJA QUE NUNCA SE APAGA",
  facebook: "#",
  instagram: "#",
  whatsapp: "#",
} as const;
