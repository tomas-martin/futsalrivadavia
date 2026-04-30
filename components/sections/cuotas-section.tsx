"use client";

import { useState, useCallback } from "react";
import {
  MESES,
  AÑO_ACTUAL,
  type Jugador,
  type EstadoPago,
} from "@/lib/types";

// Demo config - will be replaced with Supabase data
const DEMO_CONFIG = {
  cuota_valor: 3500,
  mp_alias: "futsal.rivadavia",
  mp_cvu: "0000003100099870123456",
};

// Demo data - will be replaced with Supabase queries
const DEMO_JUGADORES: Jugador[] = [
  {
    dni: "38123456",
    nombre: "Lucas Perez",
    categoria: "Mayor",
    activo: true,
  },
  {
    dni: "40234567",
    nombre: "Matias Gonzalez",
    categoria: "Juvenil",
    activo: true,
  },
  {
    dni: "42345678",
    nombre: "Tomas Rodriguez",
    categoria: "Mayor",
    activo: true,
  },
];

// Demo payment states
const DEMO_PAGOS: Record<string, Record<number, EstadoPago>> = {
  "38123456": { 0: "aprobado", 1: "aprobado", 2: "aprobado", 3: "aprobado" },
  "40234567": { 0: "aprobado", 1: "aprobado" },
  "42345678": { 0: "aprobado", 1: "aprobado", 2: "aprobado", 3: "en_revision" },
};

type Step = "search" | "status" | "payment";

export function CuotasSection() {
  const [step, setStep] = useState<Step>("search");
  const [dni, setDni] = useState("");
  const [jugador, setJugador] = useState<Jugador | null>(null);
  const [error, setError] = useState("");
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const mesActual = new Date().getMonth();

  const getMesEstado = useCallback(
    (playerDni: string, mes: number): EstadoPago => {
      return DEMO_PAGOS[playerDni]?.[mes] || "pendiente";
    },
    []
  );

  const getStatusBadge = (estado: EstadoPago) => {
    const styles = {
      aprobado:
        "bg-success/15 text-success border-success/30",
      en_revision:
        "bg-warning/15 text-warning border-warning/30",
      pendiente:
        "bg-orange/15 text-orange border-orange/30",
      rechazado:
        "bg-error/15 text-error border-error/30",
    };

    const labels = {
      aprobado: "Pagada",
      en_revision: "En revision",
      pendiente: "Pendiente",
      rechazado: "Rechazada",
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border px-3 py-1 font-[var(--font-condensed)] text-[0.85rem] font-bold ${styles[estado]}`}
      >
        {labels[estado]}
      </span>
    );
  };

  const handleSearch = () => {
    setError("");
    if (!dni || dni.length < 7) {
      setError("Ingresa un DNI valido (minimo 7 digitos).");
      return;
    }

    // TODO: Replace with Supabase query
    const found = DEMO_JUGADORES.find((j) => j.dni === dni.trim());
    if (!found) {
      setError(
        "No encontramos ningun jugador con ese DNI. Contactate con la administracion."
      );
      return;
    }

    setJugador(found);
    setStep("status");
  };

  const handleBack = () => {
    if (step === "payment") {
      setStep("status");
      setSelectedMonths([]);
      setFile(null);
      setComment("");
    } else {
      setStep("search");
      setDni("");
      setJugador(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const toggleMonth = (mes: number) => {
    setSelectedMonths((prev) =>
      prev.includes(mes) ? prev.filter((m) => m !== mes) : [...prev, mes]
    );
  };

  const handleSubmitPayment = async () => {
    setError("");

    if (selectedMonths.length === 0) {
      setError("Selecciona al menos una cuota a pagar.");
      return;
    }

    if (!file) {
      setError("Debes subir el comprobante de Mercado Pago.");
      return;
    }

    setSubmitting(true);

    // TODO: Upload to Supabase Storage and create payment records
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSuccess(true);
    setTimeout(() => {
      setStep("status");
      setSelectedMonths([]);
      setFile(null);
      setComment("");
      setSuccess(false);
    }, 3000);

    setSubmitting(false);
  };

  // Count pending months
  const pendingCount = jugador
    ? Array.from({ length: mesActual + 1 }, (_, i) => i).filter((m) => {
        const estado = getMesEstado(jugador.dni, m);
        return estado === "pendiente" || estado === "rechazado";
      }).length
    : 0;

  const total = selectedMonths.length * DEMO_CONFIG.cuota_valor;

  return (
    <section
      id="cuotas"
      className="bg-gradient-to-br from-surface to-background"
    >
      <div className="mx-auto max-w-[1100px] px-8 py-24">
        <div className="mb-2 font-[var(--font-condensed)] text-[0.85rem] font-bold uppercase tracking-[0.25em] text-orange">
          PAGOS
        </div>
        <h2 className="mb-4 font-[var(--font-display)] text-[clamp(2.2rem,5vw,3.5rem)] leading-none text-foreground">
          Gestion de <span className="text-orange">Cuotas</span>
        </h2>
        <p className="mb-10 max-w-[600px] text-lg text-muted">
          Ingresa tu numero de documento para consultar el estado de tus cuotas
          y realizar el pago.
        </p>

        <div className="mx-auto max-w-[560px]">
          {/* Step 1: Search */}
          {step === "search" && (
            <div className="rounded-[var(--radius-lg)] border border-orange/20 bg-surface-alt p-8 shadow-[var(--shadow-base)]">
              <h3 className="mb-6 border-b-2 border-orange pb-3 font-[var(--font-condensed)] text-[1.4rem] font-black uppercase tracking-widest text-foreground">
                Consultar mi Estado
              </h3>

              <div className="mb-5">
                <label className="mb-1.5 block font-[var(--font-condensed)] text-[0.85rem] font-bold uppercase tracking-widest text-orange">
                  Numero de Documento (DNI)
                </label>
                <input
                  type="text"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Ej: 38123456"
                  maxLength={10}
                  className="w-full rounded-lg border border-foreground/10 bg-surface px-4 py-3 text-foreground transition-all placeholder:text-muted focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange-glow"
                />
              </div>

              <button
                onClick={handleSearch}
                className="w-full rounded-[var(--radius)] border-2 border-orange bg-orange px-8 py-3 font-[var(--font-condensed)] text-base font-bold uppercase tracking-widest text-background transition-all hover:bg-orange-light"
              >
                Consultar
              </button>

              {error && (
                <div className="mt-4 rounded-lg border border-error/30 bg-error/15 px-4 py-3 text-sm text-error">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Status */}
          {step === "status" && jugador && (
            <div className="rounded-[var(--radius-lg)] border border-orange/20 bg-surface-alt p-8 shadow-[var(--shadow-base)]">
              {/* Player info */}
              <div className="mb-5 rounded-[10px] border-l-4 border-orange bg-surface p-5">
                <h4 className="font-[var(--font-condensed)] text-[1.3rem] font-black uppercase text-foreground">
                  {jugador.nombre}
                </h4>
                <p className="mt-1 text-sm text-muted">
                  DNI: {jugador.dni} - Categoria: {jugador.categoria}
                </p>
              </div>

              {/* Payment status */}
              <div className="mb-5">
                <h4 className="mb-3 font-[var(--font-condensed)] text-base font-bold uppercase tracking-widest text-orange">
                  Estado de Cuotas {AÑO_ACTUAL}
                </h4>

                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: mesActual + 1 }, (_, i) => i).map(
                    (mes) => (
                      <div key={mes} className="flex items-center gap-2">
                        <span className="font-[var(--font-condensed)] text-sm font-bold text-muted">
                          {MESES[mes]}:
                        </span>
                        {getStatusBadge(getMesEstado(jugador.dni, mes))}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Summary */}
              {pendingCount === 0 ? (
                <div className="mb-4 rounded-lg border border-success/30 bg-success/15 px-4 py-3 text-sm text-success">
                  Estas al dia con todas tus cuotas! Gracias por tu compromiso.
                </div>
              ) : (
                <div className="mb-4 rounded-lg border border-error/30 bg-error/15 px-4 py-3 text-sm text-error">
                  Tenes <strong>{pendingCount}</strong> cuota
                  {pendingCount > 1 ? "s" : ""} pendiente
                  {pendingCount > 1 ? "s" : ""}.
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                {pendingCount > 0 && (
                  <button
                    onClick={() => setStep("payment")}
                    className="flex-1 rounded-[var(--radius)] border-2 border-orange bg-orange px-6 py-3 font-[var(--font-condensed)] text-base font-bold uppercase tracking-widest text-background transition-all hover:bg-orange-light"
                  >
                    Pagar Cuotas Pendientes
                  </button>
                )}
                <button
                  onClick={handleBack}
                  className="rounded-[var(--radius)] border-2 border-orange bg-transparent px-6 py-3 font-[var(--font-condensed)] text-sm font-bold uppercase tracking-widest text-orange transition-all hover:bg-orange-glow"
                >
                  Volver
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === "payment" && jugador && (
            <div className="rounded-[var(--radius-lg)] border border-orange/20 bg-surface-alt p-8 shadow-[var(--shadow-base)]">
              <h3 className="mb-6 border-b-2 border-orange pb-3 font-[var(--font-condensed)] text-[1.4rem] font-black uppercase tracking-widest text-foreground">
                Subir Comprobante de Pago
              </h3>

              <p className="mb-5 text-[0.95rem] text-muted">
                Realiza el pago a traves de Mercado Pago y luego subi el
                comprobante aqui.
              </p>

              {/* MP Info */}
              <div className="mb-5 rounded-[10px] border border-foreground/10 bg-background/30 p-5">
                <div className="mb-3 inline-block rounded bg-[#00b900] px-3 py-1 font-[var(--font-condensed)] text-[0.9rem] font-bold text-foreground">
                  MERCADO PAGO
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Alias:</strong> {DEMO_CONFIG.mp_alias}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>CVU:</strong> {DEMO_CONFIG.mp_cvu}
                </p>
                {selectedMonths.length > 0 && (
                  <p className="mt-2 font-[var(--font-display)] text-[1.8rem] text-orange">
                    TOTAL: ${total.toLocaleString("es-AR")}
                  </p>
                )}
              </div>

              {/* Month selection */}
              <div className="mb-5">
                <label className="mb-2 block font-[var(--font-condensed)] text-[0.85rem] font-bold uppercase tracking-widest text-orange">
                  Mes/es a pagar
                </label>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: mesActual + 1 }, (_, i) => i).map(
                    (mes) => {
                      const estado = getMesEstado(jugador.dni, mes);
                      if (estado !== "pendiente" && estado !== "rechazado")
                        return null;
                      return (
                        <label
                          key={mes}
                          className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground"
                        >
                          <input
                            type="checkbox"
                            checked={selectedMonths.includes(mes)}
                            onChange={() => toggleMonth(mes)}
                            className="h-4 w-4 accent-orange"
                          />
                          {MESES[mes]}
                        </label>
                      );
                    }
                  )}
                </div>
              </div>

              {/* File upload */}
              <div className="mb-5">
                <label className="mb-2 block font-[var(--font-condensed)] text-[0.85rem] font-bold uppercase tracking-widest text-orange">
                  Comprobante (imagen o PDF)
                </label>
                <label className="block cursor-pointer rounded-[10px] border-2 border-dashed border-orange/40 p-7 text-center text-sm text-muted transition-all hover:border-orange hover:bg-orange-glow hover:text-foreground">
                  {file
                    ? `${file.name} (${(file.size / 1024).toFixed(1)} KB)`
                    : "Arrastra el comprobante aqui o hace click para seleccionar"}
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Comment */}
              <div className="mb-5">
                <label className="mb-1.5 block font-[var(--font-condensed)] text-[0.85rem] font-bold uppercase tracking-widest text-orange">
                  Comentario (opcional)
                </label>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ej: Pago cuota marzo y abril"
                  className="w-full rounded-lg border border-foreground/10 bg-surface px-4 py-3 text-foreground transition-all placeholder:text-muted focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange-glow"
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmitPayment}
                disabled={submitting}
                className="w-full rounded-[var(--radius)] border-2 border-orange bg-orange px-8 py-3 font-[var(--font-condensed)] text-base font-bold uppercase tracking-widest text-background transition-all hover:bg-orange-light disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Enviando..." : "Enviar Comprobante"}
              </button>

              <button
                onClick={handleBack}
                className="mt-3 w-full rounded-[var(--radius)] border-2 border-orange bg-transparent px-6 py-3 font-[var(--font-condensed)] text-sm font-bold uppercase tracking-widest text-orange transition-all hover:bg-orange-glow"
              >
                Volver
              </button>

              {error && (
                <div className="mt-4 rounded-lg border border-error/30 bg-error/15 px-4 py-3 text-sm text-error">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-4 rounded-lg border border-success/30 bg-success/15 px-4 py-3 text-sm text-success">
                  Comprobante enviado correctamente! Tu pago de{" "}
                  <strong>
                    {selectedMonths.length} cuota
                    {selectedMonths.length > 1 ? "s" : ""}
                  </strong>{" "}
                  esta siendo revisado por la administracion.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
